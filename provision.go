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
		// Backfill any wallet the account is missing — an account opened by an
		// earlier build predates per-asset wallets, so this self-heals it.
		ensureWallets(app, acct.Id, user.Id)
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
	// Only the sandbox auto-approves. On real rails an account opens pending,
	// unverified, and medium-risk; status/kycStatus/riskRating transition only
	// from the compliance service, never from self-asserted onboarding data.
	// entityType is likewise self-declared here and must NOT be trusted to set
	// the limit tier outside sandbox — the compliance review sets the tier when
	// it approves. (See LP-3040 §Security.)
	status, kyc0, risk, method := "pending", "not_started", "medium", "iam"
	if Sandbox() {
		status, kyc0, risk, method = "active", "approved", "low", "sandbox-auto"
	}
	acct := core.NewRecord(acctColl)
	acct.Set("owner", user.Id)
	acct.Set("entityName", name)
	acct.Set("entityType", entityType)
	acct.Set("country", country)
	acct.Set("currency", "USD")
	acct.Set("status", status)
	acct.Set("kycStatus", kyc0)
	acct.Set("riskRating", risk)
	acct.Set("metadata", map[string]any{
		"sandbox": Sandbox(),
		"kyc": map[string]any{
			"dob":         kyc.DOB,
			"addressLine": kyc.AddressLine,
			"city":        kyc.City,
			"postalCode":  kyc.PostalCode,
			"country":     country,
			"submittedAt": time.Now().UTC().Format(time.RFC3339),
			"method":      method,
		},
	})
	if err := app.Save(acct); err != nil {
		return nil, err
	}

	// Crypto wallets — one per supported asset, each with its own chain-derived
	// deposit address (a BTC address is bech32, an EVM asset is 0x). Production
	// provisions keys by threshold MPC; the sandbox derives stable display
	// addresses from the principal via the chain backend.
	ensureWallets(app, acct.Id, user.Id)

	if Sandbox() {
		if err := fundSandbox(app, acct, name); err != nil {
			app.Logger().Error("sandbox provisioning partial", "account", acct.Id, "err", err)
		}
	}

	return acct, nil
}

// ensureWallets creates one wallet per SupportedCrypto asset for an account,
// each with its own chain-derived deposit address. Idempotent: an asset that
// already has a wallet is left untouched, so it both provisions new accounts
// and backfills accounts opened before per-asset wallets existed.
func ensureWallets(app core.App, accountID, seed string) {
	walletColl, err := app.FindCollectionByNameOrId(collections.WalletCollectionName)
	if err != nil {
		return
	}
	cb := chain()
	for _, asset := range SupportedCrypto {
		existing, _ := app.FindFirstRecordByFilter(collections.WalletCollectionName,
			"account = {:a} && currency = {:c}", map[string]any{"a": accountID, "c": asset})
		if existing != nil {
			continue
		}
		w := core.NewRecord(walletColl)
		w.Set("account", accountID)
		w.Set("currency", asset)
		w.Set("walletId", "mpc:"+asset+":"+seed)
		w.Set("address", cb.Address(seed, asset))
		w.Set("network", cb.Network())
		w.Set("status", "active")
		_ = app.Save(w)
	}
}

// seedBeneficiaries seeds a few verified payment recipients so the Send screen
// opens with a populated recipient list instead of an empty form. Idempotent.
func seedBeneficiaries(app core.App, accountID string) {
	if existing, _ := app.FindFirstRecordByFilter(collections.BeneficiaryCollectionName,
		"account = {:a}", map[string]any{"a": accountID}); existing != nil {
		return
	}
	col, err := app.FindCollectionByNameOrId(collections.BeneficiaryCollectionName)
	if err != nil {
		return
	}
	seeds := []struct {
		name, holder, currency, country, paymentType string
		details                                       map[string]any
	}{
		{"Northwind Ltd", "Northwind Trading Ltd", "GBP", "GB", "regular", map[string]any{"iban": "GB29NWBK60161331926819", "bic": "NWBKGB2L", "sortCode": "601613", "accountNumber": "31926819"}},
		{"Lindqvist AB", "Lindqvist Handels AB", "EUR", "SE", "regular", map[string]any{"iban": "SE4550000000058398257466", "bic": "ESSESESS"}},
		{"Blackwood Consulting", "Blackwood Consulting LLC", "USD", "US", "priority", map[string]any{"accountNumber": "4830261905", "routing": "021000021"}},
		{"Meridian Labs", "Meridian Labs Inc", "USD", "US", "regular", map[string]any{"accountNumber": "9921740385", "routing": "026009593"}},
	}
	for _, s := range seeds {
		b := core.NewRecord(col)
		b.Set("account", accountID)
		b.Set("name", s.name)
		b.Set("bankAccountHolder", s.holder)
		b.Set("currency", s.currency)
		b.Set("country", s.country)
		b.Set("paymentType", s.paymentType)
		b.Set("bankDetails", s.details)
		b.Set("verified", true)
		if err := app.Save(b); err != nil {
			app.Logger().Warn("seed beneficiary failed", "name", s.name, "err", err)
		}
	}
}

