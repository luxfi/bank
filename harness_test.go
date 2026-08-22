package bank

import (
	"os"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
	"github.com/luxfi/bank/hooks"
)

// newBankApp returns a live, in-process bank app on a temp SQLite: every
// collection ensured, every hook and route registered, exactly as cmd/bankd
// wires them — so a test exercises the real ledger, not a mock. Sandbox mode
// (default on) keeps the seeded demo path available. Caller-scoped cleanup.
func newBankApp(t testing.TB) *tests.TestApp {
	t.Helper()
	t.Setenv("hz_test_env", "0123456789abcdef0123456789abcdef")

	app, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("new test app: %v", err)
	}
	t.Cleanup(app.Cleanup)

	for _, ensure := range []func(core.App) error{
		collections.EnsureAccountCollection,
		collections.EnsureBalanceCollection,
		collections.EnsureBeneficiaryCollection,
		collections.EnsureTransactionCollection,
		collections.EnsureFeeCollection,
		collections.EnsureCardCollection,
		collections.EnsureWalletCollection,
		collections.EnsureConversionCollection,
		collections.EnsureAuditCollection,
		collections.EnsureSessionCollection,
		collections.EnsureCredentialCollection,
		collections.EnsureDocumentCollection,
	} {
		if err := ensure(app); err != nil {
			t.Fatalf("ensure collection: %v", err)
		}
	}

	// Register every hook exactly as cmd/bankd does, so tests exercise the
	// same wiring — including the webhook routes and the document/wallet hooks.
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
	RegisterRoutes(app)

	return app
}

// seedPrincipal creates a superuser (the shape the sandbox login mints), opens
// its account via ProvisionCustomer, and returns the principal id plus a bearer
// token that satisfies apis.RequireAuth on the /v1/bank routes.
func seedPrincipal(t testing.TB, app core.App) (id, token string) {
	t.Helper()
	su, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, "test@lux.financial")
	if err != nil || su == nil {
		col, cerr := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if cerr != nil {
			t.Fatalf("superusers collection: %v", cerr)
		}
		su = core.NewRecord(col)
		su.SetEmail("test@lux.financial")
		su.Set("password", "test-password-1234")
		if serr := app.Save(su); serr != nil {
			t.Fatalf("save superuser: %v", serr)
		}
	}
	if _, err := ProvisionCustomer(app, su, KYC{Name: "Test User", Country: "US", EntityType: "individual"}); err != nil {
		t.Fatalf("provision: %v", err)
	}
	tok, err := su.NewAuthToken()
	if err != nil {
		t.Fatalf("auth token: %v", err)
	}
	return su.Id, tok
}

// TestMain guards against a stray BANK_SANDBOX in the environment flipping the
// suite into production behavior.
func TestMain(m *testing.M) {
	_ = os.Unsetenv("BANK_SANDBOX")
	os.Exit(m.Run())
}
