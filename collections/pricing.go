package collections

import (
	"math"
	"strings"
)

// Canonical reference pricing, shared by the bank package (sandbox exchange)
// and the hooks package (limit + AML normalization), so both compare value in
// one unit — USD — instead of raw minor units that mean cents for fiat and
// micro-units for crypto. Live pricing deals through forexd; these tables are
// the sandbox reference and the normalization basis for limits.

// PerUSD holds units of each fiat currency per 1 USD.
var PerUSD = map[string]float64{
	"USD": 1.00, "EUR": 0.92, "GBP": 0.79, "JPY": 157.0, "CHF": 0.89,
	"CAD": 1.37, "AUD": 1.52, "SGD": 1.35, "AED": 3.67, "HKD": 7.81,
}

// CryptoUSD holds the USD price of one whole unit of each supported asset.
var CryptoUSD = map[string]float64{
	"LUX": 12.50, "BTC": 64000.0, "ETH": 3400.0, "DAI": 1.00,
}

// CryptoDecimals is the fixed-point precision for crypto balances (6 dp).
const CryptoDecimals = 6

// IsCrypto reports whether cur is a supported crypto asset.
func IsCrypto(cur string) bool {
	_, ok := CryptoUSD[strings.ToUpper(cur)]
	return ok
}

// DecimalsFor returns the minor-unit precision for a currency.
func DecimalsFor(cur string) int {
	cur = strings.ToUpper(cur)
	if IsCrypto(cur) {
		return CryptoDecimals
	}
	switch cur {
	case "JPY", "KRW":
		return 0
	default:
		return 2
	}
}

// UnitPriceUSD returns the USD value of one whole unit of the currency.
func UnitPriceUSD(cur string) float64 {
	cur = strings.ToUpper(cur)
	if p, ok := CryptoUSD[cur]; ok {
		return p
	}
	if r, ok := PerUSD[cur]; ok && r != 0 {
		return 1.0 / r
	}
	return 0
}

// MinorToUSD converts a minor-unit amount in cur to a USD float value.
func MinorToUSD(minor int64, cur string) float64 {
	return float64(minor) / math.Pow10(DecimalsFor(cur)) * UnitPriceUSD(cur)
}

// USDCents converts a minor-unit amount in cur to integer USD cents — the
// common unit for comparing transaction value against USD-denominated limits
// and thresholds regardless of the transacted currency.
func USDCents(minor int64, cur string) int64 {
	return int64(math.Round(MinorToUSD(minor, cur) * 100))
}
