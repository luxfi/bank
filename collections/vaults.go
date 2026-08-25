package collections

import "github.com/hanzoai/base/core"

// Vault is a Liquid Protocol market: deposit a yield-bearing collateral asset,
// borrow the vault's synthetic x-token against it up to MaxLTV, and the
// collateral's yield (APY) flows to repay the debt — a self-repaying loan.
// This is a curated catalog (like Plans), not user data. Underlying is the
// balance currency actually moved when depositing (the collateral is that
// asset in yield-bearing form).
type Vault struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Collateral  string  `json:"collateral"` // yield-bearing form deposited (stLUX, wstETH…)
	Underlying  string  `json:"underlying"` // balance currency moved (LUX, ETH, USD, DAI)
	Synthetic   string  `json:"synthetic"`  // x-token borrowed against it (xLUX, xETH, xUSD)
	APY         float64 `json:"apy"`        // collateral yield, percent per year
	MaxLTV      float64 `json:"maxLtv"`     // borrow ceiling as a fraction of collateral value
	TVLUsd      int64   `json:"tvlUsd"`     // total value locked, USD cents
	Description string  `json:"description"`
}

// Vaults is the published Liquid Protocol market list.
var Vaults = []Vault{
	{
		ID: "stlux", Name: "Staked LUX", Collateral: "stLUX", Underlying: "LUX", Synthetic: "xLUX",
		APY: 8.2, MaxLTV: 0.90, TVLUsd: 48_200_000_00,
		Description: "Stake LUX for network yield and borrow xLUX against it. Staking rewards repay the loan.",
	},
	{
		ID: "wsteth", Name: "Wrapped stETH", Collateral: "wstETH", Underlying: "ETH", Synthetic: "xETH",
		APY: 3.4, MaxLTV: 0.90, TVLUsd: 126_500_000_00,
		Description: "Deposit ETH as wstETH and borrow xETH. Ethereum staking yield flows to your debt.",
	},
	{
		ID: "usdc", Name: "USD Coin", Collateral: "USDC", Underlying: "USD", Synthetic: "xUSD",
		APY: 6.5, MaxLTV: 0.90, TVLUsd: 89_400_000_00,
		Description: "Deposit USD into money-market strategies and borrow stable xUSD against it.",
	},
	{
		ID: "sdai", Name: "Savings DAI", Collateral: "sDAI", Underlying: "DAI", Synthetic: "xUSD",
		APY: 5.1, MaxLTV: 0.85, TVLUsd: 31_800_000_00,
		Description: "Earn the DAI savings rate and borrow xUSD without selling your DAI.",
	},
}

const PositionCollectionName = "positions"

// EnsurePositionCollection creates the positions collection: one record per
// account per vault, holding deposited collateral (underlying minor units) and
// outstanding debt (USD cents). Superuser-only; read/written through the
// authenticated /v1/bank/earn routes.
func EnsurePositionCollection(app core.App) error {
	if existing, err := app.FindCollectionByNameOrId(PositionCollectionName); err == nil {
		if existing.Fields.GetByName("tokenId") == nil {
			existing.Fields.Add(tokenIDField())
			return app.Save(existing)
		}
		return nil
	}
	c := core.NewBaseCollection(PositionCollectionName, PositionCollectionName)
	c.Fields.Add(
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},
		// Vault catalog id (stlux, wsteth, …).
		&core.TextField{Name: "vault", Required: true},
		// Deposited collateral, in minor units of the vault's underlying asset.
		// Not Required: a position legitimately holds 0 on one side (a fresh
		// deposit before borrowing, or a fully repaid loan), and Base treats a
		// required number's 0 as blank — which would 500 the save.
		&core.NumberField{Name: "collateral"},
		// Outstanding borrowed debt, in USD cents.
		&core.NumberField{Name: "debt"},
		tokenIDField(),
		&core.AutodateField{Name: "created", OnCreate: true},
		&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
	)
	return app.Save(c)
}

// tokenIDField holds the position NFT that carries this loan on chain, and zero
// when the position is only a ledger row. It settles which of the two the
// numbers beside it mean: a chain position is like-kind, so its debt is counted
// in the vault's own asset, while a ledger position counts debt in USD cents.
func tokenIDField() *core.NumberField {
	return &core.NumberField{Name: "tokenId", OnlyInt: true}
}
