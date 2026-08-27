package hooks

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// debit puts one outbound transaction through the hooks and reports whether the
// limit gate admitted it.
func debit(t *testing.T, app core.App, acct string, usdCents int64) error {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", acct)
	r.Set("type", "payment")
	r.Set("direction", "debit")
	r.Set("amount", usdCents)
	r.Set("currency", "USD")
	r.Set("status", "pending")
	return app.Save(r)
}

// onPlan returns an account holding the named membership ("" for none).
func onPlan(t *testing.T, app core.App, plan string) string {
	t.Helper()
	id := account(t, app)
	if plan == "" {
		return id
	}
	r, err := app.FindRecordById(collections.AccountCollectionName, id)
	if err != nil {
		t.Fatal(err)
	}
	r.Set("plan", plan)
	if err := app.Save(r); err != nil {
		t.Fatalf("putting the account on %s: %v", plan, err)
	}
	return id
}

// Buying the cheapest membership must not take away what an account already
// had. The tier replaced the entity-type limits outright rather than raising
// them, so the entry tier cut an individual from $50,000 a day to $10,000 —
// a customer who paid $29 could move a fifth of what they could move for
// nothing, and the ladder is on the landing page waiting to be sold.
func TestAMembershipNeverLowersWhatAnAccountMayMove(t *testing.T) {
	// $20,000: above the entry tier's daily limit, below an individual's.
	const amount int64 = 20_000_00

	app := limitApp(t)
	RegisterAccountHooks(app)
	if err := debit(t, app, onPlan(t, app, ""), amount); err != nil {
		t.Fatalf("an account with no membership was refused $20,000: %v", err)
	}

	for _, plan := range []string{"silver", "gold", "black", "sovereign"} {
		app := limitApp(t)
		RegisterAccountHooks(app)
		if err := debit(t, app, onPlan(t, app, plan), amount); err != nil {
			t.Errorf("%s costs money and allows less than holding no membership at all: %v", plan, err)
		}
	}
}

// The raise still happens — a tier above the baseline lifts it. Sovereign is
// $1M a day against an individual's $50,000, so an amount between the two
// separates a working ladder from one that is merely harmless.
func TestAMembershipAboveTheBaselineRaisesIt(t *testing.T) {
	const amount int64 = 200_000_00 // above individual's $50k, below black's $250k

	app := limitApp(t)
	RegisterAccountHooks(app)
	if err := debit(t, app, onPlan(t, app, ""), amount); err == nil {
		t.Error("an account with no membership moved $200,000, over the $50,000 individual limit")
	}

	for _, plan := range []string{"black", "sovereign"} {
		app := limitApp(t)
		RegisterAccountHooks(app)
		if err := debit(t, app, onPlan(t, app, plan), amount); err != nil {
			t.Errorf("%s is meant to carry $200,000 and refused it: %v", plan, err)
		}
	}
}

// Every rung of the advertised ladder is one an account can actually be put on.
// The field is a select over the plan ids, so a tier added to the catalog and
// not to the field is a membership nobody can hold — and the limit gate would
// read it as no membership at all.
func TestEveryAdvertisedTierIsOneAnAccountCanHold(t *testing.T) {
	app := limitApp(t)
	for _, p := range collections.Plans {
		if _, ok := collections.PlanByID(p.ID); !ok {
			t.Errorf("%q is advertised but PlanByID does not know it", p.ID)
		}
		if err := debit(t, app, onPlan(t, app, p.ID), 1_00); err != nil {
			t.Errorf("an account cannot be put on the advertised tier %q: %v", p.ID, err)
		}
	}
}
