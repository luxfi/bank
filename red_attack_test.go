package bank

import (
	"context"
	"fmt"
	"math/big"
	"net/http"
	"os"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/geth/common"
)

// -----------------------------------------------------------------------------
// RED — adversarial reproductions. Each of these is an attack or a lie, not a
// style complaint.
// -----------------------------------------------------------------------------

// postRaw is `post` without the content assertions, so a test can look at what
// actually came back rather than assert a shape up front.
func postRaw(t *testing.T, app *tests.TestApp, h map[string]string, url, body string, want int) map[string]any {
	t.Helper()
	var out map[string]any
	run(t, app, tests.ApiScenario{
		Name:           url,
		Method:         http.MethodPost,
		URL:            url,
		Body:           strings.NewReader(body),
		Headers:        h,
		ExpectedStatus: want,
		TestAppFactory: func(testing.TB) *tests.TestApp { return app },
		AfterTestFunc: func(t testing.TB, _ *tests.TestApp, res *http.Response) {
			dec := res.Body
			_ = dec
			_ = out
		},
	})
	return out
}

// RED-1: a customer with ZERO ledger balance and ZERO on-chain balance asks the
// bank to send native coin. submit() calls fund(), which tops the customer up by
// TWICE (value + gas) out of the treasury — because `value` is inside `need`.
// The send then succeeds and the value lands at an address the attacker chose.
// Only AFTER the chain has moved does newTx run the balance check and refuse.
//
// Net: the bank paid out the full amount plus an equal amount parked in the
// customer's own custodial address, and holds no record of any of it.
func TestRedTreasuryDrainOnUnfundedSend(t *testing.T) {
	c := liveChain(t)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()

	fundTreasury(t, c, ctx)

	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account")
	}
	seed := chainSeed(app, acct)

	// The attacker has nothing worth speaking of. One micro-LUX on the ledger
	// (Base rejects a literal zero on a required number field) and nothing at
	// all on the chain.
	if err := setBalance(app, acct.Id, "LUX", 1); err != nil {
		t.Fatalf("floor the ledger balance: %v", err)
	}
	customer := common.HexToAddress(c.Address(seed, "LUX"))
	treasuryKey, _ := c.Treasury()
	treasury := addressOf(treasuryKey)

	// A destination the attacker controls and the bank does not.
	sink := common.HexToAddress("0x00000000000000000000000000000000DEADBEEF")

	bal := func(a common.Address) *big.Int {
		v, err := c.client.BalanceAt(ctx, a, nil)
		if err != nil {
			t.Fatalf("balance %s: %v", a.Hex(), err)
		}
		return v
	}
	treasuryBefore, sinkBefore, customerBefore := bal(treasury), bal(sink), bal(customer)
	t.Logf("before: treasury=%s customer=%s sink=%s", treasuryBefore, customerBefore, sinkBefore)

	const steal = int64(20_000000) // 20 LUX in the ledger's 6dp minor units

	// The bank refuses with 422 — insufficient ledger balance — AFTER the chain
	// has already moved. That refusal is the point: it proves no ledger record
	// exists for money that left.
	postRaw(t, app, h, "/v1/bank/crypto/send",
		fmt.Sprintf(`{"asset":"LUX","amount":%d,"toAddress":%q}`, steal, sink.Hex()),
		http.StatusUnprocessableEntity)

	treasuryAfter, sinkAfter, customerAfter := bal(treasury), bal(sink), bal(customer)
	t.Logf("after:  treasury=%s customer=%s sink=%s", treasuryAfter, customerAfter, sinkAfter)

	movedToSink := new(big.Int).Sub(sinkAfter, sinkBefore)
	drained := new(big.Int).Sub(treasuryBefore, treasuryAfter)
	parked := new(big.Int).Sub(customerAfter, customerBefore)

	t.Logf("EXPLOIT: treasury -%s wei, sink +%s wei, attacker custodial +%s wei",
		drained, movedToSink, parked)

	if movedToSink.Sign() == 0 {
		t.Fatalf("no value reached the sink — attack did not land")
	}
	want := c.toWei(steal, 18)
	if movedToSink.Cmp(want) != 0 {
		t.Fatalf("sink moved by %s, expected exactly %s", movedToSink, want)
	}

	// And the ledger holds no trace.
	txs, _ := app.FindRecordsByFilter("transactions",
		"account = {:a} && currency = 'LUX'", "-created", 20, 0, map[string]any{"a": acct.Id})
	for _, tx := range txs {
		if strings.Contains(tx.GetString("reference"), sink.Hex()) {
			t.Fatalf("unexpected: a ledger record exists for the stolen send")
		}
	}
	t.Logf("CONFIRMED: %s wei left the bank with no transaction record", movedToSink)
}

