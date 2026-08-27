package bank

import (
	"os"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// A deposit address is where a customer is told to send money, so the row that
// records it has to keep up with the chain the bank is actually running against.
// These pin down every direction it can move: simulation to real chain, real
// chain back to simulation, and a chain that was configured and cannot be
// reached. Like the rest of the on-chain suite they need a chain to compare
// against, and skip without one:
//
//	BANK_CHAIN_RPC=http://127.0.0.1:8747 BANK_CHAIN_MNEMONIC="…" go test -run TestWallet ./...
// -----------------------------------------------------------------------------

// TestWalletAddressFollowsTheChain: an account opened against the simulation
// carries a display address derived from a hash — nobody holds that key, so
// anything sent there is gone. Configuring a real chain has to move the address
// the customer is shown onto the one the bank can sign for, and nothing may
// afterwards move it back.
func TestWalletAddressFollowsTheChain(t *testing.T) {
	rpc := os.Getenv("BANK_CHAIN_RPC")
	if rpc == "" {
		t.Skip("BANK_CHAIN_RPC unset — no chain to reconcile against")
	}

	// Open the account with no chain configured, the way every standing sandbox
	// account was opened: the simulation answers.
	t.Setenv("BANK_CHAIN_RPC", "")
	app := newBankApp(t)
	seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	seed := chainIndex(app, acct)
	simulated := walletAddress(t, app, acct.Id, "LUX")
	if simulated == "" {
		t.Fatal("the simulation left the wallet without an address")
	}

	// Point the bank at the chain. What is on record is now an address the bank
	// cannot sign for, and healing it is the whole job.
	t.Setenv("BANK_CHAIN_RPC", rpc)
	c := reach(t)
	want := c.address(seed)
	if want == simulated {
		t.Fatalf("the simulation and the chain agree on %s — nothing to prove", want)
	}
	t.Logf("recorded %s, but the key controls %s", simulated, want)

	ensureWallets(app, acct)
	for _, asset := range SupportedCrypto {
		// One chain, one address: every asset arrives at the same place, and the
		// bech32 the simulation showed for BTC is not that place.
		if got := walletAddress(t, app, acct.Id, asset); got != want {
			t.Fatalf("%s wallet still shows %s; the account's address is %s", asset, got, want)
		}
	}
	if net := walletNetwork(t, app, acct.Id, "LUX"); net != c.Network() {
		t.Fatalf("address moved to %s but the row still says network %s", c.Network(), net)
	}

	// And back the other way, which must not happen: the simulation cannot sign
	// for anything, so it has no business renaming an address a customer holds.
	t.Setenv("BANK_CHAIN_RPC", "")
	ensureWallets(app, acct)
	if got := walletAddress(t, app, acct.Id, "LUX"); got != want {
		t.Fatalf("the simulation overwrote a real address with %s", got)
	}
}

// TestWalletWaitsForAnUnreachableChain: a bank pointed at a chain it cannot
// reach knows nothing about any address. It must neither publish an empty one
// nor invent one, and the row has to appear on the first boot that can answer.
func TestWalletWaitsForAnUnreachableChain(t *testing.T) {
	rpc := os.Getenv("BANK_CHAIN_RPC")
	if rpc == "" {
		t.Skip("BANK_CHAIN_RPC unset — no chain to reconcile against")
	}
	t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
	app := newBankApp(t)
	seedPrincipal(t, app)
	acct := primaryAccount(app, principalID(t, app))
	if acct == nil {
		t.Fatal("no account provisioned")
	}
	if w := walletFor(app, acct.Id, "LUX"); w != nil {
		t.Fatalf("a chain that answers nothing produced a wallet at %q", w.GetString("address"))
	}

	t.Setenv("BANK_CHAIN_RPC", rpc)
	c := reach(t)
	ensureWallets(app, acct)
	want := c.address(chainIndex(app, acct))
	if got := walletAddress(t, app, acct.Id, "LUX"); got != want {
		t.Fatalf("wallet shows %q once the chain came up; the account's address is %s", got, want)
	}

	// The chain going quiet again leaves the address alone.
	t.Setenv("BANK_CHAIN_RPC", "http://127.0.0.1:1")
	ensureWallets(app, acct)
	if got := walletAddress(t, app, acct.Id, "LUX"); got != want {
		t.Fatalf("an unreachable chain rewrote the address to %q", got)
	}
}

func walletFor(app core.App, accountID, asset string) *core.Record {
	w, _ := app.FindFirstRecordByFilter(collections.WalletCollectionName,
		"account = {:a} && currency = {:c}", map[string]any{"a": accountID, "c": asset})
	return w
}

func walletAddress(t *testing.T, app core.App, accountID, asset string) string {
	t.Helper()
	w := walletFor(app, accountID, asset)
	if w == nil {
		t.Fatalf("no %s wallet on account %s", asset, accountID)
	}
	return w.GetString("address")
}

func walletNetwork(t *testing.T, app core.App, accountID, asset string) string {
	t.Helper()
	w := walletFor(app, accountID, asset)
	if w == nil {
		t.Fatalf("no %s wallet on account %s", asset, accountID)
	}
	return w.GetString("network")
}
