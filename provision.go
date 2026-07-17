package bank

import (
	"time"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// KYC is the sandbox onboarding payload. In sandbox mode every applicant is
// auto-approved; the data is retained on the account for the demo's compliance
// view. No real identity verification is performed.
type KYC struct {
	Name        string `json:"name"`
	DOB         string `json:"dob"`
	AddressLine string `json:"addressLine"`
	City        string `json:"city"`
	PostalCode  string `json:"postalCode"`
	Country     string `json:"country"`
	EntityType  string `json:"entityType"` // individual | business
}

// primaryAccount returns the caller's single consumer account (or nil).
func primaryAccount(app core.App, userID string) *core.Record {
	recs, _ := app.FindRecordsByFilter(
		collections.AccountCollectionName, "owner = {:u}", "-created", 1, 0,
		map[string]any{"u": userID},
	)
	if len(recs) > 0 {
		return recs[0]
	}
	return nil
}

// ProvisionCustomer opens an account for a user and, in sandbox mode, funds it
// with demo balances, a Lux testnet wallet, a virtual card, and a realistic
// activity history — so the dashboard is alive the moment the customer lands.
// Idempotent: returns the existing account if one is already open.
func ProvisionCustomer(app core.App, user *core.Record, kyc KYC) (*core.Record, error) {
	if acct := primaryAccount(app, user.Id); acct != nil {
		return acct, nil
	}

	name := kyc.Name
	if name == "" {
		name = user.GetString("name")
	}
	if name == "" {
		name = user.GetString("email")
	}
	entityType := kyc.EntityType
	if entityType != "business" {
		entityType = "individual"
	}
	country := kyc.Country
	if len(country) != 2 {
		country = "US"
	}

	acctColl, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	if err != nil {
		return nil, err
	}
	acct := core.NewRecord(acctColl)
	acct.Set("owner", user.Id)
	acct.Set("entityName", name)
	acct.Set("entityType", entityType)
	acct.Set("country", country)
	acct.Set("currency", "USD")
	acct.Set("status", "active")
	acct.Set("kycStatus", "approved") // sandbox: auto-approve
	acct.Set("riskRating", "low")
	acct.Set("metadata", map[string]any{
		"sandbox": true,
		"kyc": map[string]any{
			"dob":         kyc.DOB,
			"addressLine": kyc.AddressLine,
			"city":        kyc.City,
			"postalCode":  kyc.PostalCode,
			"country":     country,
			"approvedAt":  time.Now().UTC().Format(time.RFC3339),
			"method":      "sandbox-auto",
		},
		"iban": sandboxIBAN("USD"),
	})
	if err := app.Save(acct); err != nil {
		return nil, err
	}

	// Crypto wallet (Lux testnet). Production uses threshold MPC keygen; the
	// sandbox derives a stable display address from the principal.
	if walletColl, err := app.FindCollectionByNameOrId(collections.WalletCollectionName); err == nil {
		w := core.NewRecord(walletColl)
		w.Set("account", acct.Id)
		w.Set("currency", "LUX")
		w.Set("walletId", "mpc:"+user.Id)
		w.Set("address", luxTestnetAddress(user.Id))
		w.Set("network", "lux-testnet")
		w.Set("status", "active")
		_ = app.Save(w)
	}

	if Sandbox() {
		if err := fundSandbox(app, acct, name); err != nil {
			app.Logger().Error("sandbox provisioning partial", "account", acct.Id, "err", err)
		}
	}

	return acct, nil
}

// fundSandbox seeds demo balances, a virtual card, and activity history.
func fundSandbox(app core.App, acct *core.Record, holder string) error {
	// Headroom first so seed debits pass the pre-create balance check; final
	// display balances are force-set at the end.
	_ = setBalance(app, acct.Id, "USD", 5_000_000)

	// A believable opening story: salary in, a card load, an FX, a payment out.
	seedTxns := []map[string]any{
		{"type": "deposit", "direction": "credit", "amount": 850_000, "currency": "USD", "status": "completed", "reference": "Payroll — Acme Corp"},
		{"type": "deposit", "direction": "credit", "amount": 420_000, "currency": "USD", "status": "completed", "reference": "Incoming SWIFT — Northwind Ltd"},
		{"type": "payment", "direction": "debit", "amount": 89_900, "currency": "USD", "status": "completed", "reference": "Card — Apple Store"},
		{"type": "payment", "direction": "debit", "amount": 154_000, "currency": "USD", "status": "completed", "reference": "Rent — Sandbox Realty"},
		{"type": "conversion", "direction": "debit", "amount": 300_000, "currency": "USD", "status": "completed", "reference": "FX USD → EUR"},
		{"type": "deposit", "direction": "credit", "amount": 276_000, "currency": "EUR", "status": "completed", "reference": "FX USD → EUR"},
	}
	for _, f := range seedTxns {
		f["account"] = acct.Id
		if _, err := newTx(app, f); err != nil {
			app.Logger().Warn("seed txn failed", "ref", f["reference"], "err", err)
		}
	}

	// Final, deterministic display balances.
	_ = setBalance(app, acct.Id, "USD", 1_250_000)  // $12,500.00
	_ = setBalance(app, acct.Id, "EUR", 320_000)    // €3,200.00
	_ = setBalance(app, acct.Id, "GBP", 175_000)    // £1,750.00
	_ = setBalance(app, acct.Id, "LUX", 250_000000) // 250 LUX
	_ = setBalance(app, acct.Id, "DAI", 500_000000) // 500 DAI

	// One virtual card, active.
	issueCardRecord(app, acct.Id, holder, "USD")
	return nil
}

// issueCardRecord creates a virtual sandbox card and returns it (CVV is not
// stored — the caller surfaces it once if needed).
func issueCardRecord(app core.App, accountID, holder, currency string) *core.Record {
	col, err := app.FindCollectionByNameOrId(collections.CardCollectionName)
	if err != nil {
		return nil
	}
	last4 := randDigits(4)
	now := time.Now().UTC()
	card := core.NewRecord(col)
	card.Set("account", accountID)
	card.Set("holderName", holder)
	card.Set("brand", "visa")
	card.Set("type", "virtual")
	card.Set("last4", last4)
	card.Set("display", "4242 42•• •••• "+last4)
	card.Set("expMonth", int(now.Month()))
	card.Set("expYear", now.Year()+3)
	card.Set("currency", currency)
	card.Set("status", "active")
	card.Set("design", "aurora")
	if err := app.Save(card); err != nil {
		app.Logger().Warn("card issue failed", "err", err)
		return nil
	}
	return card
}

// SeedSandbox creates a demo customer with a fully-funded account on first boot
// (sandbox only). The login itself is IAM-native (lux.id); this record makes
// the admin/API views alive and mirrors what every new signup receives.
func SeedSandbox(app core.App) {
	if !Sandbox() {
		return
	}
	const demoEmail = "demo@lux.financial"

	users, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return
	}
	existing, _ := app.FindFirstRecordByFilter("users", "email = {:e}", map[string]any{"e": demoEmail})
	if existing == nil {
		existing = core.NewRecord(users)
		existing.Set("email", demoEmail)
		existing.Set("name", "Demo Customer")
		existing.Set("verified", true)
		// IAM-native Base auth collections have no local password; the record is
		// a passive directory mirror (tokenKey is auto-generated on save).
		if err := app.Save(existing); err != nil {
			app.Logger().Warn("seed: demo user create failed", "err", err)
			return
		}
	}

	if primaryAccount(app, existing.Id) != nil {
		return // already provisioned
	}
	if _, err := ProvisionCustomer(app, existing, KYC{
		Name: "Demo Customer", Country: "US", EntityType: "individual",
		DOB: "1990-01-01", AddressLine: "1 Market St", City: "San Francisco", PostalCode: "94105",
	}); err != nil {
		app.Logger().Warn("seed: provisioning failed", "err", err)
		return
	}
	app.Logger().Info("sandbox seed: demo customer ready", "email", demoEmail)
}
