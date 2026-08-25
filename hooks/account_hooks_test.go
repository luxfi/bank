package hooks

import (
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// hookedApp is limitApp with the account hooks actually bound, so a record
// written through Save travels the same path a request does.
func hookedApp(t *testing.T) core.App {
	t.Helper()
	app := limitApp(t)
	RegisterAccountHooks(app)
	return app
}

// An account gets a balance the moment it exists. Without it the first credit
// has nowhere to land, and the console shows a customer with no money rather
// than a customer with none.
func TestCreatingAnAccountOpensItsBalance(t *testing.T) {
	app := hookedApp(t)
	id := account(t, app)

	bal, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
		"account = {:a}", map[string]any{"a": id})
	if err != nil {
		t.Fatalf("no balance was opened for the new account: %v", err)
	}
	if got := bal.GetString("currency"); got != "USD" {
		t.Fatalf("balance currency = %q, want the account's own USD", got)
	}
	if bal.GetFloat("available") != 0 || bal.GetFloat("held") != 0 {
		t.Fatalf("a new balance starts at %v/%v, want 0/0",
			bal.GetFloat("available"), bal.GetFloat("held"))
	}
}

// The limit gate refuses a currency it cannot price, through the hook, on the
// real create path. USDCents answers 0 for such a currency, and 0 clears every
// ceiling — so admitting it would let any amount past the daily limit while
// consuming none of it.
func TestAnUnpriceableCurrencyIsRefusedOnCreate(t *testing.T) {
	app := hookedApp(t)
	id := account(t, app)

	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", id)
	r.Set("direction", "debit")
	r.Set("status", "pending")
	r.Set("type", "payment")
	r.Set("currency", "ZZZ") // three letters, which is all the field requires
	r.Set("amount", 1_000_000_000)

	err = app.Save(r)
	if err == nil {
		t.Fatal("a transaction in an unpriceable currency was accepted — it values at " +
			"0 cents and would clear every USD-denominated limit")
	}
	if !strings.Contains(strings.ToLower(err.Error()), "currency") {
		t.Fatalf("refused, but not for the currency: %v", err)
	}
}

// The same door still admits a currency the bank does price — the refusal is
// about pricing, not about being strict.
func TestAPriceableCurrencyStillPasses(t *testing.T) {
	app := hookedApp(t)
	id := account(t, app)

	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	for _, cur := range []string{"USD", "EUR", "BTC"} {
		r := core.NewRecord(col)
		r.Set("account", id)
		r.Set("direction", "debit")
		r.Set("status", "pending")
		r.Set("type", "payment")
		r.Set("currency", cur)
		r.Set("amount", 100)
		if err := app.Save(r); err != nil {
			t.Fatalf("a %s transaction was refused: %v", cur, err)
		}
	}
}
