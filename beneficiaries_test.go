package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// A beneficiary is where money leaves to, so who may delete one is the whole
// question: an account that could remove another's recipient could remove the
// one a payment is about to name, and add its own.
func TestABeneficiaryBelongsToOneAccount(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	mine := primaryAccount(app, owner)
	if mine == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	// Somebody else's account, and their recipient on it.
	theirs := secondAccount(t, app, "another-owner", "approved")
	col, err := app.FindCollectionByNameOrId(collections.BeneficiaryCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	rec := core.NewRecord(col)
	rec.Set("account", theirs)
	rec.Set("name", "Their Landlord")
	rec.Set("bankAccountHolder", "Their Landlord")
	rec.Set("currency", "USD")
	rec.Set("country", "US")
	rec.Set("paymentType", "regular")
	rec.Set("bankDetails", map[string]any{"accountNumber": "12345678", "sortCode": "00-00-00"})
	rec.Set("verified", true)
	if err := app.Save(rec); err != nil {
		t.Fatalf("their beneficiary: %v", err)
	}

	run(t, app, tests.ApiScenario{
		Name:            "deleting another account's beneficiary is refused",
		Method:          http.MethodDelete,
		URL:             "/v1/bank/beneficiaries/" + rec.Id,
		Headers:         h,
		ExpectedStatus:  http.StatusForbidden,
		ExpectedContent: []string{"beneficiary"},
	})

	// And it is still there.
	if _, err := app.FindRecordById(collections.BeneficiaryCollectionName, rec.Id); err != nil {
		t.Errorf("another account's beneficiary was deleted: %v", err)
	}

	// A beneficiary that does not exist is not found, rather than forbidden —
	// the two answers say different things and only one of them is true.
	run(t, app, tests.ApiScenario{
		Name:            "deleting a beneficiary that does not exist",
		Method:          http.MethodDelete,
		URL:             "/v1/bank/beneficiaries/nosuchbeneficiary",
		Headers:         h,
		ExpectedStatus:  http.StatusNotFound,
		ExpectedContent: []string{"not found"},
	})
}

// The round trip a customer actually makes: add a recipient, see it listed,
// remove it, see it gone.
func TestARecipientCanBeAddedListedAndRemoved(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	if primaryAccount(app, owner) == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	body := post(t, app, h, "/v1/bank/beneficiaries",
		`{"name":"Lindqvist AB","currency":"eur","country":"se","iban":"SE3550000000054910000003","bic":"ESSESESS"}`,
		http.StatusCreated, `"id"`)
	id, _ := body["id"].(string)
	if id == "" {
		t.Fatalf("no id came back: %v", body)
	}

	// The currency and country are upper-cased on the way in, and the holder
	// defaults to the name, so a recipient added with the short form is
	// complete enough to pay.
	rec, err := app.FindRecordById(collections.BeneficiaryCollectionName, id)
	if err != nil {
		t.Fatal(err)
	}
	for field, want := range map[string]string{
		"currency":          "EUR",
		"country":           "SE",
		"bankAccountHolder": "Lindqvist AB",
		"paymentType":       "regular",
	} {
		if got := rec.GetString(field); got != want {
			t.Errorf("%s = %q, want %q", field, got, want)
		}
	}

	run(t, app, tests.ApiScenario{
		Name:            "the recipient is listed",
		Method:          http.MethodGet,
		URL:             "/v1/bank/beneficiaries",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  http.StatusOK,
		ExpectedContent: []string{"Lindqvist AB", `"EUR"`},
	})

	run(t, app, tests.ApiScenario{
		Name:            "remove it",
		Method:          http.MethodDelete,
		URL:             "/v1/bank/beneficiaries/" + id,
		Headers:         h,
		ExpectedStatus:  http.StatusOK,
		ExpectedContent: []string{`"deleted"`},
	})

	if _, err := app.FindRecordById(collections.BeneficiaryCollectionName, id); err == nil {
		t.Error("the recipient survived its own deletion")
	}
}

// An anonymous caller reaches none of it.
func TestRecipientsNeedAnAccount(t *testing.T) {
	app := newBankApp(t)
	for _, tc := range []struct{ method, url string }{
		{http.MethodGet, "/v1/bank/beneficiaries"},
		{http.MethodPost, "/v1/bank/beneficiaries"},
		{http.MethodDelete, "/v1/bank/beneficiaries/anything"},
	} {
		run(t, app, tests.ApiScenario{
			Name:            tc.method + " " + tc.url + " rejects the anonymous caller",
			Method:          tc.method,
			URL:             tc.url,
			Body:            strings.NewReader(`{"name":"x","currency":"USD"}`),
			Headers:         map[string]string{"Content-Type": "application/json"},
			ExpectedStatus:  http.StatusUnauthorized,
			ExpectedContent: []string{"message"},
		})
	}
}

// A frozen account does not gain a verified place to send money to. The rule
// was bound to the update alone, and a beneficiary reaches "verified" by either
// door: an update flips the flag, and a create arrives with it already set. The
// route sets it on the way in, so the flag was never flipped, the hook never
// fired, and a suspended account added verified payees at will.
func TestAFrozenAccountGainsNoVerifiedPayee(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	acct.Set("status", "suspended")
	if err := app.Save(acct); err != nil {
		t.Fatal(err)
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	// Forbidden, not a malformed request: the account is the reason.
	run(t, app, tests.ApiScenario{
		Name:            "a suspended account adds a payee",
		Method:          http.MethodPost,
		URL:             "/v1/bank/beneficiaries",
		Body:            strings.NewReader(`{"name":"New Payee","currency":"USD","accountNumber":"12345678"}`),
		Headers:         h,
		ExpectedStatus:  http.StatusForbidden,
		ExpectedContent: []string{"not active"},
	})

	got, err := app.FindRecordsByFilter(collections.BeneficiaryCollectionName,
		"account = {:a} && name = 'New Payee'", "", 5, 0, map[string]any{"a": acct.Id})
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 0 {
		t.Errorf("a suspended account holds %d new payee(s), verified=%v", len(got), got[0].GetBool("verified"))
	}

	// The same rule by the other door: verifying one that already exists.
	col, err := app.FindCollectionByNameOrId(collections.BeneficiaryCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	unverified := core.NewRecord(col)
	unverified.Set("account", acct.Id)
	unverified.Set("name", "Pending Payee")
	unverified.Set("bankAccountHolder", "Pending Payee")
	unverified.Set("currency", "USD")
	unverified.Set("country", "US")
	unverified.Set("paymentType", "regular")
	unverified.Set("bankDetails", map[string]any{"accountNumber": "87654321"})
	unverified.Set("verified", false)
	if err := app.Save(unverified); err != nil {
		t.Fatalf("an unverified payee on a frozen account should still record: %v", err)
	}

	fresh, err := app.FindRecordById(collections.BeneficiaryCollectionName, unverified.Id)
	if err != nil {
		t.Fatal(err)
	}
	fresh.Set("verified", true)
	if err := app.Save(fresh); err == nil {
		t.Error("a payee was verified on a suspended account")
	}
}

// And an active account is unaffected — the control is about the account's
// state, not about adding payees.
func TestAnActiveAccountStillAddsPayees(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	if primaryAccount(app, owner) == nil {
		t.Fatal("no account provisioned")
	}
	post(t, app, map[string]string{"Authorization": token, "Content-Type": "application/json"},
		"/v1/bank/beneficiaries",
		`{"name":"Ordinary Payee","currency":"USD","accountNumber":"12345678"}`,
		http.StatusCreated, `"id"`)
}
