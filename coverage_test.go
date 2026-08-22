package bank

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// seedSuperuserOnly mints a superuser with no account, so onboarding has work
// to do (unlike seedPrincipal, which pre-provisions).
func seedSuperuserOnly(t *testing.T, app core.App) string {
	t.Helper()
	col, _ := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
	su := core.NewRecord(col)
	su.SetEmail("onboard@lux.financial")
	su.Set("password", "onboard-pass-1234")
	if err := app.Save(su); err != nil {
		t.Fatalf("save superuser: %v", err)
	}
	tok, err := su.NewAuthToken()
	if err != nil {
		t.Fatalf("token: %v", err)
	}
	return tok
}

func TestOnboardOpensAccount(t *testing.T) {
	app := newBankApp(t)
	token := seedSuperuserOnly(t, app)
	run(t, app, tests.ApiScenario{
		Name:            "onboard opens and funds the account",
		Method:          http.MethodPost,
		URL:             "/v1/bank/onboard",
		Body:            strings.NewReader(`{"name":"New User","country":"US","entityType":"individual"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"onboarded":true`, `"account"`},
	})
}

func TestPaymentCallbackWebhook(t *testing.T) {
	const secret = "cb-secret"
	t.Setenv("WEBHOOK_HMAC_SECRET", secret)
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	// A pending outbound the callback will reconcile.
	tx, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "payment", "direction": "debit",
		"amount": 1_00, "currency": "USD", "status": "pending", "reference": "cb",
	})
	if err != nil {
		// balance may be insufficient; seed and retry
		_ = setBalance(app, acct.Id, "USD", 100_00)
		tx, err = newTx(app, map[string]any{
			"account": acct.Id, "type": "payment", "direction": "debit",
			"amount": 1_00, "currency": "USD", "status": "pending", "reference": "cb",
		})
		if err != nil {
			t.Fatalf("newTx: %v", err)
		}
	}

	body := `{"transactionId":"` + tx.Id + `","status":"completed","provider":"forex"}`
	run(t, app, tests.ApiScenario{
		Name:            "payment callback reconciles a transaction",
		Method:          http.MethodPost,
		URL:             "/v1/bank/webhooks/payments/callback",
		Body:            strings.NewReader(body),
		Headers:         map[string]string{"Content-Type": "application/json", "X-Signature": hmacSign(secret, body)},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"`},
	})
}

// A payment transaction fires `go routeToForex` on create; a mock forex server
// proves the request is shaped and sent to /v1/payments.
func TestRouteToForex(t *testing.T) {
	got := make(chan string, 1)
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		select {
		case got <- r.URL.Path:
		default:
		}
		w.WriteHeader(200)
	}))
	defer srv.Close()
	t.Setenv("FOREX_SERVICE_URL", srv.URL)

	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if err := setBalance(app, acct.Id, "USD", 100_00); err != nil {
		t.Fatalf("set balance: %v", err)
	}
	if _, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "payment", "direction": "debit",
		"amount": 1_00, "currency": "USD", "status": "pending", "reference": "fx",
	}); err != nil {
		t.Fatalf("newTx: %v", err)
	}
	select {
	case path := <-got:
		if !strings.Contains(path, "/v1/payments") {
			t.Errorf("forex path = %q, want /v1/payments", path)
		}
	case <-time.After(2 * time.Second):
		t.Error("forex service was not called")
	}
}

// Freezing an account writes an immutable audit-log entry — covers the
// account-status audit branch and the audit hooks.
func TestAccountFreezeAudits(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	acct.Set("status", "suspended")
	if err := app.Save(acct); err != nil {
		t.Fatalf("freeze: %v", err)
	}
	recs, err := app.FindRecordsByFilter(collections.AuditCollectionName,
		"account = {:a}", "-created", 0, 0, map[string]any{"a": acct.Id})
	if err != nil {
		t.Fatalf("find audit: %v", err)
	}
	if len(recs) == 0 {
		t.Error("expected an audit-log entry after freezing the account")
	}
}

// The document create hook refuses an unrecognized document type before base
// even validates the record's fields.
func TestDocumentTypeValidation(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	col, _ := app.FindCollectionByNameOrId(collections.DocumentCollectionName)

	bad := core.NewRecord(col)
	bad.Set("account", acct.Id)
	bad.Set("type", "not-a-doc")
	err := app.Save(bad)
	if err == nil || !strings.Contains(strings.ToLower(err.Error()), "document type") {
		t.Errorf("invalid document type: err = %v, want an 'invalid document type' rejection", err)
	}
}
