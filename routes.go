package bank

import (
	"math"
	"net/http"

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
			// Public health/config (unauthenticated).
			e.Router.GET("/v1/bank/health", func(re *core.RequestEvent) error {
				return re.JSON(http.StatusOK, map[string]any{"status": "ok", "sandbox": Sandbox()})
			})
			// Membership ladder — one source for lux.finance, lux.credit,
			// and the dash pricing surfaces.
			e.Router.GET("/v1/bank/plans", func(re *core.RequestEvent) error {
				return re.JSON(http.StatusOK, collections.Plans)
			})
			// Sandbox-only password login → mints a superuser token.
			if Sandbox() {
				e.Router.POST("/v1/bank/login", handleSandboxLogin(app))
			}
			e.Router.GET("/v1/bank/config", func(re *core.RequestEvent) error {
				network := "lux-mainnet"
				disclaimer := "Banking services are provided by SF Private Bank LTD, International Banking License (L17601/SFPB) " +
					"under Union of Comoros Offshore Finance Authority (FSA Offshore), and SF Neobanq Kommanditbolag " +
					"registered in Stockholm (969802-1251), issued by Bolagsverket."
				if Sandbox() {
					network = "lux-testnet"
					disclaimer = "Demo — " + disclaimer + " Sandbox environment, not for real deposits."
				}
				return re.JSON(http.StatusOK, map[string]any{
					"sandbox":    Sandbox(),
					"demoLogin":  Sandbox(),
					"demoEmail":  DemoEmail(),
					"fiat":       SupportedFiat,
					"crypto":     SupportedCrypto,
					"network":    network,
					"disclaimer": disclaimer,
					"partner": map[string]string{
						"name":    "SF Private Bank",
						"terms":   "https://www.sf-privatebank.com/terms",
						"privacy": "https://www.sf-privatebank.com/privacy-policy",
					},
				})
			})

			g := e.Router.Group("/v1/bank")
			g.Bind(apis.RequireAuth())

			// Onboarding + dashboard.
			g.POST("/onboard", handleOnboard(app))
			g.GET("/overview", handleOverview(app))
			g.GET("/transactions", handleListTransactions(app))
			g.GET("/account/summary", handleAccountSummary(app))

			// Money movement.
			g.POST("/transfers", handleTransfer(app))
			g.POST("/payments/outbound", handleOutboundPayment(app))

			// Per-account reads.
			g.GET("/accounts/{id}/balances", handleGetBalances(app))
			g.GET("/accounts/{id}/wallets", handleGetWallets(app))
			g.GET("/accounts/{id}/transactions", handleGetTransactions(app))

			// Beneficiaries.
			g.GET("/beneficiaries", handleListBeneficiaries(app))
			g.POST("/beneficiaries", handleCreateBeneficiary(app))
			g.DELETE("/beneficiaries/{id}", handleDeleteBeneficiary(app))

			// Cards.
			g.GET("/cards", handleListCards(app))
			g.POST("/cards", handleIssueCard(app))
			g.POST("/cards/{id}/freeze", setCardStatus(app, "frozen"))
			g.POST("/cards/{id}/unfreeze", setCardStatus(app, "active"))

			// Issuer card account (provider-neutral; see issuer.go).
			registerIssuerRoutes(g)

			// Exchange (fiat FX + crypto buy/sell/convert) and wallet.
			g.POST("/exchange/quote", handleExchangeQuote(app))
			g.POST("/exchange/execute", handleExchangeExecute(app))
			g.GET("/wallet", handleGetWallet(app))
			g.GET("/crypto/prices", handleCryptoPrices(app))

			return e.Next()
		},
	})
}

// handleAccountSummary returns a compact list of the caller's accounts.
func handleAccountSummary(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		records, err := app.FindRecordsByFilter(
			collections.AccountCollectionName, "owner = {:userId}", "-created", 10, 0,
			map[string]any{"userId": e.Auth.Id},
		)
		if err != nil {
			return apis.NewBadRequestError("failed to fetch accounts", nil)
		}
		out := make([]accountView, 0, len(records))
		for _, r := range records {
			out = append(out, viewAccount(r))
		}
		return e.JSON(http.StatusOK, out)
	}
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

		status := "pending"
		if Sandbox() {
			// Instant, deterministic settlement for the demo.
			if err := settle(app, debit); err != nil {
				return apis.NewInternalServerError("settlement failed", err)
			}
			if err := settle(app, credit); err != nil {
				return apis.NewInternalServerError("settlement failed", err)
			}
			status = "completed"
		}

		return e.JSON(http.StatusCreated, map[string]any{
			"debitId":  debit.Id,
			"creditId": credit.Id,
			"status":   status,
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

		status := "pending"
		if Sandbox() {
			// Simulated SWIFT/SEPA rail: settle immediately in the demo.
			if err := settle(app, tx); err != nil {
				return apis.NewInternalServerError("settlement failed", err)
			}
			status = "completed"
		}

		return e.JSON(http.StatusCreated, map[string]any{
			"transactionId": tx.Id,
			"status":        status,
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

// -- Account wallets --

func handleGetWallets(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		accountId := e.Request.PathValue("id")
		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			return apis.NewNotFoundError("account not found", nil)
		}
		if account.GetString("owner") != e.Auth.Id {
			return apis.NewForbiddenError("not your account", nil)
		}
		wallets, err := app.FindRecordsByFilter(collections.WalletCollectionName,
			"account = {:accountId}", "currency", 0, 0,
			map[string]any{"accountId": accountId})
		if err != nil {
			return apis.NewInternalServerError("", nil)
		}
		type wr struct {
			ID       string `json:"id"`
			Currency string `json:"currency"`
			WalletId string `json:"walletId"`
			Status   string `json:"status"`
		}
		out := make([]wr, 0, len(wallets))
		for _, w := range wallets {
			out = append(out, wr{w.Id, w.GetString("currency"), w.GetString("walletId"), w.GetString("status")})
		}
		return e.JSON(http.StatusOK, out)
	}
}

// -- Transaction history --

func handleGetTransactions(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		accountId := e.Request.PathValue("id")
		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			return apis.NewNotFoundError("account not found", nil)
		}
		if account.GetString("owner") != e.Auth.Id {
			return apis.NewForbiddenError("not your account", nil)
		}
		txs, err := app.FindRecordsByFilter(collections.TransactionCollectionName,
			"account = {:accountId}", "-created", 100, 0,
			map[string]any{"accountId": accountId})
		if err != nil {
			return apis.NewInternalServerError("", nil)
		}
		type tr struct {
			ID        string  `json:"id"`
			Type      string  `json:"type"`
			Direction string  `json:"direction"`
			Amount    float64 `json:"amount"`
			Currency  string  `json:"currency"`
			Status    string  `json:"status"`
			Reference string  `json:"reference"`
			Created   string  `json:"created"`
		}
		out := make([]tr, 0, len(txs))
		for _, t := range txs {
			out = append(out, tr{t.Id, t.GetString("type"), t.GetString("direction"),
				t.GetFloat("amount"), t.GetString("currency"), t.GetString("status"),
				t.GetString("reference"), t.GetString("created")})
		}
		return e.JSON(http.StatusOK, out)
	}
}
