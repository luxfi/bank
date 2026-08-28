package bank

import (
	"strings"
	"testing"

	"github.com/hanzoai/base/core"

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

// Why bankd refuses to start outside the sandbox with no chain configured.
//
// The simulation is chosen on the chain being absent, not on the sandbox flag,
// and it names the network from the sandbox flag alone. So a deployment that
// has declared itself real and was pointed at no chain gets the simulation
// calling itself mainnet: invented deposit addresses, receipts for transfers
// that never happened, and a customer who sends real coins to one loses them,
// because nobody holds that key and no operator can sweep it.
//
// A configured chain that is merely unreachable already refuses rather than
// degrading into the simulation. This is the same rule for the case where none
// was configured at all, and it is enforced where a deployment is read rather
// than on every call — so this test is what keeps the reason written down.
func TestTheSimulationWouldCallItselfMainnet(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("BANK_CHAIN_RPC", "")
	evmMu.Lock()
	evmInst, evmFrom = nil, ""
	evmMu.Unlock()
	t.Cleanup(func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	})

	if ChainConfigured() {
		t.Fatal("a chain is configured, so this proves nothing")
	}
	if _, simulated := chain().(simChain); !simulated {
		t.Fatalf("the backend with no chain configured is %T, not the simulation", chain())
	}
	if got := chain().Network(); got != "lux-mainnet" {
		t.Errorf("the simulation names itself %q outside the sandbox; the hazard this documents has changed shape", got)
	}
	if _, simulated := custodian().(simCustodian); !simulated {
		t.Errorf("the custodian with no chain configured is %T, not the simulation", custodian())
	}
	// And what it would hand a customer is an address no key answers for.
	addr := simAddress("1", "LUX")
	if !validEVMAddress(addr) {
		t.Fatalf("the simulation's address %q is not even well formed", addr)
	}
	if addr == "" {
		t.Fatal("the simulation named no address")
	}
}

// An account opens in its own market's money, and the coordinates a payer needs
// follow from it. Every market the bank names has to be one it can price: a
// currency it cannot value is one whose limits it cannot enforce and whose
// balance reads as nothing.
func TestEveryMarketOpensInACurrencyTheBankCarries(t *testing.T) {
	for country, cur := range marketOf {
		if len(country) != 2 || country != strings.ToUpper(country) {
			t.Errorf("%q is not a two-letter country code", country)
		}
		if !collections.CanPrice(cur) {
			t.Errorf("%s opens accounts in %s, which the bank cannot price", country, cur)
		}
		if !supportedAsset(cur) {
			t.Errorf("%s opens accounts in %s, which the bank does not carry", country, cur)
		}
	}
	// A country nobody has mapped settles in what the bank settles in.
	for _, unknown := range []string{"ZZ", "", "XX", "us"} {
		if got := marketCurrency(unknown); got != "USD" {
			t.Errorf("an account from %q opens in %q, want USD", unknown, got)
		}
	}
	// And the ones that are mapped are read case-insensitively, since a country
	// arrives in an onboarding body.
	if got := marketCurrency("de"); got != "EUR" {
		t.Errorf("a lower-case country opens in %q, want EUR", got)
	}
}

// The IBAN markets are the reason this mapping exists: receivingFor shapes the
// coordinates by the account's currency, and until an account could open in one
// of them that whole branch answered no account this bank could open.
func TestAnIBANMarketOpensAnAccountWithAnIBAN(t *testing.T) {
	app := newBankApp(t)
	col, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	for country, wantCur := range map[string]string{"DE": "EUR", "GB": "GBP", "CH": "CHF", "US": "USD"} {
		r := core.NewRecord(col)
		r.Set("owner", "owner-"+country)
		r.Set("entityName", "Acme")
		r.Set("entityType", "individual")
		r.Set("country", country)
		r.Set("currency", marketCurrency(country))
		r.Set("status", "active")
		r.Set("kycStatus", "approved")
		if err := app.Save(r); err != nil {
			t.Fatalf("%s account: %v", country, err)
		}
		if got := r.GetString("currency"); got != wantCur {
			t.Errorf("%s opens in %q, want %q", country, got, wantCur)
		}

		rec := receivingFor(r)
		if rec == nil {
			t.Fatalf("%s account has no coordinates", country)
		}
		if country == "US" {
			if rec.IBAN != "" {
				t.Errorf("a US account carries the IBAN %q; the US issues none", rec.IBAN)
			}
			if rec.RoutingNumber == "" {
				t.Error("a US account carries no routing number")
			}
			continue
		}
		if rec.IBAN == "" {
			t.Errorf("a %s account carries no IBAN", country)
		}
		if rec.RoutingNumber != "" {
			t.Errorf("a %s account carries the routing number %q; its rail is the IBAN", country, rec.RoutingNumber)
		}
	}
}
