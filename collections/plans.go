package collections

import "github.com/hanzoai/base/core"

// Plan is a Lux membership tier — one ladder across the bank
// (lux.finance), the card program (lux.credit), and the platform.
// Monetary values are minor units (cents); percentages are on majors.
// Priced above the issuer cost basis (see the sfprivate fee schedule
// on docs.lux.financial): account + card stack $25/mo, wires $75,
// ACH $10, FX 1.75–2.55%, deposit 1%.
type Plan struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Monthly      int64    `json:"monthly"`
	Card         string   `json:"card"` // included card: virtual | plastic | metal
	IBAN         bool     `json:"iban"` // wallet bank account included
	FreeACH      int      `json:"freeACH"`
	FreeWires    int      `json:"freeWires"`
	ACHFee       int64    `json:"achFee"`  // beyond allowance
	WireFee      int64    `json:"wireFee"` // beyond allowance
	FXPct        float64  `json:"fxPct"`
	DepositPct   float64  `json:"depositPct"`
	DailyLimit   int64    `json:"dailyLimit"`
	MonthlyLimit int64    `json:"monthlyLimit"`
	Holders      int      `json:"holders"`
	Invite       bool     `json:"invite,omitempty"`
	Perks        []string `json:"perks"`
}

// Plans is the published ladder, lowest to highest.
var Plans = []Plan{
	{
		ID: "silver", Name: "Silver", Monthly: 29_00,
		Card: "virtual", IBAN: false,
		FreeACH: 2, FreeWires: 0, ACHFee: 15_00, WireFee: 95_00,
		FXPct: 2.25, DepositPct: 1.5,
		DailyLimit: 10_000_00, MonthlyLimit: 100_000_00, Holders: 1,
		Perks: []string{
			"Virtual card in Apple Pay + Google Pay",
			"Multi-currency ewallet + P2P",
			"Non-custodial crypto wallet",
		},
	},
	{
		ID: "gold", Name: "Gold", Monthly: 99_00,
		Card: "plastic", IBAN: true,
		FreeACH: 10, FreeWires: 1, ACHFee: 12_00, WireFee: 85_00,
		FXPct: 1.95, DepositPct: 1.25,
		DailyLimit: 50_000_00, MonthlyLimit: 500_000_00, Holders: 1,
		Perks: []string{
			"Dedicated IBAN account",
			"Plastic card, shipped worldwide",
			"Priority support",
		},
	},
	{
		ID: "black", Name: "Black", Monthly: 299_00,
		Card: "metal", IBAN: true,
		FreeACH: 100, FreeWires: 3, ACHFee: 0, WireFee: 85_00,
		FXPct: 1.45, DepositPct: 1.0,
		DailyLimit: 250_000_00, MonthlyLimit: 2_500_000_00, Holders: 2,
		Perks: []string{
			"Metal card (annual commitment)",
			"Free ACH, 3 free wires monthly",
			"Borrow against your crypto — Liquid Protocol",
			"Pairs with the lux.credit Black Card",
		},
	},
	{
		ID: "sovereign", Name: "Sovereign", Monthly: 999_00,
		Card: "metal", IBAN: true, Invite: true,
		FreeACH: 100, FreeWires: 10, ACHFee: 0, WireFee: 75_00,
		FXPct: 0.95, DepositPct: 0.75,
		DailyLimit: 1_000_000_00, MonthlyLimit: 10_000_000_00, Holders: 3,
		Perks: []string{
			"Private banker + concierge",
			"10 free wires monthly, FX under 1%",
			"Up to 3 account holders",
			"Pairs with the lux.credit Sovereign Card",
		},
	},
}

// planField is the accounts-collection membership field; empty means the
// entity-type default limits apply.
func planField() *core.SelectField {
	ids := make([]string, len(Plans))
	for i, p := range Plans {
		ids[i] = p.ID
	}
	return &core.SelectField{Name: "plan", Values: ids, MaxSelect: 1}
}

// PlanByID returns the plan, or false when the id names no tier.
func PlanByID(id string) (Plan, bool) {
	for _, p := range Plans {
		if p.ID == id {
			return p, true
		}
	}
	return Plan{}, false
}
