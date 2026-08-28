package bank

import (
	"math"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// position builds a vault position record with the collateral and debt given,
// both in the vault asset's minor units.
func position(t *testing.T, app core.App, vault string, collateral, debt Minor) (*collections.Vault, *core.Record) {
	t.Helper()
	var v *collections.Vault
	for i := range collections.Vaults {
		if collections.Vaults[i].ID == vault {
			v = &collections.Vaults[i]
		}
	}
	if v == nil {
		t.Fatalf("no vault %q", vault)
	}
	col, err := app.FindCollectionByNameOrId(collections.PositionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("collateral", collateral)
	r.Set("debt", debt)
	return v, r
}

// The numbers a customer decides on. What is borrowable is what the ceiling
// leaves, the LTV is where they stand against it, and the self-repay figure is
// how long the collateral's own yield takes to clear the loan — the reason the
// product exists.
func TestThePositionNumbersAreTheOnesACustomerDecidesOn(t *testing.T) {
	app := newBankApp(t)

	// 100 LUX of collateral in a vault that lends 90% of it.
	v, rec := position(t, app, "stlux", 100_000000, 0)
	p := viewPosition(v, rec)
	if p.Borrowable != round[Minor](100_000000*v.MaxLTV) {
		t.Errorf("nothing borrowed leaves %d borrowable, want %d", p.Borrowable, round[Minor](100_000000*v.MaxLTV))
	}
	if p.LTV != 0 {
		t.Errorf("nothing borrowed reads as %.4f LTV", p.LTV)
	}
	if p.SelfRepayDays != 0 {
		t.Errorf("nothing borrowed repays itself in %d days", p.SelfRepayDays)
	}

	// Borrowed exactly to the ceiling: nothing left, and the LTV is the vault's.
	v, rec = position(t, app, "stlux", 100_000000, 90_000000)
	p = viewPosition(v, rec)
	if p.Borrowable != 0 {
		t.Errorf("at the ceiling %d is still borrowable", p.Borrowable)
	}
	if math.Abs(p.LTV-v.MaxLTV) > 1e-9 {
		t.Errorf("at the ceiling the LTV reads %.4f, want %.4f", p.LTV, v.MaxLTV)
	}

	// The self-repay figure is the debt divided by a year of the collateral's
	// yield, in days. Computed here from the vault's own APY so the assertion
	// does not restate the implementation's constants.
	wantDays := int(math.Ceil(float64(p.DebtUsd) / float64(p.YieldUsdYear) * 365))
	if p.SelfRepayDays != wantDays {
		t.Errorf("self-repay reads %d days, want %d", p.SelfRepayDays, wantDays)
	}
	if p.SelfRepayDays <= 0 {
		t.Errorf("a loan against yielding collateral repays itself in %d days", p.SelfRepayDays)
	}
}

// An empty position divides by nothing and says so, rather than reporting a
// number a customer would read as a position they do not have.
func TestAnEmptyPositionReportsNothingRatherThanZeroes(t *testing.T) {
	app := newBankApp(t)
	v, rec := position(t, app, "stlux", 0, 0)
	p := viewPosition(v, rec)

	if p.LTV != 0 || p.Borrowable != 0 || p.SelfRepayDays != 0 {
		t.Errorf("an empty position reads ltv=%.4f borrowable=%d selfRepay=%d", p.LTV, p.Borrowable, p.SelfRepayDays)
	}
	if p.CollateralUsd != 0 || p.DebtUsd != 0 {
		t.Errorf("an empty position is worth %d against %d", p.CollateralUsd, p.DebtUsd)
	}
}

// A position past its ceiling — which the chain can produce as a price moves —
// reports nothing borrowable rather than a negative figure the screen would
// render as headroom.
func TestAPositionPastItsCeilingOffersNoHeadroom(t *testing.T) {
	app := newBankApp(t)
	v, rec := position(t, app, "stlux", 100_000000, 95_000000)
	p := viewPosition(v, rec)

	if p.Borrowable != 0 {
		t.Errorf("a position past its ceiling offers %d to borrow", p.Borrowable)
	}
	if p.LTV <= v.MaxLTV {
		t.Errorf("the LTV reads %.4f, which is not past the %.4f ceiling this asserts", p.LTV, v.MaxLTV)
	}
}
