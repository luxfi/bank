package bank

import (
	"fmt"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// Portfolio seed (sandbox / demo)
//
// The hero login (SeedSandbox) is one funded customer. A single-customer bank
// reads as a toy in a demo. seedPortfolio adds a curated book of business — a
// realistic spread of individuals and corporates across jurisdictions, KYC
// states, and risk tiers — so the admin console (customers, accounts, treasury,
// transactions, compliance queue) looks like a live institution the moment an
// investor lands on it.
//
// These are ACCOUNT records only: brand-neutral names (no "Lux" string, so the
// white-label rebrand leaves them clean), plain-string owner ids (the accounts
// collection stores owner as free text, not a relation), auto-approved-or-not
// per the curated KYC state. The admin derives balances, cards, wallets and
// compliance cases deterministically over whatever accounts exist —
// so seeding the book here lights up every downstream view. No real money, no
// real identities; sandbox only.
// -----------------------------------------------------------------------------

// pfAccount is one curated book entry.
type pfAccount struct {
	name    string
	kind    string // individual | business
	country string // ISO-3166 alpha-2
	ccy     string // ISO-4217 base currency
	kyc     string // approved | pending | not_started | rejected
	risk    string // low | medium | high
	status  string // active | suspended | closed
	ageDays int    // account age, for a believable created spread
}

// portfolioBook is the demo book of business. Curated (not random) so every row
// is credible and the aggregate reads like a real institution: corporates with
// treasury-scale balances, a long tail of retail, a handful of pending-KYC and
// elevated-risk names to make the compliance queue non-empty. ~55% business.
var portfolioBook = []pfAccount{
	// Corporates — approved, low/medium risk, treasury-scale (drive liquidity + FX mix)
	{"Meridian Robotics", "business", "US", "USD", "approved", "low", "active", 412},
	{"Northwind Freight", "business", "GB", "GBP", "approved", "low", "active", 388},
	{"Halcyon Capital", "business", "US", "USD", "approved", "medium", "active", 351},
	{"Aperture Studios", "business", "DE", "EUR", "approved", "low", "active", 322},
	{"Solaris Energy", "business", "AE", "AED", "approved", "medium", "active", 297},
	{"Cobalt Semiconductors", "business", "SG", "SGD", "approved", "low", "active", 268},
	{"Atlas Logistics", "business", "US", "USD", "approved", "low", "active", 241},
	{"Lumen Payments", "business", "GB", "GBP", "approved", "medium", "active", 214},
	{"Ironwood Timber", "business", "CA", "CAD", "approved", "low", "active", 190},
	{"Quantum Textiles", "business", "JP", "JPY", "approved", "low", "active", 166},
	{"Cedar Grove Foods", "business", "US", "USD", "approved", "low", "active", 138},
	{"Vector Health", "business", "CH", "CHF", "approved", "medium", "active", 121},
	// Corporates — in-flight / elevated (populate compliance queue)
	{"Bluepeak Trading", "business", "AE", "AED", "pending", "high", "active", 22},
	{"Silvermoon Ventures", "business", "SG", "SGD", "pending", "medium", "active", 14},
	{"Redline Motorsport", "business", "DE", "EUR", "rejected", "high", "suspended", 9},

	// Individuals — retail spread across regions
	{"Amelia Chen", "individual", "US", "USD", "approved", "low", "active", 205},
	{"Marcus Delgado", "individual", "US", "USD", "approved", "low", "active", 182},
	{"Priya Nair", "individual", "GB", "GBP", "approved", "low", "active", 159},
	{"Yuki Tanaka", "individual", "JP", "JPY", "approved", "low", "active", 133},
	{"Fatima Al-Sayed", "individual", "AE", "AED", "approved", "medium", "active", 96},
	{"Lars Eriksson", "individual", "CH", "CHF", "approved", "low", "active", 74},
	{"Grace Okafor", "individual", "GB", "GBP", "pending", "low", "active", 18},
	{"Daniel Rossi", "individual", "CA", "CAD", "not_started", "low", "active", 6},
	{"Noor Rahman", "individual", "SG", "SGD", "approved", "high", "active", 41},
}

// pfOwnerPrefix marks portfolio-seeded accounts so seedPortfolio is idempotent
// (and any external seeding using the same prefix is respected).
const pfOwnerPrefix = "seed:pf:"

// seedPortfolio adds the curated demo book if it has not been seeded yet.
// Idempotent: if any account with the portfolio owner prefix already exists it
// returns immediately, so restarts and re-deploys never duplicate the book.
func seedPortfolio(app core.App) {
	if !Sandbox() {
		return
	}
	existing, _ := app.FindRecordsByFilter(
		collections.AccountCollectionName, "owner ~ {:p}", "-created", 1, 0,
		map[string]any{"p": pfOwnerPrefix + "%"},
	)
	if len(existing) > 0 {
		return // already seeded
	}

	coll, err := app.FindCollectionByNameOrId(collections.AccountCollectionName)
	if err != nil {
		app.Logger().Warn("portfolio seed: accounts collection missing", "err", err)
		return
	}

	now := time.Now().UTC()
	seeded := 0
	for i, e := range portfolioBook {
		acct := core.NewRecord(coll)
		acct.Set("owner", fmt.Sprintf("%s%02d", pfOwnerPrefix, i))
		acct.Set("entityName", e.name)
		acct.Set("entityType", e.kind)
		acct.Set("country", e.country)
		acct.Set("currency", e.ccy)
		acct.Set("status", e.status)
		acct.Set("kycStatus", e.kyc)
		acct.Set("riskRating", e.risk)
		created := now.Add(-time.Duration(e.ageDays) * 24 * time.Hour)
		acct.Set("metadata", map[string]any{
			"sandbox":   true,
			"portfolio": true,
			"iban":      sandboxIBAN(e.ccy),
			"kyc": map[string]any{
				"country":    e.country,
				"method":     "sandbox-book",
				"approvedAt": created.Format(time.RFC3339),
			},
		})
		if err := app.Save(acct); err != nil {
			app.Logger().Warn("portfolio seed: account save failed", "name", e.name, "err", err)
			continue
		}
		seeded++
	}
	app.Logger().Info("sandbox seed: portfolio book ready", "accounts", seeded)
}
