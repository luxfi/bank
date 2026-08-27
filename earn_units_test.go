package bank

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// Earn deals in one unit: minor units of the vault's asset. Collateral and debt
// are like-kind, so every amount that moves — deposited, borrowed, repaid,
// withdrawn — is counted the same way, and dollars are a valuation taken at the
// edge for display. These tests pin that on the wire, where the dash reads it,
// because both bugs they cover were invisible in Go and only showed up as money.
// -----------------------------------------------------------------------------

// market stands in for a deployed Liquid market: it records what it was asked
// to move, in the units it was asked in, and reports back a position of the
// test's choosing. Nothing leaves the process, so the bank's ordering and its
// unit handling are testable without a chain to point at.
type market struct {
	moves []Minor
	pos   Position
	no    error // when set, every movement is refused
}

func (m *market) Deposit(amount Minor) (string, error)  { return m.move(amount) }
func (m *market) Borrow(amount Minor) (string, error)   { return m.move(amount) }
func (m *market) Repay(amount Minor) (string, error)    { return m.move(amount) }
func (m *market) Withdraw(amount Minor) (string, error) { return m.move(amount) }
func (m *market) Position() (Position, error)           { return m.pos, nil }

func (m *market) move(amount Minor) (string, error) {
	m.moves = append(m.moves, amount)
	if m.no != nil {
		return "", m.no
	}
	return simTxHash(), nil
}

// event builds the request/response pair a handler writes through, so a handler
// can be called directly rather than through the router.
func event(app core.App) (*core.RequestEvent, *httptest.ResponseRecorder) {
	rec := httptest.NewRecorder()
	e := &core.RequestEvent{App: app}
	e.Response = rec
	e.Request = httptest.NewRequest(http.MethodPost, "/v1/bank/earn", nil)
	return e, rec
}

// account returns the seeded principal's account with its positions cleared, so
// a test starts from a vault it fully controls.
func account(t *testing.T, app *tests.TestApp) *core.Record {
	t.Helper()
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	open, _ := app.FindRecordsByFilter(collections.PositionCollectionName,
		"account = {:a}", "", 100, 0, map[string]any{"a": acct.Id})
	for _, p := range open {
		if err := app.Delete(p); err != nil {
			t.Fatalf("clear seeded position: %v", err)
		}
	}
	return acct
}

func available(t *testing.T, app core.App, accountID, currency string) Minor {
	t.Helper()
	b, err := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
		"account = {:a} && currency = {:c}", map[string]any{"a": accountID, "c": currency})
	if err != nil {
		t.Fatalf("no %s balance: %v", currency, err)
	}
	return money[Minor](b, "available")
}

// figure reads one number out of a decoded position.
func figure(t *testing.T, body map[string]any, key string) int64 {
	t.Helper()
	pos, ok := body["position"].(map[string]any)
	if !ok {
		t.Fatalf("no position in %v", body)
	}
	n, ok := pos[key].(float64)
	if !ok {
		t.Fatalf("position has no %s: %v", key, pos)
	}
	return int64(n)
}