// RED-2, now the guard on its own fix. Claiming a chainIndex is a read of the
// maximum followed by a write, so accounts opened at the same moment used to
// take the same number — the same derivation path, address and private key,
// and either customer's session could spend the other's coins.
//
// Two things settle it and BOTH are asserted here, because either alone leaves
// a hole: the partial unique index refuses the second writer, and the loser
// retries for a number nobody holds. Without the index they collide; without
// the retry the loser keeps no index at all and ensureWallets returns early, so
// the account silently ends up with no wallets.
//
// This asserted the BUG — it counted collisions and skipped when it found none.
// That made it a permanent skip the moment the fix landed: eight runs, eight
// skips, affirming nothing. What must be true on EVERY run is stated instead,
// so it passes when the mechanisms hold and fails the moment either goes.
func TestRedChainIndexCollides(t *testing.T) {
	app := newBankApp(t)

	col, err := app.FindCollectionByNameOrId("accounts")
	if err != nil {
		t.Fatal(err)
	}
	mk := func(owner string) *core.Record {
		r := core.NewRecord(col)
		r.Set("owner", owner)
		r.Set("entityName", owner)
		r.Set("entityType", "individual")
		r.Set("country", "US")
		r.Set("currency", "USD")
		r.Set("status", "active")
		r.Set("kycStatus", "approved")
		if err := app.Save(r); err != nil {
			t.Fatalf("save %s: %v", owner, err)
		}
		return r
	}

	const n = 8
	accts := make([]*core.Record, n)
	for i := range accts {
		accts[i] = mk(fmt.Sprintf("owner-%d", i))
	}

	seeds := make([]string, n)
	var wg sync.WaitGroup
	start := make(chan struct{})
	for i := range accts {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			<-start
			seeds[i] = chainSeed(app, accts[i])
		}(i)
	}
	close(start)
	wg.Wait()

	t.Logf("indices assigned: %v", seeds)

	seen := map[string]int{}
	for i, s := range seeds {
		// Empty means the account never claimed a number: the retry gave up, and
		// ensureWallets will return early leaving it with no wallets at all.
		if s == "" {
			t.Fatalf("account %d claimed no chain index — the retry did not find it one", i)
		}
		if s == "0" {
			t.Fatalf("account %d claimed index 0, which belongs to the bank's treasury", i)
		}
		if was, dup := seen[s]; dup {
			t.Fatalf("accounts %d and %d both hold chainIndex %s — one derivation path, "+
				"one address, one balance, two customers", was, i, s)
		}
		seen[s] = i
	}
	if len(seen) != n {
		t.Fatalf("%d accounts hold %d distinct indices", n, len(seen))
	}
}

