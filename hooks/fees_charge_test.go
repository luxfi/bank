package hooks

import (
	"slices"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// A fee row's type is a closed vocabulary the collection enforces, so a type
// CalculateFee can return but a fee row cannot hold is not a smaller charge —
// it is no charge at all, refused on save and only logged. Every answer the
// function can give is checked against the one list, so the two cannot drift.
func TestEveryFeeTypeIsOneAFeeRowCanHold(t *testing.T) {
	seen := map[string]bool{}
	for _, entity := range []string{"individual", "business", "", "trust"} {
		for _, kind := range []string{"payment", "conversion", "deposit", "withdrawal", "earn", "card", ""} {
			for _, vol := range []int64{0, 100_000_00, 500_000_00, 1_000_000_00} {
				_, ft := CalculateFee(entity, kind, 100_00, vol)
				seen[ft] = true
				if !slices.Contains(collections.FeeTypes, ft) {
					t.Errorf("CalculateFee(%q, %q, vol=%d) returns type %q, which a fee row cannot hold — the charge is refused and lost",
						entity, kind, vol, ft)
				}
			}
			// And with every rail named explicitly.
			for _, r := range []PaymentRail{RailSEPA, RailSEPAInst, RailFPS, RailACH, RailWire, RailSWIFT, RailInterac, RailInternal} {
				_, ft := CalculateFee(entity, kind, 100_00, 0, r)
				seen[ft] = true
				if !slices.Contains(collections.FeeTypes, ft) {
					t.Errorf("CalculateFee(%q, %q, rail=%s) returns type %q, which a fee row cannot hold",
						entity, kind, r, ft)
				}
			}
		}
	}
	t.Logf("types produced: %v", seen)
}

// The charge that is actually raised, end to end: a payment saves a fee row,
// and the row holds what the schedule says. This is what never happened — the
// hook computed a charge, the save was refused for its type, and the only trace
// was a log line.
func TestAPaymentRaisesAFeeThatIsActuallyRecorded(t *testing.T) {
	app := limitApp(t)
	if err := collections.EnsureFeeCollection(app); err != nil {
		t.Fatalf("ensure fees: %v", err)
	}
	RegisterFeeHooks(app)
	acct := account(t, app)

	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	tx := core.NewRecord(col)
	tx.Set("account", acct)
	tx.Set("type", "payment")
	tx.Set("direction", "debit")
	tx.Set("amount", 100_00)
	tx.Set("currency", "USD")
	tx.Set("status", "pending")
	if err := app.Save(tx); err != nil {
		t.Fatalf("save transaction: %v", err)
	}

	fees, err := app.FindRecordsByFilter(collections.FeeCollectionName,
		"transaction = {:t}", "", 0, 0, map[string]any{"t": tx.Id})
	if err != nil {
		t.Fatalf("reading fees: %v", err)
	}
	if len(fees) != 1 {
		t.Fatalf("a $100.00 payment raised %d fee rows, want 1 — a charge that cannot be saved is a charge nobody makes", len(fees))
	}

	// An individual pays 50bp with no volume discount: 50 minor units on 10000.
	if got := int64(fees[0].GetFloat("amount")); got != 50 {
		t.Errorf("fee = %d minor units on a 10000 payment, want 50 (0.50%%)", got)
	}
	if got := fees[0].GetString("currency"); got != "USD" {
		t.Errorf("fee currency = %q, want USD", got)
	}
}

// A payment must not be charged a flat network fee for a network nobody chose.
// The schedule defaulted to SWIFT, which is $35 — on a $100 payment that is a
// 35.5%% charge, and it was named after a rail the payment never used.
func TestAPaymentWithNoRailCarriesNoNetworkFee(t *testing.T) {
	fee, ft := CalculateFee("individual", "payment", 100_00, 0)
	if fee != 50 {
		t.Errorf("a $100.00 payment with no rail chosen costs %d minor units, want 50 — the tier fee alone", fee)
	}
	if ft != "service_fee" {
		t.Errorf("fee type = %q, want service_fee", ft)
	}

	// Naming a rail adds that network's own cost, and does not rename the
	// charge.
	withRail, ft := CalculateFee("individual", "payment", 100_00, 0, RailSEPA)
	if want := int64(50) + RailFee(RailSEPA); withRail != want {
		t.Errorf("a SEPA payment costs %d, want %d", withRail, want)
	}
	if ft != "service_fee" {
		t.Errorf("naming a rail changed the fee type to %q", ft)
	}

	// A free rail stays free of network cost.
	if free, _ := CalculateFee("individual", "payment", 100_00, 0, RailFPS); free != 50 {
		t.Errorf("an FPS payment costs %d, want 50 — FPS is free", free)
	}
}

// The volume discount takes the largest tier the account has reached, not the
// first one it passed.
func TestTheVolumeDiscountTakesTheLargestTierReached(t *testing.T) {
	for _, tc := range []struct {
		volume int64
		want   int64 // fee on a 100_00 payment, individual = 50bp
	}{
		{0, 50},            // 50bp
		{99_999_00, 50},    // just under the first tier
		{100_000_00, 45},   // 50 - 5
		{500_000_00, 40},   // 50 - 10
		{1_000_000_00, 35}, // 50 - 15
		{9_000_000_00, 35}, // still the largest tier
	} {
		got, _ := CalculateFee("individual", "payment", 100_00, tc.volume)
		if got != tc.want {
			t.Errorf("at %d monthly volume a $100.00 payment costs %d, want %d", tc.volume, got, tc.want)
		}
	}
}