// Borrowing 90 LUX against 100 LUX of collateral is borrowing 90% of it. The
// amount is the vault asset's minor units for every verb, so it means the same
// thing on the way in, in the stored position, and on the way back out — and it
// is the same number the market enforces the ceiling on
// (evmchain_test.go asserts this exact ladder against a real chain).
func TestEarnBorrowUnit(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}
	acct := account(t, app)
	opening := available(t, app, acct.Id, "LUX")

	post(t, app, h, "/v1/bank/earn/deposit", `{"vault":"stlux","amount":100000000}`,
		http.StatusOK, `"collateral":100000000`)

	body := post(t, app, h, "/v1/bank/earn/borrow", `{"vault":"stlux","amount":90000000}`,
		http.StatusOK, `"ltv":0.9`, `"borrowable":0`)

	wantDebtUsd := collections.USDCents(90_000000, "LUX")
	t.Logf("100 LUX collateral, borrowed %d minor units (%.2f LUX, $%.2f)",
		figure(t, body, "debt"), float64(figure(t, body, "debt"))/1e6,
		float64(figure(t, body, "debtUsd"))/100)
	if got := figure(t, body, "debt"); got != 90_000000 {
		t.Errorf("borrowed 90 LUX, position carries %d — the field was read in another unit", got)
	}
	if got := figure(t, body, "debtUsd"); got != wantDebtUsd {
		t.Errorf("debt valued at %d cents, want %d", got, wantDebtUsd)
	}
	// The loan lands in the vault's own asset: the synthetic tracks it at parity,
	// so 90 LUX borrowed is 90 LUX credited.
	if got, want := available(t, app, acct.Id, "LUX"), opening-100_000000+90_000000; got != want {
		t.Errorf("LUX balance %d after a 100 in / 90 out round trip, want %d", got, want)
	}

	// At the ceiling, one more unit is refused — by the ledger here, by the
	// contract on chain, in the same words.
	post(t, app, h, "/v1/bank/earn/borrow", `{"vault":"stlux","amount":1000000}`,
		http.StatusUnprocessableEntity, "over the borrow limit")

	// Repaying the same number clears the same debt out of the same balance.
	body = post(t, app, h, "/v1/bank/earn/repay", `{"vault":"stlux","amount":90000000}`,
		http.StatusOK, `"debt":0`)
	if got := figure(t, body, "debt"); got != 0 {
		t.Errorf("repaid the whole loan, %d left", got)
	}
	if got, want := available(t, app, acct.Id, "LUX"), opening-100_000000; got != want {
		t.Errorf("LUX balance %d after repaying, want %d", got, want)
	}
}

