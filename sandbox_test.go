package bank

import "testing"

func TestDecimalsFor(t *testing.T) {
	cases := map[string]int{"USD": 2, "EUR": 2, "JPY": 0, "LUX": 6, "BTC": 6, "DAI": 6}
	for cur, want := range cases {
		if got := decimalsFor(cur); got != want {
			t.Errorf("decimalsFor(%q) = %d, want %d", cur, got, want)
		}
	}
}

func TestIsCrypto(t *testing.T) {
	for _, c := range []string{"LUX", "BTC", "ETH", "DAI"} {
		if !isCrypto(c) {
			t.Errorf("isCrypto(%q) = false, want true", c)
		}
	}
	for _, f := range []string{"USD", "EUR", "GBP"} {
		if isCrypto(f) {
			t.Errorf("isCrypto(%q) = true, want false", f)
		}
	}
}

func TestConvertMinorFiat(t *testing.T) {
	// $100.00 -> EUR at 0.92 minus 0.2% spread ≈ €91.82.
	toMinor, rate := convertMinor(100_00, "USD", "EUR")
	if toMinor < 91_00 || toMinor > 92_00 {
		t.Errorf("USD->EUR of $100 = %d minor, want ~9182", toMinor)
	}
	if rate <= 0.90 || rate >= 0.92 {
		t.Errorf("USD->EUR rate = %f, want ~0.918", rate)
	}
}

func TestConvertMinorCrypto(t *testing.T) {
	// $1250.00 -> LUX at $12.50 each ≈ 99.8 LUX (100 minus spread), 6dp.
	toMinor, _ := convertMinor(1250_00, "USD", "LUX")
	// 99.8 LUX = 99_800000 micro-units, allow small rounding band.
	if toMinor < 99_000000 || toMinor > 100_000000 {
		t.Errorf("USD->LUX of $1250 = %d micro-LUX, want ~99_800000", toMinor)
	}
}

func TestUnitPriceUSD(t *testing.T) {
	if p := unitPriceUSD("USD"); p != 1.0 {
		t.Errorf("unitPriceUSD(USD) = %f, want 1.0", p)
	}
	if p := unitPriceUSD("LUX"); p != 12.50 {
		t.Errorf("unitPriceUSD(LUX) = %f, want 12.50", p)
	}
	// EUR: 1/0.92 ≈ 1.087 USD per EUR.
	if p := unitPriceUSD("EUR"); p < 1.08 || p > 1.09 {
		t.Errorf("unitPriceUSD(EUR) = %f, want ~1.087", p)
	}
}

// The simulation models each asset as its own chain, so it hands out one
// address per asset. That is a property of the simulation, not of the bank —
// on a real EVM an account has a single address and the assets are token
// contracts — so this names simAddress rather than asking who the custodian is.
func TestChainAddressDeterministic(t *testing.T) {
	a := simAddress("user-123", "ETH")
	b := simAddress("user-123", "ETH")
	if a != b {
		t.Errorf("address not deterministic: %s != %s", a, b)
	}
	if len(a) != 42 || a[:2] != "0x" {
		t.Errorf("EVM address %q malformed (want 0x + 40 hex)", a)
	}
	if simAddress("other", "ETH") == a {
		t.Errorf("distinct seeds produced same address")
	}
	// Each asset gets its own address; BTC is bech32, not 0x.
	if simAddress("user-123", "DAI") == a {
		t.Errorf("distinct assets produced same address")
	}
	btc := simAddress("user-123", "BTC")
	if !validAddress("BTC", btc) {
		t.Errorf("BTC address %q not a valid bech32 address", btc)
	}
}

func TestValidAddress(t *testing.T) {
	cases := []struct {
		asset, addr string
		want        bool
	}{
		{"ETH", "0x1234567890abcdef1234567890abcdef12345678", true},  // all-lowercase, no checksum
		{"LUX", "0x1234567890ABCDEF1234567890ABCDEF12345678", true},  // all-uppercase, no checksum
		{"ETH", "0x52908400098527886E0F7030069857D2E4169EE7", true},  // valid EIP-55 checksum
		{"ETH", "0x52908400098527886E0F7030069857D2E4169Ee7", false}, // one char wrong case → checksum fail
		{"ETH", "0x1234", false},
		{"ETH", "1234567890abcdef1234567890abcdef12345678xx", false},
		{"BTC", "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4", true},  // valid bech32
		{"BTC", "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5", false}, // last char flipped → polymod fail
		{"BTC", "0x1234567890abcdef1234567890abcdef12345678", false},
		{"BTC", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", false}, // length-window garbage now rejected
		{"BTC", "short", false},
	}
	for _, c := range cases {
		if got := validAddress(c.asset, c.addr); got != c.want {
			t.Errorf("validAddress(%q, %q) = %v, want %v", c.asset, c.addr, got, c.want)
		}
	}
}

func TestTxHashShape(t *testing.T) {
	h := simTxHash()
	if len(h) != 66 || h[:2] != "0x" {
		t.Errorf("simTxHash = %q, want 0x + 64 hex", h)
	}
	if h == simTxHash() {
		t.Error("simTxHash not random")
	}
}

func TestTxHashForAssetShape(t *testing.T) {
	// EVM-family hashes are 0x + 64 hex; a Bitcoin hash is 64 bare hex chars.
	for _, asset := range []string{"LUX", "ETH", "DAI"} {
		h := txHashFor(asset)
		if len(h) != 66 || h[:2] != "0x" {
			t.Errorf("txHashFor(%s) = %q, want 0x + 64 hex", asset, h)
		}
	}
	btc := txHashFor("BTC")
	if len(btc) != 64 {
		t.Errorf("txHashFor(BTC) = %q, want 64 bare hex chars", btc)
	}
	if btc[:2] == "0x" {
		t.Errorf("txHashFor(BTC) = %q, must not be 0x-prefixed", btc)
	}
}
