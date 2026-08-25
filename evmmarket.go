package bank

import (
	"context"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/luxfi/geth/common"
)

// -----------------------------------------------------------------------------
// Market — the on-chain half of Earn. A position is a self-repaying loan: the
// account's own address deposits collateral, borrows the collateral's like-kind
// synthetic against it, and the collateral's yield pays the debt down.
//
// The borrow ceiling is not the bank's to enforce. The contract refuses a mint
// that would push a position past its collateralization floor, and the bank
// records what the chain decided. That is the whole point of moving this out of
// the ledger: the number the customer is quoted and the number the protocol
// enforces are the same number.
// -----------------------------------------------------------------------------

// Position is an account's stake in one market, in the bank's minor units.
type Position struct {
	Collateral int64 // collateral held, minor units of the market's asset
	Debt       int64 // synthetic owed, minor units of the same asset
	Borrowable int64 // headroom left before the chain refuses
	TokenID    int64 // the position NFT that holds it
}

// Market is one collateral asset's lending market.
type Market interface {
	// Deposit moves collateral from the account into the market, opening a
	// position if it has none.
	Deposit(seed string, amount int64) (string, error)
	// Borrow mints the market's synthetic against the position. It fails when
	// the chain refuses the borrow.
	Borrow(seed string, amount int64) (string, error)
	// Repay burns synthetic back into the position's debt.
	Repay(seed string, amount int64) (string, error)
	// Withdraw takes collateral back out, as far as the debt allows.
	Withdraw(seed string, amount int64) (string, error)
	// Position reads the account's position from the chain.
	Position(seed string) (Position, error)
}

// Market returns the lending market for an asset, or nil when this chain has
// none — in which case Earn stays on the ledger for that vault.
func (c *evmChain) Market(asset string) Market {
	m, ok := c.deploy.Markets[strings.ToUpper(asset)]
	if !ok || m.Liquid == "" {
		return nil
	}
	return &evmMarket{
		chain:      c,
		liquid:     common.HexToAddress(m.Liquid),
		collateral: common.HexToAddress(m.Collateral),
		synthetic:  common.HexToAddress(m.Synthetic),
		position:   common.HexToAddress(m.Position),
	}
}

type evmMarket struct {
	chain                                   *evmChain
	liquid, collateral, synthetic, position common.Address
}

// call is the shape every movement shares: approve what the market must pull,
// then send one transaction and return its hash.
func (m *evmMarket) call(seed, method string, spender *common.Address, amount int64, args func(id *big.Int, wei *big.Int) []any) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()
	owner := addressOf(key)

	dp, err := m.chain.decimals(ctx, m.collateral)
	if err != nil {
		return "", err
	}
	wei := m.chain.toWei(amount, dp)

	if spender != nil {
		if err := m.approve(ctx, seed, owner, *spender, wei); err != nil {
			return "", err
		}
	}

	id, err := m.tokenID(ctx, owner)
	if err != nil {
		return "", err
	}
	data, err := liquidABI.Pack(method, args(id, wei)...)
	if err != nil {
		return "", err
	}
	return m.chain.submit(ctx, key, m.liquid, big.NewInt(0), data)
}

func (m *evmMarket) Deposit(seed string, amount int64) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	owner := addressOf(key)
	// tokenId 0 tells the market to open a position and mint its NFT to owner.
	return m.call(seed, "deposit", &m.collateral, amount, func(id, wei *big.Int) []any {
		return []any{wei, owner, id}
	})
}

func (m *evmMarket) Borrow(seed string, amount int64) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	owner := addressOf(key)
	return m.call(seed, "mint", nil, amount, func(id, wei *big.Int) []any {
		return []any{id, wei, owner}
	})
}

func (m *evmMarket) Repay(seed string, amount int64) (string, error) {
	return m.call(seed, "burn", &m.synthetic, amount, func(id, wei *big.Int) []any {
		return []any{wei, id}
	})
}

func (m *evmMarket) Withdraw(seed string, amount int64) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	owner := addressOf(key)
	return m.call(seed, "withdraw", nil, amount, func(id, wei *big.Int) []any {
		return []any{wei, owner, id}
	})
}

