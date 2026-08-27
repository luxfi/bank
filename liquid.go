package bank

import (
	"errors"
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
//
// One unit runs through all of it: minor units of the vault's asset. The market
// lends the collateral's own synthetic at parity, so collateral and debt are
// like-kind, and everything moved here — deposited, borrowed, repaid, withdrawn
// — is counted in that single asset. Dollars are a projection taken at the edge
// for display, kept in the *Usd fields, and never added back to the amounts they
// were derived from.
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
// UI needs. The units are in the types now: Minor is the vault's own asset,
// Cents is what those amounts are worth.
type positionView struct {
	Vault         string  `json:"vault"`
	Collateral    Minor   `json:"collateral"`
	CollateralUsd Cents   `json:"collateralUsd"`
	Debt          Minor   `json:"debt"`
	DebtUsd       Cents   `json:"debtUsd"`
	LTV           float64 `json:"ltv"` // debt / collateral, 0..1
	Borrowable    Minor   `json:"borrowable"`
	YieldUsdYear  Cents   `json:"yieldUsdYear"`
	SelfRepayDays int     `json:"selfRepayDays"` // days for yield to clear the debt (0 if none)
	TokenID       int64   `json:"tokenId"`       // the position NFT on chain; 0 when ledger-only
}

// usd values an amount of the vault's asset — collateral, or the like-kind debt
// drawn against it. This is the only crossing between the two units, and it
// needs a price, which is exactly why it should be the only one.
func usd(v *collections.Vault, m Minor) Cents {
	return round[Cents](minorToUSD(m, v.Underlying) * 100)
}

// borrowCeiling is the most debt a collateral holding can carry. Both sides are
// the same asset — the return type says so — and no price enters it. That is
// what makes 90% safe: a price move takes both sides with it and cannot move
// the ratio.
func borrowCeiling(v *collections.Vault, collateral Minor) Minor {
	return round[Minor](float64(collateral) * v.MaxLTV)
}

func viewPosition(v *collections.Vault, p *core.Record) positionView {
	collateral := money[Minor](p, "collateral")
	debt := money[Minor](p, "debt")
	colUsd := usd(v, collateral)
	pv := positionView{
		Vault: v.ID, Collateral: collateral, CollateralUsd: colUsd,
		Debt: debt, DebtUsd: usd(v, debt),
		TokenID:      money[int64](p, "tokenId"),
		YieldUsdYear: round[Cents](float64(colUsd) * v.APY / 100),
	}
	if collateral > 0 {
		pv.LTV = float64(debt) / float64(collateral)
	}
	if ceiling := borrowCeiling(v, collateral); ceiling > debt {
		pv.Borrowable = ceiling - debt
	}
	if debt > 0 && pv.YieldUsdYear > 0 {
		pv.SelfRepayDays = int(math.Ceil(float64(pv.DebtUsd) / float64(pv.YieldUsdYear) * 365))
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

// earnSummary is the account-wide Earn position for the dashboard. Every figure
// is USD cents: the vaults are denominated in four different assets, so dollars
// are the only unit a total across them can be stated in.
type earnSummary struct {
	CollateralUsd Cents   `json:"collateralUsd"`
	DebtUsd       Cents   `json:"debt"`
	NetUsd        Cents   `json:"netUsd"`
	YieldUsdYear  Cents   `json:"yieldUsdYear"`
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
		s.DebtUsd += pv.DebtUsd
		s.YieldUsdYear += pv.YieldUsdYear
		s.Positions++
	}
	s.NetUsd = s.CollateralUsd - s.DebtUsd
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
	Amount Minor  `json:"amount"` // the vault's own asset, whichever verb
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
		// When the account's custodian can reach a market for this vault's asset,
		// the loan lives there and the ledger only records what the chain did. A
		// custodian that cannot act at all is not the same thing as a vault with
		// no market behind it, and must never be read as one.
		m, err := custodian().Market(app, acct, v.Underlying)
		if errors.Is(err, errChainDown) {
			// Not a fault of this request, and not a vault without a market.
			// Same words and same status the movement itself would answer with.
			return errJSON(e, http.StatusBadGateway, "the chain is unreachable")
		}
		if err != nil {
			return apis.NewInternalServerError("account has no chain identity", err)
		}
		if m != nil {
			return earnOnChain(app, e, acct, v, pos, m, act, req.Amount)
		}
		collateral := money[Minor](pos, "collateral")
		debt := money[Minor](pos, "debt")

		var direction, ref string
		switch act {
		case actDeposit:
			direction, ref = "debit", "Deposit to "+v.Name+" vault"
			collateral += req.Amount
		case actBorrow:
			if debt+req.Amount > borrowCeiling(v, collateral) {
				return errJSON(e, http.StatusUnprocessableEntity, "over the borrow limit for this collateral")
			}
			direction, ref = "credit", "Borrow "+v.Synthetic
			debt += req.Amount
		case actRepay:
			if req.Amount > debt {
				req.Amount = debt
			}
			if req.Amount == 0 {
				return errJSON(e, http.StatusUnprocessableEntity, "no debt to repay")
			}
			direction, ref = "debit", "Repay "+v.Synthetic
			debt -= req.Amount
		case actWithdraw:
			if req.Amount > collateral {
				return errJSON(e, http.StatusUnprocessableEntity, "more than the collateral in this vault")
			}
			if borrowCeiling(v, collateral-req.Amount) < debt {
				return errJSON(e, http.StatusUnprocessableEntity, "withdrawal would leave the loan undercollateralized")
			}
			direction, ref = "credit", "Withdraw from "+v.Name+" vault"
			collateral -= req.Amount
		}

		// Move the money through a settled earn transaction — this validates a
		// debit against the live balance (via the payment hooks) and records the
		// movement in the activity feed. One vault moves one asset: the synthetic
		// tracks the underlying at parity, so a borrow lands in that balance and a
		// repayment comes back out of it.
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "earn", "direction": direction,
			"amount": req.Amount, "currency": v.Underlying, "status": "pending",
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
// The amount arrives in the vault asset's minor units and reaches the market
// untouched. Debt is like-kind — the market issues the collateral asset's own
// synthetic — so there is nothing to convert, and no price of ours sizes a loan
// the protocol will hold someone to.
func earnOnChain(app core.App, e *core.RequestEvent, acct *core.Record, v *collections.Vault,
	pos *core.Record, m Market, act earnAct, amount Minor) error {

	cb := chain()

	var move func(Minor) (string, error)
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

	// The ledger reserves first and the chain moves second. A pending debit holds
	// the funds, so a movement the ledger refuses never reaches a place it cannot
	// be taken back from — moving first meant the balance check arrived after the
	// collateral was gone, and the customer read a 422 over money already spent.
	tx, err := newTx(app, map[string]any{
		"account": acct.Id, "type": "earn", "direction": direction,
		"amount": amount, "currency": v.Underlying, "status": "pending",
		"reference": ref,
		"metadata":  map[string]any{"vault": v.ID, "network": cb.Network()},
	})
	if err != nil {
		return errJSON(e, http.StatusUnprocessableEntity, err.Error())
	}

	hash, err := move(amount)
	if err != nil {
		if rerr := release(app, tx); rerr != nil {
			app.Logger().Error("hold survived a refused movement", "tx", tx.Id, "err", rerr)
		}
		// The chain refusing a borrow is the borrow limit, not a fault. Say so
		// in the same words the ledger path uses, so a client sees one contract.
		if strings.Contains(err.Error(), "Undercollateralized") {
			return errJSON(e, http.StatusUnprocessableEntity, "over the borrow limit for this collateral")
		}
		app.Logger().Error("earn movement rejected on chain", "vault", v.ID, "err", err)
		return errJSON(e, http.StatusBadGateway, "the chain rejected this movement")
	}

	on, err := m.Position()
	if err != nil {
		return apis.NewInternalServerError("position unreadable on chain", err)
	}

	// The receipt and the position NFT are known only once the chain has moved,
	// so the record the ledger already holds is completed with them.
	tx.Set("metadata", map[string]any{
		"vault": v.ID, "txHash": hash, "network": cb.Network(), "tokenId": on.TokenID,
	})
	if err := app.Save(tx); err != nil {
		return apis.NewInternalServerError("could not record the transaction", err)
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
		"network":  cb.Network(),
		"position": viewPosition(v, pos),
		"balances": viewBalances(app, acct.Id),
	})
}
