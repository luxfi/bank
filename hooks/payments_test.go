package hooks

import (
	"encoding/json"
	"testing"
)

func TestMapCallbackStatus(t *testing.T) {
	cases := []struct{ in, want string }{
		{"completed", "completed"},
		{"settled", "completed"},
		{"failed", "failed"},
		{"rejected", "failed"},
		{"cancelled", "cancelled"},
		{"canceled", "cancelled"},
		{"processing", "processing"},
		{"in_progress", "processing"},
		{"", "pending"},
		{"weird", "pending"},
	}
	for _, c := range cases {
		if got := mapCallbackStatus(c.in); got != c.want {
			t.Errorf("mapCallbackStatus(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestValidTransition(t *testing.T) {
	cases := []struct {
		from, to string
		want     bool
	}{
		{"pending", "processing", true},
		{"pending", "failed", true},
		{"pending", "cancelled", true},
		{"processing", "completed", true},
		{"processing", "failed", true},
		{"processing", "cancelled", true},
		{"completed", "failed", false},
		{"completed", "processing", false},
		{"failed", "completed", false},
		{"cancelled", "completed", false},
	}
	for _, c := range cases {
		if got := validTransition(c.from, c.to); got != c.want {
			t.Errorf("validTransition(%q,%q) = %v, want %v", c.from, c.to, got, c.want)
		}
	}
}

func TestPaymentCallbackPayloadShape(t *testing.T) {
	// Normalized event from forexd: provider/eventType/externalId carry the
	// provider-issued reference; bank looks the record up by externalId.
	in := `{"provider":"currencycloud","eventType":"payment","externalId":"cc-99","status":"completed","reason":""}`
	var p paymentCallbackPayload
	if err := json.Unmarshal([]byte(in), &p); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	if p.Provider != "currencycloud" || p.EventType != "payment" {
		t.Errorf("provider/eventType not captured: %+v", p)
	}
	if p.ExternalID != "cc-99" {
		t.Errorf("externalId = %q, want cc-99", p.ExternalID)
	}
	if p.TransactionID != "" {
		t.Errorf("transactionId should be empty for provider-only events, got %q", p.TransactionID)
	}
	if p.Status != "completed" {
		t.Errorf("status = %q, want completed", p.Status)
	}
}
