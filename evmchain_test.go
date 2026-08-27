package bank

import (
	"context"
	"crypto/ecdsa"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/crypto"
	"github.com/luxfi/geth/common"
)

// -----------------------------------------------------------------------------
// These run against a real EVM. Point BANK_CHAIN_RPC at one that has the stack
// deployed (chain/deploy.sh does that), and they exercise the whole path: keys
// derived from the mnemonic, collateral moved by a signed transaction, a loan
// opened through the deployed market, and the borrow ceiling refused by the
// contract rather than by the bank.
//
//	cd chain && RPC=http://127.0.0.1:8645 PRIVATE_KEY=… ./deploy.sh
//	BANK_CHAIN_RPC=http://127.0.0.1:8645 \
//	BANK_CHAIN_MNEMONIC="…" go test -run TestChain ./...
//
// Without BANK_CHAIN_RPC they skip, so the suite still runs on the simulation.
// -----------------------------------------------------------------------------

// anvilFunder is the first well-known development account of the standard test
// mnemonic. It holds the deployment and the token float on a local node, and
// nothing else — it is published in Foundry's own documentation and can never
// be an account anywhere real.
const anvilFunder = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

// liveChain returns the configured backend, or skips.
func liveChain(t *testing.T) *evmChain {
	t.Helper()
	if os.Getenv("BANK_CHAIN_RPC") == "" {
		t.Skip("BANK_CHAIN_RPC unset — no chain to test against")
	}
	c := evm()
	if c == nil {
		t.Fatal("BANK_CHAIN_RPC is set but the chain did not come up")
	}
	return c
}

// TestChainDerivesDistinctAddresses checks the property the ledger depends on:
// every account index yields its own address, reproducibly. That one address
// carries every asset is no longer a thing to check — address() has no asset to
// vary, and a per-asset answer cannot be written down.
func TestChainDerivesDistinctAddresses(t *testing.T) {
	c := liveChain(t)

	seen := map[string]string{}
	for _, seed := range []string{"0", "1", "2", "3"} {
		addr := c.address(seed)
		if !validEVMAddress(addr) {
			t.Fatalf("index %s produced %q, not an address", seed, addr)
		}
		if was, dup := seen[addr]; dup {
			t.Fatalf("index %s collided with index %s at %s", seed, was, addr)
		}
		seen[addr] = seed
		if again := c.address(seed); again != addr {
			t.Fatalf("index %s is not reproducible: %s then %s", seed, addr, again)
		}
	}
}

// TestChainSendMovesRealValue funds an account and sends from it, then checks
// the destination's balance actually moved and the hash names a real receipt.
func TestChainSendMovesRealValue(t *testing.T) {
	c := liveChain(t)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()

	fundTreasury(t, c, ctx)
	const amount = Minor(5_000000) // 5 LUX in the ledger's 6dp minor units
	seedNative(t, c, ctx, c.address("7"), amount*4)

	to := c.address("8")
	before, err := c.Balance(to, "LUX")
	if err != nil {
		t.Fatalf("balance before: %v", err)
	}

	hash, err := c.send("7", "LUX", to, amount)
	if err != nil {
		t.Fatalf("send: %v", err)
	}
	if !strings.HasPrefix(hash, "0x") || len(hash) != 66 {
		t.Fatalf("hash %q is not a transaction hash", hash)
	}
	receipt, err := c.client.TransactionReceipt(ctx, common.HexToHash(hash))
	if err != nil {
		t.Fatalf("no receipt on chain for %s: %v", hash, err)
	}
	t.Logf("sent %d LUX minor units, tx %s in block %d", amount, hash, receipt.BlockNumber)

	after, err := c.Balance(to, "LUX")
	if err != nil {
		t.Fatalf("balance after: %v", err)
	}
	if after-before != amount {
		t.Fatalf("destination moved by %d, want %d", after-before, amount)
	}
}

