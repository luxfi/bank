package bank

import (
	"math"
	"net/http"
	"strings"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/router"
	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// Earn — the Liquid Protocol layer folded into the bank. Deposit yield-bearing
// collateral into a vault, borrow the vault's synthetic x-token against it up
// to the vault's LTV, and the collateral yield repays the debt. Money moves
// through the same transaction ledger as everything else (type "earn"); the
// position record is the vault-specific state. Sandbox settles instantly; a
// real on-chain Liquid backend drops in behind these routes unchanged.
// -----------------------------------------------------------------------------

// vaultByID returns the catalog vault or nil.
func vaultByID(id string) *collections.Vault {
	for i := range collections.Vaults {
		if collections.Vaults[i].ID == id {
			return &collections.Vaults[i]
		}
	}
	return nil
}

// positionFor returns the caller's position in a vault, or nil if none is open.
func positionFor(app core.App, accountID, vaultID string) *core.Record {
	p, _ := app.FindFirstRecordByFilter(collections.PositionCollectionName,
		"account = {:a} && vault = {:v}", map[string]any{"a": accountID, "v": vaultID})
	return p
}

// upsertPosition finds or creates the caller's position in a vault.
func upsertPosition(app core.App, accountID, vaultID string) (*core.Record, error) {
	if p := positionFor(app, accountID, vaultID); p != nil {
		return p, nil
	}
	col, err := app.FindCollectionByNameOrId(collections.PositionCollectionName)
	if err != nil {
		return nil, err
	}
	p := core.NewRecord(col)
	p.Set("account", accountID)
	p.Set("vault", vaultID)
	p.Set("collateral", 0)
	p.Set("debt", 0)
	return p, nil
}

// positionView is the caller's stake in one vault, with the derived numbers the
// UI needs: values in USD cents, the current loan-to-value, headroom left to
// borrow, and how long the collateral yield would take to clear the debt.
type positionView struct {
	Vault         string  `json:"vault"`
	Collateral    int64   `json:"collateral"`    // underlying minor units
	CollateralUsd int64   `json:"collateralUsd"` // USD cents
	Debt          int64   `json:"debt"`          // ledger: USD cents. on chain: the vault's own asset
	DebtUsd       int64   `json:"debtUsd"`       // USD cents either way
	LTV           float64 `json:"ltv"`           // debt / collateral, 0..1
	Borrowable    int64   `json:"borrowable"`    // more that can be borrowed, in Debt's unit
	YieldUsdYear  int64   `json:"yieldUsdYear"`  // collateral yield per year, USD cents
	SelfRepayDays int     `json:"selfRepayDays"` // days for yield to clear the debt (0 if none)
	TokenID       int64   `json:"tokenId"`       // the position NFT on chain; 0 when ledger-only
}

// collateralUsdCents values a collateral amount (underlying minor units) in USD cents.
func collateralUsdCents(v *collections.Vault, collateral int64) int64 {
	return int64(math.Round(minorToUSD(collateral, v.Underlying) * 100))
}

func viewPosition(v *collections.Vault, p *core.Record) positionView {
	collateral := int64(math.Round(p.GetFloat("collateral")))
	debt := int64(math.Round(p.GetFloat("debt")))
	tokenID := int64(math.Round(p.GetFloat("tokenId")))
	colUsd := collateralUsdCents(v, collateral)
	pv := positionView{
		Vault: v.ID, Collateral: collateral, CollateralUsd: colUsd, Debt: debt,
		TokenID: tokenID, YieldUsdYear: int64(math.Round(float64(colUsd) * v.APY / 100)),
	}

	// A position on chain is like-kind — collateral and debt are the same asset
	// — so the loan-to-value is the ratio of the two raw amounts and no price
	// enters it. That is the property that makes the ceiling hold through a
	// drawdown, and stating it as a division by the collateral rather than by
	// its dollar value is what keeps it true here too.
	basis, debtUsd := colUsd, debt
	if tokenID > 0 {
		basis = collateral
		debtUsd = int64(math.Round(minorToUSD(debt, v.Underlying) * 100))
	}
	pv.DebtUsd = debtUsd

	if basis > 0 {
		pv.LTV = float64(debt) / float64(basis)
	}
	if ceiling := int64(math.Round(float64(basis) * v.MaxLTV)); ceiling > debt {
		pv.Borrowable = ceiling - debt
	}
	if debt > 0 && pv.YieldUsdYear > 0 {
		pv.SelfRepayDays = int(math.Ceil(float64(debtUsd) / float64(pv.YieldUsdYear) * 365))
	}
	return pv
}

// vaultView is a catalog vault with the caller's position folded in (nil when
// they have none), so one call drives the whole Earn screen.
type vaultView struct {
	collections.Vault
	Position *positionView `json:"position"`
}

func viewVaults(app core.App, accountID string) []vaultView {
	out := make([]vaultView, 0, len(collections.Vaults))
	for i := range collections.Vaults {
		v := &collections.Vaults[i]
		vv := vaultView{Vault: *v}
		if p := positionFor(app, accountID, v.ID); p != nil {
			pv := viewPosition(v, p)
			vv.Position = &pv
		}
		out = append(out, vv)
	}
	return out
}

// earnSummary is the account-wide Earn position for the dashboard.
type earnSummary struct {
	CollateralUsd int64   `json:"collateralUsd"`
	Debt          int64   `json:"debt"`
	NetUsd        int64   `json:"netUsd"`
	YieldUsdYear  int64   `json:"yieldUsdYear"`
	Positions     int     `json:"positions"`
	NetAPY        float64 `json:"netApy"`
}

func viewEarnSummary(app core.App, accountID string) earnSummary {
	var s earnSummary
	for i := range collections.Vaults {
		v := &collections.Vaults[i]
		p := positionFor(app, accountID, v.ID)
		if p == nil {
			continue
		}
		pv := viewPosition(v, p)
		if pv.Collateral == 0 && pv.Debt == 0 {
			continue
		}
		s.CollateralUsd += pv.CollateralUsd
		s.Debt += pv.Debt
		s.YieldUsdYear += pv.YieldUsdYear
		s.Positions++
	}
	s.NetUsd = s.CollateralUsd - s.Debt
	if s.CollateralUsd > 0 {
		s.NetAPY = float64(s.YieldUsdYear) / float64(s.CollateralUsd) * 100
	}
	return s
}

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

func registerEarnRoutes(app core.App, g *router.RouterGroup[*core.RequestEvent]) {
	g.GET("/earn/vaults", func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		return e.JSON(http.StatusOK, viewVaults(app, acct.Id))
	})
	g.POST("/earn/deposit", earnAction(app, actDeposit))
	g.POST("/earn/borrow", earnAction(app, actBorrow))
	g.POST("/earn/repay", earnAction(app, actRepay))
	g.POST("/earn/withdraw", earnAction(app, actWithdraw))
}

