package bank

import (
	"strings"
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
		ensureWallets(app, acct)
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
	country := strings.ToUpper(kyc.Country)
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
	// entityType is likewise self-declared, and it is what the limit tier and
	// the fee rate are read from — a business moves ten times an individual's
	// daily figure and pays 30bp against 50bp. So outside the sandbox the field
	// opens at the conservative value whatever was claimed, and the claim is
	// kept beside the rest of the submission. The compliance review sets the
	// tier when it approves; an account is superuser-writable and a customer's
	// is not, so what stands there afterwards is the bank's. (LP-3040 §Security.)
	status, kyc0, risk, method := "pending", "not_started", "medium", "iam"
	declared := entityType
	if Sandbox() {
		status, kyc0, risk, method = "active", "approved", "low", "sandbox-auto"
	} else {
		entityType = "individual"
	}
	acct := core.NewRecord(acctColl)
	acct.Set("owner", user.Id)
	acct.Set("entityName", name)
	acct.Set("entityType", entityType)
	acct.Set("country", country)
	acct.Set("currency", marketCurrency(country))
	acct.Set("status", status)
	acct.Set("kycStatus", kyc0)
	acct.Set("riskRating", risk)
	acct.Set("metadata", map[string]any{
		"sandbox": Sandbox(),
		"kyc": map[string]any{
			"entityType":  declared,
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

	// Crypto wallets — one row per supported asset, carrying the address this
	// account receives at. Which address that is belongs to the custodian: the
	// bank derives one from the deploy mnemonic, or the account's owner has
	// declared one they hold themselves. See custody.go.
	ensureWallets(app, acct)

	if Sandbox() {
		if err := fundSandbox(app, acct, name); err != nil {
			app.Logger().Error("sandbox provisioning partial", "account", acct.Id, "err", err)
		}
	}

	return acct, nil
}

// ensureWallets holds an account's wallet rows to what its custodian answers
// right now: one row per SupportedCrypto asset, carrying the address the account
// receives at. It provisions new accounts and reconciles standing ones, so it is
// safe to call on every boot.
//
// On a real EVM every one of those rows carries the SAME address — an account
// has one address there and receives the coin and every token at it. The rows
// stay per-asset because the row is also where the asset's network and status
// live, and because the simulation really does model separate chains.
func ensureWallets(app core.App, acct *core.Record) {
	walletColl, err := app.FindCollectionByNameOrId(collections.WalletCollectionName)
	if err != nil {
		return
	}
	accountID, cu, cb := acct.Id, custodian(), chain()
	for _, asset := range SupportedCrypto {
		held := cu.Wallet(app, acct, asset)
		w, _ := app.FindFirstRecordByFilter(collections.WalletCollectionName,
			"account = {:a} && currency = {:c}", map[string]any{"a": accountID, "c": asset})
		switch {
		case w == nil:
			// A custodian that cannot answer names no address, and an address
			// the customer cannot receive at is worse than none at all. The row
			// appears on the first boot that can answer for it.
			if held.Address == "" {
				continue
			}
			w = core.NewRecord(walletColl)
			w.Set("account", accountID)
			w.Set("currency", asset)
			w.Set("walletId", held.Ref)
			w.Set("status", "active")
		case !replaces(cu, w.GetString("address"), held.Address):
			continue
		}
		// The address and the network it is on are one fact, so they move together.
		w.Set("address", held.Address)
		w.Set("network", cb.Network())
		_ = app.Save(w)
	}
}

// replaces decides whether a custodian's answer may take the place of a deposit
// address already on record. Written once and trusted forever, a simulated
// address survived a real chain being configured, and coins sent to it are
// unrecoverable — nobody holds that key.
//
// Only a custodian whose addresses have a key behind them may overwrite one. A
// real address over a simulated one recovers an account that could never have
// been swept; the reverse points a customer at an address nobody can spend from,
// so the simulation leaves what it finds. An address nobody has answered for yet
// is empty, and anything that can answer may fill it.
//
// The question is Holds, not which type this is. Asking for a concrete type
// meant every custodian added after the first was silently treated as the
// simulation — a bank that switched to customer custody would have gone on
// showing the address it derived, and the customer would have received at a key
// the bank still held.
func replaces(cu Custodian, recorded, answer string) bool {
	if answer == "" || answer == recorded {
		return false
	}
	if recorded == "" {
		return true
	}
	holds := cu.Holds()
	return holds
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
		details                                      map[string]any
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

	// Final, deterministic display balances — one per fiat and per crypto asset,
	// so every wallet the account provisions shows a holding (and its receive
	// address, incl. the BTC bech32 one) rather than reading half-empty.
	_ = setBalance(app, acct.Id, "USD", 1_250_000)  // $12,500.00
	_ = setBalance(app, acct.Id, "EUR", 320_000)    // €3,200.00
	_ = setBalance(app, acct.Id, "GBP", 175_000)    // £1,750.00
	_ = setBalance(app, acct.Id, "LUX", 250_000000) // 250 LUX
	_ = setBalance(app, acct.Id, "BTC", 185_000)    // 0.185 BTC ≈ $11,840
	_ = setBalance(app, acct.Id, "ETH", 3_600000)   // 3.6 ETH ≈ $12,240
	_ = setBalance(app, acct.Id, "DAI", 500_000000) // 500 DAI

	// One virtual card, active.
	issueCardRecord(app, acct.Id, holder, "USD")

	// An open Earn position so the Liquid vaults screen reads like a real book:
	// staked LUX collateral with a modest self-repaying xUSD loan against it.
	seedPositions(app, acct.Id)
	return nil
}

// seedPositions opens a demo vault position directly — seed state, not a user
// action, so it does not move the wallet balances. Both sides are counted in
// minor units of the vault's own asset, the way a like-kind loan is: the debt is
// the collateral's synthetic, so a ratio of the two is the LTV with no price in
// it.
func seedPositions(app core.App, accountID string) {
	col, err := app.FindCollectionByNameOrId(collections.PositionCollectionName)
	if err != nil {
		return
	}
	seeds := []struct {
		vault      string
		collateral int64 // underlying minor units
		debt       int64 // synthetic owed, minor units of the same asset
	}{
		{"stlux", 180_000000, 96_000000}, // 180 LUX against 96 xLUX, 53% drawn
		{"wsteth", 1_500000, 900000},     // 1.5 ETH against 0.9 xETH, 60% drawn
	}
	for _, s := range seeds {
		if positionFor(app, accountID, s.vault) != nil {
			continue
		}
		p := core.NewRecord(col)
		p.Set("account", accountID)
		p.Set("vault", s.vault)
		p.Set("collateral", s.collateral)
		p.Set("debt", s.debt)
		if err := app.Save(p); err != nil {
			app.Logger().Warn("seed position failed", "vault", s.vault, "err", err)
		}
	}
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

// refreshDemoAccount brings a standing demo account up to the current seed,
// idempotently — every step no-ops when its data already exists, so nothing the
// account holds is disturbed. It backfills per-asset wallets, recipients, Earn
// positions, and the crypto balances added in later builds.
func refreshDemoAccount(app core.App, accountID, seed string) {
	if acct, err := app.FindRecordById(collections.AccountCollectionName, accountID); err == nil {
		ensureWallets(app, acct)
	}
	seedBeneficiaries(app, accountID)
	seedPositions(app, accountID)
	// Crypto balances added after the account was first funded — set only when
	// absent so a real (mutated) balance is never clobbered.
	for cur, amount := range map[string]Minor{"BTC": 185_000, "ETH": 3_600000} {
		if b, _ := app.FindFirstRecordByFilter(collections.BalanceCollectionName,
			"account = {:a} && currency = {:c}", map[string]any{"a": accountID, "c": cur}); b == nil {
			_ = setBalance(app, accountID, cur, amount)
		}
	}
}

// SeedSandbox seeds what a demo needs and no identity (sandbox only).
//
// Everyone signs in through IAM, so the hero's account is opened on the first
// authenticated request rather than at boot — see requireAccount. What is seeded
// here is the curated book of business the console reads, which belongs to
// nobody in particular.
func SeedSandbox(app core.App) {
	if !Sandbox() {
		return
	}

	// The hero account is NOT seeded here any more, because seeding it needs an
	// owner and the owner is IAM's subject — a value this process cannot know at
	// boot. It is opened on the first authenticated request instead
	// (requireAccount), which owns it by whoever IAM actually signed in.
	//
	// What stood here minted a local _superusers record and a bcrypt credential
	// to own it. Base accepts no locally-minted token now, so that account
	// belonged to an identity that could never sign in.

	// Curated book of business so the admin console reads like a live
	// institution (not a one-customer sandbox). Needs no identity. Idempotent.
	seedPortfolio(app)
}
