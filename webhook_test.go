package bank

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

func hmacSign(secret, body string) string {
	m := hmac.New(sha256.New, []byte(secret))
	m.Write([]byte(body))
	return hex.EncodeToString(m.Sum(nil))
}

// txWithCCID creates a pending transaction tagged with a CurrencyCloud id so a
// webhook has something to reconcile against.
func txWithCCID(t *testing.T, app core.App, acctID, ccID string) {
	t.Helper()
	col, _ := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	r := core.NewRecord(col)
	r.Set("account", acctID)
	r.Set("type", "payment")
	r.Set("direction", "credit")
	r.Set("amount", 10_00)
	r.Set("currency", "USD")
	r.Set("status", "pending")
	r.Set("ccTransactionId", ccID)
	if err := app.Save(r); err != nil {
		t.Fatalf("save cc tx: %v", err)
	}
}

func TestCurrencyCloudWebhooks(t *testing.T) {
	const secret = "wh-secret"
	t.Setenv("WEBHOOK_HMAC_SECRET", secret)
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	txWithCCID(t, app, acct.Id, "cc-pay-1")
	txWithCCID(t, app, acct.Id, "ifx-1")

	pay := `{"id":"cc-pay-1","status":"completed"}`
	run(t, app, tests.ApiScenario{
		Name:            "cc payment webhook reconciles",
		Method:          http.MethodPost,
		URL:             "/v1/bank/webhooks/currencycloud/payment",
		Body:            strings.NewReader(pay),
		Headers:         map[string]string{"Content-Type": "application/json", "X-Signature": hmacSign(secret, pay)},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"status"`},
	})

	// Bad signature is refused by the HMAC gate.
	run(t, app, tests.ApiScenario{
		Name:            "cc payment webhook rejects a bad signature",
		Method:          http.MethodPost,
		URL:             "/v1/bank/webhooks/currencycloud/payment",
		Body:            strings.NewReader(pay),
		Headers:         map[string]string{"Content-Type": "application/json", "X-Signature": "bad"},
		ExpectedStatus:  401,
		ExpectedContent: []string{`"error"`},
	})

	// Unknown id is accepted (200 ignored) so the upstream does not retry.
	unknown := `{"id":"nope","status":"completed"}`
	run(t, app, tests.ApiScenario{
		Name:            "cc payment webhook ignores an unknown id",
		Method:          http.MethodPost,
		URL:             "/v1/bank/webhooks/currencycloud/payment",
		Body:            strings.NewReader(unknown),
		Headers:         map[string]string{"Content-Type": "application/json", "X-Signature": hmacSign(secret, unknown)},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"ignored"`},
	})

	txWithCCID(t, app, acct.Id, "cc-conv-1")
	conv := `{"id":"cc-conv-1","status":"completed"}`
	run(t, app, tests.ApiScenario{
		Name:            "cc conversion webhook reconciles",
		Method:          http.MethodPost,
		URL:             "/v1/bank/webhooks/currencycloud/conversion",
		Body:            strings.NewReader(conv),
		Headers:         map[string]string{"Content-Type": "application/json", "X-Signature": hmacSign(secret, conv)},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"status"`},
	})

	ifx := `{"transaction_id":"ifx-1","status":"settled"}`
	run(t, app, tests.ApiScenario{
		Name:            "ifx settlement webhook reconciles",
		Method:          http.MethodPost,
		URL:             "/v1/bank/webhooks/ifx/settlement",
		Body:            strings.NewReader(ifx),
		Headers:         map[string]string{"Content-Type": "application/json", "X-Signature": hmacSign(secret, ifx)},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"status"`},
	})
}

// Sanctions screening blocks a beneficiary create when the compliance service
// says so — covering screenSanctions + the beneficiary-create compliance hook.
func TestSanctionsBlocksBeneficiary(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`{"result":"blocked"}`))
	}))
	defer srv.Close()
	t.Setenv("COMPLIANCE_SERVICE_URL", srv.URL)

	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	col, _ := app.FindCollectionByNameOrId(collections.BeneficiaryCollectionName)
	ben := core.NewRecord(col)
	ben.Set("account", acct.Id)
	ben.Set("name", "Sanctioned Party")
	ben.Set("currency", "USD")
	ben.Set("country", "IR")
	ben.Set("type", "bank")
	if err := app.Save(ben); err == nil {
		t.Error("expected sanctions screening to block the beneficiary create")
	}
}

// Live-mode exchange refuses to price without forexd, rather than falling back
// to sandbox tables.
func TestExchangeLive503WithoutForex(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("FOREX_SERVICE_URL", "")
	// A fresh app in live mode; onboarding opens a pending account, so seed a
	// principal and hit the public-shaped exchange path via the rate function.
	if _, _, err := exchangeRate(t.Context(), "USD", "EUR", 100_00); err == nil {
		t.Error("expected live-mode exchange to error without FOREX_SERVICE_URL")
	}
}