type earnReq struct {
	Vault  string `json:"vault"`
	Amount int64  `json:"amount"` // deposit/withdraw: underlying minor units. borrow/repay: USD cents.
}

type earnAct int

const (
	actDeposit earnAct = iota
	actBorrow
	actRepay
	actWithdraw
)

// earnAction is the one handler behind all four vault movements: it validates
// the request against the position, moves money through a settled "earn"
// transaction, and adjusts the position. One place, four verbs.
func earnAction(app core.App, act earnAct) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		req, err := bindBody[earnReq](e)
		if err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		v := vaultByID(strings.ToLower(req.Vault))
		if v == nil || req.Amount <= 0 {
			return apis.NewBadRequestError("invalid vault or amount", nil)
		}
		pos, err := upsertPosition(app, acct.Id, v.ID)
		if err != nil {
			return apis.NewInternalServerError("position unavailable", err)
		}
		// When the configured chain carries a market for this vault's asset, the
		// loan lives there and the ledger only records what the chain did.
		if m := chain().Market(v.Underlying); m != nil {
			return earnOnChain(app, e, acct, v, pos, m, act, req.Amount)
		}
		collateral := int64(math.Round(pos.GetFloat("collateral")))
		debt := int64(math.Round(pos.GetFloat("debt")))

		var moveCurrency, direction, ref string
		var moveAmount int64
		switch act {
		case actDeposit:
			moveCurrency, direction, moveAmount = v.Underlying, "debit", req.Amount
			ref = "Deposit to " + v.Name + " vault"
			collateral += req.Amount
		case actBorrow:
			ceiling := int64(math.Round(float64(collateralUsdCents(v, collateral)) * v.MaxLTV))
			if debt+req.Amount > ceiling {
				return errJSON(e, http.StatusUnprocessableEntity, "over the borrow limit for this collateral")
			}
			moveCurrency, direction, moveAmount = "USD", "credit", req.Amount
			ref = "Borrow " + v.Synthetic
			debt += req.Amount
		case actRepay:
			if req.Amount > debt {
				req.Amount = debt
			}
			if req.Amount == 0 {
				return errJSON(e, http.StatusUnprocessableEntity, "no debt to repay")
			}
			moveCurrency, direction, moveAmount = "USD", "debit", req.Amount
			ref = "Repay " + v.Synthetic
			debt -= req.Amount
		case actWithdraw:
			if req.Amount > collateral {
				return errJSON(e, http.StatusUnprocessableEntity, "more than the collateral in this vault")
			}
			remaining := collateralUsdCents(v, collateral-req.Amount)
			if int64(math.Round(float64(remaining)*v.MaxLTV)) < debt {
				return errJSON(e, http.StatusUnprocessableEntity, "withdrawal would leave the loan undercollateralized")
			}
			moveCurrency, direction, moveAmount = v.Underlying, "credit", req.Amount
			ref = "Withdraw from " + v.Name + " vault"
			collateral -= req.Amount
		}

		// Move the money through a settled earn transaction — this validates a
		// debit against the live balance (via the payment hooks) and records the
		// movement in the activity feed.
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "earn", "direction": direction,
			"amount": moveAmount, "currency": moveCurrency, "status": "pending",
			"reference": ref, "metadata": map[string]any{"vault": v.ID},
		})
		if err != nil {
			return errJSON(e, http.StatusUnprocessableEntity, err.Error())
		}
		if err := settle(app, tx); err != nil {
			return apis.NewInternalServerError("settlement failed", err)
		}

		pos.Set("collateral", collateral)
		pos.Set("debt", debt)
		if err := app.Save(pos); err != nil {
			return apis.NewInternalServerError("position update failed", err)
		}

		return e.JSON(http.StatusOK, map[string]any{
			"vault":    v.ID,
			"position": viewPosition(v, pos),
			"balances": viewBalances(app, acct.Id),
		})
	}
}

