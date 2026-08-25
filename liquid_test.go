package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
)

// The vault catalog is public, like the plan ladder.
func TestVaultsPublic(t *testing.T) {
	app := newBankApp(t)
	run(t, app, tests.ApiScenario{
		Name:            "vault catalog is public",
		Method:          http.MethodGet,
		URL:             "/v1/bank/vaults",
		ExpectedStatus:  200,
		ExpectedContent: []string{`"stlux"`, `"xLUX"`, `"maxLtv"`, `"wsteth"`},
	})
}

// The seeded principal opens with two demo positions; borrowing past the LTV
// ceiling is refused, and a legitimate deposit + borrow settles.
func TestEarnFlow(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	run(t, app, tests.ApiScenario{
		Name:            "earn/vaults folds the caller's positions into the catalog",
		Method:          http.MethodGet,
		URL:             "/v1/bank/earn/vaults",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"stlux"`, `"position"`, `"selfRepayDays"`},
	})

	run(t, app, tests.ApiScenario{
		Name:            "deposit adds collateral",
		Method:          http.MethodPost,
		URL:             "/v1/bank/earn/deposit",
		Body:            strings.NewReader(`{"vault":"stlux","amount":20000000}`),
		Headers:         h,
		ExpectedStatus:  200,
		ExpectedContent: []string{`"collateralUsd"`, `"borrowable"`},
	})

	// Amounts are the vault asset's minor units on every verb, so this asks to
	// borrow 200 LUX against 200 LUX of collateral — the whole of it, past the
	// 90% the vault lends against.
	run(t, app, tests.ApiScenario{
		Name:            "borrowing past the LTV ceiling is refused",
		Method:          http.MethodPost,
		URL:             "/v1/bank/earn/borrow",
		Body:            strings.NewReader(`{"vault":"stlux","amount":200000000}`),
		Headers:         h,
		ExpectedStatus:  422,
		ExpectedContent: []string{"over the borrow limit"},
	})

	run(t, app, tests.ApiScenario{
		Name:            "a borrow within the limit settles",
		Method:          http.MethodPost,
		URL:             "/v1/bank/earn/borrow",
		Body:            strings.NewReader(`{"vault":"stlux","amount":50000}`),
		Headers:         h,
		ExpectedStatus:  200,
		ExpectedContent: []string{`"debt"`, `"ltv"`},
	})
}
