package bank

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// A transaction above the AML threshold ($10k) with no compliance service
// configured passes (fail-open dev mode) — and exercises the AML branch.
func TestAMLFailOpenWithoutService(t *testing.T) {
	t.Setenv("COMPLIANCE_SERVICE_URL", "")
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if err := setBalance(app, acct.Id, "USD", 50_000_00); err != nil {
		t.Fatalf("set balance: %v", err)
	}
	if _, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "payment", "direction": "debit",
		"amount": 20_000_00, "currency": "USD", "status": "pending", "reference": "big",
	}); err != nil {
		t.Errorf("expected fail-open AML to allow the transaction, got %v", err)
	}
}

// With a compliance service that blocks, an above-threshold transaction is
// refused — covering callComplianceService and the block branch.
func TestAMLBlocksWhenServiceBlocks(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"result":"blocked"}`))
	}))
	defer srv.Close()
	t.Setenv("COMPLIANCE_SERVICE_URL", srv.URL)

	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if err := setBalance(app, acct.Id, "USD", 50_000_00); err != nil {
		t.Fatalf("set balance: %v", err)
	}
	if _, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "payment", "direction": "debit",
		"amount": 20_000_00, "currency": "USD", "status": "pending", "reference": "big",
	}); err == nil {
		t.Error("expected AML screening to block the above-threshold transaction")
	}
}
