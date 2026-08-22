package bank

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

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