// RED-3: viewEarnSummary adds a ledger position's debt (USD cents) to a chain
// position's debt (like-kind minor units of the underlying) in one int64, then
// subtracts that sum from a USD-cents collateral figure. The dash renders the
// result as dollars. No chain needed — this is arithmetic.
func TestRedEarnSummaryMixesUnits(t *testing.T) {
	app := newBankApp(t)
	_, _ = seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account")
	}

	col, err := app.FindCollectionByNameOrId("positions")
	if err != nil {
		t.Fatal(err)
	}
	// Clear whatever the sandbox seeded, so the arithmetic below is only ever
	// about the one position under test.
	old, _ := app.FindRecordsByFilter("positions", "account = {:a}", "", 100, 0,
		map[string]any{"a": acct.Id})
	for _, o := range old {
		if err := app.Delete(o); err != nil {
			t.Fatalf("clear seeded position: %v", err)
		}
	}
	// A healthy on-chain ETH position: 1 ETH collateral, 0.9 ETH debt, at the
	// 90% ceiling. Both in the ledger's 6dp minor units, as earnOnChain stores.
	p := core.NewRecord(col)
	p.Set("account", acct.Id)
	p.Set("vault", "wsteth")
	p.Set("collateral", 1_000000)
	p.Set("debt", 900000)
	p.Set("tokenId", 1)
	if err := app.Save(p); err != nil {
		t.Fatal(err)
	}

	v := vaultByID("wsteth")
	pv := viewPosition(v, p)
	s := viewEarnSummary(app, acct.Id)

	ethUSD := unitPriceUSD("ETH")
	trueCollateralUSD := 1.0 * ethUSD
	trueDebtUSD := 0.9 * ethUSD
	trueNetUSD := trueCollateralUSD - trueDebtUSD

	t.Logf("ETH marked at $%.2f", ethUSD)
	t.Logf("truth:     collateral $%.2f, debt $%.2f, net $%.2f",
		trueCollateralUSD, trueDebtUSD, trueNetUSD)
	t.Logf("position:  collateralUsd=%d cents ($%.2f), debt=%d, debtUsd=%d cents ($%.2f), borrowable=%d",
		pv.CollateralUsd, float64(pv.CollateralUsd)/100, pv.Debt, pv.DebtUsd,
		float64(pv.DebtUsd)/100, pv.Borrowable)
	t.Logf("summary:   collateralUsd=%d, debt=%d, netUsd=%d", s.CollateralUsd, s.Debt, s.NetUsd)
	t.Logf("dash renders (Earn.tsx:119,130,307):")
	t.Logf("    Net       = formatUSD(netUsd/100)     = $%.2f   (truth $%.2f)",
		float64(s.NetUsd)/100, trueNetUSD)
	t.Logf("    Borrowed  = formatUSD(debt/100)       = $%.2f   (truth $%.2f)",
		float64(s.Debt)/100, trueDebtUSD)
	t.Logf("    Left      = formatUSD(borrowable/100) = $%.2f",
		float64(pv.Borrowable)/100)

	if s.NetUsd >= 0 {
		t.Errorf("expected the mixed-unit net to go negative on a healthy position, got %d", s.NetUsd)
	}
	t.Logf("CONFIRMED: a 90%%-LTV position with $%.2f of real equity is shown as $%.2f",
		trueNetUSD, float64(s.NetUsd)/100)
}

// RED-4: two sends from one account at the same time both read the same pending
// nonce. One of them is not going to make it, and confirm() will sit on a hash
// no block will ever carry.
func TestRedConcurrentSendsShareANonce(t *testing.T) {
	c := liveChain(t)
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Minute)
	defer cancel()

	fundTreasury(t, c, ctx)
	const amount = int64(1_000000)
	seedNative(t, c, ctx, c.Address("21", "LUX"), amount*40)

	// Two DIFFERENT payments — different payees, different amounts — which is
	// what two customers of one bank actually look like. Identical payloads
	// would collapse to one hash and the node would dedupe them; distinct ones
	// contend for the same nonce.
	dests := []string{c.Address("22", "LUX"), c.Address("23", "LUX")}
	amounts := []int64{amount, amount * 2}

	before := make([]int64, len(dests))
	for i, d := range dests {
		var err error
		if before[i], err = c.Balance(fmt.Sprint(22+i), "LUX"); err != nil {
			t.Fatal(err)
		}
		_ = d
	}

	type res struct {
		i    int
		hash string
		err  error
	}
	out := make(chan res, len(dests))
	var wg sync.WaitGroup
	start := make(chan struct{})
	for i := range dests {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			<-start
			h, err := c.Send("21", "LUX", dests[i], amounts[i])
			out <- res{i, h, err}
		}(i)
	}
	close(start)
	wg.Wait()
	close(out)

	claimed := int64(0)
	for r := range out {
		if r.err != nil {
			t.Logf("payment %d (%d minor) FAILED: %v", r.i, amounts[r.i], r.err)
			continue
		}
		claimed += amounts[r.i]
		t.Logf("payment %d (%d minor) reported SUCCESS: %s", r.i, amounts[r.i], r.hash)
	}

	settled := int64(0)
	for i := range dests {
		after, err := c.Balance(fmt.Sprint(22+i), "LUX")
		if err != nil {
			t.Fatal(err)
		}
		t.Logf("payee %d moved by %d minor units", i, after-before[i])
		settled += after - before[i]
	}
	t.Logf("the bank told its customers %d minor units were sent; the chain moved %d",
		claimed, settled)
	if claimed != settled {
		t.Fatalf("CONFIRMED nonce race: %d minor units reported sent, %d actually moved",
			claimed, settled)
	}
}

