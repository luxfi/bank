package bank

import (
	"net/http"
	"testing"

	"github.com/hanzoai/base/tests"
)

// The receiving coordinates are invented: a bank name, a SWIFT, and digits
// derived from the account id. In the sandbox that is the demo, and
// TestReceivingForByCurrency pins their shape. Outside it they are what a
// customer hands a payer, and a wire lands wherever those digits actually
// point — so there are none until a rail issues them. No coordinates is a
// customer who asks; wrong ones are somebody's money gone.
func TestNoReceivingCoordinatesAreInventedOutsideTheSandbox(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if acct == nil {
		t.Fatal("no account provisioned")
	}

	v := viewAccount(acct)
	if v.Receiving != nil {
		t.Errorf("a customer is shown where to be paid: routing %q, account %q, at %q — a wire to those is gone",
			v.Receiving.RoutingNumber, v.Receiving.AccountNumber, v.Receiving.BankName)
	}
	if v.IBAN != "" {
		t.Errorf("a customer is shown the IBAN %q", v.IBAN)
	}
	// The account is otherwise unaffected: still an account, just with nowhere
	// for a wire to land yet.
	if v.ID == "" || v.Currency == "" {
		t.Error("the account view lost its own fields along with the coordinates")
	}
}

// In the sandbox the demo still shows them, and the overview carries them
// through to the page that asks.
func TestTheSandboxStillShowsWhereToBePaid(t *testing.T) {
	app := newBankApp(t)
	id, token := seedPrincipal(t, app)
	acct := primaryAccount(app, id)
	if acct == nil {
		t.Fatal("no account provisioned")
	}

	v := viewAccount(acct)
	if v.Receiving == nil {
		t.Fatal("the sandbox shows no coordinates at all")
	}
	// Deterministic in the account, so what a customer quotes today is what
	// they quote tomorrow.
	if again := viewAccount(acct); again.Receiving.AccountNumber != v.Receiving.AccountNumber {
		t.Error("the coordinates shuffled between two reads")
	}

	run(t, app, tests.ApiScenario{
		Name:            "the overview carries them through",
		Method:          http.MethodGet,
		URL:             "/v1/bank/overview",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  http.StatusOK,
		ExpectedContent: []string{`"receiving"`, `"routingNumber"`},
	})
}
