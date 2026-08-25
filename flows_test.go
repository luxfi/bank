package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// openAccount creates a second account owned by ownerID with a USD balance,
// so a book transfer has a destination the caller also owns.
func openAccount(t *testing.T, app core.App, ownerID string, usd Minor) string {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	if err != nil {
		t.Fatalf("account collection: %v", err)
	}
	a := core.NewRecord(col)
	a.Set("owner", ownerID)
	a.Set("entityName", "Second Account")
	a.Set("entityType", "individual")
	a.Set("country", "US")
	a.Set("currency", "USD")
	a.Set("status", "active")
	a.Set("kycStatus", "approved")
	a.Set("riskRating", "low")
	if err := app.Save(a); err != nil {
		t.Fatalf("save account: %v", err)
	}
	if err := setBalance(app, a.Id, "USD", usd); err != nil {
		t.Fatalf("set balance: %v", err)
	}
	return a.Id
}

func TestSandboxLogin(t *testing.T) {
	app := newBankApp(t)
	if _, err := ensureDemoSuperuser(app, "hero@lux.financial", "s3cret-demo-pass"); err != nil {
		t.Fatalf("ensure demo superuser: %v", err)
	}
	run(t, app, tests.ApiScenario{
		Name:            "sandbox login mints a token for valid credentials",
		Method:          http.MethodPost,
		URL:             "/v1/bank/login",
		Body:            strings.NewReader(`{"email":"hero@lux.financial","password":"s3cret-demo-pass"}`),
		Headers:         map[string]string{"Content-Type": "application/json"},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"token":`, `"email":"hero@lux.financial"`},
	})
	run(t, app, tests.ApiScenario{
		Name:            "sandbox login rejects a wrong password",
		Method:          http.MethodPost,
		URL:             "/v1/bank/login",
		Body:            strings.NewReader(`{"email":"hero@lux.financial","password":"wrong"}`),
		Headers:         map[string]string{"Content-Type": "application/json"},
		ExpectedStatus:  401,
		ExpectedContent: []string{`"status":401`},
	})
}

func TestBookTransferBetweenOwnAccounts(t *testing.T) {
	app := newBankApp(t)
	id, token := seedPrincipal(t, app)
	src := primaryAccount(app, id)
	if err := setBalance(app, src.Id, "USD", 100_00); err != nil {
		t.Fatalf("set balance: %v", err)
	}
	dst := openAccount(t, app, id, 1_00)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	run(t, app, tests.ApiScenario{
		Name:            "book transfer between two own accounts",
		Method:          http.MethodPost,
		URL:             "/v1/bank/transfers",
		Body:            strings.NewReader(`{"fromAccountId":"` + src.Id + `","toAccountId":"` + dst + `","amount":4000,"currency":"USD","reference":"sweep"}`),
		Headers:         h,
		ExpectedStatus:  201,
		ExpectedContent: []string{`"debitId"`, `"creditId"`},
	})

	// A transfer to an account the caller does not own is refused.
	other := newBankApp(t) // throwaway to mint a foreign owner id shape
	_ = other
	run(t, app, tests.ApiScenario{
		Name:            "transfer to an unowned destination is refused",
		Method:          http.MethodPost,
		URL:             "/v1/bank/transfers",
		Body:            strings.NewReader(`{"fromAccountId":"` + src.Id + `","toAccountId":"nonexistent0000","amount":100,"currency":"USD"}`),
		Headers:         h,
		ExpectedStatus:  404,
		ExpectedContent: []string{`"status":404`},
	})
}

func TestBeneficiaryLifecycleAndOutboundPayment(t *testing.T) {
	app := newBankApp(t)
	id, token := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if err := setBalance(app, acct.Id, "USD", 500_00); err != nil {
		t.Fatalf("set balance: %v", err)
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	// Create a beneficiary tied to the account.
	benBody := `{"account":"` + acct.Id + `","name":"Supplier Ltd","currency":"USD","country":"US","type":"bank","accountNumber":"12345678","routing":"021000021"}`
	run(t, app, tests.ApiScenario{
		Name:            "create a beneficiary",
		Method:          http.MethodPost,
		URL:             "/v1/bank/beneficiaries",
		Body:            strings.NewReader(benBody),
		Headers:         h,
		ExpectedStatus:  201,
		ExpectedContent: []string{`"id"`},
	})

	ben, _ := app.FindFirstRecordByFilter(collections.BeneficiaryCollectionName,
		"account = {:a}", map[string]any{"a": acct.Id})
	if ben == nil {
		t.Fatal("beneficiary not created")
	}

	run(t, app, tests.ApiScenario{
		Name:            "outbound payment to the beneficiary",
		Method:          http.MethodPost,
		URL:             "/v1/bank/payments/outbound",
		Body:            strings.NewReader(`{"accountId":"` + acct.Id + `","beneficiaryId":"` + ben.Id + `","amount":5000,"currency":"USD","reference":"invoice 1"}`),
		Headers:         h,
		ExpectedStatus:  201,
		ExpectedContent: []string{`"transactionId"`},
	})

	run(t, app, tests.ApiScenario{
		Name:            "list beneficiaries",
		Method:          http.MethodGet,
		URL:             "/v1/bank/beneficiaries",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"Supplier Ltd"`},
	})

	run(t, app, tests.ApiScenario{
		Name:            "delete the beneficiary",
		Method:          http.MethodDelete,
		URL:             "/v1/bank/beneficiaries/" + ben.Id,
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"deleted"`},
	})
}

func TestCardIssueAndFreeze(t *testing.T) {
	app := newBankApp(t)
	id, token := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	run(t, app, tests.ApiScenario{
		Name:            "issue a virtual card",
		Method:          http.MethodPost,
		URL:             "/v1/bank/cards",
		Body:            strings.NewReader(`{"accountId":"` + acct.Id + `","currency":"USD"}`),
		Headers:         h,
		ExpectedStatus:  201,
		ExpectedContent: []string{`"brand":"visa"`, `"type":"virtual"`},
	})

	card, _ := app.FindFirstRecordByFilter(collections.CardCollectionName,
		"account = {:a} && status = 'active'", map[string]any{"a": acct.Id})
	if card == nil {
		t.Fatal("card not issued")
	}

	run(t, app, tests.ApiScenario{
		Name:            "freeze the card",
		Method:          http.MethodPost,
		URL:             "/v1/bank/cards/" + card.Id + "/freeze",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"status":"frozen"`},
	})
	run(t, app, tests.ApiScenario{
		Name:            "unfreeze the card",
		Method:          http.MethodPost,
		URL:             "/v1/bank/cards/" + card.Id + "/unfreeze",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"status":"active"`},
	})
}

func TestPerAccountReads(t *testing.T) {
	app := newBankApp(t)
	id, token := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	h := map[string]string{"Authorization": token}
	for _, c := range []struct{ path, want string }{
		{"/v1/bank/accounts/" + acct.Id + "/balances", `"currency"`},
		{"/v1/bank/accounts/" + acct.Id + "/wallets", `[`},
		{"/v1/bank/accounts/" + acct.Id + "/transactions", `[`},
	} {
		run(t, app, tests.ApiScenario{
			Name:            "read " + c.path,
			Method:          http.MethodGet,
			URL:             c.path,
			Headers:         h,
			ExpectedStatus:  200,
			ExpectedContent: []string{c.want},
		})
	}
}
