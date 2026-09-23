package collections

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
)

// every collection this package defines, with the name it must answer to.
var ensures = []struct {
	name   string
	ensure func(core.App) error
	coll   string
}{
	{"account", EnsureAccountCollection, AccountCollectionName},
	{"balance", EnsureBalanceCollection, BalanceCollectionName},
	{"beneficiary", EnsureBeneficiaryCollection, BeneficiaryCollectionName},
	{"transaction", EnsureTransactionCollection, TransactionCollectionName},
	{"fee", EnsureFeeCollection, FeeCollectionName},
	{"card", EnsureCardCollection, CardCollectionName},
	{"wallet", EnsureWalletCollection, WalletCollectionName},
	{"conversion", EnsureConversionCollection, ConversionCollectionName},
	{"audit", EnsureAuditCollection, AuditCollectionName},
	{"session", EnsureSessionCollection, SessionCollectionName},
	{"document", EnsureDocumentCollection, DocumentCollectionName},
}

func newApp(t *testing.T) *tests.TestApp {
	t.Helper()
	app, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("new test app: %v", err)
	}
	t.Cleanup(app.Cleanup)
	return app
}
