package hooks

import "testing"

func TestRailFee(t *testing.T) {
	cases := map[PaymentRail]int64{
		RailSEPA:               500,
		RailSEPAInst:           1000,
		RailFPS:                0,
		RailACH:                0,
		RailWire:               2500,
		RailSWIFT:              3500,
		RailInterac:            150,
		RailInternal:           0,
		PaymentRail("unknown"): 2500, // default is the wire fee
	}
	for rail, want := range cases {
		if got := RailFee(rail); got != want {
			t.Errorf("RailFee(%q) = %d, want %d", rail, got, want)
		}
	}
}

func TestMapCCStatus(t *testing.T) {
	cases := map[string]string{
		"ready_to_send": "processing",
		"submitted":     "processing",
		"completed":     "completed",
		"failed":        "failed",
		"cancelled":     "cancelled",
		"weird":         "pending", // unknown maps to pending (no state change)
	}
	for in, want := range cases {
		if got := mapCCStatus(in); got != want {
			t.Errorf("mapCCStatus(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestMapIFXStatus(t *testing.T) {
	cases := map[string]string{
		"settled":  "completed",
		"rejected": "failed",
		"anything": "processing",
	}
	for in, want := range cases {
		if got := mapIFXStatus(in); got != want {
			t.Errorf("mapIFXStatus(%q) = %q, want %q", in, got, want)
		}
	}
}
