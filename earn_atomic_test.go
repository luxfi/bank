package bank

import (
	"errors"
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// An Earn movement and the position it changes are one act. Written separately,
// a position that failed to save after the money had already settled cost
// somebody every way round: a deposit debited without crediting the collateral,
// a borrow paid out without recording the debt, a repayment taken without
// reducing it.
//
// The failure is provoked with a hook, because that is the shape the real one
// takes — something refusing the write after the balance has moved. What the
// test asserts is that nothing moved at all.
func TestAnEarnMovementAndItsPositionMoveTogether(t *testing.T) {
	for _, act := range []struct{ verb, body string }{
		{"deposit", `{"vault":"stlux","amount":1000000}`},
		{"borrow", `{"vault":"stlux","amount":1000000}`},
	} {
		t.Run(act.verb, func(t *testing.T) {
			// This is the ledger path's atomicity. With a chain configured the
			// movement goes to the market instead, where the position the
			// contract reports back is the position and none of this applies —
			// so the path is pinned rather than left to the environment.
			t.Setenv("BANK_CHAIN_RPC", "")
			evmMu.Lock()
			evmInst, evmFrom = nil, ""
			evmMu.Unlock()
			t.Cleanup(func() {
				evmMu.Lock()
				evmInst, evmFrom = nil, ""
				evmMu.Unlock()
			})

			app := newBankApp(t)
			_, token := seedPrincipal(t, app)
			acct := primaryAccount(app, principalID(t, app))
			if acct == nil {
				t.Fatal("no account provisioned")
			}

			// Refuse every position write, after the movement has settled.
			app.OnRecordUpdate(collections.PositionCollectionName).BindFunc(func(e *core.RecordEvent) error {
				return errors.New("position store is unavailable")
			})
			app.OnRecordCreate(collections.PositionCollectionName).BindFunc(func(e *core.RecordEvent) error {
				return errors.New("position store is unavailable")
			})

			before := availableOf(t, app, acct.Id, "LUX")
			if before == 0 {
				t.Fatal("the account holds no LUX, so this proves nothing")
			}

			run(t, app, tests.ApiScenario{
				Name:            act.verb + " is refused whole when the position cannot be written",
				Method:          http.MethodPost,
				URL:             "/v1/bank/earn/" + act.verb,
				Body:            strings.NewReader(act.body),
				Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
				ExpectedStatus:  500,
				ExpectedContent: []string{"position"},
			})

			if after := availableOf(t, app, acct.Id, "LUX"); after != before {
				t.Errorf("the balance moved by %d on a %s that failed — the money settled and the position did not",
					after-before, act.verb)
			}
		})
	}
}
