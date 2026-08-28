package bank

import (
	"fmt"
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// A send has to reach a chain that can carry it. The sandbox settles against
// its own testnet ledger; a configured chain signs and broadcasts. With neither
// — a chain named and unreachable — it refuses, rather than debiting a customer
// against a receipt nothing broadcast.
func TestASendRefusesWhenNoChainCanCarryIt(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
	evmMu.Lock()
	evmInst, evmFrom = nil, ""
	evmMu.Unlock()
	t.Cleanup(func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	})

	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	if err := setBalance(app, acct.Id, "LUX", 100_000000); err != nil {
		t.Fatal(err)
	}
	before := availableOf(t, app, acct.Id, "LUX")

	run(t, app, tests.ApiScenario{
		Name:   "a send with no chain to carry it",
		Method: http.MethodPost,
		URL:    "/v1/bank/crypto/send",
		Body: strings.NewReader(
			`{"asset":"LUX","amount":1000000,"toAddress":"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}`),
		Headers:         map[string]string{"Authorization": token, "Content-Type": "application/json"},
		ExpectedStatus:  http.StatusServiceUnavailable,
		ExpectedContent: []string{"unavailable"},
	})

	// Refused before anything was reserved.
	if after := availableOf(t, app, acct.Id, "LUX"); after != before {
		t.Errorf("the balance moved by %d on a send that was refused", after-before)
	}
	txs, err := app.FindRecordsByFilter(collections.TransactionCollectionName,
		"account = {:a} && type = 'withdrawal'", "", 20, 0, map[string]any{"a": acct.Id})
	if err != nil {
		t.Fatal(err)
	}
	if len(txs) != 0 {
		t.Errorf("%d withdrawal(s) stand for a send that never reached a chain", len(txs))
	}
}

// What the send and the faucet will not take. An amount of nothing, an amount
// below nothing, and an asset the bank does not carry are each refused before
// any hold is taken.
func TestTheCryptoRoutesRefuseWhatTheyCannotMove(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	if primaryAccount(app, owner) == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}
	const to = `"toAddress":"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"`

	for name, body := range map[string]string{
		"an asset the bank does not carry": `{"asset":"DOGE","amount":1000,` + to + `}`,
		"a fiat currency":                  `{"asset":"USD","amount":1000,` + to + `}`,
		"nothing at all":                   `{"asset":"LUX","amount":0,` + to + `}`,
		"less than nothing":                `{"asset":"LUX","amount":-1000,` + to + `}`,
	} {
		run(t, app, tests.ApiScenario{
			Name:            "sending " + name,
			Method:          http.MethodPost,
			URL:             "/v1/bank/crypto/send",
			Body:            strings.NewReader(body),
			Headers:         h,
			ExpectedStatus:  http.StatusBadRequest,
			ExpectedContent: []string{"asset or amount"},
		})
	}

	// A destination that is not one is refused too — a transposed character is
	// irreversible once it is on chain.
	run(t, app, tests.ApiScenario{
		Name:            "sending to something that is not an address",
		Method:          http.MethodPost,
		URL:             "/v1/bank/crypto/send",
		Body:            strings.NewReader(`{"asset":"LUX","amount":1000,"toAddress":"0xnot-an-address"}`),
		Headers:         h,
		ExpectedStatus:  http.StatusBadRequest,
		ExpectedContent: []string{"destination address"},
	})
}

// The faucet mints demo balance from nothing, so what it will hand over in one
// call is capped. Without the ceiling a demo account could be given any figure,
// and every number on the screen after that is fiction.
func TestTheFaucetWillNotMintPastItsCeiling(t *testing.T) {
	app := newBankApp(t)
	owner, token := seedPrincipal(t, app)
	acct := primaryAccount(app, owner)
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}
	before := availableOf(t, app, acct.Id, "BTC")

	// One BTC is well past $25,000 at the reference price.
	run(t, app, tests.ApiScenario{
		Name:            "a faucet call past the ceiling",
		Method:          http.MethodPost,
		URL:             "/v1/bank/crypto/deposit",
		Body:            strings.NewReader(`{"asset":"BTC","amount":1000000}`),
		Headers:         h,
		ExpectedStatus:  http.StatusBadRequest,
		ExpectedContent: []string{"aucet limit"},
	})
	if after := availableOf(t, app, acct.Id, "BTC"); after != before {
		t.Errorf("the faucet minted %d past its own ceiling", after-before)
	}

	// And what it will hand over, it hands over.
	const small = 10000 // 0.01 BTC ≈ $640
	post(t, app, h, "/v1/bank/crypto/deposit",
		fmt.Sprintf(`{"asset":"BTC","amount":%d}`, small), http.StatusOK, `"txHash"`)
	if after := availableOf(t, app, acct.Id, "BTC"); after != before+small {
		t.Errorf("the faucet credited %d, want %d", after-before, small)
	}
}