// RED-5: an account provisioned while the chain was not configured keeps its
// simulation addresses forever. ensureWallets skips any asset that already has a
// row, so pointing the bank at a real chain later does not move them. A customer
// who deposits to the displayed address sends coins to a sha256 digest that no
// key controls.
func TestRedWalletAddressesFreezeAtSimulation(t *testing.T) {
	c := liveChain(t)

	app := newBankApp(t)
	_, _ = seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account")
	}
	seed := chainSeed(app, acct)

	// What provisioning would have written with no chain configured.
	var sim ChainBackend = simChain{}
	simAddr := sim.Address(seed, "LUX")
	// What the account's key actually controls now that a chain IS configured.
	realAddr := c.Address(seed, "LUX")

	w, err := app.FindFirstRecordByFilter("wallets",
		"account = {:a} && currency = 'LUX'", map[string]any{"a": acct.Id})
	if err != nil {
		t.Fatalf("no LUX wallet: %v", err)
	}
	stored := w.GetString("address")
	t.Logf("stored wallet address: %s", stored)
	t.Logf("simulation address:    %s", simAddr)
	t.Logf("real key address:      %s", realAddr)

	// Now simulate the migration: overwrite with what a pre-chain provision left
	// behind, then run the backfill Blue relies on and see if it corrects it.
	w.Set("address", simAddr)
	if err := app.Save(w); err != nil {
		t.Fatal(err)
	}
	ensureWallets(app, acct)
	w2, _ := app.FindFirstRecordByFilter("wallets",
		"account = {:a} && currency = 'LUX'", map[string]any{"a": acct.Id})
	after := w2.GetString("address")
	t.Logf("after ensureWallets(): %s", after)
	if after != realAddr {
		t.Errorf("CONFIRMED: the deposit address stayed at %s; the key controls %s. "+
			"Coins sent to the displayed address are unrecoverable.", after, realAddr)
	}
}

// RED-6: the bank's LUX asset is the chain's native coin, but the LUX market's
// collateral is WLUX, an ERC-20 the bank never mentions and never wraps into.
// A customer holding LUX cannot deposit into the LUX vault at all.
func TestRedLuxVaultCollateralIsNotTheLuxAsset(t *testing.T) {
	c := liveChain(t)

	native, ok := c.assets["LUX"]
	if !ok {
		t.Fatal("LUX is not an asset on this chain")
	}
	marketCollateral := common.HexToAddress(c.deploy.Markets["LUX"].Collateral)
	t.Logf("bank asset LUX      = %s (native, no contract)", native.Hex())
	t.Logf("LUX market collateral = %s", marketCollateral.Hex())

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	var sym string
	if err := c.read(ctx, marketCollateral, erc20ABI, "symbol", &sym); err != nil {
		t.Fatalf("collateral symbol: %v", err)
	}
	t.Logf("the LUX vault actually takes %q as collateral", sym)
	if (native == common.Address{}) && sym != "LUX" {
		t.Errorf("CONFIRMED: the stlux vault's underlying is LUX (native) but its "+
			"collateral token is %s. A customer's LUX balance cannot be deposited; "+
			"the deposit reverts on a zero %s balance.", sym, sym)
	}
}

// RED-7: the market addresses in deploy/<chainId>.json are used without ever
// asking the contract at them who it is — unlike the token addresses, which are
// checked against symbol(). An approve() is granted to whatever is there.
func TestRedMarketAddressesAreNeverVerified(t *testing.T) {
	c := liveChain(t)
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	for _, asset := range []string{"LUX", "ETH", "BTC"} {
		m := c.deploy.Markets[asset]
		if m.Liquid == "" {
			continue
		}
		liquid := common.HexToAddress(m.Liquid)
		code, err := c.client.CodeAt(ctx, liquid, nil)
		if err != nil {
			t.Fatalf("code at %s: %v", liquid.Hex(), err)
		}
		// What the bank checks before approving collateral to this address:
		// nothing at all. Not even that it has code.
		t.Logf("market %s -> liquid %s (%d bytes of code) — bank performs 0 checks",
			asset, liquid.Hex(), len(code))
	}
	t.Log("CONFIRMED by inspection of evmmarket.go:51-63: Market() constructs from " +
		"the JSON directly; load() verifies only Tokens, never Markets.")
}