// TestChainEarnBorrowAndCeiling is the whole point: a customer deposits
// collateral into the deployed market through the bank's own route, borrows
// against it, and then tries to borrow past the ceiling. The refusal has to come
// from the contract — the bank must not be the thing deciding it.
func TestChainEarnBorrowAndCeiling(t *testing.T) {
	c := liveChain(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	// Its own index, so its own address and its own position. Every test opens
	// a fresh database and so every first account is index 1 — but one chain
	// outlives all of them, and a position that already carries another test's
	// collateral is one this test reads as its own.
	acct.Set("chainIndex", 51)
	if err := app.Save(acct); err != nil {
		t.Fatalf("claim a chain index: %v", err)
	}
	seed := chainIndex(app, acct)
	customer := c.address(seed)
	t.Logf("account %s is chain index %s at %s", acct.Id, seed, customer)

	// Stand the customer up the way an operator would: the deployer seeds the
	// bank's treasury with gas, the treasury covers the customer, and the
	// customer holds collateral to deposit.
	fundTreasury(t, c, ctx)
	const (
		collateral  = Minor(100_000000) // 100 LUX
		atCeiling   = Minor(90_000000)  // exactly 90% of it
		overCeiling = Minor(1_000000)   // one more, which must not be allowed
	)
	// One chain outlives every run of this suite, so the position may already
	// carry an earlier one's collateral — including a run that failed before it
	// could unwind. Read what is there and start from zero: the ceiling being
	// checked is a ratio against the collateral actually deposited, so anything
	// left behind changes the answer.
	var held Position
	if m0, ok := c.market("LUX", seed).(*evmMarket); ok && m0 != nil {
		if p0, err := m0.Position(); err == nil {
			held = p0
		}
	}

	// The customer holds the chain's own coin, which is what an account holds.
	// The market takes its wrapper and the deposit wraps on the way in, so
	// seeding the wrapper directly asks the funder for a token nobody has
	// minted — it only exists by wrapping — and the transfer underflows.
	//
	// Enough to unwind whatever is there and then run: repaying is a debit of
	// the underlying, so a position left open by an earlier run has to be
	// affordable before this one can start.
	stake := collateral*2 + held.Debt
	seedNative(t, c, ctx, customer, stake)
	if err := setBalance(app, acct.Id, "LUX", stake); err != nil {
		t.Fatalf("seed ledger balance: %v", err)
	}

	if held.Debt > 0 || held.Collateral > 0 {
		unwind(t, app, h, c, seed)
	}

	// Deposit.
	body := post(t, app, h, "/v1/bank/earn/deposit", `{"vault":"stlux","amount":100000000}`,
		http.StatusOK, `"txHash":"0x`, `"tokenId"`)
	t.Logf("deposit tx %s", body["txHash"])
	requireReceipt(t, c, ctx, body["txHash"].(string))

	// Borrow right up to the ceiling.
	body = post(t, app, h, "/v1/bank/earn/borrow", `{"vault":"stlux","amount":90000000}`,
		http.StatusOK, `"txHash":"0x`, `"ltv":0.9`, `"borrowable":0`)
	t.Logf("borrow tx %s", body["txHash"])
	requireReceipt(t, c, ctx, body["txHash"].(string))

	// The position the bank reports must be the position the chain holds.
	m := c.market("LUX", seed)
	if m == nil {
		t.Fatal("chain has no LUX market")
	}
	on, err := m.Position()
	if err != nil {
		t.Fatalf("read position: %v", err)
	}
	if on.Collateral != collateral || on.Debt != atCeiling {
		t.Fatalf("on chain: collateral %d debt %d; want %d and %d",
			on.Collateral, on.Debt, collateral, atCeiling)
	}
	if on.TokenID == 0 {
		t.Fatal("no position NFT was minted")
	}
	t.Logf("on chain: position #%d holds %d collateral against %d debt, %d borrowable",
		on.TokenID, on.Collateral, on.Debt, on.Borrowable)

	// One more unit of debt breaches the collateralization floor, and the
	// contract is what says no.
	before := on.Debt
	post(t, app, h, "/v1/bank/earn/borrow", `{"vault":"stlux","amount":1000000}`,
		http.StatusUnprocessableEntity, "over the borrow limit")

	after, err := m.Position()
	if err != nil {
		t.Fatalf("read position after refusal: %v", err)
	}
	if after.Debt != before {
		t.Fatalf("refused borrow still moved debt from %d to %d", before, after.Debt)
	}
	t.Logf("chain refused a borrow of %d over the ceiling; debt still %d", overCeiling, after.Debt)

	// Unwind, so the position ends where it started. One chain outlives every
	// run of this suite, and a test that leaves collateral behind reads it as
	// its own the next time and borrows against twice what it deposited. The
	// round trip also proves the two verbs the ceiling check does not.
	unwind(t, app, h, c, seed)
}

// unwind returns a position to zero: repay what it owes, then withdraw what is
// left. Each amount is read immediately before it is used — repaying moves the
// collateral, so a figure taken before it is already stale and the chain
// refuses a withdrawal larger than what is there.
func unwind(t *testing.T, app *tests.TestApp, h map[string]string, c *evmChain, seed string) {
	t.Helper()
	m, ok := c.market("LUX", seed).(*evmMarket)
	if !ok || m == nil {
		t.Fatal("this chain carries no LUX market")
	}
	for range 2 {
		p, err := m.Position()
		if err != nil {
			t.Fatalf("read position while unwinding: %v", err)
		}
		if p.Debt == 0 && p.Collateral == 0 {
			return
		}
		if p.Debt > 0 {
			post(t, app, h, "/v1/bank/earn/repay",
				fmt.Sprintf(`{"vault":"stlux","amount":%d}`, p.Debt), http.StatusOK, `"txHash":"0x`)
			continue
		}
		post(t, app, h, "/v1/bank/earn/withdraw",
			fmt.Sprintf(`{"vault":"stlux","amount":%d}`, p.Collateral), http.StatusOK, `"txHash":"0x`)
	}
	p, err := m.Position()
	if err != nil {
		t.Fatalf("read position after unwinding: %v", err)
	}
	if p.Collateral != 0 || p.Debt != 0 {
		t.Fatalf("the position did not unwind: %d collateral, %d debt left behind", p.Collateral, p.Debt)
	}
}

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------

// post runs one authenticated request through the real router and returns the
// decoded body.
func post(t *testing.T, app *tests.TestApp, h map[string]string, url, body string, want int, contains ...string) map[string]any {
	t.Helper()
	var out map[string]any
	run(t, app, tests.ApiScenario{
		Name:            url,
		Method:          http.MethodPost,
		URL:             url,
		Body:            strings.NewReader(body),
		Headers:         h,
		ExpectedStatus:  want,
		ExpectedContent: contains,
		TestAppFactory:  func(testing.TB) *tests.TestApp { return app },
		AfterTestFunc: func(t testing.TB, _ *tests.TestApp, res *http.Response) {
			_ = json.NewDecoder(res.Body).Decode(&out)
		},
	})
	return out
}

func principalID(t testing.TB, app core.App) string {
	t.Helper()
	su, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, "test@lux.financial")
	if err != nil {
		t.Fatalf("principal: %v", err)
	}
	return su.Id
}