// fundSandbox seeds demo balances, a virtual card, and activity history.
func fundSandbox(app core.App, acct *core.Record, holder string) error {
	// Headroom first so seed debits pass the pre-create balance check; final
	// display balances are force-set at the end.
	_ = setBalance(app, acct.Id, "USD", 5_000_000)

	// A believable book: wires in, payroll, card spend at named merchants, an
	// FX, a crypto receive — varied enough that the activity feed reads like a
	// real account, not a test loop.
	seedTxns := []map[string]any{
		{"type": "deposit", "direction": "credit", "amount": 850_000, "currency": "USD", "status": "completed", "reference": "Payroll — Meridian Labs"},
		{"type": "deposit", "direction": "credit", "amount": 420_000, "currency": "USD", "status": "completed", "reference": "Incoming wire — Northwind Ltd"},
		{"type": "deposit", "direction": "credit", "amount": 128_500, "currency": "USD", "status": "completed", "reference": "Refund — Stripe"},
		{"type": "card", "direction": "debit", "amount": 4_299, "currency": "USD", "status": "completed", "reference": "Card — Apple Store"},
		{"type": "card", "direction": "debit", "amount": 1_842, "currency": "USD", "status": "completed", "reference": "Card — Whole Foods Market"},
		{"type": "card", "direction": "debit", "amount": 1_299, "currency": "USD", "status": "completed", "reference": "Card — Uber"},
		{"type": "card", "direction": "debit", "amount": 2_000, "currency": "USD", "status": "completed", "reference": "Card — Amazon"},
		{"type": "payment", "direction": "debit", "amount": 154_000, "currency": "USD", "status": "completed", "reference": "Rent — Kearny Street Holdings"},
		{"type": "payment", "direction": "debit", "amount": 68_400, "currency": "USD", "status": "completed", "reference": "Wire — Blackwood Consulting"},
		{"type": "conversion", "direction": "debit", "amount": 300_000, "currency": "USD", "status": "completed", "reference": "Converted USD → EUR"},
		{"type": "deposit", "direction": "credit", "amount": 276_000, "currency": "EUR", "status": "completed", "reference": "Converted USD → EUR"},
		{"type": "payment", "direction": "debit", "amount": 92_000, "currency": "EUR", "status": "completed", "reference": "Supplier — Lindqvist AB"},
		{"type": "deposit", "direction": "credit", "amount": 50_000000, "currency": "LUX", "status": "completed", "reference": "Received LUX"},
		{"type": "deposit", "direction": "credit", "amount": 10_000, "currency": "GBP", "status": "completed", "reference": "Incoming Faster Payment — Halden & Co"},
	}
	// Crypto seeds need their own headroom so the pre-create hold passes.
	_ = setBalance(app, acct.Id, "LUX", 210_000000)
	for _, f := range seedTxns {
		f["account"] = acct.Id
		if _, err := newTx(app, f); err != nil {
			app.Logger().Warn("seed txn failed", "ref", f["reference"], "err", err)
		}
	}

	seedBeneficiaries(app, acct.Id)

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

// cardBIN is the Visa sandbox test BIN. It lives in exactly one place; both the
// masked display and the one-time full PAN derive from it, so the number can
// never drift between the stored mask and what a reveal shows.
const cardBIN = "424242424242"

// sandboxPAN is the full 16-digit card number, shown once at issue and never
// stored. maskedPAN is the persisted display form (only last4 is recoverable).
func sandboxPAN(last4 string) string {
	return cardBIN[0:4] + " " + cardBIN[4:8] + " " + cardBIN[8:12] + " " + last4
}
func maskedPAN(last4 string) string {
	return cardBIN[0:4] + " " + cardBIN[4:6] + "•• •••• " + last4
}

// issueCardRecord creates a virtual sandbox card and returns it (CVV and the
// full PAN are not stored — the caller surfaces them once if needed).
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
	card.Set("display", maskedPAN(last4))
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

// SeedSandbox seeds the hero demo identity on boot (sandbox only):
//   - a _superusers record (so the shared DB is writable/seedable and the
//     demo login can mint a superuser token — the only local token bankd's
//     external-auth mode accepts),
//   - a bcrypt-hashed sandbox credential for that email (never plaintext),
//   - a fully-funded customer account owned by the superuser id.
//
// The hero logs in at app.lux.financial with email + password (sandbox login),
// landing on a populated dashboard. Real signups still use IAM (lux.id).
func SeedSandbox(app core.App) {
	if !Sandbox() {
		return
	}
	email := DemoEmail()

	su, err := ensureDemoSuperuser(app, email, DemoPassword())
	if err != nil {
		app.Logger().Warn("seed: demo superuser failed", "err", err)
		return
	}

	if primaryAccount(app, su.Id) == nil {
		if _, err := ProvisionCustomer(app, su, KYC{
			Name: "Lux Demo", Country: "US", EntityType: "individual",
			DOB: "1990-01-01", AddressLine: "1 Market St", City: "San Francisco", PostalCode: "94105",
		}); err != nil {
			app.Logger().Warn("seed: provisioning failed", "err", err)
			return
		}
	}
	app.Logger().Info("sandbox seed: hero customer ready", "email", email)

	// Curated book of business so the admin console reads like a live
	// institution (not a one-customer sandbox). Idempotent.
	seedPortfolio(app)
}
