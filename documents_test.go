package bank

import (
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/filesystem"
	"github.com/luxfi/bank/collections"
)

// onePixelPNG is a valid 1x1 PNG — the collection mime-checks what it stores,
// so the bytes have to actually be one.
var onePixelPNG = []byte{
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
	0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
	0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
	0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
	0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
	0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
}

// doc creates a KYC document of the given type, with whatever status is asked
// for ("" to leave it to the default), and returns the save error.
func doc(t *testing.T, app core.App, account, kind, status string) (*core.Record, error) {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.DocumentCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", account)
	r.Set("type", kind)
	if status != "" {
		r.Set("status", status)
	}
	// The file is required and mime-checked, so a document is a real upload
	// even here: a one-pixel PNG is the smallest thing the collection accepts.
	f, err := filesystem.NewFileFromBytes(onePixelPNG, "scan.png")
	if err != nil {
		t.Fatal(err)
	}
	r.Set("file", f)
	return r, app.Save(r)
}

// The status a new document opens at is load-bearing rather than cosmetic: the
// field is required, so a document created without one is refused outright —
// "cannot be blank" — and nobody can submit anything for review. The default is
// what makes the collection usable, so it is checked where it is stored rather
// than on the instance the caller happens to hold.
func TestANewDocumentOpensPending(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	r, err := doc(t, app, acct.Id, "passport", "")
	if err != nil {
		t.Fatalf("a document with no status was refused: %v", err)
	}
	stored, err := app.FindRecordById(collections.DocumentCollectionName, r.Id)
	if err != nil {
		t.Fatal(err)
	}
	if got := stored.GetString("status"); got != "pending" {
		t.Errorf("a new document is stored %q, want pending", got)
	}
}

// A status that was asked for is kept — the default fills a gap, it does not
// overwrite an answer. A reviewer approving on submission would otherwise find
// the decision reset.
func TestADocumentKeepsTheStatusItWasGiven(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	r, err := doc(t, app, acct.Id, "passport", "approved")
	if err != nil {
		t.Fatalf("save: %v", err)
	}
	stored, _ := app.FindRecordById(collections.DocumentCollectionName, r.Id)
	if got := stored.GetString("status"); got != "approved" {
		t.Errorf("a document created approved is stored %q", got)
	}
}

// Every type the bank asks a customer for is one it accepts, and nothing else
// is. The list lives in the hook because the field is free text — so this is
// the only thing standing between a typo in an upload form and a document
// nobody will ever review.
func TestOnlyTheDocumentsTheBankAsksForAreAccepted(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	for _, kind := range []string{
		"passport", "drivers_license", "utility_bill",
		"bank_statement", "selfie", "proof_of_address",
	} {
		if _, err := doc(t, app, acct.Id, kind, ""); err != nil {
			t.Errorf("%s is a document the bank asks for and it was refused: %v", kind, err)
		}
	}

	for _, kind := range []string{"", "not-a-doc", "PASSPORT", "passport ", "id_card"} {
		_, err := doc(t, app, acct.Id, kind, "")
		if err == nil {
			t.Errorf("%q was accepted as a document type", kind)
			continue
		}
		if !strings.Contains(strings.ToLower(err.Error()), "document type") {
			t.Errorf("%q was refused, but for %v rather than its type", kind, err)
		}
	}
}

// A review decision is auditable. Approving or rejecting somebody's identity
// document is the record a regulator asks for, so the trail has to carry which
// document, which way it went, and what it was before.
func TestAReviewDecisionIsAudited(t *testing.T) {
	app := newBankApp(t)
	id, _ := seedPrincipal(t, app)
	acct := primaryAccount(app, id)

	r, err := doc(t, app, acct.Id, "passport", "")
	if err != nil {
		t.Fatalf("save: %v", err)
	}

	fresh, err := app.FindRecordById(collections.DocumentCollectionName, r.Id)
	if err != nil {
		t.Fatal(err)
	}
	fresh.Set("status", "approved")
	if err := app.Save(fresh); err != nil {
		t.Fatalf("approve: %v", err)
	}

	logs, err := app.FindRecordsByFilter(collections.AuditCollectionName,
		"action = 'document_approved'", "-created", 5, 0, nil)
	if err != nil {
		t.Fatalf("reading the audit trail: %v", err)
	}
	if len(logs) == 0 {
		t.Fatal("approving a document left no audit record")
	}
	if got := logs[0].GetString("account"); got != acct.Id {
		t.Errorf("the audit record names account %q, want %q", got, acct.Id)
	}
}
