package bank

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// -----------------------------------------------------------------------------
// Exchange rate source
//
// One function decides where a price comes from, so the exchange handlers never
// have to know which mode they are running in. Sandbox prices off the local
// reference tables; live asks forexd, the only component holding liquidity-venue
// credentials. A live deployment without forexd cannot price an exchange —
// there is deliberately no fallback to the sandbox tables.
// -----------------------------------------------------------------------------

// forexProvider is the forexd adapter that prices live exchanges. Kraken is
// the spot backend for crypto + fiat conversion; override with FOREX_PROVIDER.
func forexProvider() string {
	if p := strings.TrimSpace(os.Getenv("FOREX_PROVIDER")); p != "" {
		return p
	}
	return "kraken"
}

// exchangeRate prices `amount` minor units of `from` into minor units of `to`,
// and returns the effective rate (whole `to` per 1 whole `from`).
func exchangeRate(ctx context.Context, from, to string, amount int64) (int64, float64, error) {
	if Sandbox() {
		toMinor, rate := convertMinor(amount, from, to)
		return toMinor, rate, nil
	}
	rate, err := forexRate(ctx, from, to)
	if err != nil {
		return 0, 0, err
	}
	// whole `from` = amount / 10^fromDp; whole `to` = whole `from` * rate.
	fromWhole := float64(amount) / math.Pow10(decimalsFor(from))
	toMinor := int64(math.Round(fromWhole * rate * math.Pow10(decimalsFor(to))))
	return toMinor, rate, nil
}

// forexRate asks forexd for the spot rate (whole `to` per 1 whole `from`) via
// GET /v1/{provider}/rate/{base}/{quote} — the canonical forexd contract.
func forexRate(ctx context.Context, from, to string) (float64, error) {
	forexURL := strings.TrimRight(os.Getenv("FOREX_SERVICE_URL"), "/")
	if forexURL == "" {
		return 0, errors.New("FOREX_SERVICE_URL not set")
	}
	endpoint := fmt.Sprintf("%s/v1/%s/rate/%s/%s",
		forexURL, url.PathEscape(forexProvider()),
		url.PathEscape(strings.ToUpper(from)), url.PathEscape(strings.ToUpper(to)))

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return 0, err
	}
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return 0, fmt.Errorf("forex rate returned %d", resp.StatusCode)
	}
	var out struct {
		Rate float64 `json:"rate"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&out); err != nil {
		return 0, err
	}
	if out.Rate <= 0 {
		return 0, fmt.Errorf("forex rate unpriced for %s → %s", from, to)
	}
	return out.Rate, nil
}
