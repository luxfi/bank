package bank

import (
	"net/http"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// signIn opens a real, non-superuser identity with an account of its own, and
// returns the account id and a bearer for it.
//
// The rest of the suite signs in as a superuser, which bypasses collection
// rules entirely — so nothing here can be checked with the harness principal.
func signIn(t *testing.T, app core.App, email string) (account, token string) {
	t.Helper()
	col, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		t.Fatalf("users collection: %v", err)
	}
	u := core.NewRecord(col)
	u.SetEmail(email)
	u.Set("password", "a-long-enough-password")
	u.Set("verified", true)
	if err := app.Save(u); err != nil {
		t.Fatalf("save %s: %v", email, err)
	}
	acct, err := ProvisionCustomer(app, u, KYC{Name: email, Country: "US", EntityType: "individual"})
	if err != nil {
		t.Fatalf("provision %s: %v", email, err)
	}
	tok, err := u.NewAuthToken()
	if err != nil {
		t.Fatalf("token for %s: %v", email, err)
	}
	return acct.Id, tok
}

// Base serves every collection at /v1/collections/{name}/records, so the API
// rules are a second door onto the same data — one nothing in /v1/bank guards.
// A customer reaches it with the token they already hold, and what stops them
// listing another's accounts, cards, wallets and payment history is one rule
// expression per collection.
//
// A mistake in one is not a crash: it is every customer reading every other
// customer. Worth asking rather than reading, and it has to be asked as a real
// customer — a superuser is answered whatever it wants.
func TestTheCollectionDoorShowsACustomerOnlyTheirOwn(t *testing.T) {
	app := newBankApp(t)
	mine, myToken := signIn(t, app, "mine@example.com")
	theirs, _ := signIn(t, app, "theirs@example.com")
	seedRecordsFor(t, app, theirs)

	for _, name := range []string{
		collections.AccountCollectionName,
		collections.TransactionCollectionName,
		collections.BeneficiaryCollectionName,
		collections.CardCollectionName,
		collections.WalletCollectionName,
	} {
		run(t, app, tests.ApiScenario{
			Name:               name + " lists only the caller's own",
			Method:             http.MethodGet,
			URL:                "/v1/collections/" + name + "/records?perPage=200",
			Headers:            map[string]string{"Authorization": myToken},
			ExpectedStatus:     http.StatusOK,
			ExpectedContent:    []string{`"items"`},
			NotExpectedContent: []string{theirs},
		})

		run(t, app, tests.ApiScenario{
			Name:               name + " shows the anonymous caller nothing",
			Method:             http.MethodGet,
			URL:                "/v1/collections/" + name + "/records?perPage=200",
			ExpectedStatus:     http.StatusOK,
			NotExpectedContent: []string{theirs, mine},
		})
	}
}

// Balances carry no rule at all — superuser only — so the collection door does
// not open on them for a customer, and /v1/bank/accounts/{id}/balances is the
// way in. A rule added there later would open every account's money to every
// signed-in caller.
func TestBalancesAreNotReadableThroughTheCollectionDoor(t *testing.T) {
	app := newBankApp(t)
	_, token := signIn(t, app, "mine@example.com")

	for who, headers := range map[string]map[string]string{
		"a signed-in customer": {"Authorization": token},
		"an anonymous caller":  {},
	} {
		run(t, app, tests.ApiScenario{
			Name:            collections.BalanceCollectionName + " is closed to " + who,
			Method:          http.MethodGet,
			URL:             "/v1/collections/" + collections.BalanceCollectionName + "/records",
			Headers:         headers,
			ExpectedStatus:  http.StatusForbidden,
			ExpectedContent: []string{"message"},
		})
	}
}

// seedRecordsFor gives an account one of each kind of record, so a leak has
// something to leak.
func seedRecordsFor(t *testing.T, app core.App, account string) {
	t.Helper()
	for _, seed := range []struct {
		collection string
		fields     map[string]any
	}{
		{collections.TransactionCollectionName, map[string]any{
			"type": "payment", "direction": "debit", "amount": 4200,
			"currency": "USD", "status": "completed", "reference": "Their rent",
		}},
		{collections.BeneficiaryCollectionName, map[string]any{
			"name": "Their Landlord", "bankAccountHolder": "Their Landlord",
			"currency": "USD", "country": "US", "paymentType": "regular", "verified": true,
			"bankDetails": map[string]any{"accountNumber": "12345678"},
		}},
	} {
		col, err := app.FindCollectionByNameOrId(seed.collection)
		if err != nil {
			t.Fatalf("%s: %v", seed.collection, err)
		}
		r := core.NewRecord(col)
		r.Set("account", account)
		for k, v := range seed.fields {
			r.Set(k, v)
		}
		if err := app.Save(r); err != nil {
			t.Fatalf("seeding a %s for the other account: %v", seed.collection, err)
		}
	}
	if card := issueCardRecord(app, account, "Someone Else", "USD"); card == nil {
		t.Fatal("could not give the other account a card")
	}
}
