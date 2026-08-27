package hooks

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// Webhooks arrive out of order. A transaction that has reached a terminal
// state has nowhere left to go, so a late delivery reporting an earlier step is
// a status it cannot take — and that is not something the sender can fix.
// Refusing the save answers 500, which a provider reads as "try again", so one
// late delivery becomes a retry every few minutes for as long as the
// transaction exists.
func TestAStatusATransactionCannotTakeIsNotAnError(t *testing.T) {
	app := limitApp(t)
	acct := account(t, app)
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", acct)
	r.Set("type", "payment")
	r.Set("direction", "debit")
	r.Set("amount", 1000)
	r.Set("currency", "USD")
	r.Set("status", "completed")
	if err := app.Save(r); err != nil {
		t.Fatalf("save: %v", err)
	}

	for _, to := range []string{"processing", "pending", "failed", "cancelled"} {
		if movesTo(r, to) {
			t.Errorf("a completed transaction reports it can move to %q", to)
		}
	}

	// The same status twice is one fact delivered twice, not a move — a
	// provider redelivering is ordinary and must not be treated as a conflict.
	if !movesTo(r, "completed") {
		t.Error("a repeated delivery of the status a transaction already holds reads as a move it cannot make")
	}
}

// And the moves a transaction can make are still moves.
func TestTheMovesATransactionCanMakeAreAllowed(t *testing.T) {
	app := limitApp(t)
	acct := account(t, app)
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	for from, tos := range map[string][]string{
		"pending":    {"processing", "completed", "failed", "cancelled"},
		"processing": {"completed", "failed", "cancelled"},
	} {
		r := core.NewRecord(col)
		r.Set("account", acct)
		r.Set("type", "payment")
		r.Set("direction", "debit")
		r.Set("amount", 1000)
		r.Set("currency", "USD")
		r.Set("status", from)
		if err := app.Save(r); err != nil {
			t.Fatalf("save %s: %v", from, err)
		}
		for _, to := range tos {
			if !movesTo(r, to) {
				t.Errorf("%s -> %s is a move a payment makes and it was refused", from, to)
			}
		}
	}
}
