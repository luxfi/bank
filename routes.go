package bank

import (
	"bytes"
	"encoding/json"
	"math"
	"net/http"
	"os"
	"time"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/hook"
	"github.com/luxfi/bank/collections"
)

// RegisterRoutes adds custom HTTP endpoints to the Base app.
func RegisterRoutes(app core.App) {
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Id: "bankRoutes",
		Func: func(e *core.ServeEvent) error {
			g := e.Router.Group("/v1")
			g.Bind(apis.RequireAuth())

			g.POST("/transfers", handleTransfer(app))
			g.POST("/payments/outbound", handleOutboundPayment(app))
			g.GET("/accounts/{id}/balances", handleGetBalances(app))
			g.POST("/fx/quote", handleFXQuote(app))
			g.POST("/fx/execute", handleFXExecute(app))

			return e.Next()
		},
	})
}

// -- Transfer (internal move between own accounts) --

type transferRequest struct {
	FromAccountID string `json:"fromAccountId"`
	ToAccountID   string `json:"toAccountId"`
	Amount        int64  `json:"amount"`
	Currency      string `json:"currency"`
	Reference     string `json:"reference"`
}

func handleTransfer(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var req transferRequest
		if err := e.BindBody(&req); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}

		if req.FromAccountID == "" || req.ToAccountID == "" || req.Amount <= 0 || req.Currency == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing required fields"})
		}

		// Verify caller owns the source account.
		from, err := app.FindRecordById(collections.AccountCollectionName, req.FromAccountID)
		if err != nil {
			return apis.NewNotFoundError("source account not found", nil)
		}
		if from.GetString("owner") != e.Auth.Id {
			return apis.NewForbiddenError("not your account", nil)
		}

		// Verify destination exists and belongs to the caller.
		to, err := app.FindRecordById(collections.AccountCollectionName, req.ToAccountID)
		if err != nil {
			return apis.NewNotFoundError("destination account not found", nil)
		}
		if to.GetString("owner") != e.Auth.Id {
			return apis.NewForbiddenError("destination account not owned by caller", nil)
		}

		// Create debit transaction (hooks will validate balance, KYC, limits).
		txCollection, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
		if err != nil {
			return apis.NewInternalServerError("", nil)
		}

		debit := core.NewRecord(txCollection)
		debit.Set("account", req.FromAccountID)
		debit.Set("type", "payment")
		debit.Set("direction", "debit")
		debit.Set("amount", req.Amount)
		debit.Set("currency", req.Currency)
		debit.Set("status", "pending")
		debit.Set("reference", req.Reference)

		if err := app.Save(debit); err != nil {
			return e.JSON(http.StatusUnprocessableEntity, map[string]string{"error": err.Error()})
		}

		// Create matching credit transaction.
		credit := core.NewRecord(txCollection)
		credit.Set("account", req.ToAccountID)
		credit.Set("type", "deposit")
		credit.Set("direction", "credit")
		credit.Set("amount", req.Amount)
		credit.Set("currency", req.Currency)
		credit.Set("status", "pending")
		credit.Set("reference", req.Reference)

		if err := app.Save(credit); err != nil {
			return e.JSON(http.StatusUnprocessableEntity, map[string]string{"error": err.Error()})
		}

		return e.JSON(http.StatusCreated, map[string]any{
			"debitId":  debit.Id,
			"creditId": credit.Id,
			"status":   "pending",
		})
	}
}

// -- Outbound payment (to external beneficiary) --

type outboundPaymentRequest struct {
	AccountID     string `json:"accountId"`
	BeneficiaryID string `json:"beneficiaryId"`
	Amount        int64  `json:"amount"`
	Currency      string `json:"currency"`
	Reference     string `json:"reference"`
}

func handleOutboundPayment(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var req outboundPaymentRequest
		if err := e.BindBody(&req); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}

		if req.AccountID == "" || req.BeneficiaryID == "" || req.Amount <= 0 || req.Currency == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing required fields"})
		}

		// Verify ownership.
		account, err := app.FindRecordById(collections.AccountCollectionName, req.AccountID)
		if err != nil {
			return apis.NewNotFoundError("account not found", nil)
		}
		if account.GetString("owner") != e.Auth.Id {
			return apis.NewForbiddenError("not your account", nil)
		}

		// Verify beneficiary belongs to this account.
		bene, err := app.FindRecordById(collections.BeneficiaryCollectionName, req.BeneficiaryID)
		if err != nil {
			return apis.NewNotFoundError("beneficiary not found", nil)
		}
		if bene.GetString("account") != req.AccountID {
			return apis.NewForbiddenError("beneficiary does not belong to this account", nil)
		}

		txCollection, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
		if err != nil {
			return apis.NewInternalServerError("", nil)
		}

		tx := core.NewRecord(txCollection)
		tx.Set("account", req.AccountID)
		tx.Set("beneficiary", req.BeneficiaryID)
		tx.Set("type", "payment")
		tx.Set("direction", "debit")
		tx.Set("amount", req.Amount)
		tx.Set("currency", req.Currency)
		tx.Set("status", "pending")
		tx.Set("reference", req.Reference)

		if err := app.Save(tx); err != nil {
			return e.JSON(http.StatusUnprocessableEntity, map[string]string{"error": err.Error()})
		}

		return e.JSON(http.StatusCreated, map[string]any{
			"transactionId": tx.Id,
			"status":        "pending",
		})
	}
}

