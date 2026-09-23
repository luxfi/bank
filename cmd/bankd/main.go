package main

import (
	"log"
	"os"

	"github.com/hanzoai/base"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/plugins/migratecmd"
	"github.com/hanzoai/base/plugins/platform"
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
		IAMClientID:            envOr("IAM_CLIENT_ID", "lux-bank"),
		IAMClientSecret:        os.Getenv("IAM_CLIENT_SECRET"),
		IAMOrg:                 envOr("IAM_ORG", "lux"),
		IAMApp:                 envOr("IAM_APP", "lux-bank"),
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
			collections.EnsureCardCollection,
			collections.EnsureCredentialCollection,
		} {
			if err := ensure(app); err != nil {
				return err
			}
		}
		if err := collections.EnforceReads(app); err != nil {
			return err
		}

		// Lux ID is the only way in: a users record is made from an IAM
		// identity by the platform plugin, never by an anonymous create.
		if err := collections.CloseSignup(app); err != nil {
			return err
		}

		// Sandbox: seed a fully-funded demo customer so admin/API views are
		// alive out of the box (gated behind BANK_SANDBOX; default on).
		bank.SeedSandbox(app)

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
