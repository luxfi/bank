package bank

import (
	"net/http"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// principalWithoutAccount is an authenticated caller who has never onboarded —
// which is every caller now, on their first request. The demo account cannot be
// seeded at boot because its owner is IAM's subject and nothing knows that value
// until somebody signs in.
func principalWithoutAccount(t *testing.T, app core.App, email string) (id, token string) {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
	if err != nil {
		t.Fatal(err)
	}
	su := core.NewRecord(col)
	su.SetEmail(email)
	su.Set("password", "test-password-1234")
	if err := app.Save(su); err != nil {
		t.Fatalf("save principal: %v", err)
	}
	tok, err := su.NewAuthToken()
	if err != nil {
		t.Fatalf("auth token: %v", err)
	}
	if got := primaryAccount(app, su.Id); got != nil {
		t.Fatal("the principal already holds an account; this test needs one that does not")
	}
	return su.Id, tok
}

// In sandbox the first authenticated request OPENS the account. Answering
// onboarded:false instead left the shell in its pre-onboarding state — no nav,
// nothing to click — for a customer who had just signed in successfully, and
// there was no longer any boot-time seeding to fall back on.
func TestSandboxOpensTheAccountOnFirstSight(t *testing.T) {
	app := newBankApp(t)
	id, token := principalWithoutAccount(t, app, "fresh@lux.financial")

	run(t, app, tests.ApiScenario{
		Name:            "a caller with no account is onboarded by asking",
		Method:          http.MethodGet,
		URL:             "/v1/bank/overview",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"onboarded":true`, `"account"`},
	})

	acct := primaryAccount(app, id)
	if acct == nil {
		t.Fatal("no account was opened for the caller")
	}
	if got := acct.GetString("owner"); got != id {
		t.Fatalf("account owner = %q, want the caller %q", got, id)
	}
}

// Asking twice does not open two. The account is the caller's, not the request's.
func TestOpeningIsIdempotent(t *testing.T) {
	app := newBankApp(t)
	id, token := principalWithoutAccount(t, app, "twice@lux.financial")

	for i := 0; i < 3; i++ {
		run(t, app, tests.ApiScenario{
			Name:            "repeat overview",
			Method:          http.MethodGet,
			URL:             "/v1/bank/overview",
			Headers:         map[string]string{"Authorization": token},
			ExpectedStatus:  200,
			ExpectedContent: []string{`"onboarded":true`},
		})
	}

	accts, err := app.FindRecordsByFilter(collections.AccountCollectionName,
		"owner = {:u}", "", 0, 0, map[string]any{"u": id})
	if err != nil {
		t.Fatal(err)
	}
	if len(accts) != 1 {
		t.Fatalf("%d accounts were opened for one caller", len(accts))
	}
}

// Outside sandbox it does NOT. An account is opened by onboarding, which takes a
// KYC body; inventing one for whoever appears is the opposite of that.
func TestLiveDoesNotInventAnAccount(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	app := newBankApp(t)
	id, token := principalWithoutAccount(t, app, "live@lux.financial")

	run(t, app, tests.ApiScenario{
		Name:            "a live caller with no account is not onboarded behind their back",
		Method:          http.MethodGet,
		URL:             "/v1/bank/overview",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"onboarded":false`},
	})

	if primaryAccount(app, id) != nil {
		t.Fatal("an account was opened for a caller who never onboarded")
	}
}