func funderKey(t *testing.T) *ecdsa.PrivateKey {
	t.Helper()
	k, err := crypto.HexToECDSA(anvilFunder)
	if err != nil {
		t.Fatalf("funder key: %v", err)
	}
	return k
}

// fundTreasury gives the bank's own address enough native coin to pay its
// customers' gas — the operational step a deployment does once.
func fundTreasury(t *testing.T, c *evmChain, ctx context.Context) {
	t.Helper()
	treasury, err := c.Treasury()
	if err != nil {
		t.Fatalf("treasury: %v", err)
	}
	addr := addressOf(treasury)
	have, err := c.client.BalanceAt(ctx, addr, nil)
	if err != nil {
		t.Fatalf("treasury balance: %v", err)
	}
	want := new(big.Int).Mul(big.NewInt(50), big.NewInt(1e18))
	if have.Cmp(want) >= 0 {
		return
	}
	if _, err := c.submit(ctx, funderKey(t), addr, want, nil); err != nil {
		t.Fatalf("fund treasury: %v", err)
	}
}

// seedNative gives an address native coin, in the ledger's minor units.
func seedNative(t *testing.T, c *evmChain, ctx context.Context, to string, minor Minor) {
	t.Helper()
	if _, err := c.submit(ctx, funderKey(t), common.HexToAddress(to), c.toWei(minor, 18), nil); err != nil {
		t.Fatalf("seed native: %v", err)
	}
}

// requireReceipt fails unless the hash names a transaction the chain accepted.
func requireReceipt(t *testing.T, c *evmChain, ctx context.Context, hash string) {
	t.Helper()
	r, err := c.client.TransactionReceipt(ctx, common.HexToHash(hash))
	if err != nil {
		t.Fatalf("no receipt for %s: %v", hash, err)
	}
	if r.Status != 1 {
		t.Fatalf("transaction %s reverted", hash)
	}
}
