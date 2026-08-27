package hooks

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

func wallet(t *testing.T, app core.App, acct, currency string) *core.Record {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.WalletCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	w := core.NewRecord(col)
	w.Set("account", acct)
	w.Set("currency", currency)
	w.Set("address", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
	if err := app.Save(w); err != nil {
		t.Fatalf("save wallet: %v", err)
	}
	return w
}

// walletApp is limitApp with the wallet collection, since wallets relate to
// accounts and balances.
func walletApp(t *testing.T) core.App {
	t.Helper()
	app := limitApp(t)
	if err := collections.EnsureWalletCollection(app); err != nil {
		t.Fatalf("ensure wallets: %v", err)
	}
	RegisterWalletHooks(app)
	return app
}

// A default that only exists on the instance in hand is not a default. e.Next()
// IS the write, so setting the status after it left the row with the empty
// string it was created with — the caller read "active" and every reader after
// that, the customer's own wallet list included, read nothing at all.
func TestANewWalletIsStoredActive(t *testing.T) {
	app := walletApp(t)
	w := wallet(t, app, account(t, app), "LUX")

	stored, err := app.FindRecordById(collections.WalletCollectionName, w.Id)
	if err != nil {
		t.Fatal(err)
	}
	if got := stored.GetString("status"); got != "active" {
		t.Errorf("a new wallet is stored with status %q, want active — the customer is shown that, not what the creator saw", got)
	}
}

// A status that was asked for is kept: the default fills a gap, it does not
// overwrite an answer.
func TestAWalletKeepsTheStatusItWasGiven(t *testing.T) {
	app := walletApp(t)
	acct := account(t, app)
	col, err := app.FindCollectionByNameOrId(collections.WalletCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	w := core.NewRecord(col)
	w.Set("account", acct)
	w.Set("currency", "LUX")
	w.Set("address", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
	w.Set("status", "suspended")
	if err := app.Save(w); err != nil {
		t.Fatalf("save wallet: %v", err)
	}
	stored, err := app.FindRecordById(collections.WalletCollectionName, w.Id)
	if err != nil {
		t.Fatal(err)
	}
	if got := stored.GetString("status"); got != "suspended" {
		t.Errorf("a wallet created suspended is stored %q", got)
	}
}

// Opening a wallet opens the balance it holds, so the currency shows up at zero
// rather than being absent until the first credit.
func TestANewWalletOpensItsBalance(t *testing.T) {
	app := walletApp(t)
	acct := account(t, app)
	wallet(t, app, acct, "LUX")

	b, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
		"account = {:a} && currency = 'LUX'", map[string]any{"a": acct})
	if err != nil {
		t.Fatalf("a new wallet opened no balance: %v", err)
	}
	if got := int64(b.GetFloat("available")); got != 0 {
		t.Errorf("a new balance opens at %d, want 0", got)
	}
}

// A second wallet in a currency the account already holds must not open a
// second balance — two rows for one currency is a balance that depends on which
// one you read.
func TestASecondWalletDoesNotOpenASecondBalance(t *testing.T) {
	app := walletApp(t)
	acct := account(t, app)
	updateBalance(app, acct, "LUX", 5_000000, 0)

	wallet(t, app, acct, "LUX")

	rows, err := app.FindRecordsByFilter(collections.BalanceCollectionName,
		"account = {:a} && currency = 'LUX'", "", 0, 0, map[string]any{"a": acct})
	if err != nil {
		t.Fatal(err)
	}
	if len(rows) != 1 {
		t.Fatalf("%d LUX balances for one account", len(rows))
	}
	if got := int64(rows[0].GetFloat("available")); got != 5_000000 {
		t.Errorf("opening a wallet reset the balance to %d", got)
	}
}
