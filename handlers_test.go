package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
)

// scenario runs one HTTP case against a shared app. Cleanup is owned by
// newBankApp's t.Cleanup, so per-scenario cleanup is disabled — otherwise the
// first scenario closes the DB the next one needs.
func run(t *testing.T, app *tests.TestApp, s tests.ApiScenario) {
	s.TestAppFactory = func(testing.TB) *tests.TestApp { return app }
	s.DisableTestAppCleanup = true
	s.Test(t)
}

func TestHealthPublic(t *testing.T) {
	app := newBankApp(t)
	run(t, app, tests.ApiScenario{
		Name:            "health is public",
		Method:          http.MethodGet,
		URL:             "/v1/bank/health",
		ExpectedStatus:  200,
		ExpectedContent: []string{`"status":"ok"`, `"sandbox":true`},
	})
}

func TestPlansPublic(t *testing.T) {
	app := newBankApp(t)
	run(t, app, tests.ApiScenario{
		Name:            "plans list the ladder",
		Method:          http.MethodGet,
		URL:             "/v1/bank/plans",
		ExpectedStatus:  200,
		ExpectedContent: []string{`"silver"`, `"gold"`, `"black"`, `"sovereign"`},
	})
}

func TestConfigPublic(t *testing.T) {
	app := newBankApp(t)
	run(t, app, tests.ApiScenario{
		Name:            "config is public and sandbox-flagged",
		Method:          http.MethodGet,
		URL:             "/v1/bank/config",
		ExpectedStatus:  200,
		ExpectedContent: []string{`"sandbox":true`, `"network":"lux-testnet"`, `"partner"`},
	})
}

func TestWalletRequiresAuth(t *testing.T) {
	app := newBankApp(t)
	run(t, app, tests.ApiScenario{
		Name:            "wallet rejects the anonymous caller",
		Method:          http.MethodGet,
		URL:             "/v1/bank/wallet",
		ExpectedStatus:  401,
		ExpectedContent: []string{`"status":401`},
	})
}

func TestWalletAuthed(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	run(t, app, tests.ApiScenario{
		Name:            "wallet returns the seeded testnet wallet",
		Method:          http.MethodGet,
		URL:             "/v1/bank/wallet",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"network":"lux-testnet"`, `"address":"0x`},
	})
}

func TestCryptoFaucetThenSend(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	run(t, app, tests.ApiScenario{
		Name:            "faucet credits ETH",
		Method:          http.MethodPost,
		URL:             "/v1/bank/crypto/deposit",
		Body:            strings.NewReader(`{"asset":"ETH","amount":1000000}`),
		Headers:         h,
		ExpectedStatus:  200,
		ExpectedContent: []string{`"txHash":"0x`, `"network":"lux-testnet"`},
	})
	run(t, app, tests.ApiScenario{
		Name:            "send debits ETH and returns a hash",
		Method:          http.MethodPost,
		URL:             "/v1/bank/crypto/send",
		Body:            strings.NewReader(`{"asset":"ETH","amount":400000,"toAddress":"0x52908400098527886E0F7030069857D2E4169EE7"}`),
		Headers:         h,
		ExpectedStatus:  200,
		ExpectedContent: []string{`"txHash":"0x`},
	})
	run(t, app, tests.ApiScenario{
		Name:            "send refuses an unusable address",
		Method:          http.MethodPost,
		URL:             "/v1/bank/crypto/send",
		Body:            strings.NewReader(`{"asset":"ETH","amount":1000,"toAddress":"0xnope"}`),
		Headers:         h,
		ExpectedStatus:  400,
		ExpectedContent: []string{`"status":400`},
	})
}

func TestExchangeQuoteAndExecute(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	run(t, app, tests.ApiScenario{
		Name:            "exchange quotes USD -> LUX in sandbox",
		Method:          http.MethodPost,
		URL:             "/v1/bank/exchange/quote",
		Body:            strings.NewReader(`{"fromCurrency":"USD","toCurrency":"LUX","amount":1000}`),
		Headers:         h,
		ExpectedStatus:  200,
		ExpectedContent: []string{`"toAmount"`, `"rate"`},
	})
	run(t, app, tests.ApiScenario{
		Name:            "exchange executes and returns updated balances",
		Method:          http.MethodPost,
		URL:             "/v1/bank/exchange/execute",
		Body:            strings.NewReader(`{"fromCurrency":"USD","toCurrency":"LUX","amount":1000}`),
		Headers:         h,
		ExpectedStatus:  200,
		ExpectedContent: []string{`"balances"`},
	})
}

func TestAuthedReads(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token}
	for _, c := range []struct{ url, want string }{
		{"/v1/bank/overview", `"onboarded":true`},
		{"/v1/bank/account/summary", `"entityName":"Test User"`},
		{"/v1/bank/transactions", `"reference"`},
		{"/v1/bank/beneficiaries", `[`},
		{"/v1/bank/cards", `"brand":"visa"`},
		{"/v1/bank/crypto/prices", `"prices"`},
	} {
		run(t, app, tests.ApiScenario{
			Name:            "authed read " + c.url,
			Method:          http.MethodGet,
			URL:             c.url,
			Headers:         h,
			ExpectedStatus:  200,
			ExpectedContent: []string{c.want},
		})
	}
}

// exercises the balance hook chain directly: a debit holds then settles.
func TestLedgerHoldAndSettle(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if acct == nil {
		t.Fatal("no account seeded")
	}
	if err := setBalance(app, acct.Id, "USD", 100_00); err != nil {
		t.Fatalf("setBalance: %v", err)
	}
	tx, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "payment", "direction": "debit",
		"amount": 40_00, "currency": "USD", "status": "pending", "reference": "test",
	})
	if err != nil {
		t.Fatalf("newTx: %v", err)
	}
	if err := settle(app, tx); err != nil {
		t.Fatalf("settle: %v", err)
	}
	bal, _ := app.FindFirstRecordByFilter("balances", "account = {:a} && currency = 'USD'", map[string]any{"a": acct.Id})
	if bal == nil {
		t.Fatal("no balance")
	}
	if got := int64(bal.GetFloat("available")); got != 60_00 {
		t.Errorf("available after settle = %d, want 6000", got)
	}
	if got := int64(bal.GetFloat("held")); got != 0 {
		t.Errorf("held after settle = %d, want 0", got)
	}
}

// a debit over the balance is rejected by the pre-create hold.
func TestLedgerRejectsOverdraw(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if err := setBalance(app, acct.Id, "USD", 10_00); err != nil {
		t.Fatalf("setBalance: %v", err)
	}
	if _, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "payment", "direction": "debit",
		"amount": 50_00, "currency": "USD", "status": "pending", "reference": "over",
	}); err == nil {
		t.Error("expected overdraw to be rejected by the hold hook")
	}
}
