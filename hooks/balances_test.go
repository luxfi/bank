package hooks

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// balanceOf reads one account's balance in a currency, or nil when the account
// holds none.
func balanceOf(t *testing.T, app core.App, accountId, currency string) *core.Record {
	t.Helper()
	r, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
		`account = {:a} && currency = {:c}`,
		map[string]any{"a": accountId, "c": currency})
	if err != nil {
		return nil
	}
	return r
}

// A settlement in a currency the account has never held opens the balance. Zero
// is the value a required field refuses, so held starting at 0 is the case that
// used to fail — quietly, since nothing read the result.
func TestACreditInANewCurrencyOpensTheBalance(t *testing.T) {
	app := limitApp(t)
	acct := account(t, app)

	updateBalance(app, acct, "USD", 250_00, 0)

	bal := balanceOf(t, app, acct, "USD")
	if bal == nil {
		t.Fatal("the credit landed nowhere — no balance row exists for it")
	}
	if got := int64(bal.GetFloat("available")); got != 250_00 {
		t.Errorf("available = %d, want 25000", got)
	}
	if got := int64(bal.GetFloat("held")); got != 0 {
		t.Errorf("held = %d, want 0", got)
	}
}

// The half that used to be silent. createBalance runs inside the settlement's
// transaction, so a row it cannot write has to fail the settlement — otherwise
// the ledger records money arriving and no balance carries it.
func TestABalanceThatCannotBeWrittenFailsTheSettlement(t *testing.T) {
	app := limitApp(t)

	// An account id nothing resolves to. The relation is required, so the save
	// is refused — which is the point: any refusal at all must be reported.
	if err := createBalance(app, "nosuchaccountid", "USD", 100); err == nil {
		t.Fatal("a balance for an account that does not exist was reported as written")
	}

	// And nothing was left behind by the attempt.
	if bal := balanceOf(t, app, "nosuchaccountid", "USD"); bal != nil {
		t.Errorf("a balance row survives for an account that does not exist: %s", bal.Id)
	}
}

// A debit against a currency the account has never held is not a new balance —
// it is a settlement that should never have been reached, and creating a row
// for it would mint the funds it is trying to take.
func TestADebitInAnUnheldCurrencyOpensNothing(t *testing.T) {
	app := limitApp(t)
	acct := account(t, app)

	updateBalance(app, acct, "EUR", -100_00, 0)

	if bal := balanceOf(t, app, acct, "EUR"); bal != nil {
		t.Errorf("a debit opened a balance of %d — the ledger invented the funds",
			int64(bal.GetFloat("available")))
	}
}

// The floor is the other end of the same rule: a settlement may not drive a
// balance below zero, however it is spelled.
func TestASettlementCannotDriveABalanceNegative(t *testing.T) {
	app := limitApp(t)
	acct := account(t, app)
	updateBalance(app, acct, "USD", 100_00, 0)

	updateBalance(app, acct, "USD", -150_00, 0)

	bal := balanceOf(t, app, acct, "USD")
	if bal == nil {
		t.Fatal("the balance disappeared")
	}
	if got := int64(bal.GetFloat("available")); got != 100_00 {
		t.Errorf("available = %d after a settlement past the floor, want 10000 unchanged", got)
	}
}
