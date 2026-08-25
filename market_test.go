package bank

import (
	"context"
	"encoding/json"
	"math/big"
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/luxfi/geth/common"
)

// -----------------------------------------------------------------------------
// The market half of the on-chain suite. Same setup as evmchain_test.go: point
// BANK_CHAIN_RPC at a chain with the stack deployed and these run; without one
// they skip.
// -----------------------------------------------------------------------------

// TestMarketRefusesAnAddressThatIsNotOne points the bank at a deployment whose
// LUX market sits at an address holding no code — what a stale file, or a file
// written for another chain, looks like. An allowance to an address anyone can
// later occupy is a standing claim on the customer's collateral, so it must
// never be granted, and the movement must not be reported as having happened.
func TestMarketRefusesAnAddressThatIsNotOne(t *testing.T) {
	c := reach(t)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	const seed = "9"
	owner := common.HexToAddress(c.Address(seed, "LUX"))
	collateral := common.HexToAddress(c.deploy.Markets["LUX"].Collateral)
	empty := common.HexToAddress("0x00000000000000000000000000000000000000ff")
	if code, err := c.client.CodeAt(ctx, empty, nil); err != nil || len(code) != 0 {
		t.Fatalf("%s was meant to hold nothing, holds %d bytes (%v)", empty, len(code), err)
	}
	fundTreasury(t, c, ctx)

	bad := rebook(t, c, func(m map[string]any) { m["liquid"] = empty.Hex() })
	m := bad.Market("LUX")
	if m == nil {
		t.Fatal("no LUX market in the rewritten book")
	}

	before := erc20(t, bad, ctx, collateral, "allowance", owner, empty)
	if _, err := m.Deposit(seed, 5_000000); err == nil {
		t.Fatal("the bank reported a deposit into an address that holds no contract")
	} else {
		t.Logf("refused: %v", err)
	}
	after := erc20(t, bad, ctx, collateral, "allowance", owner, empty)
	if after.Cmp(before) != 0 {
		t.Fatalf("granted an allowance of %s to the non-contract at %s", after, empty)
	}
	if _, err := m.Position(seed); err == nil {
		t.Fatal("read a position out of an address that holds no contract")
	}

	// The other way an address goes wrong: real code, wrong contract. The market
	// answers, and what it answers with is not what the file claims.
	swapped := rebook(t, c, func(m map[string]any) {
		m["liquid"] = c.deploy.Markets["ETH"].Liquid
	})
	if _, err := swapped.Market("LUX").Deposit(seed, 5_000000); err == nil {
		t.Fatal("the bank deposited LUX collateral into the ETH market")
	} else {
		t.Logf("refused: %v", err)
	}
}

