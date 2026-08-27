package hooks

import (
	"log/slog"
	"net/http"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/hook"
	"github.com/luxfi/bank/collections"
)

// RegisterCurrencyCloudWebhooks adds HTTP routes that CurrencyCloud and IFX
// call when payment status changes. The routes are protected by a shared
// webhook secret validated via HMAC signature header.
func RegisterCurrencyCloudWebhooks(app core.App) {
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Id: "bankCurrencyCloudWebhooks",
		Func: func(e *core.ServeEvent) error {
			// CurrencyCloud payment status callback.
			e.Router.POST("/v1/bank/webhooks/currencycloud/payment", handleCCPayment(app)).
				Bind(RequireHMACAuth())

			// CurrencyCloud conversion status callback.
			e.Router.POST("/v1/bank/webhooks/currencycloud/conversion", handleCCConversion(app)).
				Bind(RequireHMACAuth())

			// IFX (forex) rate and settlement callback.
			e.Router.POST("/v1/bank/webhooks/ifx/settlement", handleIFXSettlement(app)).
				Bind(RequireHMACAuth())

			return e.Next()
		},
	})
}

// ccPaymentEvent represents the subset of CurrencyCloud webhook payload
// we care about.
type ccPaymentEvent struct {
	ID        string  `json:"id"`
	Status    string  `json:"status"`
	Amount    float64 `json:"amount"`
	Currency  string  `json:"currency"`
	Reference string  `json:"reference"`
	Reason    string  `json:"reason"`
}

func handleCCPayment(app core.App) func(e *core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var payload ccPaymentEvent
		if err := e.BindBody(&payload); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}

		if payload.ID == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing payment id"})
		}

		// Find the matching transaction by CurrencyCloud id.
		records, err := app.FindRecordsByFilter(
			collections.TransactionCollectionName,
			"ccTransactionId = {:ccId}",
			"-created",
			1,
			0,
			map[string]any{"ccId": payload.ID},
		)
		if err != nil || len(records) == 0 {
			app.Logger().Warn("cc webhook: transaction not found",
				slog.String("ccId", payload.ID),
			)
			// Return 200 so CurrencyCloud does not retry.
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}

		record := records[0]
		// A status the transaction cannot move to is not something the sender
		// can fix — webhooks arrive out of order, and a transaction that has
		// reached a terminal state has nowhere left to go. Acknowledge it.
		// Answering 500 turns one late delivery into a retry every few
		// minutes, forever.
		to := mapCCStatus(payload.Status)
		if !movesTo(record, to) {
			app.Logger().Warn("cc webhook: a status the transaction cannot move to",
				slog.String("id", record.Id),
				slog.String("from", record.GetString("status")),
				slog.String("to", to),
			)
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}
		record.Set("status", to)
		if payload.Reason != "" {
			record.Set("reason", payload.Reason)
		}

		if err := app.Save(record); err != nil {
			app.Logger().Error("cc webhook: failed to update transaction",
				slog.String("ccId", payload.ID),
				slog.String("error", err.Error()),
			)
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": "update failed"})
		}

		app.Logger().Info("cc webhook: transaction updated",
			slog.String("ccId", payload.ID),
			slog.String("status", payload.Status),
		)

		return e.JSON(http.StatusOK, map[string]string{"status": "ok"})
	}
}

// ccConversionEvent represents a CurrencyCloud conversion callback.
type ccConversionEvent struct {
	ID           string  `json:"id"`
	Status       string  `json:"status"`
	BuyAmount    float64 `json:"buy_amount"`
	BuyCurrency  string  `json:"buy_currency"`
	SellAmount   float64 `json:"sell_amount"`
	SellCurrency string  `json:"sell_currency"`
	ExchangeRate float64 `json:"exchange_rate"`
}

func handleCCConversion(app core.App) func(e *core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var payload ccConversionEvent
		if err := e.BindBody(&payload); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}

		if payload.ID == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing conversion id"})
		}

		records, err := app.FindRecordsByFilter(
			collections.TransactionCollectionName,
			"ccTransactionId = {:ccId}",
			"-created",
			1,
			0,
			map[string]any{"ccId": payload.ID},
		)
		if err != nil || len(records) == 0 {
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}

		record := records[0]
		// A status the transaction cannot move to is not something the sender
		// can fix — webhooks arrive out of order, and a transaction that has
		// reached a terminal state has nowhere left to go. Acknowledge it.
		// Answering 500 turns one late delivery into a retry every few
		// minutes, forever.
		to := mapCCStatus(payload.Status)
		if !movesTo(record, to) {
			app.Logger().Warn("cc webhook: a status the transaction cannot move to",
				slog.String("id", record.Id),
				slog.String("from", record.GetString("status")),
				slog.String("to", to),
			)
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}
		record.Set("status", to)
		record.Set("buyAmount", payload.BuyAmount)
		record.Set("buyCurrency", payload.BuyCurrency)
		record.Set("sellAmount", payload.SellAmount)
		record.Set("sellCurrency", payload.SellCurrency)
		record.Set("exchangeRate", payload.ExchangeRate)

		if err := app.Save(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": "update failed"})
		}

		return e.JSON(http.StatusOK, map[string]string{"status": "ok"})
	}
}

// ifxSettlementEvent represents an IFX settlement notification.
type ifxSettlementEvent struct {
	TransactionID string  `json:"transaction_id"`
	Status        string  `json:"status"`
	SettledAmount float64 `json:"settled_amount"`
	Currency      string  `json:"currency"`
}

func handleIFXSettlement(app core.App) func(e *core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var payload ifxSettlementEvent
		if err := e.BindBody(&payload); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}

		if payload.TransactionID == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing transaction_id"})
		}

		records, err := app.FindRecordsByFilter(
			collections.TransactionCollectionName,
			"ccTransactionId = {:txId}",
			"-created",
			1,
			0,
			map[string]any{"txId": payload.TransactionID},
		)
		if err != nil || len(records) == 0 {
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}

		record := records[0]
		// A status the transaction cannot move to is not something the sender
		// can fix — webhooks arrive out of order, and a transaction that has
		// reached a terminal state has nowhere left to go. Acknowledge it.
		// Answering 500 turns one late delivery into a retry every few
		// minutes, forever.
		to := mapIFXStatus(payload.Status)
		if !movesTo(record, to) {
			app.Logger().Warn("ifx webhook: a status the transaction cannot move to",
				slog.String("id", record.Id),
				slog.String("from", record.GetString("status")),
				slog.String("to", to),
			)
			return e.JSON(http.StatusOK, map[string]string{"status": "ignored"})
		}
		record.Set("status", to)

		if err := app.Save(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]string{"error": "update failed"})
		}

		return e.JSON(http.StatusOK, map[string]string{"status": "ok"})
	}
}

// mapCCStatus converts CurrencyCloud status strings to our internal vocabulary.
func mapCCStatus(ccStatus string) string {
	switch ccStatus {
	case "ready_to_send", "submitted":
		return "processing"
	case "completed":
		return "completed"
	case "failed":
		return "failed"
	case "cancelled":
		return "cancelled"
	default:
		return "pending"
	}
}

// mapIFXStatus converts IFX status strings to our internal vocabulary.
func mapIFXStatus(ifxStatus string) string {
	switch ifxStatus {
	case "settled":
		return "completed"
	case "rejected":
		return "failed"
	default:
		return "processing"
	}
}