// -----------------------------------------------------------------------------
// Earn, on chain
// -----------------------------------------------------------------------------

// earnOnChain runs one vault movement against the deployed market. The contract
// owns the decision: it refuses a borrow that would breach the collateralization
// floor and a withdrawal that would leave the loan short, and the position it
// reports back afterwards is the position. The bank does not re-derive those
// numbers, it records them — so the ceiling a customer is quoted and the ceiling
// that is enforced cannot drift apart.
//
// The debt here is like-kind: the market issues the collateral asset's own
// synthetic, so collateral and debt are counted in the same unit and a price
// move cannot change the ratio between them. That is what makes a 90% ceiling
// safe, and it is why the ledger's USD-denominated debt does not carry over.
func earnOnChain(app core.App, e *core.RequestEvent, acct *core.Record, v *collections.Vault,
	pos *core.Record, m Market, act earnAct, amount int64) error {

	seed := chainSeed(app, acct)
	if seed == "" {
		return apis.NewInternalServerError("account has no chain identity", nil)
	}

	var move func(string, int64) (string, error)
	var direction, ref string
	switch act {
	case actDeposit:
		move, direction, ref = m.Deposit, "debit", "Deposit to "+v.Name+" vault"
	case actBorrow:
		move, direction, ref = m.Borrow, "credit", "Borrow "+v.Synthetic
	case actRepay:
		move, direction, ref = m.Repay, "debit", "Repay "+v.Synthetic
	case actWithdraw:
		move, direction, ref = m.Withdraw, "credit", "Withdraw from "+v.Name+" vault"
	}

	hash, err := move(seed, amount)
	if err != nil {
		// The chain refusing a borrow is the borrow limit, not a fault. Say so
		// in the same words the ledger path uses, so a client sees one contract.
		if strings.Contains(err.Error(), "Undercollateralized") {
			return errJSON(e, http.StatusUnprocessableEntity, "over the borrow limit for this collateral")
		}
		app.Logger().Error("earn movement rejected on chain", "vault", v.ID, "err", err)
		return errJSON(e, http.StatusBadGateway, "the chain rejected this movement")
	}

	on, err := m.Position(seed)
	if err != nil {
		return apis.NewInternalServerError("position unreadable on chain", err)
	}

	// The ledger movement mirrors the chain movement so the money shows up in
	// the activity feed and the balance it came from or went to.
	tx, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "earn", "direction": direction,
		"amount": amount, "currency": v.Underlying, "status": "pending",
		"reference": ref,
		"metadata": map[string]any{
			"vault": v.ID, "txHash": hash, "network": chain().Network(), "tokenId": on.TokenID,
		},
	})
	if err != nil {
		return errJSON(e, http.StatusUnprocessableEntity, err.Error())
	}
	if err := settle(app, tx); err != nil {
		return apis.NewInternalServerError("settlement failed", err)
	}

	pos.Set("collateral", on.Collateral)
	pos.Set("debt", on.Debt)
	pos.Set("tokenId", on.TokenID)
	if err := app.Save(pos); err != nil {
		return apis.NewInternalServerError("position update failed", err)
	}

	return e.JSON(http.StatusOK, map[string]any{
		"vault":    v.ID,
		"txHash":   hash,
		"network":  chain().Network(),
		"position": viewPosition(v, pos),
		"balances": viewBalances(app, acct.Id),
	})
}
