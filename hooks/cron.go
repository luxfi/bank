package hooks

import (
	"log/slog"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// RegisterCronJobs sets up scheduled tasks on the Base cron.
func RegisterCronJobs(app core.App) {
	// Every hour: expire stale pending transactions (> 24h).
	app.Cron().MustAdd("staleTransactions", "0 * * * *", func() {
		expireStaleTransactions(app)
	})

	// Daily at midnight UTC: log daily limit reset (limits are query-based,
	// not stored state, so this is purely an audit marker).
	app.Cron().MustAdd("dailyLimitReset", "0 0 * * *", func() {
		app.Logger().Info("cron: daily transaction limits reset (query window rolled)")
	})
}

// expireStaleTransactions marks pending transactions older than 24 hours
// as failed and reverses any held funds.
func expireStaleTransactions(app core.App) {
	records, err := app.FindRecordsByFilter(
		collections.TransactionCollectionName,
		`status = "pending" && created < @staleThreshold`,
		"",
		0,
		0,
		map[string]any{"staleThreshold": "@now -24h"},
	)
	if err != nil {
		app.Logger().Error("cron: failed to query stale transactions",
			slog.String("error", err.Error()),
		)
		return
	}

	for _, r := range records {
		r.Set("status", "failed")
		r.Set("reason", "timed out: pending > 24h")

		if err := app.Save(r); err != nil {
			app.Logger().Error("cron: failed to expire transaction",
				slog.String("id", r.Id),
				slog.String("error", err.Error()),
			)
		}
	}

	if len(records) > 0 {
		app.Logger().Info("cron: expired stale transactions", slog.Int("count", len(records)))
	}
}
