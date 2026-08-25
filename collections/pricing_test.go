package collections

import (
	"math"
	"testing"
)

func TestIsCrypto(t *testing.T) {
	for _, cur := range []string{"LUX", "BTC", "ETH", "DAI", "lux", "btc", "Eth"} {
		if !IsCrypto(cur) {
			t.Errorf("IsCrypto(%q) = false", cur)
		}
	}
	for _, cur := range []string{"USD", "EUR", "JPY", "", "XXX", "BTCC"} {
		if IsCrypto(cur) {
			t.Errorf("IsCrypto(%q) = true", cur)
		}
	}
}

func TestDecimalsFor(t *testing.T) {
	for cur, want := range map[string]int{
		"BTC": 6, "LUX": 6, "eth": 6, "DAI": 6, // crypto is fixed-point 6dp
		"USD": 2, "EUR": 2, "gbp": 2, // ordinary fiat
		"JPY": 0, "KRW": 0, "jpy": 0, // zero-decimal fiat
		"XXX": 2, "": 2, // unknown falls to the common case
	} {
		if got := DecimalsFor(cur); got != want {
			t.Errorf("DecimalsFor(%q) = %d, want %d", cur, got, want)
		}
	}
}

func TestUnitPriceUSD(t *testing.T) {
	if got := UnitPriceUSD("BTC"); got != 64000.0 {
		t.Errorf("UnitPriceUSD(BTC) = %v", got)
	}
	if got := UnitPriceUSD("usd"); got != 1.0 {
		t.Errorf("UnitPriceUSD(usd) = %v, want 1", got)
	}
	// Fiat is quoted as units-per-USD, so the price of one unit is its inverse.
	if got, want := UnitPriceUSD("EUR"), 1.0/0.92; math.Abs(got-want) > 1e-12 {
		t.Errorf("UnitPriceUSD(EUR) = %v, want %v", got, want)
	}
	if got := UnitPriceUSD("XXX"); got != 0 {
		t.Errorf("UnitPriceUSD(XXX) = %v, want 0", got)
	}
}

func TestMinorToUSDAndCents(t *testing.T) {
	// 1.00 USD in cents.
	if got := MinorToUSD(100, "USD"); got != 1.0 {
		t.Errorf("MinorToUSD(100, USD) = %v", got)
	}
	// 1 BTC is 1_000_000 minor units at 6dp.
	if got := MinorToUSD(1_000_000, "BTC"); got != 64000.0 {
		t.Errorf("MinorToUSD(1e6, BTC) = %v", got)
	}
	if got := USDCents(1_000_000, "BTC"); got != 6_400_000 {
		t.Errorf("USDCents(1e6, BTC) = %d, want 6400000", got)
	}
	// JPY carries no decimals: 1000 JPY is 1000 yen, not 10.
	if got, want := USDCents(1000, "JPY"), int64(math.Round(1000.0/157.0*100)); got != want {
		t.Errorf("USDCents(1000, JPY) = %d, want %d", got, want)
	}
	if got := USDCents(0, "USD"); got != 0 {
		t.Errorf("USDCents(0, USD) = %d", got)
	}
}

// USDCents answers 0 for a currency it cannot price, and 0 clears every
// USD-denominated ceiling — below the AML threshold, never over a daily limit,
// and adding nothing to the running total it should have consumed. The currency
// field is an unconstrained three-letter string, so this was reachable by typing
// one: "KRW" is named by DecimalsFor while PerUSD carries no rate for it, and
// "ZZZ" is accepted just as readily.
//
// The number itself cannot carry the distinction, so CanPrice does. Callers
// enforcing a limit ask it first; hooks/accounts refuses the transaction and
// hooks/compliance screens it rather than valuing it at nothing.
func TestCanPriceSeparatesZeroFromUnpriceable(t *testing.T) {
	for _, cur := range []string{"USD", "EUR", "JPY", "btc", "LUX", "dai"} {
		if !CanPrice(cur) {
			t.Errorf("CanPrice(%q) = false, but it has a reference price", cur)
		}
	}
	for _, cur := range []string{"KRW", "ZZZ", "XXX", "", "krw"} {
		if CanPrice(cur) {
			t.Errorf("CanPrice(%q) = true, but nothing prices it", cur)
		}
	}

	// The trap this exists to close: an unpriceable currency is worth 0 cents,
	// and a genuine zero is worth 0 cents too. Only CanPrice tells them apart.
	const huge = 1_000_000_000_000
	if got := USDCents(huge, "KRW"); got != 0 {
		t.Fatalf("USDCents(huge, KRW) = %d — the premise changed, revisit the gates", got)
	}
	if USDCents(0, "USD") != USDCents(huge, "KRW") {
		t.Fatal("the two are meant to be indistinguishable by value alone")
	}
	if !CanPrice("USD") || CanPrice("KRW") {
		t.Fatal("CanPrice must be what separates them")
	}
}
