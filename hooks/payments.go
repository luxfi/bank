package hooks

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// RegisterPaymentHooks attaches hooks for payment lifecycle:
//   - Validate balance and daily limits before transaction creation.
//   - Route outbound payments to the forex service.
//   - Handle status transitions on update.
func RegisterPaymentHooks(app core.App) {
	// Pre-create: validate balance + limits.
	app.OnRecordCreate(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		accountId := e.Record.GetString("account")
		if accountId == "" {
			return e.Next()
		}

		amount := int64(e.Record.GetFloat("amount"))
		currency := e.Record.GetString("currency")
		if amount <= 0 || currency == "" {
			return e.Next()
		}

		// Check available balance.
		balances, err := app.FindRecordsByFilter(
			collections.BalanceCollectionName,
			`account = {:accountId} && currency = {:currency}`,
			"", 1, 0,
			map[string]any{"accountId": accountId, "currency": currency},
		)
		if err != nil || len(balances) == 0 {
			return apis.NewBadRequestError("no balance found for currency", nil)
		}

		available := int64(balances[0].GetFloat("available"))
		if available < amount {
			return apis.NewBadRequestError("insufficient balance", nil)
		}

		// Check daily limit.
		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			return err
		}

		dailyLimit := int64(account.GetFloat("dailyLimit"))
		if dailyLimit > 0 {
			todayVolume := getDailyVolume(app, accountId)
			if todayVolume+amount > dailyLimit {
				return apis.NewForbiddenError("daily transaction limit exceeded", nil)
			}
		}

		return e.Next()
	})

	// Post-create: hold funds and route outbound payments.
	app.OnRecordCreateExecute(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		accountId := e.Record.GetString("account")
		amount := int64(e.Record.GetFloat("amount"))
		currency := e.Record.GetString("currency")

		// Hold funds.
		holdFunds(app, accountId, currency, amount)

		// Route outbound payments to forex service.
		txType := e.Record.GetString("type")
		if txType == "payment" || txType == "conversion" {
			go routeToForex(app, e.Record)
		}

		return nil
	})

	// On update: handle status transitions.
	app.OnRecordUpdate(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus == newStatus {
			return e.Next()
		}

		accountId := e.Record.GetString("account")
		amount := int64(e.Record.GetFloat("amount"))
		currency := e.Record.GetString("currency")

		switch newStatus {
		case "completed":
			// Release hold, debit balance.
			releaseHold(app, accountId, currency, amount)
			debitBalance(app, accountId, currency, amount)

		case "failed", "cancelled":
			// Release hold, restore available.
			releaseHold(app, accountId, currency, amount)
		}

		return e.Next()
	})
}

// holdFunds moves amount from available to held.
func holdFunds(app core.App, accountId, currency string, amount int64) {
	updateBalance(app, accountId, currency, -amount, amount)
}

// releaseHold moves amount from held back (does not restore available).
func releaseHold(app core.App, accountId, currency string, amount int64) {
	updateBalance(app, accountId, currency, 0, -amount)
}

// debitBalance removes amount from available (already held, so just remove held).
func debitBalance(app core.App, accountId, currency string, amount int64) {
	// Already debited from available during hold. Nothing to do.
	_ = amount
}

func updateBalance(app core.App, accountId, currency string, availableDelta, heldDelta int64) {
	balances, err := app.FindRecordsByFilter(
		collections.BalanceCollectionName,
		`account = {:accountId} && currency = {:currency}`,
		"", 1, 0,
		map[string]any{"accountId": accountId, "currency": currency},
	)
	if err != nil || len(balances) == 0 {
		app.Logger().Error("payments: balance not found",
			slog.String("accountId", accountId),
			slog.String("currency", currency),
		)
		return
	}

	b := balances[0]
	b.Set("available", int64(b.GetFloat("available"))+availableDelta)
	b.Set("held", int64(b.GetFloat("held"))+heldDelta)

	if err := app.Save(b); err != nil {
		app.Logger().Error("payments: failed to update balance",
			slog.String("error", err.Error()),
		)
	}
}

// routeToForex sends outbound payment details to the forex service.
func routeToForex(app core.App, record *core.Record) {
	forexURL := os.Getenv("FOREX_SERVICE_URL")
	if forexURL == "" {
		forexURL = "http://forex:8086"
	}

	payload := map[string]any{
		"transactionId": record.Id,
		"amount":        record.GetFloat("amount"),
		"currency":      record.GetString("currency"),
		"type":          record.GetString("type"),
		"beneficiary":   record.GetString("beneficiary"),
	}

	body, _ := json.Marshal(payload)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(forexURL+"/v1/execute", "application/json", bytes.NewReader(body))
	if err != nil {
		app.Logger().Error("payments: forex routing failed",
			slog.String("transactionId", record.Id),
			slog.String("error", err.Error()),
		)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		app.Logger().Error("payments: forex returned error",
			slog.String("transactionId", record.Id),
			slog.Int("status", resp.StatusCode),
		)
	}
}

// getDailyVolume sums today's transaction amounts for an account.
func getDailyVolume(app core.App, accountId string) int64 {
	records, err := app.FindRecordsByFilter(
		collections.TransactionCollectionName,
		`account = {:accountId} && created >= @todayStart`,
		"", 0, 0,
		map[string]any{
			"accountId":  accountId,
			"todayStart": "@now -24h",
		},
	)
	if err != nil {
		return 0
	}

	var total int64
	for _, r := range records {
		total += int64(r.GetFloat("amount"))
	}
	return total
}