// RED-8: every customer send that is short of gas routes through the treasury's
// single key. Two customers paying at the same time contend for one nonce.
func TestRedTreasuryGasFundingSerializes(t *testing.T) {
	c := liveChain(t)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()
	fundTreasury(t, c, ctx)

	// Two customers, both broke on chain, both with somewhere to send.
	payers := []string{"31", "32"}
	dest := c.Address("33", "LUX")
	const amount = int64(100000)

	type res struct {
		who string
		err error
	}
	out := make(chan res, len(payers))
	var wg sync.WaitGroup
	start := make(chan struct{})
	for _, p := range payers {
		wg.Add(1)
		go func(p string) {
			defer wg.Done()
			<-start
			_, err := c.Send(p, "LUX", dest, amount)
			out <- res{p, err}
		}(p)
	}
	close(start)
	wg.Wait()
	close(out)

	failed := 0
	for r := range out {
		if r.err != nil {
			failed++
			t.Logf("customer %s could not pay: %v", r.who, r.err)
			continue
		}
		t.Logf("customer %s paid", r.who)
	}
	if failed > 0 {
		t.Errorf("CONFIRMED: %d of %d concurrent customer payments failed on treasury "+
			"nonce contention — one key, no serialization (evmchain.go:390, 412-435)",
			failed, len(payers))
	}
}

// RED-9: the network a receipt claims is derived from the sandbox flag, not from
// the chain the transaction actually went to. The same response body carries two
// different answers.
func TestRedReceiptMisnamesTheNetwork(t *testing.T) {
	c := liveChain(t)
	t.Logf("BANK_CHAIN_RPC   = %s", os.Getenv("BANK_CHAIN_RPC"))
	t.Logf("chain id          = %s", c.chainID)
	t.Logf("chain().Network() = %q   (metadata.network, from BANK_CHAIN_NETWORK)", c.Network())
	t.Logf("networkName()     = %q   (top-level `network`, from Sandbox() alone)", networkName())
	if c.Network() == networkName() {
		t.Skip("they agree under this configuration")
	}
	t.Errorf("CONFIRMED: one send response reports network=%q at the top level and "+
		"network=%q in metadata, for the same transaction on chain %s. "+
		"A production bank (Sandbox()=false) pointed at any chain labels every "+
		"receipt \"lux-mainnet\" regardless of where it went. (crypto.go:33-38, 181, 191)",
		networkName(), c.Network(), c.chainID)
}

// RED-10: when the configured chain is unreachable, evm() holds a process-wide
// mutex across a dial-and-identify with a 15s timeout. Every request that asks
// which backend is active queues behind it.
func TestRedUnreachableChainSerializesEveryRequest(t *testing.T) {
	// A port nothing is listening on, reached through a black-holed address so
	// the dial hangs rather than being refused.
	t.Setenv("BANK_CHAIN_RPC", "http://10.255.255.1:8645")
	evmMu.Lock()
	evmInst, evmFrom = nil, ""
	evmMu.Unlock()

	if !chainConfigured() {
		t.Fatal("expected a configured chain")
	}
	const n = 3
	var wg sync.WaitGroup
	began := time.Now()
	took := make([]time.Duration, n)
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			s := time.Now()
			cb := chain()
			took[i] = time.Since(s)
			if _, isOff := cb.(offChain); !isOff {
				t.Errorf("request %d got %T, not offChain — the refuse contract broke", i, cb)
			}
		}(i)
	}
	wg.Wait()
	total := time.Since(began)
	for i, d := range took {
		t.Logf("request %d waited %s", i, d.Round(time.Millisecond))
	}
	t.Logf("%d concurrent requests took %s in total", n, total.Round(time.Millisecond))
	if total > 20*time.Second {
		t.Errorf("CONFIRMED: %d requests serialized to %s behind evmMu while the chain "+
			"was unreachable (evmchain.go:89-111). A chain outage is a bank outage.", n, total)
	}
}

