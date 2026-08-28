package main

import (
	"log"
	"os"

	"github.com/hanzoai/base"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/plugins/migratecmd"
	"github.com/hanzoai/base/plugins/org"
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

	// Hanzo org plugin — wires Lux IAM (lux.id) for OIDC SSO and gives every org
	// a Base of its own under {DataDir}/orgs/{org}. Defaults pin the Lux brand;
	// every value overridable via env.
	//
	// There is no isolation setting: registering the plugin IS what turns
	// per-org storage on, because a deployment with orgs and one shared database
	// is not a shape anyone wants.
	org.MustRegister(app, org.Config{
		IAMEndpoint: envOr("IAM_ENDPOINT", "https://lux.id"),
		// KMS is reached over native ZAP, not HTTP — an http(s) endpoint is
		// rejected outright. Empty selects the in-cluster ZAP default; set
		// KMS_ENDPOINT to zap://host:9999 (or host:9999) to point elsewhere.
		KMSEndpoint:            os.Getenv("KMS_ENDPOINT"),
		IAMClientID:            envOr("IAM_CLIENT_ID", "lux-bank"),
		IAMClientSecret:        os.Getenv("IAM_CLIENT_SECRET"),
		IAMOrg:                 envOr("IAM_ORG", "lux"),
		IAMApp:                 envOr("IAM_APP", "lux-bank"),
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
			collections.EnsurePositionCollection,
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

		// Sandbox: seed a fully-funded demo customer so admin/API views are
		// alive out of the box (gated behind BANK_SANDBOX; default on).
		bank.SeedSandbox(app)

		return nil
	})

	// Where a price comes from. The DEX has an order book, so a mark from it is
	// one somebody would trade at; the reference tables are constants somebody
	// typed, and a constant is wrong quietly. DEX_URL names the venue, and
	// without one the tables stand — a bank pointed at no venue is not a bank
	// that prices everything at nothing.
	bank.PriceFromDex()

	// ---- hooks ----
	//
	// A bank that has declared itself real screens for sanctions and AML. Both
	// are fail-closed, and with no service configured there is nothing to be
	// closed against — every transaction and every beneficiary would pass
	// unscreened, silently, because a screen that cannot run reports nothing.
	// Refusing to start is the only answer that cannot be missed. The sandbox
	// has no screener and wants none.
	if !bank.Sandbox() && hooks.Screener() == "" {
		log.Fatal("COMPLIANCE_SERVICE_URL is not set: outside the sandbox there is nothing to screen against, and AML and sanctions screening are fail-closed")
	}

	// A bank with no chain to be custodian of falls to the simulation, which
	// invents a deposit address and answers a send with a receipt for a
	// transfer that never happened — and names the network from the sandbox
	// flag alone, so with that flag off it calls itself mainnet. A customer
	// sending real coins to an invented address loses them: nobody holds that
	// key, and no operator can sweep it.
	//
	// A configured chain that is merely unreachable already refuses rather than
	// degrading into the simulation. This is the same rule for the case where
	// none was configured at all.
	if !bank.Sandbox() && !bank.ChainConfigured() {
		log.Fatal("BANK_CHAIN_RPC is not set: outside the sandbox there is no chain to hold anything on, and the simulation would hand out deposit addresses nobody holds the keys to")
	}

	// The card routes are issuer-neutral, which is what lets a counterparty be
	// swapped. It also means nothing on the route says which bank is behind it,
	// so a name this build does not implement, or one with no credentials,
	// mounts a working-looking surface over nothing. A customer gets as far as
	// handing over identity documents before the first upstream call fails.
	if err := bank.IssuerReady(); err != nil {
		log.Fatal(err)
	}

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

	// Run bare (the k8s/demo case) as `serve` on BANKD_HTTP (default :8070);
	// otherwise honor the CLI verbatim so `serve --http`, `migrate`, and
	// `--help` all work instead of being overridden.
	if len(os.Args) > 1 {
		app.RootCmd.SetArgs(os.Args[1:])
	} else {
		addr := os.Getenv("BANKD_HTTP")
		if addr == "" {
			addr = "0.0.0.0:8070"
		}
		app.RootCmd.SetArgs([]string{"serve", "--http", addr})
	}

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
