package hooks

import (
	"log/slog"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// RegisterWalletHooks attaches hooks for wallet lifecycle.
func RegisterWalletHooks(app core.App) {
	// Default status on create + ensure balance record exists.
	app.OnRecordCreateExecute(collections.WalletCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		if e.Record.GetString("status") == "" {
			e.Record.Set("status", "active")
		}

		// Create balance record if it doesn't exist for this account+currency.
		accountId := e.Record.GetString("account")
		currency := e.Record.GetString("currency")

		existing, _ := app.FindFirstRecordByFilter(
			collections.BalanceCollectionName,
			`account = {:accountId} && currency = {:currency}`,
			map[string]any{"accountId": accountId, "currency": currency},
		)
		if existing == nil {
			balCol, err := app.FindCollectionByNameOrId(collections.BalanceCollectionName)
			if err == nil {
				bal := core.NewRecord(balCol)
				bal.Set("account", accountId)
				bal.Set("currency", currency)
				bal.Set("available", 0)
				bal.Set("held", 0)
				_ = app.Save(bal)
			}
		}

		return nil
	})

	// Audit on status change.
	app.OnRecordUpdateExecute(collections.WalletCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus != newStatus && (newStatus == "suspended" || newStatus == "closed") {
			writeAudit(app, e.Record.GetString("account"), "system", "wallet_"+newStatus, map[string]any{
				"walletId": e.Record.Id,
				"currency": e.Record.GetString("currency"),
			})
			app.Logger().Info("wallet status changed",
				slog.String("walletId", e.Record.Id),
				slog.String("from", oldStatus),
				slog.String("to", newStatus),
			)
		}

		return nil
	})
}
