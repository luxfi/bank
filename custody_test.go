package bank

import (
	"reflect"
	"strings"
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

	// Name and Holds describe the custodian and act for nobody: who it is, and
	// whether the addresses it names have a key behind them. Both are constant
	// per deployment, so neither may take an account — a Holds that varied by
	// account would be the custody question answered per customer, which is not
	// a thing a deployment can be.
	describes := map[string]bool{"Name": true, "Holds": true}

	for i := 0; i < custody.NumMethod(); i++ {
		m := custody.Method(i)
		if describes[m.Name] {
			if m.Type.NumIn() != 0 {
				t.Fatalf("Custodian.%s%v takes an argument — it describes the custodian and nothing else", m.Name, m.Type)
			}
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
		{"the customer holds their own", "http://127.0.0.1:1", "holder", holder{}},
		{"case and spacing do not matter", "http://127.0.0.1:1", "  HOLDER ", holder{}},
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
		if want := "sandbox:" + asset + ":" + index; w.Ref != want {
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

// TestDerivingReachesNoMarketOverAnOutage is the same rule as the wallet above,
// applied where it costs money instead of confusing a customer.
//
// A market lookup has two ways to come back empty and they are not the same
// fact. This chain carries no market for this asset is a property of the
// deployment: Earn was always going to be a ledger loan, and answering nil is
// right. This chain cannot be reached is an outage, and answering nil hands the
// movement to the ledger — which credits a borrow against collateral no chain is
// holding, sizes it against a position the chain will overwrite the moment it
// comes back, and pays out real money in between.
//
// Bank custody is only chosen when a chain IS configured, so an unreachable one
// is the only way to arrive here with nothing to ask. It has to refuse, the way
// Send does.
func TestDerivingReachesNoMarketOverAnOutage(t *testing.T) {
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

	m, err := deriving{}.Market(app, acct, "LUX")
	if m != nil {
		t.Fatalf("Market() = %v over an outage, want none", m)
	}
	if err == nil {
		t.Fatal("Market() reported no market rather than an outage — Earn falls to the ledger and credits a borrow against collateral no chain is holding")
	}
}

// The name is what a receipt and a log line carry, so it is the field an
// operator reads to know who signed. Renaming one silently re-labels every
// record written before it.
func TestCustodiansSayWhoTheyAre(t *testing.T) {
	for want, cu := range map[string]Custodian{
		"bank":    deriving{},
		"holder":  holder{},
		"sandbox": simCustodian{},
		"none":    unheld{},
	} {
		if got := cu.Name(); got != want {
			t.Errorf("%T.Name() = %q, want %q", cu, got, want)
		}
	}
}

// A vault whose asset the chain carries no market for is the OTHER empty
// answer, and it must stay empty-with-no-error: Earn belongs on the ledger and
// always did. The sandbox holds nothing on any chain, so it is that case for
// every asset.
func TestSandboxHasNoMarketAndSaysSoWithoutFailing(t *testing.T) {
	m, err := simCustodian{}.Market(nil, nil, "LUX")
	if m != nil {
		t.Errorf("Market() = %v, want none", m)
	}
	if err != nil {
		t.Errorf("Market() failed with %v — a vault with no market behind it is not an error, it is a ledger loan", err)
	}
}

// The custody posture, stated as behaviour rather than as a claim.
//
// Under BANK_CUSTODY=holder the bank has no key for a customer's account and
// must not be able to acquire one. It reads an address the account declared,
// which is a public value, and every operation that needs a signature refuses.
// That is footnote 6 of the April 2026 staff statement satisfied mechanically:
// no custody of, and no access to, the key — not a share, not a blob, not an
// index into a mnemonic the bank keeps.
func TestHolderKeepsNoKey(t *testing.T) {
	const own = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

	t.Setenv("BANK_CHAIN_RPC", "")
	app := newBankApp(t)
	seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}

	var cu Custodian = holder{}

	// This account was opened by the sandbox, which does claim an index. What
	// matters is that customer custody never touches it: the number is a
	// position in the bank's own mnemonic, and a custodian that reached for one
	// would be deriving a key it says it does not have.
	before := int64(acct.GetFloat("chainIndex"))

	// An account that has declared nothing gets no address. A placeholder here
	// is an address nobody holds the key to, which is the sandbox's whole
	// hazard arriving by another door.
	acct.Set("address", "")
	for _, asset := range SupportedCrypto {
		if w := cu.Wallet(app, acct, asset); w.Address != "" {
			t.Errorf("%s: undeclared account was given %q", asset, w.Address)
		}
	}

	acct.Set("address", own)
	for _, asset := range SupportedCrypto {
		w := cu.Wallet(app, acct, asset)
		if w.Address != own {
			t.Errorf("%s address = %q, want the declared %q", asset, w.Address, own)
		}
		// No index, and no handle onto anything the bank keeps: the address is
		// the whole of what the bank knows about this holding.
		if w.Ref != "" {
			t.Errorf("%s ref = %q; the bank holds nothing further to name", asset, w.Ref)
		}
	}

	if got := int64(acct.GetFloat("chainIndex")); got != before {
		t.Errorf("derivation index moved %d -> %d under customer custody", before, got)
	}

	if h, err := cu.Send(app, acct, "LUX", own, 1); err == nil || h != "" {
		t.Errorf("Send() = %q, %v; the bank cannot sign for a key it does not have", h, err)
	}
	if m, err := cu.Market(app, acct, "LUX"); err == nil || m != nil {
		t.Errorf("Market() = %v, %v; an Earn movement is a transaction and needs a signer", m, err)
	}
}

// The API surface follows the posture. Where the customer holds the key the bank
// has no address until they declare one, and where the bank holds it there is
// nothing to declare — so the route exists in exactly one of the two.
func TestOnlySelfCustodyTakesADeclaredAddress(t *testing.T) {
	reset := func() {
		evmMu.Lock()
		evmInst, evmFrom = nil, ""
		evmMu.Unlock()
	}
	t.Cleanup(reset)

	for _, c := range []struct {
		name, rpc, custody string
		want               bool
	}{
		{"no chain at all", "", "", false},
		{"bank custody", "http://127.0.0.1:1", "bank", false},
		{"customer custody", "http://127.0.0.1:1", "holder", true},
		{"a custodian nobody implements", "http://127.0.0.1:1", "alpaca", false},
	} {
		t.Run(c.name, func(t *testing.T) {
			t.Setenv("BANK_CHAIN_RPC", c.rpc)
			t.Setenv("BANK_CUSTODY", c.custody)
			reset()
			if got := selfCustody(); got != c.want {
				t.Fatalf("selfCustody() = %v, want %v", got, c.want)
			}
		})
	}
}

// The reference a wallet row carries names who holds the key, and it reaches a
// customer through their own wallet list. It read "mpc:" once — a claim that
// the key was split across a threshold of parties — while one process held the
// whole mnemonic. A reference that names the wrong holder is the custody
// question answered wrongly in the one place a customer looks, so what each
// custodian may say is written down here.
func TestAWalletReferenceNamesWhoActuallyHolds(t *testing.T) {
	t.Setenv("BANK_CHAIN_RPC", "")
	app := newBankApp(t)
	seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	index := chainIndex(app, acct)

	for _, cu := range []Custodian{deriving{}, simCustodian{}, holder{}, unheld{}} {
		w := cu.Wallet(app, acct, "LUX")
		if w.Ref == "" {
			continue // a custodian that keeps no handle says so by keeping none
		}
		if want := cu.Name() + ":LUX:" + index; w.Ref != want {
			t.Errorf("%T names its holding %q, want %q", cu, w.Ref, want)
		}
	}

	// The claim that was wrong. Nothing in this estate has ever done threshold
	// signing for a customer key, so nothing may say it does.
	for _, cu := range []Custodian{deriving{}, simCustodian{}, holder{}, unheld{}} {
		for _, asset := range SupportedCrypto {
			if ref := cu.Wallet(app, acct, asset).Ref; strings.HasPrefix(ref, "mpc:") {
				t.Errorf("%T tells a customer their %s key is held by a threshold: %q", cu, asset, ref)
			}
		}
	}
}
