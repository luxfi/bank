package bank

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/hanzoai/base/tests"
)

// The three per-account reads are addressed by account id in the path, so the
// id is a caller's to write. What stops one customer reading another's balances,
// deposit addresses and payment history is a single comparison in each handler,
// and none of them was exercised.
func TestOneCustomerCannotReadAnother(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	if primaryAccount(app, owner) == nil {
		t.Fatal("no account provisioned")
	}
	theirs := secondAccount(t, app, "another-owner", "approved")

	for _, path := range []string{"balances", "wallets", "transactions"} {
		run(t, app, tests.ApiScenario{
			Name:            "reading another account's " + path + " is refused",
			Method:          http.MethodGet,
			URL:             fmt.Sprintf("/v1/bank/accounts/%s/%s", theirs, path),
			Headers:         map[string]string{"Authorization": token},
			ExpectedStatus:  http.StatusForbidden,
			ExpectedContent: []string{"account"},
		})

		// An account that does not exist is not found rather than forbidden:
		// answering "forbidden" for an id nobody holds tells a caller which
		// ids are real.
		run(t, app, tests.ApiScenario{
			Name:            "reading a " + path + " for an account that does not exist",
			Method:          http.MethodGet,
			URL:             "/v1/bank/accounts/nosuchaccount/" + path,
			Headers:         map[string]string{"Authorization": token},
			ExpectedStatus:  http.StatusNotFound,
			ExpectedContent: []string{"not found"},
		})

		run(t, app, tests.ApiScenario{
			Name:            path + " rejects the anonymous caller",
			Method:          http.MethodGet,
			URL:             fmt.Sprintf("/v1/bank/accounts/%s/%s", theirs, path),
			ExpectedStatus:  http.StatusUnauthorized,
			ExpectedContent: []string{"message"},
		})
	}
}

// And a customer reads their own.
func TestACustomerReadsTheirOwnAccount(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	mine := primaryAccount(app, owner)
	if mine == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token}

	for path, expect := range map[string]string{
		"balances":     `"currency"`,
		"wallets":      `"address"`,
		"transactions": `[`,
	} {
		run(t, app, tests.ApiScenario{
			Name:            "reading my own " + path,
			Method:          http.MethodGet,
			URL:             fmt.Sprintf("/v1/bank/accounts/%s/%s", mine.Id, path),
			Headers:         h,
			ExpectedStatus:  http.StatusOK,
			ExpectedContent: []string{expect},
		})
	}
}
