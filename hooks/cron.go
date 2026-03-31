package hooks

import (
	"log/slog"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// RegisterCronHooks sets up scheduled tasks on the Base app.
func RegisterCronHooks(app core.App) {
	app.Cron().MustAdd("stale_transactions", "0 * * * *", func() {
		cleanStaleTransactions(app)
	})
}

// cleanStaleTransactions marks pending transactions older than 24h as failed.
func cleanStaleTransactions(app core.App) {
	records, err := app.FindRecordsByFilter(
		collections.TransactionCollectionName,
		`status = "pending" && created < @staleThreshold`,
		"", 0, 0,
		map[string]any{
			"staleThreshold": "@now -24h",
		},
	)
	if err != nil {
		app.Logger().Error("cron: failed to query stale transactions",
			slog.String("error", err.Error()),
		)
		return
	}

	for _, r := range records {
		r.Set("status", "failed")
		r.Set("reason", "timed out — pending > 24h")
		if err := app.Save(r); err != nil {
			app.Logger().Error("cron: failed to expire transaction",
				slog.String("id", r.Id),
				slog.String("error", err.Error()),
			)
		}
	}

	if len(records) > 0 {
		app.Logger().Info("cron: expired stale transactions",
			slog.Int("count", len(records)),
		)
	}
}
