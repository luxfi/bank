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

// What the bank does still do for such an account: show it where it receives.
// The address is the one declared, the same for every asset, and it carries no
// reference — there is no handle onto a holding the bank knows nothing about.
func TestSelfCustodyShowsTheAddressItWasGiven(t *testing.T) {
	app := newBankApp(t)
	owner, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	onHolder(t, app, acct.Id)

	// Re-read: onHolder wrote the address through its own instance.
	acct, err := app.FindRecordById(collections.AccountCollectionName, acct.Id)
	if err != nil {
		t.Fatal(err)
	}

	const declared = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
	for _, asset := range SupportedCrypto {
		w := holder{}.Wallet(app, acct, asset)
		if w.Address != declared {
			t.Errorf("%s receives at %q, want the declared %q", asset, w.Address, declared)
		}
		if w.Ref != "" {
			t.Errorf("%s carries the reference %q; the bank knows no handle onto a holding it does not hold", asset, w.Ref)
		}
	}

	// An account that has declared nothing gets no address rather than a
	// placeholder — there is no key behind a placeholder either.
	acct.Set("address", "")
	if err := app.Save(acct); err != nil {
		t.Fatal(err)
	}
	if w := (holder{}).Wallet(app, acct, "LUX"); w.Address != "" {
		t.Errorf("an account that declared nothing receives at %q", w.Address)
	}
}
