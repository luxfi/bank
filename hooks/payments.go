package hooks

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log/slog"
	"math"
	"net/http"
	"os"
	"time"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/hook"
	"github.com/luxfi/bank/collections"
)

// Allowed status transitions. Any transition not listed is rejected.
var allowedTransitions = map[string][]string{
	"pending":    {"processing", "failed", "cancelled"},
	"processing": {"completed", "failed", "cancelled"},
}

func validTransition(from, to string) bool {
	for _, s := range allowedTransitions[from] {
		if s == to {
			return true
		}
	}
	return false
}

// RegisterPaymentHooks attaches hooks for payment lifecycle:
//   - Validate balance before debit transaction creation
//   - Enforce status transition rules on update
//   - Hold funds on create, settle/reverse on status change
//   - Route outbound payments to forex service
//   - Webhook endpoint for payment callbacks
func RegisterPaymentHooks(app core.App) {
	// Pre-create: validate balance for debits.
	app.OnRecordCreate(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if e.Record.GetString("direction") != "debit" {
			return e.Next()
		}

		amount := int64(math.Round(e.Record.GetFloat("amount")))
		if amount <= 0 {
			return apis.NewBadRequestError("amount must be positive", nil)
		}

		accountId := e.Record.GetString("account")
		currency := e.Record.GetString("currency")

		// Atomic balance check + hold within a transaction to prevent races.
		err := app.RunInTransaction(func(txApp core.App) error {
			bal, err := txApp.FindFirstRecordByFilter(
				collections.BalanceCollectionName,
				`account = {:accountId} && currency = {:currency}`,
				map[string]any{"accountId": accountId, "currency": currency},
			)
			if err != nil {
				return apis.NewBadRequestError("no balance found for currency", nil)
			}

			available := int64(math.Round(bal.GetFloat("available")))
			if available < amount {
				return apis.NewBadRequestError("insufficient balance", nil)
			}

			// Floor check: ensure available would not go negative.
			if available-amount < 0 {
				return apis.NewBadRequestError("insufficient balance", nil)
			}

			// Hold funds atomically: available -= amount, held += amount.
			held := int64(math.Round(bal.GetFloat("held")))
			bal.Set("available", available-amount)
			bal.Set("held", held+amount)
			return txApp.Save(bal)
		})
		if err != nil {
			return err
		}

		return e.Next()
	})

	// Post-create: route outbound payments to forex service.
	// (Balance hold is already done in pre-create transaction above.)
	app.OnRecordCreateExecute(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		if e.Record.GetString("direction") != "debit" {
			return nil
		}

		txType := e.Record.GetString("type")
		if txType == "payment" || txType == "conversion" {
			go routeToForex(app, e.Record)
		}

		return nil
	})

	// Pre-update: enforce status transition rules.
	app.OnRecordUpdate(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus != newStatus && !validTransition(oldStatus, newStatus) {
			return apis.NewBadRequestError(
				fmt.Sprintf("invalid status transition: %s -> %s", oldStatus, newStatus), nil,
			)
		}

		return e.Next()
	})

	// Post-update: settle balances on status change.
	app.OnRecordUpdateExecute(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")
		if oldStatus == newStatus {
			return nil
		}

		accountId := e.Record.GetString("account")
		currency := e.Record.GetString("currency")
		amount := int64(math.Round(e.Record.GetFloat("amount")))
		direction := e.Record.GetString("direction")

		switch {
		case newStatus == "completed" && direction == "debit":
			// Funds were already removed from available during hold.
			// Just release the hold counter.
			updateBalance(app, accountId, currency, 0, -amount)

		case newStatus == "completed" && direction == "credit":
			// Incoming funds: credit available.
			updateBalance(app, accountId, currency, amount, 0)

		case (newStatus == "failed" || newStatus == "cancelled") && direction == "debit":
			// Reverse hold: restore available, release held.
			updateBalance(app, accountId, currency, amount, -amount)
		}

		return nil
	})

	// Webhook endpoint for external payment service callbacks.
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Id: "bankPaymentCallbacks",
		Func: func(e *core.ServeEvent) error {
			e.Router.POST("/webhooks/payments/callback", handlePaymentCallback(app)).
				Bind(RequireHMACAuth())
			return e.Next()
		},
	})
}

