package hooks

import (
	"testing"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// staleTx writes a transaction with an explicit created stamp.
func staleTx(t *testing.T, app core.App, accountID, status string, age time.Duration) string {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", accountID)
	r.Set("direction", "debit")
	r.Set("status", status)
	r.Set("currency", "USD")
	r.Set("amount", 1000)
	r.Set("type", "payment")
	if err := app.Save(r); err != nil {
		t.Fatalf("save tx: %v", err)
	}
	r.SetRaw("created", time.Now().UTC().Add(-age).Format("2006-01-02 15:04:05.000Z"))
	if err := app.Save(r); err != nil {
		t.Fatalf("redate tx: %v", err)
	}
	return r.Id
}

func statusOf(t *testing.T, app core.App, id string) string {
	t.Helper()
	r, err := app.FindRecordById(collections.TransactionCollectionName, id)
	if err != nil {
		t.Fatalf("find %s: %v", id, err)
	}
	return r.GetString("status")
}

// The cron fails what has been pending too long, and NOTHING else. Both halves
// matter: a payment left pending forever is money nobody can account for, and a
// payment failed while it is still in flight is money taken from a customer for
// a movement that may yet settle.
func TestStaleTransactionsExpireAndFreshOnesDoNot(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)

	old := staleTx(t, app, id, "pending", 48*time.Hour)
	justOver := staleTx(t, app, id, "pending", 25*time.Hour)
	fresh := staleTx(t, app, id, "pending", 1*time.Hour)
	justUnder := staleTx(t, app, id, "pending", 23*time.Hour)
	// Already settled, and old. Age is not the only condition.
	done := staleTx(t, app, id, "completed", 72*time.Hour)

	expireStaleTransactions(app)

	for _, tc := range []struct{ id, want, why string }{
		{old, "failed", "48h pending"},
		{justOver, "failed", "25h pending — just over the line"},
		{fresh, "pending", "1h old, still in flight"},
		{justUnder, "pending", "23h old — just under the line"},
		{done, "completed", "already settled; age alone must not touch it"},
	} {
		if got := statusOf(t, app, tc.id); got != tc.want {
			t.Errorf("%s: status = %q, want %q", tc.why, got, tc.want)
		}
	}
}

// An expired transaction says why. A failure with no reason is one nobody can
// answer a customer about.
func TestAnExpiredTransactionCarriesItsReason(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)
	old := staleTx(t, app, id, "pending", 48*time.Hour)

	expireStaleTransactions(app)

	r, err := app.FindRecordById(collections.TransactionCollectionName, old)
	if err != nil {
		t.Fatal(err)
	}
	if got := r.GetString("reason"); got == "" {
		t.Fatal("an expired transaction carries no reason")
	}
}

// Running it twice changes nothing the second time: what is already failed stays
// failed, and nothing else moves.
func TestExpiryIsIdempotent(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)
	old := staleTx(t, app, id, "pending", 48*time.Hour)
	fresh := staleTx(t, app, id, "pending", 1*time.Hour)

	expireStaleTransactions(app)
	expireStaleTransactions(app)

	if got := statusOf(t, app, old); got != "failed" {
		t.Fatalf("old = %q, want failed", got)
	}
	if got := statusOf(t, app, fresh); got != "pending" {
		t.Fatalf("fresh = %q, want pending", got)
	}
}

// staleChainTx is staleTx for a movement the ledger handed to a chain: the
// network on the metadata is what a crypto send and an Earn movement both
// record, and it is what says the outcome is not the ledger's to decide.
func staleChainTx(t *testing.T, app core.App, accountID string, age time.Duration) string {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", accountID)
	r.Set("direction", "debit")
	r.Set("status", "pending")
	r.Set("currency", "LUX")
	r.Set("amount", 1000)
	r.Set("type", "withdrawal")
	r.Set("metadata", map[string]any{
		"network":   "lux-mainnet",
		"toAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
	})
	if err := app.Save(r); err != nil {
		t.Fatalf("save chain tx: %v", err)
	}
	// Re-read before amending: the instance a create returns still carries its
	// pre-create snapshot, so the status guard reads the redate as a move out
	// of nothing.
	fresh, err := app.FindRecordById(collections.TransactionCollectionName, r.Id)
	if err != nil {
		t.Fatal(err)
	}
	fresh.SetRaw("created", time.Now().UTC().Add(-age).Format("2006-01-02 15:04:05.000Z"))
	if err := app.Save(fresh); err != nil {
		t.Fatalf("redate chain tx: %v", err)
	}
	return r.Id
}

// Failing a debit gives back the funds it held, so expiring a send that
// actually reached the chain refunds a customer who already holds the coins —
// the bank pays twice. A send that never reached the chain releases its own
// hold on the way out, so a pending row with a network on it has been
// broadcast, or cannot be told apart from one that was. The clock is not
// evidence about somebody else's ledger.
func TestAPendingChainMovementIsNotExpiredByTheClock(t *testing.T) {
	app := limitApp(t)
	acct := account(t, app)

	onChain := staleChainTx(t, app, acct, 48*time.Hour)
	offChain := staleTx(t, app, acct, "pending", 48*time.Hour)

	expireStaleTransactions(app)

	chainRow, err := app.FindRecordById(collections.TransactionCollectionName, onChain)
	if err != nil {
		t.Fatal(err)
	}
	if got := chainRow.GetString("status"); got != "pending" {
		t.Errorf("a pending on-chain send was marked %q by a timeout — its hold is returned and the coins are gone", got)
	}

	// The rest of the sweep still works: a movement the ledger performed
	// itself is one the ledger may time out.
	fiatRow, err := app.FindRecordById(collections.TransactionCollectionName, offChain)
	if err != nil {
		t.Fatal(err)
	}
	if got := fiatRow.GetString("status"); got != "failed" {
		t.Errorf("an ordinary stale transaction is %q, want failed", got)
	}
}

// The one that matters in money terms, measured on the balance rather than on
// the status: the held funds must still be held after the sweep.
func TestExpiringDoesNotRefundCoinsThatLeft(t *testing.T) {
	app := limitApp(t)
	RegisterPaymentHooks(app)
	acct := account(t, app)
	updateBalance(app, acct, "LUX", 100_000000, 0)

	held := func() int64 {
		b, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
			"account = {:a} && currency = 'LUX'", map[string]any{"a": acct})
		if err != nil {
			t.Fatalf("no LUX balance: %v", err)
		}
		return int64(b.GetFloat("held"))
	}

	staleChainTx(t, app, acct, 48*time.Hour)
	if held() == 0 {
		t.Fatal("the pending send reserved nothing, so this proves nothing")
	}
	before := held()

	expireStaleTransactions(app)

	if after := held(); after != before {
		t.Errorf("the sweep released %d of a send that reached the chain — the customer keeps the coins and gets the money back",
			before-after)
	}
}
