package main

import (
	"log"
	"net/http"
	"os"

	"github.com/hanzoai/base"
	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/plugins/migratecmd"
	"github.com/hanzoai/base/plugins/platform"
	"github.com/hanzoai/base/tools/hook"
	bank "github.com/luxfi/bank"
	"github.com/luxfi/bank/collections"
	"github.com/luxfi/bank/hooks"
)

// envOr returns the env value or fallback if unset / empty.
func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

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

	// Hanzo Platform plugin — wires Lux IAM (lux.id) for OIDC SSO and
	// activates per-principal SQLite isolation (one encrypted DB per org/user).
	// Defaults pin the Lux brand; every value overridable via env.
	platform.MustRegister(app, platform.PlatformConfig{
		IAMEndpoint:            envOr("IAM_ENDPOINT", "https://lux.id"),
		KMSEndpoint:            envOr("KMS_ENDPOINT", "https://kms.lux.network"),
		IAMClientID:            envOr("IAM_CLIENT_ID", "lux-bankd"),
		IAMClientSecret:        os.Getenv("IAM_CLIENT_SECRET"),
		IAMOrg:                 envOr("IAM_ORG", "lux"),
		IAMApp:                 envOr("IAM_APP", "lux-bankd"),
		PrincipalIsolation:     envOr("PRINCIPAL_ISOLATION", "sqlite"),
		PrincipalEncryptionKey: os.Getenv("PRINCIPAL_ENCRYPTION_KEY"),
		OrgStorageEndpoint:     os.Getenv("ORG_STORAGE_ENDPOINT"),
		OrgStorageBucket:       envOr("ORG_STORAGE_BUCKET", "orgs"),
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
			collections.EnsureDocumentCollection,
			collections.EnsureWalletCollection,
			collections.EnsureConversionCollection,
		} {
			if err := ensure(app); err != nil {
				return err
			}
		}

		// Allow public customer self-signup on the built-in users auth
		// collection (createRule = "" → anyone). Identity is still Hanzo IAM
		// (lux.id) via the platform plugin for SSO; this enables direct
		// email/password registration for the consumer bank.
		if users, err := app.FindCollectionByNameOrId("users"); err == nil {
			anyone := ""
			if users.CreateRule == nil || *users.CreateRule != anyone {
				users.CreateRule = &anyone
				if err := app.Save(users); err != nil {
					app.Logger().Error("users: failed to open self-signup", "err", err)
				}
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
	hooks.RegisterDocumentHooks(app)
	hooks.RegisterWalletHooks(app)
	hooks.RegisterEmailHooks(app)
	hooks.RegisterCronJobs(app)

	// ---- routes ----

	bank.RegisterRoutes(app)

	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Id: "bankExtraRoutes",
		Func: func(e *core.ServeEvent) error {
			// Health endpoint (unauthenticated).
			e.Router.GET("/v1/bank/health", func(re *core.RequestEvent) error {
				return re.JSON(http.StatusOK, map[string]string{"status": "ok"})
			})

			// Account summary endpoint.
			e.Router.GET("/v1/bank/account/summary", func(re *core.RequestEvent) error {
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

			// Customer self-onboarding: provision a multi-currency account
			// (its opening balance is auto-created by the account hook) and a
			// non-custodial MPC crypto wallet. Idempotent — safe to retry.
			e.Router.POST("/v1/bank/onboard", func(re *core.RequestEvent) error {
				if re.Auth == nil {
					return apis.NewUnauthorizedError("unauthorized", nil)
				}
				uid := re.Auth.Id

				// Already onboarded? Return the existing account + wallet.
				if existing, _ := app.FindRecordsByFilter(collections.AccountCollectionName, "owner = {:u}", "-created", 1, 0, map[string]any{"u": uid}); len(existing) > 0 {
					acct := existing[0]
					var wallet *core.Record
					if ws, _ := app.FindRecordsByFilter(collections.WalletCollectionName, "account = {:a}", "-created", 1, 0, map[string]any{"a": acct.Id}); len(ws) > 0 {
						wallet = ws[0]
					}
					return re.JSON(http.StatusOK, map[string]any{"account": acct, "wallet": wallet})
				}

				name := re.Auth.GetString("name")
				if name == "" {
					name = re.Auth.GetString("email")
				}

				acctColl, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
				if err != nil {
					return apis.NewBadRequestError("accounts collection missing", err)
				}
				acct := core.NewRecord(acctColl)
				acct.Set("owner", uid)
				acct.Set("entityName", name)
				acct.Set("entityType", "individual")
				acct.Set("country", "US")
				acct.Set("currency", "USD")
				acct.Set("status", "active")
				acct.Set("kycStatus", "approved") // demo: auto-approve so the customer can transact immediately
				if err := app.Save(acct); err != nil {
					return apis.NewBadRequestError("failed to open account", err)
				}

				// Non-custodial crypto wallet. The address/key is produced by
				// threshold MPC keygen (same pattern as ats/cmd/mpc-provision);
				// until the MPC client is wired here the wallet is created in
				// "provisioning" state and keyed to the principal.
				var wallet *core.Record
				if walletColl, err := app.FindCollectionByNameOrId(collections.WalletCollectionName); err == nil {
					wallet = core.NewRecord(walletColl)
					wallet.Set("account", acct.Id)
					wallet.Set("currency", "USDC")
					wallet.Set("status", "provisioning")
					wallet.Set("walletId", "mpc:"+uid)
					if err := app.Save(wallet); err != nil {
						app.Logger().Error("onboard: wallet provisioning deferred", "err", err)
						wallet = nil
					}
				}

				return re.JSON(http.StatusOK, map[string]any{"account": acct, "wallet": wallet})
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
