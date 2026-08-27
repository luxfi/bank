package bank

import (
	"reflect"
	"testing"

	"github.com/hanzoai/base/core"
)

// The signature IS the design, so it is worth a test that fails when someone
// widens it back. A custodian is asked to act for a named account; hand it a
// derivation index instead and you have already assumed that the bank holds the
// mnemonic that index means anything in.
//
// Reading the chain is the other half of the rule and stays off the interface:
// ChainBackend takes an address, never a principal.
func TestCustodianActsForAnAccount(t *testing.T) {
	custody := reflect.TypeOf((*Custodian)(nil)).Elem()
	app := reflect.TypeOf((*core.App)(nil)).Elem()
	acct := reflect.TypeOf((*core.Record)(nil))

	for i := 0; i < custody.NumMethod(); i++ {
		m := custody.Method(i)
		if m.Name == "Name" {
			continue
		}
		if m.Type.NumIn() < 2 || m.Type.In(0) != app || m.Type.In(1) != acct {
			t.Fatalf("Custodian.%s%v acts for something other than a named account", m.Name, m.Type)
		}
	}

	chain := reflect.TypeOf((*ChainBackend)(nil)).Elem()
	for i := 0; i < chain.NumMethod(); i++ {
		m := chain.Method(i)
		for j := 0; j < m.Type.NumIn(); j++ {
			if m.Type.In(j) == acct || m.Type.In(j) == app {
				t.Fatalf("ChainBackend.%s takes an account — reading a chain needs no custody", m.Name)
			}
		}
	}
}

// Who holds the keys follows the chain, not BANK_SANDBOX: a sandbox pointed at a
// real chain signs with real keys, and that is the demo everyone runs. And a
// custodian nobody implements gets nothing, because the alternative is a
// deployment that asked for the customer's own holder and quietly got the bank.
func TestCustodianSelection(t *testing.T) {
	reset := func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	}
	t.Cleanup(reset)

	for _, c := range []struct {
		name, rpc, custody string
		want               Custodian
	}{
		{"nothing configured", "", "", simCustodian{}},
		{"sandbox is not the predicate", "http://127.0.0.1:1", "", deriving{}},
		{"named explicitly", "http://127.0.0.1:1", "bank", deriving{}},
		{"a holder nobody implements", "http://127.0.0.1:1", "alpaca", unheld{}},
	} {
		t.Run(c.name, func(t *testing.T) {
			t.Setenv("BANK_SANDBOX", "1")
			t.Setenv("BANK_CHAIN_RPC", c.rpc)
			t.Setenv("BANK_CUSTODY", c.custody)
			reset()
			if got := custodian(); got != c.want {
				t.Fatalf("custodian() = %T, want %T", got, c.want)
			}
		})
	}
}

// unheld is the fail-closed end of that selection, and it has to hold all the
// way down: no address to receive at, no hash, and no market that would send
// Earn to the ledger as though the vault simply had none.
func TestUnheldActsForNobody(t *testing.T) {
	var cu Custodian = unheld{}

	if w := cu.Wallet(nil, nil, "LUX"); w != (Wallet{}) {
		t.Errorf("Wallet() = %+v, want empty", w)
	}
	if h, err := cu.Send(nil, nil, "LUX", "0x1111111111111111111111111111111111111111", 1); err == nil || h != "" {
		t.Errorf("Send() = %q, %v; want no hash and a refusal", h, err)
	}
	m, err := cu.Market(nil, nil, "LUX")
	if m != nil {
		t.Errorf("Market() = %v, want nil", m)
	}
	if err == nil {
		t.Error("Market() reported no error — a custodian that cannot act reads as a vault with no market, and Earn lends on the ledger instead")
	}
}

// What the sandbox writes onto a wallet row, pinned: the address the simulation
// derives for the account's index, and the reference the row carries to the
// customer through GET /accounts/{id}/wallets.
func TestSimCustodianWallet(t *testing.T) {
	t.Setenv("BANK_CHAIN_RPC", "")
	app := newBankApp(t)
	seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	index := chainIndex(app, acct)
	if index == "" || index == "0" {
		t.Fatalf("account claimed index %q; 0 is the bank's own treasury", index)
	}

	for _, asset := range SupportedCrypto {
		w := simCustodian{}.Wallet(app, acct, asset)
		if want := simAddress(index, asset); w.Address != want {
			t.Errorf("%s address = %q, want %q", asset, w.Address, want)
		}
		if !validAddress(asset, w.Address) {
			t.Errorf("%s address %q does not pass the check a sender's would", asset, w.Address)
		}
		if want := "mpc:" + asset + ":" + index; w.Ref != want {
			t.Errorf("%s ref = %q, want %q", asset, w.Ref, want)
		}
	}
}

// An outage is where inventing an answer would be indistinguishable from
// working, and a deposit address is the field where that costs a customer their
// coins. Bank custody over a chain it cannot reach names none, and no wallet row
// appears until something can answer for it. This needs no live chain — an
// unreachable one is the whole case.
func TestDerivingNamesNoAddressOverAnOutage(t *testing.T) {
	t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
	evmMu.Lock()
	evmInst, evmFrom = nil, ""
	evmMu.Unlock()
	t.Cleanup(func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	})

	app := newBankApp(t)
	seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	if _, ok := custodian().(deriving); !ok {
		t.Fatalf("a configured chain must not hand custody to the simulation, got %T", custodian())
	}
	for _, asset := range SupportedCrypto {
		if w := (deriving{}).Wallet(app, acct, asset); w.Address != "" {
			t.Errorf("%s address = %q over an unreachable chain; nobody holds that key", asset, w.Address)
		}
		if w := walletFor(app, acct.Id, asset); w != nil {
			t.Errorf("%s wallet row written at %q while the chain was unreachable", asset, w.GetString("address"))
		}
	}
}

// One chain, one address. Under bank custody every asset an account holds
// arrives at the same place, and the wallet rows have to say so — the per-asset
// addresses were an artifact of the simulation pretending each asset had a chain
// of its own.
func TestDerivingGivesOneAddress(t *testing.T) {
	c := reach(t)

	app := newBankApp(t)
	seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	want := c.address(chainIndex(app, acct))
	if !validEVMAddress(want) {
		t.Fatalf("the account's key controls %q, which is not an address", want)
	}

	for _, asset := range SupportedCrypto {
		if got := (deriving{}).Wallet(app, acct, asset).Address; got != want {
			t.Fatalf("%s arrives at %s; the account's address is %s", asset, got, want)
		}
	}
}
