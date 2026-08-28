package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// onHolder points the deployment at self-custody with a chain configured — the
// only way holder is chosen — and gives the account an address of its own.
func onHolder(t *testing.T, app *tests.TestApp, acct string) {
	t.Helper()
	t.Setenv("BANK_CUSTODY", "holder")
	t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
	evmMu.Lock()
	evmInst, evmFrom = nil, ""
	evmMu.Unlock()
	t.Cleanup(func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	})
	r, err := app.FindRecordById(collections.AccountCollectionName, acct)
	if err != nil {
		t.Fatal(err)
	}
	r.Set("address", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
	if err := app.Save(r); err != nil {
		t.Fatalf("declare an address: %v", err)
	}
	if !selfCustody() {
		t.Fatal("the deployment is not self-custodial, so this proves nothing")
	}
}

// A send from an account whose owner holds the key is not a failure and not an
// outage: nothing was attempted on chain. Answering "on-chain send failed"
// sends somebody looking for one.
func TestASelfCustodySendSaysWhoseKeyItIs(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	onHolder(t, app, acct.Id)

	before := availableOf(t, app, acct.Id, "LUX")
	if before == 0 {
		t.Fatal("the account holds no LUX, so a released hold would not show")
	}

	run(t, app, tests.ApiScenario{
		Name:   "a send the bank cannot sign for",
		Method: http.MethodPost,
		URL:    "/v1/bank/crypto/send",
		Body: strings.NewReader(
			`{"asset":"LUX","amount":1000,"toAddress":"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  http.StatusNotImplemented,
		ExpectedContent: []string{"held by its owner"},
	})

	// And the hold it took on the way in was given back.
	if after := availableOf(t, app, acct.Id, "LUX"); after != before {
		t.Errorf("the balance moved by %d on a send that was refused", after-before)
	}
}

// Earn is refused for the same reason, and the reason is not that the account
// has no chain identity — it has one, and its owner holds the key to it.
func TestSelfCustodyEarnSaysWhyRatherThanErroring(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	onHolder(t, app, acct.Id)

	for _, verb := range []string{"deposit", "borrow", "repay", "withdraw"} {
		run(t, app, tests.ApiScenario{
			Name:            verb + " is refused where the bank holds no key",
			Method:          http.MethodPost,
			URL:             "/v1/bank/earn/" + verb,
			Body:            strings.NewReader(`{"vault":"stlux","amount":1000}`),
			Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
			ExpectedStatus:  http.StatusNotImplemented,
			ExpectedContent: []string{"held by its owner"},
		})
	}
}

// Where the bank holds the key it derives the address, so there is nothing for
// a customer to tell it — and letting them say one anyway would point their
// deposits at an address the bank cannot sign for while the ledger went on
// believing it could. The route is absent there rather than present and
// refusing.
func TestDeclaringAnAddressIsAbsentWhereTheBankHoldsTheKey(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}

	// A chain configured and the default custodian: the bank holds the key.
	t.Setenv("BANK_CUSTODY", "")
	t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
	evmMu.Lock()
	evmInst, evmFrom = nil, ""
	evmMu.Unlock()
	t.Cleanup(func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	})
	if selfCustody() {
		t.Fatal("this deployment is self-custodial, so this proves nothing")
	}

	before := acct.GetString("address")
	run(t, app, tests.ApiScenario{
		Name:   "declaring an address where the bank derives one",
		Method: http.MethodPost,
		URL:    "/v1/bank/accounts/" + acct.Id + "/address",
		Body: strings.NewReader(
			`{"address":"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  http.StatusNotFound,
		ExpectedContent: []string{"message"},
	})

	after, err := app.FindRecordById(collections.AccountCollectionName, acct.Id)
	if err != nil {
		t.Fatal(err)
	}
	if got := after.GetString("address"); got != before {
		t.Errorf("the account's address became %q on a deployment that derives it", got)
	}
}

// Declaring is how a self-custody account tells the bank where it receives.
// It is the only place a customer writes something the bank then shows other
// people as an address to send money to, so what it accepts is the whole of the
// protection: a typo here is somebody's deposit gone.
func TestDeclaringAnAddressRecordsWhereMoneyArrives(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	onHolder(t, app, acct.Id)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}
	url := "/v1/bank/accounts/" + acct.Id + "/address"

	// A well-formed address is recorded, and the wallet rows follow it.
	const moved = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
	run(t, app, tests.ApiScenario{
		Name:            "declaring a new address",
		Method:          http.MethodPost,
		URL:             url,
		Body:            strings.NewReader(`{"address":"` + moved + `"}`),
		Headers:         h,
		ExpectedStatus:  http.StatusOK,
		ExpectedContent: []string{moved},
	})

	stored, err := app.FindRecordById(collections.AccountCollectionName, acct.Id)
	if err != nil {
		t.Fatal(err)
	}
	if got := stored.GetString("address"); got != moved {
		t.Fatalf("the account receives at %q, want the declared %q", got, moved)
	}
	// Every wallet row moved with it — a row left on the old address goes on
	// sending deposits to a device the customer has left.
	for _, w := range viewWallets(app, acct.Id) {
		if w.Address != moved {
			t.Errorf("the %s row still receives at %q", w.Currency, w.Address)
		}
	}

	// What it will not take. A checksum that does not check out is the case
	// that matters: a transposed character passes every length test.
	for name, addr := range map[string]string{
		"a transposed character": "0x70997970C51812dc3A010C7d01b50e0d17dc79C9",
		"not hex":                "0xZZ997970C51812dc3A010C7d01b50e0d17dc79C8",
		"too short":              "0x70997970C51812dc3A010C7d01b50e0d17dc79",
		"nothing at all":         "",
		"a bitcoin address":      "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
	} {
		run(t, app, tests.ApiScenario{
			Name:            "declaring " + name,
			Method:          http.MethodPost,
			URL:             url,
			Body:            strings.NewReader(`{"address":"` + addr + `"}`),
			Headers:         h,
			ExpectedStatus:  http.StatusBadRequest,
			ExpectedContent: []string{"address"},
		})
	}

	// None of that moved where money arrives.
	stored, err = app.FindRecordById(collections.AccountCollectionName, acct.Id)
	if err != nil {
		t.Fatal(err)
	}
	if got := stored.GetString("address"); got != moved {
		t.Errorf("a refused declaration left the account receiving at %q", got)
	}
}

// And it is one account's to declare. An address is where money arrives, so
// writing one onto somebody else's account is pointing their deposits at
// yourself.
func TestOnlyTheOwnerDeclaresTheirAddress(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	mine := primaryAccount(app, owner)
	if mine == nil {
		t.Fatal("no account provisioned")
	}
	onHolder(t, app, mine.Id)
	theirs := secondAccount(t, app, "another-owner", "approved")

	run(t, app, tests.ApiScenario{
		Name:   "declaring an address on another account",
		Method: http.MethodPost,
		URL:    "/v1/bank/accounts/" + theirs + "/address",
		Body: strings.NewReader(
			`{"address":"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  http.StatusForbidden,
		ExpectedContent: []string{"account"},
	})

	after, err := app.FindRecordById(collections.AccountCollectionName, theirs)
	if err != nil {
		t.Fatal(err)
	}
	if got := after.GetString("address"); got != "" {
		t.Errorf("another account now receives at %q", got)
	}
}
