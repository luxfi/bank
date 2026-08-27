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
	// pending may reach any terminal state directly: an external webhook
	// (CurrencyCloud, IFX) authoritatively reports settlement without bankd
	// ever observing the intermediate "processing" step. The settlement hook
	// fires once on any transition into "completed", so a direct
	// pending -> completed releases the hold / credits exactly once.
	"pending":    {"processing", "completed", "failed", "cancelled"},
	"processing": {"completed", "failed", "cancelled"},
}

// movesTo reports whether a transaction can take the status a provider has
// reported. Repeating a status it already holds counts: a webhook delivered
// twice is the same fact twice, not a move.
func movesTo(r *core.Record, to string) bool {
	from := r.GetString("status")
	return from == to || validTransition(from, to)
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

		// The hold and the transaction it belongs to commit together or not at
		// all. Reading the balance and writing the hold in one transaction is
		// what keeps two concurrent debits from both passing the check — but
		// that transaction used to close before the rest of the create ran, so
		// a later refusal (a daily limit, a fee rule) left the money held
		// against a record that was never written, with nothing left pointing
		// at it to give it back. Carrying e.Next() inside means the same
		// refusal now unwinds the hold with it.
		original := e.App
		return e.App.RunInTransaction(func(txApp core.App) error {
			e.App = txApp
			defer func() { e.App = original }()

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

			held := int64(math.Round(bal.GetFloat("held")))
			bal.Set("available", available-amount)
			bal.Set("held", held+amount)
			if err := txApp.Save(bal); err != nil {
				return err
			}
			return e.Next()
		})
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
			updateBalance(e.App, accountId, currency, 0, -amount)

		case newStatus == "completed" && direction == "credit":
			// Incoming funds: credit available.
			updateBalance(e.App, accountId, currency, amount, 0)

		case (newStatus == "failed" || newStatus == "cancelled") && direction == "debit":
			// Reverse hold: restore available, release held.
			updateBalance(e.App, accountId, currency, amount, -amount)
		}

		return nil
	})

	// Webhook endpoint for external payment service callbacks.
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Id: "bankPaymentCallbacks",
		Func: func(e *core.ServeEvent) error {
			e.Router.POST("/v1/bank/webhooks/payments/callback", handlePaymentCallback(app)).
				Bind(RequireHMACAuth())
			return e.Next()
		},
	})
}

// updateBalance adjusts available and held by the given deltas atomically.
// The read-modify-write runs inside a transaction so it serializes against the
// pre-create hold (which is also transactional) — without it, a settlement's
// stale read clobbers a concurrent hold and the ledger can be made to mint
// funds. The floor check rejects any settlement that would drive available
// below zero.
func updateBalance(app core.App, accountId, currency string, availableDelta, heldDelta int64) {
	err := app.RunInTransaction(func(txApp core.App) error {
		bal, err := txApp.FindFirstRecordByFilter(
			collections.BalanceCollectionName,
			`account = {:accountId} && currency = {:currency}`,
			map[string]any{"accountId": accountId, "currency": currency},
		)
		if err != nil {
			// For credits to a new currency, create the balance record. Its
			// failure is the transaction's failure: swallowing it committed a
			// settlement with no balance row behind it, so the credit was gone
			// and nothing anywhere said so.
			if availableDelta > 0 && heldDelta == 0 {
				return createBalance(txApp, accountId, currency, availableDelta)
			}
			return fmt.Errorf("balance not found for %s/%s", accountId, currency)
		}

		newAvailable := int64(math.Round(bal.GetFloat("available"))) + availableDelta
		newHeld := int64(math.Round(bal.GetFloat("held"))) + heldDelta

		if newAvailable < 0 {
			return fmt.Errorf("balance floor violation: %s/%s would go to %d", accountId, currency, newAvailable)
		}

		bal.Set("available", newAvailable)
		bal.Set("held", newHeld)
		return txApp.Save(bal)
	})
	if err != nil {
		app.Logger().Error("payments: balance update rejected", slog.String("error", err.Error()))
	}
}

// createBalance opens an account's first balance in a currency. It reports what
// went wrong rather than absorbing it: this runs inside the settlement's own
// transaction, and a credit whose row could not be written has to take the
// settlement down with it.
func createBalance(app core.App, accountId, currency string, amount int64) error {
	col, err := app.FindCollectionByNameOrId(collections.BalanceCollectionName)
	if err != nil {
		return err
	}
	bal := core.NewRecord(col)
	bal.Set("account", accountId)
	bal.Set("currency", currency)
	bal.Set("available", amount)
	bal.Set("held", 0)
	return app.Save(bal)
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

// paymentCallbackPayload is the normalized shape forexd POSTs here for any
// provider webhook. TransactionID resolves an internal record by id;
// ExternalID resolves by the provider-issued reference stored in
// ccTransactionId. Exactly one must be set.
type paymentCallbackPayload struct {
	TransactionID string `json:"transactionId,omitempty"`
	ExternalID    string `json:"externalId,omitempty"`
	Provider      string `json:"provider,omitempty"`
	EventType     string `json:"eventType,omitempty"`
	Status        string `json:"status"`
	Reason        string `json:"reason,omitempty"`
}

func handlePaymentCallback(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var p paymentCallbackPayload
		if err := e.BindBody(&p); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}
		if p.TransactionID == "" && p.ExternalID == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing transactionId or externalId"})
		}

		record, err := lookupTransaction(app, p.TransactionID, p.ExternalID)
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
	case "cancelled", "canceled":
		return "cancelled"
	case "processing", "in_progress":
		return "processing"
	default:
		return "pending"
	}
}

// lookupTransaction resolves a transaction record by internal id or by the
// provider-issued external id stored in the ccTransactionId column.
func lookupTransaction(app core.App, internalID, externalID string) (*core.Record, error) {
	if internalID != "" {
		return app.FindRecordById(collections.TransactionCollectionName, internalID)
	}
	return app.FindFirstRecordByFilter(
		collections.TransactionCollectionName,
		"ccTransactionId = {:extId}",
		map[string]any{"extId": externalID},
	)
}