// -- Account balances --

func handleGetBalances(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		accountId := e.Request.PathValue("id")

		// Verify ownership.
		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			return apis.NewNotFoundError("account not found", nil)
		}
		if account.GetString("owner") != e.Auth.Id {
			return apis.NewForbiddenError("not your account", nil)
		}

		balances, err := app.FindRecordsByFilter(
			collections.BalanceCollectionName,
			`account = {:accountId}`,
			"currency",
			0,
			0,
			map[string]any{"accountId": accountId},
		)
		if err != nil {
			return apis.NewInternalServerError("", nil)
		}

		type balanceResponse struct {
			Currency  string `json:"currency"`
			Available int64  `json:"available"`
			Held      int64  `json:"held"`
		}

		result := make([]balanceResponse, 0, len(balances))
		for _, b := range balances {
			result = append(result, balanceResponse{
				Currency:  b.GetString("currency"),
				Available: int64(math.Round(b.GetFloat("available"))),
				Held:      int64(math.Round(b.GetFloat("held"))),
			})
		}

		return e.JSON(http.StatusOK, result)
	}
}

// -- FX Quote --

type fxQuoteRequest struct {
	SellCurrency string `json:"sellCurrency"`
	BuyCurrency  string `json:"buyCurrency"`
	Amount       int64  `json:"amount"`
}

type fxQuoteResponse struct {
	SellCurrency string  `json:"sellCurrency"`
	BuyCurrency  string  `json:"buyCurrency"`
	SellAmount   int64   `json:"sellAmount"`
	BuyAmount    int64   `json:"buyAmount"`
	Rate         float64 `json:"rate"`
	QuoteID      string  `json:"quoteId"`
	ExpiresAt    string  `json:"expiresAt"`
}

func handleFXQuote(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var req fxQuoteRequest
		if err := e.BindBody(&req); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}

		if req.SellCurrency == "" || req.BuyCurrency == "" || req.Amount <= 0 {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing required fields"})
		}

		forexURL := os.Getenv("FOREX_SERVICE_URL")
		if forexURL == "" {
			return e.JSON(http.StatusServiceUnavailable, map[string]string{"error": "FX service not configured"})
		}

		body, _ := json.Marshal(req)
		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Post(forexURL+"/v1/quote", "application/json", bytes.NewReader(body))
		if err != nil {
			return e.JSON(http.StatusBadGateway, map[string]string{"error": "FX service unavailable"})
		}
		defer resp.Body.Close()

		if resp.StatusCode >= 400 {
			return e.JSON(resp.StatusCode, map[string]string{"error": "FX quote failed"})
		}

		var quote fxQuoteResponse
		if err := json.NewDecoder(resp.Body).Decode(&quote); err != nil {
			return e.JSON(http.StatusBadGateway, map[string]string{"error": "invalid FX response"})
		}

		return e.JSON(http.StatusOK, quote)
	}
}

// -- FX Execute --

type fxExecuteRequest struct {
	AccountID string `json:"accountId"`
	QuoteID   string `json:"quoteId"`
}

func handleFXExecute(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var req fxExecuteRequest
		if err := e.BindBody(&req); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}

		if req.AccountID == "" || req.QuoteID == "" {
			return e.JSON(http.StatusBadRequest, map[string]string{"error": "missing required fields"})
		}

		// Verify ownership.
		account, err := app.FindRecordById(collections.AccountCollectionName, req.AccountID)
		if err != nil {
			return apis.NewNotFoundError("account not found", nil)
		}
		if account.GetString("owner") != e.Auth.Id {
			return apis.NewForbiddenError("not your account", nil)
		}

		forexURL := os.Getenv("FOREX_SERVICE_URL")
		if forexURL == "" {
			return e.JSON(http.StatusServiceUnavailable, map[string]string{"error": "FX service not configured"})
		}

		payload := map[string]any{
			"accountId": req.AccountID,
			"quoteId":   req.QuoteID,
		}
		body, _ := json.Marshal(payload)

		client := &http.Client{Timeout: 30 * time.Second}
		resp, err := client.Post(forexURL+"/v1/execute", "application/json", bytes.NewReader(body))
		if err != nil {
			return e.JSON(http.StatusBadGateway, map[string]string{"error": "FX service unavailable"})
		}
		defer resp.Body.Close()

		if resp.StatusCode >= 400 {
			return e.JSON(resp.StatusCode, map[string]string{"error": "FX execution failed"})
		}

		var result map[string]any
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			return e.JSON(http.StatusBadGateway, map[string]string{"error": "invalid FX response"})
		}

		return e.JSON(http.StatusOK, result)
	}
}
