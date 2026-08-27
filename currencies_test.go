package bank

import (
	"strings"
	"testing"

	"github.com/luxfi/bank/collections"
)

// SupportedFiat and SupportedCrypto are what the pickers offer, and the pricing
// tables are what the bank can value. They are separate lists, so they can
// drift — and an asset a customer can be offered but the bank cannot price is
// one they can hold and never move: the limit gate refuses every transaction in
// a currency it cannot convert to USD, and a conversion of one values at
// nothing.
//
// Offering it is the promise; pricing it is what keeps the promise.
func TestEveryAssetOfferedCanBePriced(t *testing.T) {
	for _, cur := range SupportedFiat {
		if !collections.CanPrice(cur) {
			t.Errorf("%s is offered as fiat and has no reference price — an account could hold it and never move it", cur)
		}
		if collections.IsCrypto(cur) {
			t.Errorf("%s is offered as fiat but prices as crypto", cur)
		}
	}
	for _, cur := range SupportedCrypto {
		if !collections.CanPrice(cur) {
			t.Errorf("%s is offered as crypto and has no reference price", cur)
		}
		if !collections.IsCrypto(cur) {
			t.Errorf("%s is offered as crypto but the bank does not price it as one, so it is scaled at fiat precision", cur)
		}
	}
}

// The other direction: a price the pickers never offer is a currency the bank
// values and nobody can choose. Harmless, but it means the two lists have
// parted, and the direction that matters is caught by the same pass.
func TestEveryPricedAssetIsOffered(t *testing.T) {
	offered := map[string]bool{}
	for _, c := range SupportedFiat {
		offered[c] = true
	}
	for _, c := range SupportedCrypto {
		offered[c] = true
	}
	for cur := range collections.PerUSD {
		if !offered[cur] {
			t.Errorf("%s is priced but offered nowhere", cur)
		}
	}
	for cur := range collections.CryptoUSD {
		if !offered[cur] {
			t.Errorf("%s is priced but offered nowhere", cur)
		}
	}
}

// supportedAsset is what the exchange gates on, so it has to agree with what is
// offered — a pair the picker shows and the exchange refuses is a dead end a
// customer reaches by choosing from our own list.
func TestTheExchangeAcceptsEverythingOffered(t *testing.T) {
	for _, cur := range append(append([]string{}, SupportedFiat...), SupportedCrypto...) {
		if !supportedAsset(cur) {
			t.Errorf("%s is offered but the exchange refuses it", cur)
		}
		// The pickers send what the user picked; case is not the user's problem.
		if !supportedAsset(strings.ToLower(cur)) {
			t.Errorf("%s is refused when written in lower case", cur)
		}
	}
	for _, cur := range []string{"", "ZZZ", "XYZ", "USDT"} {
		if supportedAsset(cur) {
			t.Errorf("%q is accepted by the exchange but is not an asset this bank carries", cur)
		}
	}
}

// A vault names the asset its collateral and its like-kind debt are held in.
// Nothing about lending depends on a price — the borrow ceiling is a ratio
// between two amounts of the same asset, which is what makes 90% safe — but the
// position a customer reads is valued in USD, so a vault whose asset the bank
// cannot price shows somebody holding collateral worth nothing.
func TestEveryVaultAssetCanBePriced(t *testing.T) {
	for _, v := range collections.Vaults {
		if !collections.CanPrice(v.Underlying) {
			t.Errorf("vault %q is denominated in %s, which has no reference price — its position reads as $0",
				v.ID, v.Underlying)
		}
		if !supportedAsset(v.Underlying) {
			t.Errorf("vault %q is denominated in %s, which the bank does not carry", v.ID, v.Underlying)
		}
	}
}
