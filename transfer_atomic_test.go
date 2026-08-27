package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// secondAccount opens another account for the same owner, in whatever KYC state
// is asked for. A customer with an approved account and a second one still in
// review is ordinary, and it is the case that used to cost them.
func secondAccount(t *testing.T, app core.App, owner, kyc string) string {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("owner", owner)
	r.Set("entityName", "Second")
	r.Set("entityType", "individual")
	r.Set("country", "US")
	r.Set("currency", "USD")
	r.Set("status", "active")
	r.Set("kycStatus", kyc)
	if err := app.Save(r); err != nil {
		t.Fatalf("second account: %v", err)
	}
	return r.Id
}

func countTx(t *testing.T, app core.App, account string) int {
	t.Helper()
	recs, err := app.FindRecordsByFilter(collections.TransactionCollectionName,
		"account = {:a}", "", 0, 0, map[string]any{"a": account})
	if err != nil {
		t.Fatalf("counting transactions: %v", err)
	}
	return len(recs)
}

func availableOf(t *testing.T, app core.App, account, currency string) int64 {
	t.Helper()
	b, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
		"account = {:a} && currency = {:c}", map[string]any{"a": account, "c": currency})
	if err != nil {
		return 0
	}
	return int64(b.GetFloat("available"))
}

// A transfer is one act with two legs. Written separately, a credit the hooks
// refuse left the debit saved and holding the sender's money against a transfer
// the caller had already been told failed — released a day later by the stale
// sweep, if at all.
//
// KYC is checked on every transaction, not only outbound ones, so sending to
// your own account that is still in review is the ordinary way to reach this.
func TestARefusedTransferLeavesNoLegBehind(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	from := primaryAccount(app, owner)
	if from == nil {
		t.Fatal("no account provisioned")
	}
	to := secondAccount(t, app, owner, "pending")

	before := countTx(t, app, from.Id)
	balanceBefore := availableOf(t, app, from.Id, "USD")
	if balanceBefore == 0 {
		t.Fatal("the sender holds nothing, so this proves nothing")
	}

	run(t, app, tests.ApiScenario{
		Name:   "a transfer to an account still in review is refused",
		Method: http.MethodPost,
		URL:    "/v1/bank/transfers",
		Body: strings.NewReader(`{"fromAccountId":"` + from.Id + `","toAccountId":"` + to +
			`","amount":1000,"currency":"USD","reference":"rent"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  422,
		ExpectedContent: []string{"KYC"},
	})

	if after := countTx(t, app, from.Id); after != before {
		t.Errorf("%d transaction(s) survive on the sender's account after a refused transfer — the debit is holding money for a movement that never happened",
			after-before)
	}
	if after := availableOf(t, app, from.Id, "USD"); after != balanceBefore {
		t.Errorf("the sender's available balance fell by %d on a transfer that was refused", balanceBefore-after)
	}
	if n := countTx(t, app, to); n != 0 {
		t.Errorf("%d transaction(s) landed on an account that has not passed KYC", n)
	}
}

// The transfer that should work still works, and moves the money both ways.
func TestATransferBetweenTwoApprovedAccountsMovesTheMoney(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	from := primaryAccount(app, owner)
	if from == nil {
		t.Fatal("no account provisioned")
	}
	to := secondAccount(t, app, owner, "approved")

	sent := int64(1000)
	fromBefore := availableOf(t, app, from.Id, "USD")
	toBefore := availableOf(t, app, to, "USD")

	run(t, app, tests.ApiScenario{
		Name:   "a transfer between two approved accounts settles",
		Method: http.MethodPost,
		URL:    "/v1/bank/transfers",
		Body: strings.NewReader(`{"fromAccountId":"` + from.Id + `","toAccountId":"` + to +
			`","amount":1000,"currency":"USD","reference":"rent"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  201,
		ExpectedContent: []string{`"debitId"`, `"creditId"`, `"completed"`},
	})

	if got := availableOf(t, app, from.Id, "USD"); got != fromBefore-sent {
		t.Errorf("the sender's balance is %d, want %d", got, fromBefore-sent)
	}
	if got := availableOf(t, app, to, "USD"); got != toBefore+sent {
		t.Errorf("the recipient's balance is %d, want %d", got, toBefore+sent)
	}
}
