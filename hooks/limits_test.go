package hooks

import (
	"testing"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

func limitApp(t *testing.T) *tests.TestApp {
	t.Helper()
	app, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("new test app: %v", err)
	}
	t.Cleanup(app.Cleanup)
	// The daemon's own order: transactions relate to accounts and beneficiaries,
	// so those have to exist before it can be created.
	for _, ensure := range []func(core.App) error{
		collections.EnsureAccountCollection,
		collections.EnsureBalanceCollection,
		collections.EnsureBeneficiaryCollection,
		collections.EnsureTransactionCollection,
	} {
		if err := ensure(app); err != nil {
			t.Fatalf("ensure: %v", err)
		}
	}
	return app
}

func account(t *testing.T, app core.App) string {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("owner", "owner-1")
	r.Set("entityName", "Acme")
	r.Set("entityType", "individual")
	r.Set("country", "US")
	r.Set("currency", "USD")
	r.Set("status", "active")
	r.Set("kycStatus", "approved")
	if err := app.Save(r); err != nil {
		t.Fatalf("save account: %v", err)
	}
	return r.Id
}

// tx writes a transaction directly, bypassing the hooks, so these tests measure
// the accumulation and nothing else.
func tx(t *testing.T, app core.App, accountID, dir, status, cur string, amount float64, created time.Time) {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", accountID)
	r.Set("direction", dir)
	r.Set("status", status)
	r.Set("currency", cur)
	r.Set("amount", amount)
	r.Set("type", "payment")
	if err := app.Save(r); err != nil {
		t.Fatalf("save tx: %v", err)
	}
	if !created.IsZero() {
		// created is an autodate; set it raw so a dated row can be placed.
		r.SetRaw("created", created.UTC().Format("2006-01-02 15:04:05.000Z"))
		if err := app.Save(r); err != nil {
			t.Fatalf("redate tx: %v", err)
		}
	}
}

// The sum exists to make a crypto send and a fiat payment comparable: they are
// both minor units, but of different sizes and different values, and a limit
// denominated in USD cannot be enforced against their raw addition.
func TestSpendIsSummedInUSDAcrossCurrencies(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)

	tx(t, app, id, "debit", "completed", "USD", 10_000, time.Time{}) // $100.00
	tx(t, app, id, "debit", "completed", "BTC", 1_000_000, time.Time{})
	// 1 BTC at 6dp = 1_000_000 minor = $64,000 = 6_400_000 cents.

	got, err := getDailySpent(app, id)
	if err != nil {
		t.Fatalf("reading the daily total: %v", err)
	}
	want := int64(10_000 + 6_400_000)
	if got != want {
		t.Fatalf("daily spent = %d cents, want %d — raw minor units were added as if "+
			"they shared a unit", got, want)
	}
}

// Only debits that could still settle count against a limit. A credit is money
// arriving; a failed or cancelled debit never left.
func TestOnlyLiveDebitsCountAgainstTheLimit(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)

	tx(t, app, id, "debit", "completed", "USD", 5_000, time.Time{}) // counts
	tx(t, app, id, "debit", "pending", "USD", 3_000, time.Time{})   // counts: may still settle
	tx(t, app, id, "credit", "completed", "USD", 90_000, time.Time{})
	tx(t, app, id, "debit", "failed", "USD", 70_000, time.Time{})
	tx(t, app, id, "debit", "cancelled", "USD", 80_000, time.Time{})

	got, err := getDailySpent(app, id)
	if err != nil {
		t.Fatalf("reading the daily total: %v", err)
	}
	if want := int64(8_000); got != want {
		t.Fatalf("daily spent = %d, want %d", got, want)
	}
}

// One account's spending is not another's.
func TestSpendIsPerAccount(t *testing.T) {
	app := limitApp(t)
	mine := account(t, app)

	col, _ := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	other := core.NewRecord(col)
	other.Set("owner", "owner-2")
	other.Set("entityName", "Other")
	other.Set("entityType", "individual")
	other.Set("country", "US")
	other.Set("currency", "USD")
	other.Set("status", "active")
	other.Set("kycStatus", "approved")
	if err := app.Save(other); err != nil {
		t.Fatal(err)
	}

	tx(t, app, mine, "debit", "completed", "USD", 1_000, time.Time{})
	tx(t, app, other.Id, "debit", "completed", "USD", 99_000, time.Time{})

	got, err := getDailySpent(app, mine)
	if err != nil {
		t.Fatalf("reading the daily total: %v", err)
	}
	if got != 1_000 {
		t.Fatalf("daily spent = %d, want 1000 — another account's debits leaked in", got)
	}
}

// The monthly window reaches back 30 days and no further.
func TestMonthlyWindowExcludesWhatFellOutOfIt(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)

	now := time.Now().UTC()
	tx(t, app, id, "debit", "completed", "USD", 1_000, now.AddDate(0, 0, -5))
	tx(t, app, id, "debit", "completed", "USD", 2_000, now.AddDate(0, 0, -29))
	tx(t, app, id, "debit", "completed", "USD", 90_000, now.AddDate(0, 0, -45)) // outside

	got, err := getMonthlySpent(app, id)
	if err != nil {
		t.Fatalf("reading the monthly total: %v", err)
	}
	if got != 3_000 {
		t.Fatalf("monthly spent = %d, want 3000 — the window is not 30 days", got)
	}
}

// An account that has spent nothing has spent nothing — not an error, not a
// non-zero floor.
func TestNoTransactionsIsZeroSpent(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)
	daily, err := getDailySpent(app, id)
	if err != nil {
		t.Fatalf("reading the daily total: %v", err)
	}
	if got := daily; got != 0 {
		t.Fatalf("daily = %d, want 0", got)
	}
	monthly, err := getMonthlySpent(app, id)
	if err != nil {
		t.Fatalf("reading the monthly total: %v", err)
	}
	if got := monthly; got != 0 {
		t.Fatalf("monthly = %d, want 0", got)
	}
}