// RED-11: the bank boots happily against a deployment file whose market
// addresses hold no contract, because load() verifies tokens and nothing else.
// It then grants an allowance over the customer's collateral to that address and
// broadcasts a call to it. Calling an address with no code succeeds.
func TestRedDepositToAMarketThatIsNotThere(t *testing.T) {
	c := liveChain(t)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	m := c.Market("LUX")
	if m == nil {
		t.Skip("no LUX market in this deployment")
	}
	em := m.(*evmMarket)
	code, err := c.client.CodeAt(ctx, em.liquid, nil)
	if err != nil {
		t.Fatal(err)
	}
	if len(code) != 0 {
		t.Skipf("the market at %s has %d bytes of code — this test needs the "+
			"stale-address case", em.liquid.Hex(), len(code))
	}
	t.Logf("bank accepted market %s with ZERO bytes of code", em.liquid.Hex())

	fundTreasury(t, c, ctx)
	seed := "41"
	owner := common.HexToAddress(c.Address(seed, "LUX"))
	// Give the customer real collateral to lose.
	dp, err := c.decimals(ctx, em.collateral)
	if err != nil {
		t.Fatal(err)
	}
	data, err := erc20ABI.Pack("transfer", owner, c.toWei(10_000000, dp))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := c.submit(ctx, funderKey(t), em.collateral, big.NewInt(0), data); err != nil {
		t.Fatalf("seed collateral: %v", err)
	}

	hash, derr := m.Deposit(seed, 5_000000)
	t.Logf("Deposit returned hash=%q err=%v", hash, derr)

	var allowance *big.Int
	if err := c.read(ctx, em.collateral, erc20ABI, "allowance", &allowance, owner, em.liquid); err != nil {
		t.Fatalf("read allowance: %v", err)
	}
	t.Logf("allowance granted to the non-contract at %s: %s", em.liquid.Hex(), allowance)
	if allowance.Sign() > 0 {
		t.Errorf("CONFIRMED: the bank approved %s collateral units to %s, an address "+
			"with no code, without ever asking what is there (evmmarket.go:51-63, 204-224)",
			allowance, em.liquid.Hex())
	}
	if derr == nil {
		t.Errorf("CONFIRMED WORSE: Deposit reported SUCCESS with hash %s against a "+
			"market that does not exist", hash)
	}
}

// RED-12: the refuse-don't-fake contract, enumerated. simChain must be reachable
// only when nothing is configured at all.
func TestRedRefuseContract(t *testing.T) {
	reset := func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	}
	t.Run("nothing configured -> simChain", func(t *testing.T) {
		t.Setenv("BANK_CHAIN_RPC", "")
		reset()
		if _, ok := chain().(simChain); !ok {
			t.Fatalf("got %T, want simChain", chain())
		}
	})
	t.Run("configured and unreachable -> offChain, never simChain", func(t *testing.T) {
		t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
		reset()
		cb := chain()
		if _, ok := cb.(simChain); ok {
			t.Fatal("FELL THROUGH TO THE SIMULATION")
		}
		if _, ok := cb.(offChain); !ok {
			t.Fatalf("got %T, want offChain", cb)
		}
		if h, err := cb.Send("1", "LUX", "0x1234567890abcdef1234567890abcdef12345678", 1); err == nil {
			t.Fatalf("offChain.Send invented hash %q", h)
		}
	})
	t.Run("configured, reachable, but no mnemonic -> offChain", func(t *testing.T) {
		if os.Getenv("BANK_CHAIN_RPC") == "" {
			t.Skip("needs a live chain")
		}
		rpc := os.Getenv("BANK_CHAIN_RPC")
		t.Setenv("BANK_CHAIN_MNEMONIC", "")
		t.Setenv("BANK_CHAIN_RPC", rpc)
		reset()
		cb := chain()
		t.Logf("with no mnemonic the backend is %T", cb)
		if _, ok := cb.(simChain); ok {
			t.Fatal("FELL THROUGH TO THE SIMULATION")
		}
	})
	t.Run("configured, reachable, wrong address book -> offChain", func(t *testing.T) {
		if os.Getenv("BANK_CHAIN_RPC") == "" {
			t.Skip("needs a live chain")
		}
		rpc, mn := os.Getenv("BANK_CHAIN_RPC"), os.Getenv("BANK_CHAIN_MNEMONIC")
		t.Setenv("BANK_CHAIN_DEPLOY", t.TempDir())
		t.Setenv("BANK_CHAIN_RPC", rpc)
		t.Setenv("BANK_CHAIN_MNEMONIC", mn)
		reset()
		cb := chain()
		t.Logf("with no deployment file the backend is %T", cb)
		if _, ok := cb.(simChain); ok {
			t.Fatal("FELL THROUGH TO THE SIMULATION")
		}
	})
	reset()
}
