package hooks

import (
	"log/slog"
	"time"

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

// stalePendingAfter is how long a transaction may sit pending before it is
// treated as timed out.
const stalePendingAfter = 24 * time.Hour

// expireStaleTransactions marks transactions that have been pending longer than
// stalePendingAfter as failed, with the reason recorded on the row.
func expireStaleTransactions(app core.App) {
	// The instant is computed HERE and bound as a value. It was written as
	// `created < @staleThreshold` with the parameter holding the string
	// "@now -24h", and a parameter binds a value rather than a filter
	// expression — so the comparison was against that literal text, matched
	// nothing, and this job ran every hour and expired nothing. Pending
	// transactions accumulated for as long as the deployment had been up.
	//
	// Same shape getMonthlySpent already uses for its own window.
	cutoff := time.Now().UTC().Add(-stalePendingAfter).Format("2006-01-02 15:04:05.000Z")
	records, err := app.FindRecordsByFilter(
		collections.TransactionCollectionName,
		`status = "pending" && created < {:cutoff}`,
		"",
		0,
		0,
		map[string]any{"cutoff": cutoff},
	)
	if err != nil {
		app.Logger().Error("cron: failed to query stale transactions",
			slog.String("error", err.Error()),
		)
		return
	}

	var expired int
	var unresolved []string
	for _, r := range records {
		// A movement the ledger handed to a chain is not one the ledger may
		// decide the outcome of. Failing a debit returns the funds it held, so
		// a send that reached the chain and then lost its follow-up write —
		// the process restarting between the broadcast and the settle — would
		// be refunded to a customer who already holds the coins. The clock is
		// not evidence about somebody else's ledger; only the chain can say.
		//
		// A send that never reached the chain releases its own hold on the way
		// out, so what is left here has been broadcast or cannot be told apart
		// from one that was. Both are an operator's to reconcile.
		//
		// Nothing is lost in a simulation, where a send settles in the same
		// call and is never pending an hour later, let alone a day.
		var meta struct {
			Network string `json:"network"`
		}
		_ = r.UnmarshalJSONField("metadata", &meta)
		if meta.Network != "" {
			unresolved = append(unresolved, r.Id)
			continue
		}

		r.Set("status", "failed")
		r.Set("reason", "timed out: pending > 24h")

		if err := app.Save(r); err != nil {
			app.Logger().Error("cron: failed to expire transaction",
				slog.String("id", r.Id),
				slog.String("error", err.Error()),
			)
			continue
		}
		expired++
	}

	if expired > 0 {
		app.Logger().Info("cron: expired stale transactions", slog.Int("count", expired))
	}
	if len(unresolved) > 0 {
		app.Logger().Error("cron: pending on-chain movements need reconciling against the chain",
			slog.Int("count", len(unresolved)),
			slog.Any("ids", unresolved),
		)
	}
}
