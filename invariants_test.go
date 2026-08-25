package bank

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// A refused movement leaves no money behind. The debit hold is written by one
// pre-create hook and the limits are checked by another, and the hold used to
// commit in a transaction of its own before the rest of the create ran — so a
// movement the limits refused left the funds held against a transaction that
// was never written, with nothing pointing at them to give them back.
//
// $68,000 disappeared this way on a live server: available fell from 24.6 ETH
// to 4.6 with 20 held, and the caller got "Daily transaction limit exceeded".
func TestRefusedMovementReleasesEverything(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	// Enough to cover the movement, so only the daily limit can refuse it.
	// The individual ceiling is $50,000; 20 ETH is comfortably past it.
	if err := setBalance(app, acct.Id, "ETH", 24_600000); err != nil {
		t.Fatal(err)
	}
	before := balanceOf(t, app, acct.Id, "ETH")

	_, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "withdrawal", "direction": "debit",
		"amount": 20_000000, "currency": "ETH", "status": "pending",
		"reference": "over the daily limit",
	})
	if err == nil {
		t.Fatal("a movement past the daily limit was accepted")
	}

	rec, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
		"account = {:a} && currency = 'ETH'", map[string]any{"a": acct.Id})
	if err != nil {
		t.Fatal(err)
	}
	if got := int64(rec.GetFloat("available")); got != before {
		t.Errorf("available moved on a refused movement: %d -> %d", before, got)
	}
	if held := int64(rec.GetFloat("held")); held != 0 {
		t.Errorf("a refused movement left %d held, with no transaction to release it", held)
	}
}

// A debit is never accepted for more than the account holds. Both halves of
// this are load-bearing: the check itself, and the fact that it reads and
// writes in one transaction so two concurrent debits cannot both pass it.
func TestDebitCannotOverdraw(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	if err := setBalance(app, acct.Id, "USD", 10_000); err != nil {
		t.Fatal(err)
	}
	if _, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "payment", "direction": "debit",
		"amount": 10_001, "currency": "USD", "status": "pending",
		"reference": "one cent past the balance",
	}); err == nil {
		t.Fatal("a debit one cent past the balance was accepted")
	}

	rec, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
		"account = {:a} && currency = 'USD'", map[string]any{"a": acct.Id})
	if err != nil {
		t.Fatal(err)
	}
	if got := int64(rec.GetFloat("available")); got != 10_000 {
		t.Errorf("available is %d after a refused debit, want 10000", got)
	}
	if got := int64(rec.GetFloat("held")); got != 0 {
		t.Errorf("a refused debit held %d", got)
	}
}

// The audit log is append-only: once written, a record can be neither updated
// nor deleted. This is a compliance invariant, so it is asserted directly.
func TestAuditLogImmutable(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	col, _ := app.FindCollectionByNameOrId(collections.AuditCollectionName)
	rec := core.NewRecord(col)
	rec.Set("account", acct.Id)
	rec.Set("actor", "system")
	rec.Set("action", "test_event")
	rec.Set("detail", map[string]any{"k": "v"})
	if err := app.Save(rec); err != nil {
		t.Fatalf("create audit: %v", err)
	}

	rec.Set("action", "tampered")
	if err := app.Save(rec); err == nil {
		t.Error("expected audit-log update to be rejected")
	}

	fresh, err := app.FindRecordById(collections.AuditCollectionName, rec.Id)
	if err != nil {
		t.Fatalf("reload audit: %v", err)
	}
	if err := app.Delete(fresh); err == nil {
		t.Error("expected audit-log delete to be rejected")
	}
}

func TestSandboxIBAN(t *testing.T) {
	cases := map[string]string{"EUR": "DE", "USD": "US", "SGD": "SG", "AED": "AE", "GBP": "GB", "JPY": "GB"}
	for cur, cc := range cases {
		iban := sandboxIBAN(cur)
		if iban[:2] != cc {
			t.Errorf("sandboxIBAN(%q) = %q, want country prefix %q", cur, iban, cc)
		}
		if len(iban) < 10 {
			t.Errorf("sandboxIBAN(%q) too short: %q", cur, iban)
		}
	}
}

// issuer() selects the simulation in sandbox and the sfprivate client in live
// mode (default BANK_ISSUER).
func TestIssuerSelection(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "true")
	if got := issuer().Name(); got != "sandbox" {
		t.Errorf("sandbox issuer = %q, want sandbox", got)
	}
	t.Setenv("BANK_SANDBOX", "false")
	if got := issuer().Name(); got != "sfprivate" {
		t.Errorf("live issuer = %q, want sfprivate", got)
	}
}
