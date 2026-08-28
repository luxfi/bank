package bank

import "testing"

// replaces decides whether a wallet row's recorded address is overwritten by
// what a custodian now answers, and getting it wrong costs a customer their
// coins in one direction or their access in the other.
//
// A deposit address is published. Once a customer has it, it is on an exchange's
// withdrawal whitelist and in somebody's address book, and coins keep arriving
// at it long after the row changed. So an address may only ever be replaced by
// one whose key is actually held: writing a simulated address over a real one
// sends the next deposit somewhere nobody can spend from.
//
// The whole test is the table. There are two facts — what is recorded, and who
// is answering — and every combination of them has a right answer.
func TestOnlyAKeyHolderReplacesAnAddress(t *testing.T) {
	const (
		real = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
		sim  = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
	)
	for _, tc := range []struct {
		name             string
		cu               Custodian
		recorded, answer string
		want             bool
	}{
		// Nothing to write is never a replacement, whoever is asking.
		{"bank answers with nothing", deriving{}, real, "", false},
		{"the simulation answers with nothing", simCustodian{}, real, "", false},
		{"nothing recorded and nothing answered", deriving{}, "", "", false},

		// The same address is not a change.
		{"bank answers what is already there", deriving{}, real, real, false},
		{"the simulation answers what is already there", simCustodian{}, sim, sim, false},

		// An address nobody has answered for yet may be filled by anything that
		// can answer — there is no deposit at an address that was never
		// published.
		{"bank fills an empty row", deriving{}, "", real, true},
		{"the simulation fills an empty row", simCustodian{}, "", sim, true},
		{"a custodian holding nothing fills an empty row", unheld{}, "", sim, true},

		// The case this exists for. A real chain arriving must recover an
		// account that was only ever simulated...
		{"bank replaces a simulated address", deriving{}, sim, real, true},

		// ...and the simulation must never undo it. This is the one that loses
		// coins: the next deposit goes to an address nobody holds a key for.
		{"the simulation must not replace a real address", simCustodian{}, real, sim, false},

		// A custodian that holds nothing cannot speak for an address at all.
		{"a custodian holding nothing replaces nothing", unheld{}, real, sim, false},

		// The customer's own address is held by the customer, so it carries the
		// same authority here as one the bank derived. This is the migration
		// that matters: a deployment that stops holding keys must be able to
		// point an account at the address its owner holds, or the bank goes on
		// showing the address it still has the key to.
		{"the customer replaces a simulated address", holder{}, sim, real, true},
		{"the customer replaces a bank-derived address", holder{}, real, sim, true},
	} {
		if got := replaces(tc.cu, tc.recorded, tc.answer); got != tc.want {
			t.Errorf("%s: replaces(%T, %q, %q) = %v, want %v",
				tc.name, tc.cu, tc.recorded, tc.answer, got, tc.want)
		}
	}
}
