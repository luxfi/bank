package bank

import (
	"errors"
	"testing"
)

// offChain stands in for a chain the bank was TOLD to use and cannot reach. The
// whole contract is that it invents nothing: no asset list a caller might act
// on, no balance anyone might spend against.
//
// It is the shape that makes an outage safe. simChain answers what it can and is
// only ever selected when no chain is configured; the real backend answers from
// the chain. This is the third case, and the one where inventing an answer would
// be indistinguishable from working. What an outage does to addresses and sends
// is custody's half, and lives with the custodians.
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

	if _, err := c.Balance("0x1111111111111111111111111111111111111111", "LUX"); !errors.Is(err, errChainDown) {
		t.Errorf("Balance() err = %v, want errChainDown — a zero balance reads as an empty account", err)
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
