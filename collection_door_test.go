package bank

import (
	"net/http"
	"strings"
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

// Reading through the collection door is scoped; writing through it is not
// open at all. Every collection here carries a list and view rule and nothing
// else, so create, update and delete are superuser-only — and that is what
// stands between a customer and their own ledger.
//
// A credit written straight into the transactions collection is the whole
// point: the settlement hook fires on anything reaching "completed" and credits
// the balance, so a customer who could create one has a mint. The hooks are not
// the guard here — they would run and do exactly as told.
func TestACustomerCannotWriteThroughTheCollectionDoor(t *testing.T) {
	app := newBankApp(t)
	mine, token := signIn(t, app, "mine@example.com")
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	before := availableOf(t, app, mine, "USD")
	if before == 0 {
		t.Fatal("the account holds nothing, so a mint would not show")
	}

	run(t, app, tests.ApiScenario{
		Name:   "a completed credit written straight into the ledger",
		Method: http.MethodPost,
		URL:    "/v1/collections/" + collections.TransactionCollectionName + "/records",
		Body: strings.NewReader(`{"account":"` + mine + `","type":"deposit","direction":"credit",` +
			`"amount":100000000,"currency":"USD","status":"completed","reference":"minted"}`),
		Headers:         h,
		ExpectedStatus:  http.StatusForbidden,
		ExpectedContent: []string{"message"},
	})
	if after := availableOf(t, app, mine, "USD"); after != before {
		t.Fatalf("a customer minted %d out of nothing", after-before)
	}

	// Their own account is theirs to read and not to edit: KYC approval and the
	// membership that sets the limits are both fields on it, so an account a
	// customer could write is a customer who approves themselves and raises
	// their own ceiling.
	run(t, app, tests.ApiScenario{
		Name:            "approving their own KYC",
		Method:          http.MethodPatch,
		URL:             "/v1/collections/" + collections.AccountCollectionName + "/records/" + mine,
		Body:            strings.NewReader(`{"kycStatus":"approved","plan":"sovereign","riskRating":"low"}`),
		Headers:         h,
		ExpectedStatus:  http.StatusForbidden,
		ExpectedContent: []string{"message"},
	})

	acct, err := app.FindRecordById(collections.AccountCollectionName, mine)
	if err != nil {
		t.Fatal(err)
	}
	if got := acct.GetString("plan"); got != "" {
		t.Errorf("a customer set their own membership to %q", got)
	}

	// And an existing row is not theirs to amend or remove — a settled debit
	// deleted is a debit that never happened.
	txs, err := app.FindRecordsByFilter(collections.TransactionCollectionName,
		"account = {:a}", "-created", 1, 0, map[string]any{"a": mine})
	if err != nil || len(txs) == 0 {
		t.Fatalf("no transaction to try to amend: %v", err)
	}
	for _, tc := range []struct {
		name, method, body string
	}{
		{"amending a settled transaction", http.MethodPatch, `{"amount":1,"status":"failed"}`},
		{"deleting a settled transaction", http.MethodDelete, ""},
	} {
		s := tests.ApiScenario{
			Name:            tc.name,
			Method:          tc.method,
			URL:             "/v1/collections/" + collections.TransactionCollectionName + "/records/" + txs[0].Id,
			Headers:         h,
			ExpectedStatus:  http.StatusForbidden,
			ExpectedContent: []string{"message"},
		}
		if tc.body != "" {
			s.Body = strings.NewReader(tc.body)
		}
		run(t, app, s)
	}

	if _, err := app.FindRecordById(collections.TransactionCollectionName, txs[0].Id); err != nil {
		t.Errorf("a customer deleted a settled transaction: %v", err)
	}
}
