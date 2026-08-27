package bank

import (
	"errors"
	"fmt"
	"strings"
	"testing"

	"github.com/luxfi/crypto"
)

// -----------------------------------------------------------------------------
// A revert arrives as four bytes. Which four decides whether the bank reports
// "Undercollateralized" — the LTV ceiling refusing a borrow, which the user is
// entitled to be told — or shrugs and passes an opaque RPC error up. The
// selectors are hand-copied constants, so nothing but this file stops them
// drifting from the contract that emits them.
// -----------------------------------------------------------------------------

// protocolSignatures is the Solidity that produces each selector, transcribed
// from luxfi/liquid: Undercollateralized and UnauthorizedAccountAccessError from
// src/interfaces/ILiquid.sol, the four bare ones from src/base/Errors.sol,
// ERC20CallFailed from src/libraries/TokenUtils.sol.
//
// Two are worth stating explicitly because a plausible guess is wrong for both.
// BurnLimitExceeded takes (amount, available) — the no-argument spelling hashes
// to something else entirely. And the error is named UnauthorizedAccountAccess
// *Error*, so the map's value is the name with that suffix dropped.
//
// Errors.sol also declares string-carrying twins — IllegalArgument(string) and
// friends, from src/base/ErrorMessages.sol — which hash differently and are
// absent here on purpose: no contract in src/ reverts with one. _checkArgument
// and _checkState, which is how Liquid.sol raises every such refusal, throw the
// bare form.
var protocolSignatures = map[string]string{
	"0xfddafdf5": "Undercollateralized()",
	"0x9a124c80": "IllegalArgument()",
	"0x4a613c41": "IllegalState()",
	"0x82b42900": "Unauthorized()",
	"0x72812ba5": "CannotRepayOnMintBlock()",
	"0xd42c86b6": "BurnLimitExceeded(uint256,uint256)",
	"0xe7e40b5b": "ERC20CallFailed(address,bool,bytes)",
	"0x60ab04f6": "UnauthorizedAccountAccessError()",
}

// TestProtocolSelectorsMatchTheContract recomputes every selector from the
// signature it claims to be, so the table cannot drift from the Solidity
// without this failing. It checks both directions: an entry the bank decodes
// must have a signature written down here, and one written down here must still
// be decoded.
func TestProtocolSelectorsMatchTheContract(t *testing.T) {
	for selector, name := range liquidErrors {
		sig, known := protocolSignatures[selector]
		if !known {
			t.Errorf("%s (%s) has no signature recorded — add it, and verify it against luxfi/liquid", selector, name)
			continue
		}
		want := fmt.Sprintf("0x%x", crypto.Keccak256([]byte(sig))[:4])
		if selector != want {
			t.Errorf("%s is not the selector of %s; keccak256 says %s", selector, sig, want)
		}
		if !strings.HasPrefix(sig, name) {
			t.Errorf("selector %s decodes to %q but its signature is %q", selector, name, sig)
		}
	}
	for selector, sig := range protocolSignatures {
		if _, decoded := liquidErrors[selector]; !decoded {
			t.Errorf("%s (%s) is no longer decoded — a revert with it would reach the user as an opaque RPC error", selector, sig)
		}
	}
}

// dataErr is what an RPC client hands back for a reverted call: an error
// carrying the return data of the revert.
type dataErr struct{ data any }

func (dataErr) Error() string    { return "execution reverted" }
func (e dataErr) ErrorData() any { return e.data }

func TestRevertReasonNamesTheProtocolRefusal(t *testing.T) {
	// The one that matters: a borrow over the LTV ceiling, refused on chain.
	// The revert carries only the selector.
	if got := revertReason(dataErr{"0xfddafdf5"}); got == nil || got.Error() != "Undercollateralized" {
		t.Fatalf("a borrow refused by the LTV ceiling read as %v, not Undercollateralized", got)
	}
	// A revert with arguments carries them after the selector, and the
	// selector is still the first four bytes.
	withArgs := "0xd42c86b6" + strings.Repeat("0", 128)
	if got := revertReason(dataErr{withArgs}); got == nil || got.Error() != "BurnLimitExceeded" {
		t.Errorf("an error carrying arguments read as %v, not BurnLimitExceeded", got)
	}
	// Nothing says an RPC has to hand back lowercase hex.
	if got := revertReason(dataErr{"0xFDDAFDF5"}); got == nil || got.Error() != "Undercollateralized" {
		t.Errorf("uppercase hex read as %v, not Undercollateralized", got)
	}
}

// TestRevertReasonKeepsWhatItCannotDecode is the other half, and the more
// important one: every shape it does not understand has to arrive unchanged,
// because replacing an error it cannot read with a guess would be worse than
// saying nothing.
func TestRevertReasonKeepsWhatItCannotDecode(t *testing.T) {
	if got := revertReason(nil); got != nil {
		t.Errorf("no error became %v", got)
	}
	plain := errors.New("connection refused")
	for name, err := range map[string]error{
		"an error carrying no revert data": plain,
		"revert data that is not hex":      dataErr{12345},
		"a selector too short to read":     dataErr{"0xfdda"},
		"a selector nothing declares":      dataErr{"0xdeadbeef"},
	} {
		got := revertReason(err)
		if got == nil {
			t.Errorf("%s: became nil, so a failed call would read as success", name)
			continue
		}
		if !errors.Is(got, err) {
			t.Errorf("%s: was replaced by %q instead of being passed through", name, got)
		}
	}
}