// TestChainEarnFromNativeCoin is the customer the product actually has. Their
// LUX balance is the chain's own coin — the bank issues nobody WLUX — and the
// market takes WLUX. Deposit, borrow, repay and withdraw all have to work from
// that starting point, and the coin has to come back as coin.
func TestChainEarnFromNativeCoin(t *testing.T) {
	c := reach(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	// Its own index, so its own address. Every test opens a fresh database, so
	// every first account is index 1 — and on one chain that is several tests
	// sharing one address, one position NFT and each other's leftovers.
	acct.Set("chainIndex", 11)
	if err := app.Save(acct); err != nil {
		t.Fatalf("claim a chain index: %v", err)
	}
	seed := chainSeed(app, acct)
	customer := common.HexToAddress(c.Address(seed, "LUX"))
	wlux := common.HexToAddress(c.deploy.Markets["LUX"].Collateral)

	fundTreasury(t, c, ctx)
	const (
		held    = Minor(300_000000) // 300 LUX of coin, and nothing else
		deposit = Minor(100_000000)
		borrow  = Minor(50_000000)
	)
	seedNative(t, c, ctx, customer.Hex(), held)
	if wrapped := erc20(t, c, ctx, wlux, "balanceOf", customer); wrapped.Sign() != 0 {
		t.Fatalf("the account opens holding %s WLUX; nothing in the bank issues it", wrapped)
	}
	if err := setBalance(app, acct.Id, "LUX", held); err != nil {
		t.Fatalf("seed ledger balance: %v", err)
	}
	m := c.Market("LUX")
	if m == nil {
		t.Fatal("chain has no LUX market")
	}

	coin := func() *big.Int {
		t.Helper()
		v, err := c.client.BalanceAt(ctx, customer, nil)
		if err != nil {
			t.Fatalf("coin balance: %v", err)
		}
		return v
	}
	opening := coin()

	body := post(t, app, h, "/v1/bank/earn/deposit", `{"vault":"stlux","amount":100000000}`,
		http.StatusOK, `"txHash":"0x`)
	requireReceipt(t, c, ctx, hash(t, body))
	on, err := m.Position(seed)
	if err != nil {
		t.Fatalf("read position: %v", err)
	}
	if on.Collateral != deposit {
		t.Fatalf("deposited %d, the market holds %d", deposit, on.Collateral)
	}
	if on.TokenID == 0 {
		t.Fatal("no position NFT was minted")
	}
	// Wrapping is transport, not a holding: none of it is left lying around.
	if wrapped := erc20(t, c, ctx, wlux, "balanceOf", customer); wrapped.Sign() != 0 {
		t.Fatalf("%s WLUX left at the account after the deposit", wrapped)
	}
	spent := new(big.Int).Sub(opening, coin())
	if want := c.toWei(deposit, 18); spent.Cmp(want) < 0 {
		t.Fatalf("the deposit cost %s coin, less than the %s it was for", spent, want)
	}
	t.Logf("position #%d holds %d collateral, wrapped out of the account's own coin", on.TokenID, on.Collateral)

	post(t, app, h, "/v1/bank/earn/borrow", `{"vault":"stlux","amount":50000000}`,
		http.StatusOK, `"txHash":"0x`)
	if on, err = m.Position(seed); err != nil {
		t.Fatalf("read position: %v", err)
	}
	if on.Debt != borrow {
		t.Fatalf("borrowed %d, the market says %d", borrow, on.Debt)
	}

	// Repay everything the chain says is owed, then take back everything it says
	// is left — the protocol charges a fee against the collateral, so the numbers
	// to act on are its own.
	post(t, app, h, "/v1/bank/earn/repay", earn(on.Debt), http.StatusOK, `"txHash":"0x`)
	if on, err = m.Position(seed); err != nil {
		t.Fatalf("read position: %v", err)
	}
	if on.Debt != 0 {
		t.Fatalf("repaid the whole debt, %d is still owed", on.Debt)
	}

	before := coin()
	post(t, app, h, "/v1/bank/earn/withdraw", earn(on.Collateral), http.StatusOK, `"txHash":"0x`)
	returned := on.Collateral
	if on, err = m.Position(seed); err != nil {
		t.Fatalf("read position: %v", err)
	}
	if on.Collateral != 0 {
		t.Fatalf("withdrew the whole position, %d collateral is still in it", on.Collateral)
	}
	if wrapped := erc20(t, c, ctx, wlux, "balanceOf", customer); wrapped.Sign() != 0 {
		t.Fatalf("the withdrawal left %s WLUX at the account instead of coin", wrapped)
	}
	// The coin is back, less the gas the round trip cost.
	back := new(big.Int).Sub(coin(), before)
	floor := new(big.Int).Div(new(big.Int).Mul(c.toWei(returned, 18), big.NewInt(99)), big.NewInt(100))
	if back.Cmp(floor) < 0 {
		t.Fatalf("withdrew %d collateral but only %s coin came back", returned, back)
	}
	t.Logf("withdrew %d collateral; %s coin returned to the account", returned, back)
}

// reach returns the configured backend, waiting out any dial backoff another
// test left behind: evm() remembers a failed endpoint for a few seconds, so a
// test that points the bank at a bad address book answers for the next one that
// needs the good chain.
func reach(t *testing.T) *evmChain {
	t.Helper()
	if os.Getenv("BANK_CHAIN_RPC") == "" {
		t.Skip("BANK_CHAIN_RPC unset — no chain to test against")
	}
	deadline := time.Now().Add(evmRetryAfter + 2*time.Second)
	for {
		if c := evm(); c != nil {
			return c
		}
		if time.Now().After(deadline) {
			t.Fatal("BANK_CHAIN_RPC is set but the chain did not come up")
		}
		time.Sleep(100 * time.Millisecond)
	}
}

// hash is the transaction a response reports, or a stopped test — a movement
// that did not happen has nothing to look up.
func hash(t *testing.T, body map[string]any) string {
	t.Helper()
	h, ok := body["txHash"].(string)
	if !ok {
		t.Fatalf("no transaction hash in %v", body)
	}
	return h
}

// earn is one Earn request body.
func earn(amount Minor) string {
	b, _ := json.Marshal(map[string]any{"vault": "stlux", "amount": amount})
	return string(b)
}

// rebook builds a backend from this chain's address book with one market entry
// edited — the shape a deployment file takes when it is stale, or was written
// for a chain other than the one being dialled.
func rebook(t *testing.T, c *evmChain, edit func(market map[string]any)) *evmChain {
	t.Helper()
	name := c.chainID.String() + ".json"
	raw, err := os.ReadFile(filepath.Join(envOr("BANK_CHAIN_DEPLOY", "chain/deploy"), name))
	if err != nil {
		t.Fatalf("read address book: %v", err)
	}
	var book map[string]any
	if err := json.Unmarshal(raw, &book); err != nil {
		t.Fatalf("parse address book: %v", err)
	}
	edit(book["markets"].(map[string]any)["LUX"].(map[string]any))

	dir := t.TempDir()
	out, err := json.Marshal(book)
	if err != nil {
		t.Fatalf("write address book: %v", err)
	}
	if err := os.WriteFile(filepath.Join(dir, name), out, 0o600); err != nil {
		t.Fatalf("write address book: %v", err)
	}
	t.Setenv("BANK_CHAIN_DEPLOY", dir)
	// Built directly rather than through evm(), which caches by endpoint and
	// would hand back the honest book.
	bad, err := newEVM(os.Getenv("BANK_CHAIN_RPC"))
	if err != nil {
		t.Fatalf("dial with the rewritten book: %v", err)
	}
	return bad
}

// erc20 reads one uint256 off a token.
func erc20(t *testing.T, c *evmChain, ctx context.Context, token common.Address, method string, args ...any) *big.Int {
	t.Helper()
	var out *big.Int
	if err := c.read(ctx, token, erc20ABI, method, &out, args...); err != nil {
		t.Fatalf("%s on %s: %v", method, token, err)
	}
	return out
}
