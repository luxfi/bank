package collections

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

// What an asset is worth, in one place, in one unit.
//
// Everything that compares value — the limit ceilings, the AML threshold, a
// vault's collateral, a balance on a screen — asks in USD, because raw minor
// units mean cents for fiat and micro-units for crypto and adding them is
// meaningless. This file is where that question is answered and the only place
// it is answered.
//
// Where the answer comes from is one variable. The DEX is the source: it has an
// order book, so a price there is one somebody would actually trade at, rather
// than a constant somebody typed. The tables below are what it replaces and are
// the fallback until every market the bank carries is listed and has a book —
// see Source.

// Prices is where a price comes from. One implementation asks the DEX; the
// tables in this file are the other.
//
// Unpriceable is not an error: a market with no book has no price, and the bank
// already refuses what it cannot value — a limit it cannot enforce, an AML
// threshold it cannot evaluate, a conversion it cannot rate. Returning false is
// how a source says so, and every one of those refusals is already held down by
// a test.
type Prices interface {
	// UnitUSD is the USD value of one whole unit of cur, and whether this
	// source can price it at all.
	UnitUSD(cur string) (float64, bool)
}

// Source answers every price the bank asks. It is a variable because which
// source is right is a deployment's answer, not this package's — and it is ONE
// variable so a deployment cannot end up half-migrated, pricing a limit off one
// source and a conversion off another.
var Source Prices = tables{}

// tables is the reference pricing this file has always carried: constants, and
// therefore always an answer. It cannot be wrong about liquidity because it does
// not know about liquidity.
type tables struct{}

func (tables) UnitUSD(cur string) (float64, bool) {
	cur = strings.ToUpper(cur)
	if p, ok := CryptoUSD[cur]; ok {
		return p, true
	}
	if r, ok := PerUSD[cur]; ok && r != 0 {
		return 1.0 / r, true
	}
	return 0, false
}

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

// Format writes an amount the way a person reads it, in the currency's own
// number of decimal places. Everything is stored in minor units, so the stored
// number is cents or micro-units — printing it raw tells a customer their
// $250.00 transfer was 25000, and a yen amount, which has no minor unit at all,
// would grow a decimal point it never had.
//
// The arithmetic is integer throughout. Money rendered through a float is money
// rounded by whatever the float could hold.
func Format(minor int64, cur string) string {
	d := DecimalsFor(cur)
	if d <= 0 {
		return strconv.FormatInt(minor, 10)
	}
	unit := int64(1)
	for range d {
		unit *= 10
	}
	// Go truncates toward zero, so both parts of a negative amount are
	// negative and the sign has to be carried separately — otherwise -0.50
	// prints as 0.50, the loss reading as a gain.
	whole, frac := minor/unit, minor%unit
	sign := ""
	if frac < 0 {
		frac = -frac
	}
	if minor < 0 && whole == 0 {
		sign = "-"
	}
	return fmt.Sprintf("%s%d.%0*d", sign, whole, d, frac)
}

// UnitPriceUSD returns the USD value of one whole unit of the currency.
func UnitPriceUSD(cur string) float64 {
	p, _ := Source.UnitUSD(cur)
	return p
}

// MinorToUSD converts a minor-unit amount in cur to a USD float value.
func MinorToUSD(minor int64, cur string) float64 {
	return float64(minor) / math.Pow10(DecimalsFor(cur)) * UnitPriceUSD(cur)
}

// CanPrice reports whether cur has a reference price here.
//
// USDCents answers 0 for a currency it cannot price, and 0 clears every
// USD-denominated ceiling: an unpriced transfer of any size sits below the AML
// threshold, never exceeds a daily limit, and adds nothing to the running total
// it should have consumed. The currency field is an unconstrained three-letter
// string, so "KRW" — which DecimalsFor names while PerUSD carries no rate for it
// — and "ZZZ" alike arrive priced at nothing.
//
// A caller enforcing a limit has to ask this BEFORE trusting the number. A value
// that cannot be compared is not a small value.
func CanPrice(cur string) bool {
	_, ok := Source.UnitUSD(cur)
	return ok
}

// USDCents converts a minor-unit amount in cur to integer USD cents — the
// common unit for comparing transaction value against USD-denominated limits
// and thresholds regardless of the transacted currency.
func USDCents(minor int64, cur string) int64 {
	return int64(math.Round(MinorToUSD(minor, cur) * 100))
}