// The Earn summary is a total across vaults denominated in four different
// assets, so it is stated in cents and every figure that reaches it is a
// valuation. Adding a position's raw debt in put ETH into a dollar total and the
// dash printed it with a dollar sign: $340 of equity showed as $5,600 of loss.
func TestEarnSummaryOneUnit(t *testing.T) {
	app := newBankApp(t)
	_, _ = seedPrincipal(t, app)
	acct := account(t, app)

	col, err := app.FindCollectionByNameOrId(collections.PositionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	// Two healthy positions at the 90% ceiling, in assets three hundred dollars
	// apart per unit: one carried on chain, one on the ledger. A summary that
	// respects the unit cannot tell them apart.
	for _, p := range []struct {
		vault                   string
		collateral, debt, token int64
	}{
		{"wsteth", 1_000000, 900000, 1},
		{"stlux", 100_000000, 90_000000, 0},
	} {
		rec := core.NewRecord(col)
		rec.Set("account", acct.Id)
		rec.Set("vault", p.vault)
		rec.Set("collateral", p.collateral)
		rec.Set("debt", p.debt)
		rec.Set("tokenId", p.token)
		if err := app.Save(rec); err != nil {
			t.Fatal(err)
		}
	}

	raw, err := json.Marshal(viewEarnSummary(app, acct.Id))
	if err != nil {
		t.Fatal(err)
	}
	// Read it off the wire: the dash prints collateralUsd, debt and netUsd as
	// dollars, and that is the contract the arithmetic has to hold up.
	var s struct {
		CollateralUsd int64 `json:"collateralUsd"`
		Debt          int64 `json:"debt"`
		NetUsd        int64 `json:"netUsd"`
	}
	if err := json.Unmarshal(raw, &s); err != nil {
		t.Fatal(err)
	}

	wantCollateral := collections.USDCents(1_000000, "ETH") + collections.USDCents(100_000000, "LUX")
	wantDebt := collections.USDCents(900000, "ETH") + collections.USDCents(90_000000, "LUX")
	t.Logf("summary: collateral $%.2f, debt $%.2f, net $%.2f (want $%.2f / $%.2f / $%.2f)",
		float64(s.CollateralUsd)/100, float64(s.Debt)/100, float64(s.NetUsd)/100,
		float64(wantCollateral)/100, float64(wantDebt)/100, float64(wantCollateral-wantDebt)/100)

	if s.CollateralUsd != wantCollateral {
		t.Errorf("collateral %d cents, want %d", s.CollateralUsd, wantCollateral)
	}
	if s.Debt != wantDebt {
		t.Errorf("debt %d cents, want %d — an asset amount reached a dollar total", s.Debt, wantDebt)
	}
	if s.NetUsd != wantCollateral-wantDebt {
		t.Errorf("net %d cents, want %d", s.NetUsd, wantCollateral-wantDebt)
	}
	// Both positions sit at 90%, so a tenth of the collateral is equity and the
	// net is positive. It went negative when the units mixed.
	if s.NetUsd <= 0 {
		t.Errorf("two positions with equity in them net out at %d", s.NetUsd)
	}
}

// A movement the ledger refuses must never reach the chain. The ledger's answer
// is knowable first and the chain's is irreversible, so the order is not a
// preference: reserving second means refusing a customer for money that has
// already left.
func TestEarnLedgerBeforeChain(t *testing.T) {
	app := newBankApp(t)
	_, _ = seedPrincipal(t, app)
	acct := account(t, app)
	v := vaultByID("stlux")
	held := available(t, app, acct.Id, "LUX")

	pos, err := upsertPosition(app, acct.Id, v.ID)
	if err != nil {
		t.Fatal(err)
	}
	m := &market{}
	e, rec := event(app)
	if err := earnOnChain(app, e, acct, v, pos, m, actDeposit, held*4); err != nil {
		t.Fatalf("earnOnChain: %v", err)
	}
	if rec.Code != http.StatusUnprocessableEntity {
		t.Errorf("depositing %d against a balance of %d answered %d, want 422",
			held*4, held, rec.Code)
	}
	if len(m.moves) > 0 {
		t.Fatalf("the chain moved %v collateral the ledger had already refused", m.moves)
	}
	if got := int64(pos.GetFloat("collateral")); got != 0 {
		t.Errorf("refused deposit left %d in the position", got)
	}

	// Control: the same call within the balance does reach the market, so the
	// check above is about the ordering and not about a stub nothing can move.
	m = &market{pos: Position{Collateral: 100_000000, TokenID: 7}}
	e, rec = event(app)
	if err := earnOnChain(app, e, acct, v, pos, m, actDeposit, 100_000000); err != nil {
		t.Fatalf("earnOnChain: %v", err)
	}
	if rec.Code != http.StatusOK {
		t.Fatalf("a deposit within the balance answered %d: %s", rec.Code, rec.Body.String())
	}
	// And it reaches the market in the vault asset's own minor units, unscaled —
	// the market is what applies the token's decimals.
	if len(m.moves) != 1 || m.moves[0] != 100_000000 {
		t.Fatalf("the market was asked to move %v, want one deposit of 100000000", m.moves)
	}
	if got := int64(pos.GetFloat("collateral")); got != 100_000000 {
		t.Errorf("position holds %d, want the 100000000 the chain reported", got)
	}
	if got := int64(pos.GetFloat("tokenId")); got != 7 {
		t.Errorf("position NFT recorded as %d, want 7", got)
	}
	if got, want := available(t, app, acct.Id, "LUX"), held-100_000000; got != want {
		t.Errorf("LUX balance %d after the deposit settled, want %d", got, want)
	}

	// When the chain is the one that refuses, the hold reserved against it comes
	// back. Settling and releasing are the only two ways out of a pending debit;
	// neither leaves money held against a movement that did not happen.
	m = &market{no: errors.New("execution reverted")}
	e, rec = event(app)
	if err := earnOnChain(app, e, acct, v, pos, m, actDeposit, 10_000000); err != nil {
		t.Fatalf("earnOnChain: %v", err)
	}
	if rec.Code != http.StatusBadGateway {
		t.Errorf("a chain refusal answered %d, want 502", rec.Code)
	}
	if got, want := available(t, app, acct.Id, "LUX"), held-100_000000; got != want {
		t.Errorf("LUX balance %d after a refused movement, want the %d it held before", got, want)
	}
}
