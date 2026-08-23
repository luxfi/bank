package bank

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// receivingFor must shape the coordinates to the account's currency: a US
// account settles by routing + account number and carries no IBAN; an IBAN
// market carries an IBAN and no routing. Deterministic in the account id.
func TestReceivingForByCurrency(t *testing.T) {
	app := newBankApp(t)
	defer app.Cleanup()

	col, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	if err != nil {
		t.Fatalf("accounts collection: %v", err)
	}
	mk := func(currency string) *core.Record {
		r := core.NewRecord(col)
		r.Set("owner", "u")
		r.Set("entityName", "Acme")
		r.Set("entityType", "business")
		r.Set("country", "US")
		r.Set("currency", currency)
		r.Set("status", "active")
		r.Set("kycStatus", "approved")
		r.Set("riskRating", "low")
		if err := app.Save(r); err != nil {
			t.Fatalf("save account: %v", err)
		}
		return r
	}

	usd := receivingFor(mk("USD"))
	if usd.RoutingNumber == "" || usd.AccountNumber == "" {
		t.Errorf("USD account missing routing/account: %+v", usd)
	}
	if usd.IBAN != "" {
		t.Errorf("US account must not carry an IBAN, got %q", usd.IBAN)
	}
	if len(usd.RoutingNumber) != 9 {
		t.Errorf("routing number = %q, want 9 digits", usd.RoutingNumber)
	}

	eur := receivingFor(mk("EUR"))
	if eur.IBAN == "" {
		t.Errorf("EUR account missing IBAN: %+v", eur)
	}
	if eur.RoutingNumber != "" {
		t.Errorf("IBAN-market account must not carry a routing number, got %q", eur.RoutingNumber)
	}
	if eur.IBAN[:2] != "DE" {
		t.Errorf("EUR IBAN country = %q, want DE", eur.IBAN[:2])
	}

	// Deterministic: same account yields the same coordinates.
	a := mk("USD")
	first, second := receivingFor(a).AccountNumber, receivingFor(a).AccountNumber
	if first != second {
		t.Errorf("receivingFor not deterministic: %q != %q", first, second)
	}
}
