package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// The card this route issues is a simulation: the number is the published test
// BIN with four random digits after it, and the CVV is three more generated on
// the call and belonging to nothing. In the sandbox that is the demo. Outside
// it, handing that to a customer is the bank claiming to have issued a card
// that will decline everywhere it is presented.
func TestASimulatedCardIsNotIssuedOutsideTheSandbox(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("BANK_CHAIN_RPC", "")
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)

	run(t, app, tests.ApiScenario{
		Name:            "issuing a simulated card is refused where the bank is real",
		Method:          http.MethodPost,
		URL:             "/v1/bank/cards",
		Body:            strings.NewReader(`{"currency":"USD"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  http.StatusNotImplemented,
		ExpectedContent: []string{"cards/virtual"},
	})
}

// In the sandbox it is the demo, and it hands the number and CVV over once.
// They are not stored: only the masked display and the last four persist, so a
// second read cannot produce them.
func TestTheSandboxCardSurfacesItsNumberOnceAndStoresNeither(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	body := post(t, app, h, "/v1/bank/cards", `{"currency":"USD"}`, http.StatusCreated, `"pan"`, `"cvv"`)
	pan, _ := body["pan"].(string)
	cvv, _ := body["cvv"].(string)
	if len(strings.ReplaceAll(pan, " ", "")) != 16 || len(cvv) != 3 {
		t.Fatalf("pan %q / cvv %q are not a card's shape", pan, cvv)
	}

	last4 := strings.ReplaceAll(pan, " ", "")[12:]
	cards, err := app.FindRecordsByFilter(collections.CardCollectionName, "last4 = {:l}", "", 1, 0,
		map[string]any{"l": last4})
	if err != nil || len(cards) == 0 {
		t.Fatalf("the issued card was not recorded: %v", err)
	}
	stored := cards[0]

	// Whatever the record holds, it must not be the number or the code.
	for _, field := range stored.Collection().Fields {
		v := stored.GetString(field.GetName())
		if v == "" {
			continue
		}
		if strings.Contains(strings.ReplaceAll(v, " ", ""), strings.ReplaceAll(pan, " ", "")) {
			t.Errorf("the full number is stored on %s", field.GetName())
		}
		if v == cvv {
			t.Errorf("the security code is stored on %s", field.GetName())
		}
	}
	if got := stored.GetString("display"); !strings.Contains(got, "•") {
		t.Errorf("the stored display %q is not masked", got)
	}
}

// A card belongs to one account: freezing is how a customer stops their own
// card, and it must not reach anybody else's.
func TestACardIsFrozenOnlyByItsOwnAccount(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	if primaryAccount(app, owner) == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	theirs := secondAccount(t, app, "another-owner", "approved")
	card := issueCardRecord(app, theirs, "Someone Else", "USD")
	if card == nil {
		t.Fatal("could not issue the other account's card")
	}

	for _, verb := range []string{"freeze", "unfreeze"} {
		run(t, app, tests.ApiScenario{
			Name:            verb + " on another account's card is refused",
			Method:          http.MethodPost,
			URL:             "/v1/bank/cards/" + card.Id + "/" + verb,
			Headers:         h,
			ExpectedStatus:  http.StatusForbidden,
			ExpectedContent: []string{"card"},
		})
	}

	after, err := app.FindRecordById(collections.CardCollectionName, card.Id)
	if err != nil {
		t.Fatal(err)
	}
	if got := after.GetString("status"); got != card.GetString("status") {
		t.Errorf("another account's card changed status to %q", got)
	}
}