// updateBalance atomically adjusts available and held amounts.
func updateBalance(app core.App, accountId, currency string, availableDelta, heldDelta int64) {
	bal, err := app.FindFirstRecordByFilter(
		collections.BalanceCollectionName,
		`account = {:accountId} && currency = {:currency}`,
		map[string]any{"accountId": accountId, "currency": currency},
	)
	if err != nil {
		// For credits to a new currency, create the balance record.
		if availableDelta > 0 && heldDelta == 0 {
			createBalance(app, accountId, currency, availableDelta)
		} else {
			app.Logger().Error("payments: balance not found",
				slog.String("accountId", accountId),
				slog.String("currency", currency),
			)
		}
		return
	}

	newAvailable := int64(math.Round(bal.GetFloat("available"))) + availableDelta
	newHeld := int64(math.Round(bal.GetFloat("held"))) + heldDelta

	// F13: Floor check — never allow negative available balance.
	if newAvailable < 0 {
		app.Logger().Error("payments: balance floor violation — available would go negative",
			slog.String("accountId", accountId),
			slog.String("currency", currency),
			slog.Int64("newAvailable", newAvailable),
		)
		return
	}

	bal.Set("available", newAvailable)
	bal.Set("held", newHeld)

	if err := app.Save(bal); err != nil {
		app.Logger().Error("payments: failed to update balance", slog.String("error", err.Error()))
	}
}

func createBalance(app core.App, accountId, currency string, amount int64) {
	col, err := app.FindCollectionByNameOrId(collections.BalanceCollectionName)
	if err != nil {
		return
	}
	bal := core.NewRecord(col)
	bal.Set("account", accountId)
	bal.Set("currency", currency)
	bal.Set("available", amount)
	bal.Set("held", 0)
	_ = app.Save(bal)
}

// routeToForex sends outbound payment details to the forex service.
func routeToForex(app core.App, record *core.Record) {
	forexURL := os.Getenv("FOREX_SERVICE_URL")
	if forexURL == "" {
		app.Logger().Warn("payments: FOREX_SERVICE_URL not set, skipping outbound routing")
		return
	}

	payload := map[string]any{
		"transactionId": record.Id,
		"amount":        record.GetFloat("amount"),
		"currency":      record.GetString("currency"),
		"type":          record.GetString("type"),
		"beneficiary":   record.GetString("beneficiary"),
		"reference":     record.GetString("reference"),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		app.Logger().Error("payments: marshal failed", slog.String("error", err.Error()))
		return
	}

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(forexURL+"/v1/payments", "application/json", bytes.NewReader(body))
	if err != nil {
		app.Logger().Error("payments: forex request failed",
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

// paymentCallbackPayload is the expected shape from the forex/payment service.
type paymentCallbackPayload struct {
	TransactionID string `json:"transactionId"`
	Status        string `json:"status"` // completed, failed, processing
	Reason        string `json:"reason"`
}

func handlePaymentCallback(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var p paymentCallbackPayload
		if err := e.BindBody(&p); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}
		if p.TransactionID == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing transactionId"})
		}

		record, err := app.FindRecordById(collections.TransactionCollectionName, p.TransactionID)
		if err != nil {
			// Return 200 so the caller does not retry unknown transactions.
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}

		newStatus := mapCallbackStatus(p.Status)
		oldStatus := record.GetString("status")

		if !validTransition(oldStatus, newStatus) {
			app.Logger().Warn("payments: callback transition rejected",
				slog.String("transactionId", p.TransactionID),
				slog.String("from", oldStatus),
				slog.String("to", newStatus),
			)
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}

		record.Set("status", newStatus)
		if p.Reason != "" {
			record.Set("reason", p.Reason)
		}

		if err := app.Save(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": "update failed"})
		}

		return e.JSON(http.StatusOK, map[string]string{"status": "ok"})
	}
}

func mapCallbackStatus(s string) string {
	switch s {
	case "completed", "settled":
		return "completed"
	case "failed", "rejected":
		return "failed"
	case "processing", "in_progress":
		return "processing"
	default:
		return "pending"
	}
}
