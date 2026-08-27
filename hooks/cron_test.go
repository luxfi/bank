package hooks

import (
	"testing"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// staleTx writes a transaction with an explicit created stamp.
func staleTx(t *testing.T, app core.App, accountID, status string, age time.Duration) string {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", accountID)
	r.Set("direction", "debit")
	r.Set("status", status)
	r.Set("currency", "USD")
	r.Set("amount", 1000)
	r.Set("type", "payment")
	if err := app.Save(r); err != nil {
		t.Fatalf("save tx: %v", err)
	}
	r.SetRaw("created", time.Now().UTC().Add(-age).Format("2006-01-02 15:04:05.000Z"))
	if err := app.Save(r); err != nil {
		t.Fatalf("redate tx: %v", err)
	}
	return r.Id
}

func statusOf(t *testing.T, app core.App, id string) string {
	t.Helper()
	r, err := app.FindRecordById(collections.TransactionCollectionName, id)
	if err != nil {
		t.Fatalf("find %s: %v", id, err)
	}
	return r.GetString("status")
}

// The cron fails what has been pending too long, and NOTHING else. Both halves
// matter: a payment left pending forever is money nobody can account for, and a
// payment failed while it is still in flight is money taken from a customer for
// a movement that may yet settle.
func TestStaleTransactionsExpireAndFreshOnesDoNot(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)

	old := staleTx(t, app, id, "pending", 48*time.Hour)
	justOver := staleTx(t, app, id, "pending", 25*time.Hour)
	fresh := staleTx(t, app, id, "pending", 1*time.Hour)
	justUnder := staleTx(t, app, id, "pending", 23*time.Hour)
	// Already settled, and old. Age is not the only condition.
	done := staleTx(t, app, id, "completed", 72*time.Hour)

	expireStaleTransactions(app)

	for _, tc := range []struct{ id, want, why string }{
		{old, "failed", "48h pending"},
		{justOver, "failed", "25h pending — just over the line"},
		{fresh, "pending", "1h old, still in flight"},
		{justUnder, "pending", "23h old — just under the line"},
		{done, "completed", "already settled; age alone must not touch it"},
	} {
		if got := statusOf(t, app, tc.id); got != tc.want {
			t.Errorf("%s: status = %q, want %q", tc.why, got, tc.want)
		}
	}
}

// An expired transaction says why. A failure with no reason is one nobody can
// answer a customer about.
func TestAnExpiredTransactionCarriesItsReason(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)
	old := staleTx(t, app, id, "pending", 48*time.Hour)

	expireStaleTransactions(app)

	r, err := app.FindRecordById(collections.TransactionCollectionName, old)
	if err != nil {
		t.Fatal(err)
	}
	if got := r.GetString("reason"); got == "" {
		t.Fatal("an expired transaction carries no reason")
	}
}

// Running it twice changes nothing the second time: what is already failed stays
// failed, and nothing else moves.
func TestExpiryIsIdempotent(t *testing.T) {
	app := limitApp(t)
	id := account(t, app)
	old := staleTx(t, app, id, "pending", 48*time.Hour)
	fresh := staleTx(t, app, id, "pending", 1*time.Hour)

	expireStaleTransactions(app)
	expireStaleTransactions(app)

	if got := statusOf(t, app, old); got != "failed" {
		t.Fatalf("old = %q, want failed", got)
	}
	if got := statusOf(t, app, fresh); got != "pending" {
		t.Fatalf("fresh = %q, want pending", got)
	}
}
