package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// The rate rule holds at the door as well as in the function: without a rate
// source a live deployment refuses, and refuses having reserved nothing.
// TestExchangeRateLiveUnconfigured checks exchangeRate itself; this checks that
// a customer reaches the same answer and keeps their money.
func TestALiveExchangeWithoutARateSourceReservesNothing(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("FOREX_SERVICE_URL", "")
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}
	before := availableOf(t, app, acct.Id, "USD")

	for _, path := range []string{"quote", "execute"} {
		run(t, app, tests.ApiScenario{
			Name:            path + " with no rate source",
			Method:          http.MethodPost,
			URL:             "/v1/bank/exchange/" + path,
			Body:            strings.NewReader(`{"fromCurrency":"USD","toCurrency":"EUR","amount":10000}`),
			Headers:         h,
			ExpectedStatus:  http.StatusServiceUnavailable,
			ExpectedContent: []string{"unavailable"},
		})
	}

	if after := availableOf(t, app, acct.Id, "USD"); after != before {
		t.Errorf("the balance moved by %d on a conversion that was refused", after-before)
	}
	txs, err := app.FindRecordsByFilter(collections.TransactionCollectionName,
		"account = {:a} && type = 'conversion' && status = 'pending'", "", 50, 0,
		map[string]any{"a": acct.Id})
	if err != nil {
		t.Fatal(err)
	}
	if len(txs) != 0 {
		t.Errorf("%d conversion(s) are holding funds after the exchange refused", len(txs))
	}
}

// A conversion is one act with two legs, and both land: the sold currency
// leaves and the bought one arrives, by the amount the response quoted.
func TestAConversionMovesBothCurrencies(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	const sold = 10_000 // $100.00
	usdBefore := availableOf(t, app, acct.Id, "USD")
	eurBefore := availableOf(t, app, acct.Id, "EUR")

	body := post(t, app, h, "/v1/bank/exchange/execute",
		`{"fromCurrency":"USD","toCurrency":"EUR","amount":10000}`,
		http.StatusOK, `"toAmount"`, `"rate"`)
	bought, _ := body["toAmount"].(float64)
	if bought <= 0 {
		t.Fatalf("the conversion bought %v", body["toAmount"])
	}

	if got := availableOf(t, app, acct.Id, "USD"); got != usdBefore-sold {
		t.Errorf("the sold currency reads %d, want %d", got, usdBefore-sold)
	}
	if got := availableOf(t, app, acct.Id, "EUR"); got != eurBefore+int64(bought) {
		t.Errorf("the bought currency reads %d, want %d", got, eurBefore+int64(bought))
	}
}

// A pair the bank cannot price is refused before anything is reserved, and so
// is converting a currency into itself.
func TestTheExchangeRefusesAPairItCannotPrice(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	if primaryAccount(app, owner) == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	for name, body := range map[string]string{
		"a currency the bank does not carry": `{"fromCurrency":"USD","toCurrency":"ZZZ","amount":10000}`,
		"a currency into itself":             `{"fromCurrency":"USD","toCurrency":"USD","amount":10000}`,
		"nothing at all":                     `{"fromCurrency":"USD","toCurrency":"EUR","amount":0}`,
		"a negative amount":                  `{"fromCurrency":"USD","toCurrency":"EUR","amount":-10000}`,
	} {
		run(t, app, tests.ApiScenario{
			Name:            name + " is refused",
			Method:          http.MethodPost,
			URL:             "/v1/bank/exchange/execute",
			Body:            strings.NewReader(body),
			Headers:         h,
			ExpectedStatus:  http.StatusBadRequest,
			ExpectedContent: []string{"currency pair or amount"},
		})
	}
}
