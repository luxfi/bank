package hooks

import "testing"

// Fees apply to the surfaces the schedule prices — payment (rails) and
// conversion (FX spread) — and to nothing else. Deposits, withdrawals and
// on-chain crypto sends carry no platform fee, so no undebited fee row is
// written for them.
func TestCalculateFeeScopedToPaymentAndConversion(t *testing.T) {
	const amt = 100_00 // $100.00

	if fee, _ := CalculateFee("individual", "withdrawal", amt, 0); fee != 0 {
		t.Errorf("withdrawal fee = %d, want 0", fee)
	}
	if fee, _ := CalculateFee("individual", "deposit", amt, 0); fee != 0 {
		t.Errorf("deposit fee = %d, want 0", fee)
	}
	if fee, ft := CalculateFee("individual", "conversion", amt, 0); fee <= 0 || ft != "conversion_spread" {
		t.Errorf("conversion fee = (%d, %q), want (>0, conversion_spread)", fee, ft)
	}
	if fee, _ := CalculateFee("individual", "payment", amt, 0); fee <= 0 {
		t.Errorf("payment fee = %d, want > 0", fee)
	}
}
