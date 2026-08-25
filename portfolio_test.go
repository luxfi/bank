package bank

import (
	"testing"

	"github.com/luxfi/bank/collections"
)

// Sandbox decides whether this deployment fakes things: simulated chain sends,
// a faucet, and a seeded book of invented customers. It defaults to ON — only
// an explicit off word turns it off — so the spellings it accepts are the whole
// of an operator's ability to say "this one is real".
func TestSandboxIsOnUnlessTurnedOff(t *testing.T) {
	for _, raw := range []string{"false", "FALSE", "False", "0", "no", "NO", "off", "OFF", "  off  "} {
		t.Setenv("BANK_SANDBOX", raw)
		if Sandbox() {
			t.Errorf("BANK_SANDBOX=%q left the deployment in sandbox", raw)
		}
	}
	// Unset, empty, and anything it does not recognise all mean sandbox. An
	// operator who writes "disabled" gets a sandbox and no complaint, so the
	// accepted words are worth knowing exactly.
	for _, raw := range []string{"", "true", "1", "yes", "on", "disabled", "n", "prod"} {
		t.Setenv("BANK_SANDBOX", raw)
		if !Sandbox() {
			t.Errorf("BANK_SANDBOX=%q turned sandbox off — it is not one of the off words", raw)
		}
	}
}

// The demo book is invented customers with invented KYC approvals. Seeding it
// into a live bank would put fabricated identities in the compliance queue, so
// the seeder refuses outside sandbox and this holds it there.
func TestPortfolioSeedRefusesOutsideSandbox(t *testing.T) {
	app := newBankApp(t)
	t.Setenv("BANK_SANDBOX", "false")

	seedPortfolio(app)

	found, err := app.FindRecordsByFilter(collections.AccountCollectionName,
		"owner ~ {:p}", "", 0, 0, map[string]any{"p": pfOwnerPrefix + "%"})
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if len(found) != 0 {
		t.Fatalf("%d invented customers were seeded into a live bank", len(found))
	}
}

// In sandbox it seeds the book once. Twice would double every customer in the
// console on the second boot.
func TestPortfolioSeedIsIdempotent(t *testing.T) {
	app := newBankApp(t)
	t.Setenv("BANK_SANDBOX", "true")

	seedPortfolio(app)
	first, err := app.FindRecordsByFilter(collections.AccountCollectionName,
		"owner ~ {:p}", "", 0, 0, map[string]any{"p": pfOwnerPrefix + "%"})
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if len(first) == 0 {
		t.Fatal("the book seeded nothing in sandbox")
	}

	seedPortfolio(app)
	again, err := app.FindRecordsByFilter(collections.AccountCollectionName,
		"owner ~ {:p}", "", 0, 0, map[string]any{"p": pfOwnerPrefix + "%"})
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if len(again) != len(first) {
		t.Fatalf("a second boot took the book from %d accounts to %d", len(first), len(again))
	}

	// Every seeded row is a credible book entry, not a half-written record: the
	// console reads all of these and a blank one shows as a broken customer.
	for _, r := range first {
		for _, f := range []string{"entityName", "entityType", "country", "currency", "status", "kycStatus"} {
			if r.GetString(f) == "" {
				t.Fatalf("seeded account %s has an empty %s", r.Id, f)
			}
		}
	}
}
