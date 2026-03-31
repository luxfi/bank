package main

import (
	"log"
	"net/http"

	"github.com/hanzoai/base"
	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/plugins/migratecmd"
	"github.com/hanzoai/base/tools/hook"
	bank "github.com/luxfi/bank"
	"github.com/luxfi/bank/collections"
	"github.com/luxfi/bank/hooks"
)

func main() {
	app := base.New()

	// ---- flags ----

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"./migrations",
		"the directory with user-defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	// ---- plugins ----

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangGo,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})

	// ---- collections ----

	// Ensure custom collections exist after bootstrap (DB is ready).
	app.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		// Users auth collection (built-in) is auto-created by Base.
		// Create domain-specific collections.
		for _, ensure := range []func(core.App) error{
			collections.EnsureAccountCollection,
			collections.EnsureBeneficiaryCollection,
			collections.EnsureTransactionCollection,
			collections.EnsureFeeCollection,
			collections.EnsureSessionCollection,
			collections.EnsureBalanceCollection,
			collections.EnsureAuditCollection,
		} {
			if err := ensure(app); err != nil {
				return err
			}
		}

		return nil
	})

	// ---- hooks ----

	hooks.RegisterCurrencyCloudWebhooks(app)
	hooks.RegisterComplianceHooks(app)
	hooks.RegisterPaymentHooks(app)
	hooks.RegisterAccountHooks(app)
	hooks.RegisterFeeHooks(app)
	hooks.RegisterAuditHooks(app)
	hooks.RegisterCronJobs(app)

	// ---- routes ----

	bank.RegisterRoutes(app)

	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Id: "bankLegacyRoutes",
		Func: func(e *core.ServeEvent) error {
			// Health endpoint (unauthenticated).
			e.Router.GET("/health", func(re *core.RequestEvent) error {
				return re.JSON(http.StatusOK, map[string]string{"status": "ok"})
			})

			// Legacy account summary endpoint.
			e.Router.GET("/api/v1/account/summary", func(re *core.RequestEvent) error {
				if re.Auth == nil {
					return apis.NewUnauthorizedError("unauthorized", nil)
				}

				records, err := app.FindRecordsByFilter(
					collections.AccountCollectionName,
					"owner = {:userId}",
					"-created",
					10,
					0,
					map[string]any{"userId": re.Auth.Id},
				)
				if err != nil {
					return apis.NewBadRequestError("failed to fetch accounts", nil)
				}

				type accountSummary struct {
					ID        string `json:"id"`
					Entity    string `json:"entityName"`
					Currency  string `json:"currency"`
					Status    string `json:"status"`
					KYCStatus string `json:"kycStatus"`
				}

				result := make([]accountSummary, 0, len(records))
				for _, r := range records {
					result = append(result, accountSummary{
						ID:        r.Id,
						Entity:    r.GetString("entityName"),
						Currency:  r.GetString("currency"),
						Status:    r.GetString("status"),
						KYCStatus: r.GetString("kycStatus"),
					})
				}

				return re.JSON(http.StatusOK, result)
			}).Bind(apis.RequireAuth())

			return e.Next()
		},
	})

	// ---- start ----

	// Override default listen address to port 8070.
	app.RootCmd.SetArgs([]string{"serve", "--http", "0.0.0.0:8070"})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
