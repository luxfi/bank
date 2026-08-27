package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
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

// A configured chain that cannot be reached must stop an Earn movement, not
// quietly reroute it onto the ledger. The ledger path books a borrow against
// collateral the chain is not holding and sizes it from a position the chain
// overwrites the moment it returns — so the customer is paid real money against
// numbers that are about to be discarded.
//
// The refusal is only half the claim. The other half is that nothing moved: a
// 502 with a transaction row behind it would be the same bug wearing an error
// code.
func TestEarnRefusesWhileTheChainIsUnreachable(t *testing.T) {
	t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
	evmMu.Lock()
	evmInst, evmFrom = nil, ""
	evmMu.Unlock()
	t.Cleanup(func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	})

	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	before, err := app.FindRecordsByFilter(collections.TransactionCollectionName, "type = 'earn'", "", 0, 0, nil)
	if err != nil {
		t.Fatalf("counting transactions: %v", err)
	}

	for _, act := range []string{"deposit", "borrow", "repay", "withdraw"} {
		run(t, app, tests.ApiScenario{
			Name:            act + " refuses while the chain is unreachable",
			Method:          http.MethodPost,
			URL:             "/v1/bank/earn/" + act,
			Body:            strings.NewReader(`{"vault":"stlux","amount":1000000}`),
			Headers:         h,
			ExpectedStatus:  http.StatusBadGateway,
			ExpectedContent: []string{"the chain is unreachable"},
		})
	}

	after, err := app.FindRecordsByFilter(collections.TransactionCollectionName, "type = 'earn'", "", 0, 0, nil)
	if err != nil {
		t.Fatalf("counting transactions: %v", err)
	}
	if len(after) != len(before) {
		t.Errorf("%d earn transactions were written during an outage — the refusal did not stop the money", len(after)-len(before))
	}
}
