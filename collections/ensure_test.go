package collections

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
)

// every collection this package defines, with the name it must answer to.
var ensures = []struct {
	name   string
	ensure func(core.App) error
	coll   string
}{
	{"account", EnsureAccountCollection, AccountCollectionName},
	{"balance", EnsureBalanceCollection, BalanceCollectionName},
	{"beneficiary", EnsureBeneficiaryCollection, BeneficiaryCollectionName},
	{"transaction", EnsureTransactionCollection, TransactionCollectionName},
	{"fee", EnsureFeeCollection, FeeCollectionName},
	{"card", EnsureCardCollection, CardCollectionName},
	{"wallet", EnsureWalletCollection, WalletCollectionName},
	{"conversion", EnsureConversionCollection, ConversionCollectionName},
	{"audit", EnsureAuditCollection, AuditCollectionName},
	{"session", EnsureSessionCollection, SessionCollectionName},
	{"credential", EnsureCredentialCollection, CredentialCollectionName},
	{"document", EnsureDocumentCollection, DocumentCollectionName},
	{"position", EnsurePositionCollection, PositionCollectionName},
}

func newApp(t *testing.T) *tests.TestApp {
	t.Helper()
	app, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("new test app: %v", err)
	}
	t.Cleanup(app.Cleanup)
	return app
}

// Every Ensure runs on EVERY boot, against a database that may already hold the
// collection from a previous version, so each has to do two jobs: create it when
// absent, and change nothing when it is already there. A second call that errors
// takes the daemon down on restart; one that duplicates a field or an index
// corrupts the schema it exists to migrate.
//
// They are run in ORDER and in one app because that is how the daemon runs them
// and because they depend on each other: nearly every collection holds a
// relation to accounts, and creating it first is not optional — out of order,
// the relation field has no collection to point at and the rule referencing
// account.owner will not compile.
func TestEnsureCreatesThenIsIdempotent(t *testing.T) {
	app := newApp(t)

	for _, e := range ensures {
		if _, err := app.FindCollectionByNameOrId(e.coll); err == nil {
			t.Fatalf("%s exists before its Ensure ran", e.coll)
		}
		if err := e.ensure(app); err != nil {
			t.Fatalf("%s: first Ensure: %v", e.name, err)
		}
	}

	type shape struct{ fields, indexes int }
	was := map[string]shape{}
	for _, e := range ensures {
		c, err := app.FindCollectionByNameOrId(e.coll)
		if err != nil {
			t.Fatalf("%s absent after Ensure: %v", e.coll, err)
		}
		if len(c.Fields) == 0 {
			t.Fatalf("%s was created with no fields", e.coll)
		}
		was[e.coll] = shape{len(c.Fields), len(c.Indexes)}
	}

	// Two more boots against the schema that is already there.
	for boot := 2; boot <= 3; boot++ {
		for _, e := range ensures {
			if err := e.ensure(app); err != nil {
				t.Fatalf("%s: boot %d: %v", e.name, boot, err)
			}
		}
	}

	for _, e := range ensures {
		c, err := app.FindCollectionByNameOrId(e.coll)
		if err != nil {
			t.Fatalf("%s vanished across restarts: %v", e.coll, err)
		}
		if got, want := len(c.Fields), was[e.coll].fields; got != want {
			t.Errorf("%s field count moved %d -> %d across restarts", e.coll, want, got)
		}
		if got, want := len(c.Indexes), was[e.coll].indexes; got != want {
			t.Errorf("%s index count moved %d -> %d across restarts", e.coll, want, got)
		}
	}
}

// The account collection carries the one field a customer's money hangs off:
// chainIndex is the derivation path their address and signing key come from, and
// the partial unique index is what stops two accounts reaching one key.
func TestAccountCollectionGuardsTheDerivationIndex(t *testing.T) {
	app := newApp(t)
	if err := EnsureAccountCollection(app); err != nil {
		t.Fatalf("EnsureAccountCollection: %v", err)
	}
	c, err := app.FindCollectionByNameOrId(AccountCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	f := c.Fields.GetByName("chainIndex")
	if f == nil {
		t.Fatal("accounts has no chainIndex field")
	}
	if !hasIndex(c.Indexes, chainIndexUnique()) {
		t.Fatalf("accounts is missing the partial unique index on chainIndex: %v", c.Indexes)
	}
	// Partial on purpose: unassigned accounts all hold 0, and a plain unique
	// index would let only one of them exist.
	if got := chainIndexUnique(); got == "" {
		t.Fatal("chainIndexUnique is empty")
	}
}

func TestHasIndex(t *testing.T) {
	idx := []string{"CREATE INDEX a ON t (x)", "CREATE UNIQUE INDEX b ON t (y)"}
	if !hasIndex(idx, "CREATE UNIQUE INDEX b ON t (y)") {
		t.Error("hasIndex missed an exact match")
	}
	if hasIndex(idx, "CREATE INDEX b ON t (y)") {
		t.Error("hasIndex matched a different statement")
	}
	if hasIndex(nil, "anything") {
		t.Error("hasIndex found something in nil")
	}
	if hasIndex(idx, "") {
		t.Error("hasIndex matched the empty string")
	}
}
