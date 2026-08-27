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
		// Before the write, because e.Next() IS the write: setting a field
		// after it amends the instance in hand and nothing else, so the caller
		// read "active" and the row kept the empty string it was created with.
		// Every other reader saw a wallet with no status at all.
		if e.Record.GetString("status") == "" {
			e.Record.Set("status", "active")
		}

		if err := e.Next(); err != nil {
			return err
		}

		// Create balance record if it doesn't exist for this account+currency.
		accountId := e.Record.GetString("account")
		currency := e.Record.GetString("currency")

		existing, _ := app.FindFirstRecordByFilter(
			collections.BalanceCollectionName,
			`account = {:accountId} && currency = {:currency}`,
			map[string]any{"accountId": accountId, "currency": currency},
		)
		if existing != nil {
			return nil
		}
		balCol, err := app.FindCollectionByNameOrId(collections.BalanceCollectionName)
		if err != nil {
			app.Logger().Error("wallets: balance collection not found", slog.String("error", err.Error()))
			return nil
		}
		bal := core.NewRecord(balCol)
		bal.Set("account", accountId)
		bal.Set("currency", currency)
		bal.Set("available", 0)
		bal.Set("held", 0)
		if err := app.Save(bal); err != nil {
			// The wallet exists either way — the first credit opens the balance
			// if this did not. Saying so is what makes that recoverable rather
			// than a surprise.
			app.Logger().Error("wallets: could not open the balance for a new wallet",
				slog.String("accountId", accountId),
				slog.String("currency", currency),
				slog.String("error", err.Error()),
			)
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