// Position reads collateral, debt and remaining headroom from the chain.
func (m *evmMarket) Position(seed string) (Position, error) {
	var p Position
	key, err := m.chain.key(seed)
	if err != nil {
		return p, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	owner := addressOf(key)

	id, err := m.tokenID(ctx, owner)
	if err != nil {
		return p, err
	}
	if id.Sign() == 0 {
		return p, nil // no position yet
	}
	p.TokenID = id.Int64()

	dp, err := m.chain.decimals(ctx, m.collateral)
	if err != nil {
		return p, err
	}
	var cdp struct{ Collateral, Debt, Earmarked *big.Int }
	if err := m.chain.read(ctx, m.liquid, liquidABI, "getCDP", &cdp, id); err != nil {
		return p, err
	}
	p.Collateral = m.chain.toMinor(cdp.Collateral, dp)
	p.Debt = m.chain.toMinor(cdp.Debt, dp)

	// getMaxBorrowable underflows rather than returning zero once a position is
	// past its ceiling, so an error here means no headroom, not a broken read.
	var max *big.Int
	if err := m.chain.read(ctx, m.liquid, liquidABI, "getMaxBorrowable", &max, id); err == nil {
		p.Borrowable = m.chain.toMinor(max, dp)
	}
	return p, nil
}

// tokenID is the position NFT the account holds in this market, or zero when it
// holds none. A deposit with id 0 mints one.
func (m *evmMarket) tokenID(ctx context.Context, owner common.Address) (*big.Int, error) {
	var n *big.Int
	if err := m.chain.read(ctx, m.position, positionABI, "balanceOf", &n, owner); err != nil {
		return nil, err
	}
	if n.Sign() == 0 {
		return big.NewInt(0), nil
	}
	var id *big.Int
	// The bank keeps one position per account per market, so the first is it.
	if err := m.chain.read(ctx, m.position, positionABI, "tokenOfOwnerByIndex", &id, owner, big.NewInt(0)); err != nil {
		return nil, err
	}
	return id, nil
}

// approve raises the market's allowance only when it is short, so a repeat
// movement does not pay for an approval it already has.
func (m *evmMarket) approve(ctx context.Context, seed string, owner, token common.Address, wei *big.Int) error {
	key, err := m.chain.key(seed)
	if err != nil {
		return err
	}
	var have *big.Int
	if err := m.chain.read(ctx, token, erc20ABI, "allowance", &have, owner, m.liquid); err != nil {
		return err
	}
	if have.Cmp(wei) >= 0 {
		return nil
	}
	data, err := erc20ABI.Pack("approve", m.liquid, wei)
	if err != nil {
		return err
	}
	if _, err := m.chain.submit(ctx, key, token, big.NewInt(0), data); err != nil {
		return fmt.Errorf("approve failed: %w", err)
	}
	return nil
}

var liquidABI = mustABI(`[
{"name":"deposit","type":"function","stateMutability":"nonpayable","inputs":[{"type":"uint256"},{"type":"address"},{"type":"uint256"}],"outputs":[{"type":"uint256"}]},
{"name":"withdraw","type":"function","stateMutability":"nonpayable","inputs":[{"type":"uint256"},{"type":"address"},{"type":"uint256"}],"outputs":[{"type":"uint256"}]},
{"name":"mint","type":"function","stateMutability":"nonpayable","inputs":[{"type":"uint256"},{"type":"uint256"},{"type":"address"}],"outputs":[]},
{"name":"burn","type":"function","stateMutability":"nonpayable","inputs":[{"type":"uint256"},{"type":"uint256"}],"outputs":[{"type":"uint256"}]},
{"name":"getCDP","type":"function","stateMutability":"view","inputs":[{"type":"uint256"}],"outputs":[{"name":"collateral","type":"uint256"},{"name":"debt","type":"uint256"},{"name":"earmarked","type":"uint256"}]},
{"name":"getMaxBorrowable","type":"function","stateMutability":"view","inputs":[{"type":"uint256"}],"outputs":[{"type":"uint256"}]}
]`)

var positionABI = mustABI(`[
{"name":"balanceOf","type":"function","stateMutability":"view","inputs":[{"type":"address"}],"outputs":[{"type":"uint256"}]},
{"name":"tokenOfOwnerByIndex","type":"function","stateMutability":"view","inputs":[{"type":"address"},{"type":"uint256"}],"outputs":[{"type":"uint256"}]}
]`)
