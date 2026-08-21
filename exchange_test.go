package bank

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestExchangeRateSandbox(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "true")
	// Sandbox prices off the local tables — identical to convertMinor.
	wantMinor, wantRate := convertMinor(100_00, "USD", "EUR")
	toMinor, rate, err := exchangeRate(context.Background(), "USD", "EUR", 100_00)
	if err != nil {
		t.Fatalf("exchangeRate returned error: %v", err)
	}
	if toMinor != wantMinor || rate != wantRate {
		t.Errorf("exchangeRate = (%d, %f), want (%d, %f)", toMinor, rate, wantMinor, wantRate)
	}
}

func TestExchangeRateLiveUnconfigured(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("FOREX_SERVICE_URL", "")
	// No forexd, no price — never a silent fall back to the sandbox tables.
	if _, _, err := exchangeRate(context.Background(), "USD", "EUR", 100_00); err == nil {
		t.Error("exchangeRate = nil error with no FOREX_SERVICE_URL, want error")
	}
}

func TestExchangeRateLive(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Canonical forexd contract: GET /v1/{provider}/rate/{base}/{quote}.
		if r.URL.Path != "/v1/kraken/rate/USD/EUR" {
			t.Errorf("forexd path = %q, want /v1/kraken/rate/USD/EUR", r.URL.Path)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"base_currency": "USD", "quote_currency": "EUR",
			"rate": 0.90, "inverse_rate": 1.1111,
		})
	}))
	defer srv.Close()

	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("FOREX_SERVICE_URL", srv.URL)
	// $100.00 at 0.90 → €90.00, both 2 dp.
	toMinor, rate, err := exchangeRate(context.Background(), "USD", "EUR", 100_00)
	if err != nil {
		t.Fatalf("exchangeRate returned error: %v", err)
	}
	if toMinor != 90_00 || rate != 0.90 {
		t.Errorf("exchangeRate = (%d, %f), want (9000, 0.90)", toMinor, rate)
	}
}
