package bank

import (
	"errors"
	"testing"
)

// offChain stands in for a chain the bank was TOLD to use and cannot reach. The
// whole contract is that it invents nothing: no address a customer might send
// to, no balance a caller might spend against, no transaction hash that would
// record a settlement that never happened.
//
// It is the shape that makes an outage safe. simChain answers everything and is
// only ever selected when no chain is configured; the real backend answers from
// the chain. This is the third case, and the one where inventing an answer would
// be indistinguishable from working.
func TestOffChainInventsNothing(t *testing.T) {
	var c ChainBackend = offChain{}

	// A network name is safe to answer: it is what the deployment was configured
	// with, not anything read from a chain.
	if c.Network() == "" {
		t.Error("Network() is empty — the configured network name is known even when the chain is not reachable")
	}

	if got := c.Assets(); len(got) != 0 {
		t.Errorf("Assets() = %v, want empty — an unreachable chain lists no assets", got)
	}

	// An address is the dangerous one: hand a customer a deposit address derived
	// while the chain is down and they may send real coin to it.
	if got := c.Address("seed", "LUX"); got != "" {
		t.Errorf("Address() = %q, want empty — a deposit address must not be invented", got)
	}

	if _, err := c.Balance("seed", "LUX"); !errors.Is(err, errChainDown) {
		t.Errorf("Balance() err = %v, want errChainDown — a zero balance reads as an empty account", err)
	}

	hash, err := c.Send("seed", "LUX", "0x1111111111111111111111111111111111111111", 1)
	if !errors.Is(err, errChainDown) {
		t.Errorf("Send() err = %v, want errChainDown", err)
	}
	if hash != "" {
		t.Errorf("Send() returned hash %q — a receipt for a transfer that never happened", hash)
	}

	if m := c.Market("LUX"); m != nil {
		t.Errorf("Market() = %v, want nil — there is no market to borrow against", m)
	}
}

// Validating an address is pure arithmetic on the string, so it keeps working
// while the chain is down: refusing a well-formed destination during an outage
// would be a different lie, and the check needs no chain to make it.
func TestOffChainStillValidatesAddresses(t *testing.T) {
	c := offChain{}
	if !c.Valid("", "0x1111111111111111111111111111111111111111") {
		t.Error("a well-formed EVM address was refused while the chain was down")
	}
	for _, bad := range []string{"", "0x", "not-an-address", "1111111111111111111111111111111111111111"} {
		if c.Valid("", bad) {
			t.Errorf("Valid(%q) = true", bad)
		}
	}
}
