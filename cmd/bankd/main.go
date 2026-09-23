package main

import (
	"log"
	"os"

	"github.com/hanzoai/base"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/plugins/migratecmd"
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

	// Lux ID is the only way in (identity.go): an access token lux.id issued to
	// lux-financial for the lux org, and nothing else.
	bank.Identity{
		Issuer: envOr("IAM_ENDPOINT", "https://lux.id"),
		Client: envOr("IAM_CLIENT_ID", "lux-financial"),
		Org:    envOr("IAM_ORG", "lux"),
	}.Mount(app)

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
			collections.EnsureCardCollection,
		} {
			if err := ensure(app); err != nil {
				return err
			}
		}
		if err := collections.EnforceReads(app); err != nil {
			return err
		}

		// Lux ID is the only way in: a users record stands for a Lux ID for
		// one request, and is never made by an anonymous create.
		return collections.CloseSignup(app)
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
	//
	// All /v1/bank endpoints (health, config, onboard, overview, transfers,
	// beneficiaries, cards, exchange, wallet, …) are registered in
	// bank.RegisterRoutes. Keep a single registration site.

	bank.RegisterRoutes(app)

	// ---- start ----

	// Override default listen address to port 8070.
	app.RootCmd.SetArgs([]string{"serve", "--http", "0.0.0.0:8070"})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
