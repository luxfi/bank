package bank

import (
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
	"github.com/luxfi/bank/hooks"
)

// opened runs onboarding for a fresh identity with the entity type it claims,
// and returns the account as it was stored.
func opened(t *testing.T, app core.App, email, claims string) *core.Record {
	t.Helper()
	col, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		t.Fatal(err)
	}
	u := core.NewRecord(col)
	u.SetEmail(email)
	u.Set("password", "a-long-enough-password")
	if err := app.Save(u); err != nil {
		t.Fatalf("save %s: %v", email, err)
	}
	acct, err := ProvisionCustomer(app, u, KYC{Name: "Claimant", Country: "US", EntityType: claims})
	if err != nil {
		t.Fatalf("onboard %s: %v", email, err)
	}
	return acct
}

// The entity type arrives in the onboarding body, and it is what the limit tier
// and the fee rate are read from: a business moves ten times an individual's
// daily figure — $500,000 against $50,000 — and pays 30bp against 50bp. Both
// favour whoever types the word.
//
// So outside the sandbox the field opens at the conservative value whatever was
// claimed. The claim is kept beside the rest of the submission; the compliance
// review sets the tier when it approves, and since a customer cannot write
// their own account, what stands there afterwards is the bank's.
func TestAClaimedEntityTypeDoesNotSetTheTier(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	app := newBankApp(t)

	acct := opened(t, app, "claims-business@example.com", "business")
	if got := acct.GetString("entityType"); got != "individual" {
		t.Errorf("an account that claimed business opened as %q — ten times the daily limit for typing a word", got)
	}

	// What was claimed is not thrown away: a reviewer needs to see it.
	var meta struct {
		KYC struct {
			EntityType string `json:"entityType"`
		} `json:"kyc"`
	}
	if err := acct.UnmarshalJSONField("metadata", &meta); err != nil {
		t.Fatalf("reading the submission: %v", err)
	}
	if meta.KYC.EntityType != "business" {
		t.Errorf("the submission records the claim as %q, want business", meta.KYC.EntityType)
	}
}

// And the tier that is stored is the tier that is enforced — measured against
// the gate rather than read off the record, since the record is only half the
// question.
func TestTheStoredTierIsWhatTheLimitGateUses(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	app := newBankApp(t)
	hooks.RegisterAccountHooks(app)

	// $200,000: over an individual's daily limit, under a business's.
	const amount = 200_000_00

	acct := opened(t, app, "claims-business@example.com", "business")
	acct.Set("status", "active")
	acct.Set("kycStatus", "approved")
	if err := app.Save(acct); err != nil {
		t.Fatal(err)
	}
	if err := setBalance(app, acct.Id, "USD", 1_000_000_00); err != nil {
		t.Fatal(err)
	}

	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	debit := func() error {
		r := core.NewRecord(col)
		r.Set("account", acct.Id)
		r.Set("type", "payment")
		r.Set("direction", "debit")
		r.Set("amount", amount)
		r.Set("currency", "USD")
		r.Set("status", "pending")
		return app.Save(r)
	}

	if err := debit(); err == nil {
		t.Error("an account that claimed business moved $200,000 on its own say-so")
	}

	// A reviewer raising the tier is what makes it real. Only the bank can:
	// accounts are superuser-writable and a customer's token is not.
	acct.Set("entityType", "business")
	if err := app.Save(acct); err != nil {
		t.Fatal(err)
	}
	if err := debit(); err != nil {
		t.Errorf("a reviewed business account was still refused $200,000: %v", err)
	}
}

// The sandbox is the demo and keeps what it was told, so the seeded business
// customer still reads as one.
func TestTheSandboxKeepsTheClaimedType(t *testing.T) {
	app := newBankApp(t)
	if got := opened(t, app, "demo-business@example.com", "business").GetString("entityType"); got != "business" {
		t.Errorf("the sandbox stored a claimed business as %q", got)
	}
}
