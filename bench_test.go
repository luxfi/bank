package bank

import (
	"crypto/ecdsa"
	"math/big"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
)

// -----------------------------------------------------------------------------
// Benchmarks. These measure the paths a customer actually waits on — the
// dashboard's first call, a payment, a balance read — against the real ledger
// on real SQLite, not against mocks. A number here is a number a user feels.
//
// They deliberately do not benchmark the chain: a broadcast is dominated by
// block time, which says nothing about this code.
// -----------------------------------------------------------------------------

// benchApp is newBankApp with a seeded principal, built once per benchmark.
func benchApp(b *testing.B) (*tests.TestApp, *core.Record) {
	b.Helper()
	app := newBankApp(b)
	seedPrincipal(b, app)
	acct := primaryAccount(app, principalID(b, app))
	if acct == nil {
		b.Fatal("no account")
	}
	return app, acct
}

// BenchmarkBalances is the read behind every balance widget and the first half
// of the dashboard's opening call.
func BenchmarkBalances(b *testing.B) {
	app, acct := benchApp(b)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		if len(viewBalances(app, acct.Id)) == 0 {
			b.Fatal("no balances")
		}
	}
}

// BenchmarkEarnSummary folds the account's vault positions into one figure. It
// runs on every dashboard load, so it sits behind the same wait.
func BenchmarkEarnSummary(b *testing.B) {
	app, acct := benchApp(b)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		viewEarnSummary(app, acct.Id)
	}
}

// BenchmarkSettle is the whole money path end to end: create a pending debit
// (which validates the balance, checks the limits and holds the funds), then
// drive it through processing to completed (which releases the hold and moves
// the money). Every hook that guards a payment runs here.
func BenchmarkSettle(b *testing.B) {
	app, acct := benchApp(b)
	if err := setBalance(app, acct.Id, "USD", 1_000_000_000); err != nil {
		b.Fatal(err)
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "payment", "direction": "debit",
			"amount": 100, "currency": "USD", "status": "pending",
			"reference": "bench",
		})
		if err != nil {
			b.Fatal(err)
		}
		if err := settle(app, tx); err != nil {
			b.Fatal(err)
		}
	}
}

// BenchmarkRelease is settle's counterpart: the refusal path, where a movement
// the chain or the rails rejected must give the held funds back. It runs on
// every failed send, so it is as hot as the success path in a bad hour.
func BenchmarkRelease(b *testing.B) {
	app, acct := benchApp(b)
	if err := setBalance(app, acct.Id, "USD", 1_000_000_000); err != nil {
		b.Fatal(err)
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "payment", "direction": "debit",
			"amount": 100, "currency": "USD", "status": "pending",
			"reference": "bench",
		})
		if err != nil {
			b.Fatal(err)
		}
		if err := release(app, tx); err != nil {
			b.Fatal(err)
		}
	}
}

// BenchmarkScale is the unit conversion every on-chain amount passes through,
// in both directions. It is pure arithmetic on the hot path of every balance
// read, so it wants to stay allocation-light.
func BenchmarkScale(b *testing.B) {
	c := &evmChain{}
	wei := new(big.Int).SetUint64(1e18)
	b.Run("toWei", func(b *testing.B) {
		b.ReportAllocs()
		for i := 0; i < b.N; i++ {
			c.toWei(1_000000, 18)
		}
	})
	b.Run("toMinor", func(b *testing.B) {
		b.ReportAllocs()
		for i := 0; i < b.N; i++ {
			if _, err := c.toMinor(wei, 18); err != nil {
				b.Fatal(err)
			}
		}
	})
}

// BenchmarkDerive is one account's signing key. It is BIP-32 over five hardened
// steps, so it is deliberately expensive — the cache in front of it is what
// keeps it off the request path, and this measures what a cache miss costs.
func BenchmarkDerive(b *testing.B) {
	c := offlineChain(b)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		c.mu.Lock()
		c.keys = map[string]*ecdsa.PrivateKey{}
		c.mu.Unlock()
		if _, err := c.key("1"); err != nil {
			b.Fatal(err)
		}
	}
}
