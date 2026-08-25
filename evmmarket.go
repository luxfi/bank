package bank

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"math/big"
	"strings"
	"sync"
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
	Collateral Minor // collateral held, in the market's own asset
	Debt       Minor // synthetic owed, in that same asset
	Borrowable Minor // headroom left before the chain refuses
	TokenID    int64 // the position NFT that holds it
}

// Market is one collateral asset's lending market.
type Market interface {
	// Deposit moves collateral from the account into the market, opening a
	// position if it has none.
	Deposit(seed string, amount Minor) (string, error)
	// Borrow mints the market's synthetic against the position. It fails when
	// the chain refuses the borrow.
	Borrow(seed string, amount Minor) (string, error)
	// Repay burns synthetic back into the position's debt.
	Repay(seed string, amount Minor) (string, error)
	// Withdraw takes collateral back out, as far as the debt allows.
	Withdraw(seed string, amount Minor) (string, error)
	// Position reads the account's position from the chain.
	Position(seed string) (Position, error)
}

// Market returns the lending market for an asset, or nil when this chain has
// none — in which case Earn stays on the ledger for that vault.
//
// Nothing is read here. The market proves itself when it is used, not when it is
// looked up, because a lookup that failed could only answer nil — and nil hands
// Earn back to the ledger, where a borrow is credited against a loan no chain is
// holding. A chain that cannot answer has to fail the movement, not quietly turn
// into a different product.
func (c *evmChain) Market(asset string) Market {
	asset = strings.ToUpper(asset)
	m, ok := c.deploy.Markets[asset]
	if !ok || m.Liquid == "" {
		return nil
	}
	return &evmMarket{
		chain:      c,
		asset:      asset,
		liquid:     common.HexToAddress(m.Liquid),
		collateral: common.HexToAddress(m.Collateral),
		synthetic:  common.HexToAddress(m.Synthetic),
		position:   common.HexToAddress(m.Position),
	}
}

type evmMarket struct {
	chain                                   *evmChain
	asset                                   string
	liquid, collateral, synthetic, position common.Address

	// wraps records that this market's collateral is the chain's own coin in
	// ERC-20 form, so a deposit wraps on the way in and a withdrawal unwraps on
	// the way out. Established by proof, never configured.
	once  sync.Once
	err   error
	wraps bool
}

// prove asks the market who it is, before anything is approved or sent to it. An
// address in a deployment file is a claim: deployment order has already put two
// different contracts at one address on two Lux-family chains, and an address
// holding no code answers every read with silence — which is how a standing
// allowance came to be granted to an empty address anyone can later occupy. So
// the contract has to name the same collateral, synthetic and position NFT the
// file names, and the collateral has to be the asset the account actually holds.
// Read once: a market that proves out does not change what it is.
func (m *evmMarket) prove(ctx context.Context) error {
	m.once.Do(func() { m.err = m.identify(ctx) })
	return m.err
}

func (m *evmMarket) identify(ctx context.Context) error {
	for _, claim := range []struct {
		name string
		want common.Address
	}{
		{"yieldToken", m.collateral},
		{"debtToken", m.synthetic},
		{"liquidPositionNFT", m.position},
	} {
		var got common.Address
		if err := m.chain.read(ctx, m.liquid, liquidABI, claim.name, &got); err != nil {
			return fmt.Errorf("no %s market at %s on chain %s: %w", m.asset, m.liquid, m.chain.chainID, err)
		}
		if got != claim.want {
			return fmt.Errorf("chain %s: the %s market at %s calls %s %s, not the %s recorded for it",
				m.chain.chainID, m.asset, m.liquid, claim.name, got, claim.want)
		}
	}
	return m.takes(ctx)
}

// takes settles what the market accepts against what the account holds. A token
// asset is held as a contract the wallet already reads its balance from, and the
// market has to take that same one. The chain's own coin is held as no contract
// at all, so its market takes the coin's wrapper — and since wrapping sends the
// coin itself to that address, the wrapper's name is read off the chain before
// any value follows it there.
func (m *evmMarket) takes(ctx context.Context) error {
	held, ok := m.chain.assets[m.asset]
	if !ok {
		return fmt.Errorf("chain %s carries no %s", m.chain.chainID, m.asset)
	}
	if (held != common.Address{}) {
		if held != m.collateral {
			return fmt.Errorf("chain %s: the %s market takes %s, but %s is held as %s",
				m.chain.chainID, m.asset, m.collateral, m.asset, held)
		}
		return nil
	}
	var symbol string
	if err := m.chain.read(ctx, m.collateral, erc20ABI, "symbol", &symbol); err != nil {
		return fmt.Errorf("no collateral token at %s on chain %s: %w", m.collateral, m.chain.chainID, err)
	}
	if !strings.EqualFold(symbol, "W"+m.asset) {
		return fmt.Errorf("chain %s: the %s market takes %s at %s, which is not wrapped %s",
			m.chain.chainID, m.asset, symbol, m.collateral, m.asset)
	}
	m.wraps = true
	return nil
}

// call is the shape every movement shares: approve what the market must pull,
// then send one transaction and return its hash.
// call moves `amount` — counted in the ledger's minor units — through one of the
// market's verbs. `unit` is the token that DENOMINATES that amount, and it is
// not always the collateral: deposit and withdraw move collateral, while mint
// and burn move the synthetic. Scaling everything by the collateral's decimals
// was right only while the two matched; against 8-decimal bridged BTC and an
// 18-decimal synthetic it burned a ten-billionth of the debt it was asked to.
func (m *evmMarket) call(seed, method string, unit common.Address, allow *common.Address, amount Minor, args func(id *big.Int, wei *big.Int) []any) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()
	if err := m.prove(ctx); err != nil {
		return "", err
	}
	owner := addressOf(key)

	dp, err := m.chain.decimals(ctx, unit)
	if err != nil {
		return "", err
	}
	wei := m.chain.toWei(amount, dp)

	if allow != nil {
		if err := m.approve(ctx, seed, owner, *allow, wei); err != nil {
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

func (m *evmMarket) Deposit(seed string, amount Minor) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	owner := addressOf(key)
	if err := m.wrap(key, owner, amount); err != nil {
		return "", err
	}
	// tokenId 0 tells the market to open a position and mint its NFT to owner.
	return m.call(seed, "deposit", m.collateral, &m.collateral, amount, func(id, wei *big.Int) []any {
		return []any{wei, owner, id}
	})
}

func (m *evmMarket) Borrow(seed string, amount Minor) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	owner := addressOf(key)
	return m.call(seed, "mint", m.synthetic, nil, amount, func(id, wei *big.Int) []any {
		return []any{id, wei, owner}
	})
}

func (m *evmMarket) Repay(seed string, amount Minor) (string, error) {
	return m.call(seed, "burn", m.synthetic, &m.synthetic, amount, func(id, wei *big.Int) []any {
		return []any{wei, id}
	})
}

func (m *evmMarket) Withdraw(seed string, amount Minor) (string, error) {
	key, err := m.chain.key(seed)
	if err != nil {
		return "", err
	}
	owner := addressOf(key)
	hash, err := m.call(seed, "withdraw", m.collateral, nil, amount, func(id, wei *big.Int) []any {
		return []any{wei, owner, id}
	})
	if err != nil || !m.wraps {
		return hash, err
	}
	// A withdrawal is not finished until the collateral is back in the form the
	// account holds it in; a wrapper the customer was never shown is not it. If
	// this second transaction fails the movement fails with it, and the wrapper
	// waits at the account's own address, where the next deposit spends it
	// before touching any coin.
	return hash, m.unwrap(key, amount)
}

// wrap turns the account's coin into the collateral the market takes. The
// customer holds LUX; the LUX market takes WLUX, and the two are one contract
// apart — 1:1, no fee, no counterparty, no price. Nothing in that is a decision
// to put in front of a customer, so it belongs where the allowance the bank
// already raises on their behalf belongs. Only the shortfall is wrapped, so
// collateral the account already holds is spent before its coin is.
func (m *evmMarket) wrap(key *ecdsa.PrivateKey, owner common.Address, amount Minor) error {
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()
	if err := m.prove(ctx); err != nil {
		return err
	}
	if !m.wraps {
		return nil
	}
	want, err := m.wei(ctx, amount)
	if err != nil {
		return err
	}
	var have *big.Int
	if err := m.chain.read(ctx, m.collateral, erc20ABI, "balanceOf", &have, owner); err != nil {
		return err
	}
	if have.Cmp(want) >= 0 {
		return nil
	}
	short := new(big.Int).Sub(want, have)
	data, err := wrapABI.Pack("deposit")
	if err != nil {
		return err
	}
	if _, err := m.chain.submit(ctx, key, m.collateral, short, data); err != nil {
		return fmt.Errorf("wrapping %s: %w", m.asset, err)
	}
	return nil
}

func (m *evmMarket) unwrap(key *ecdsa.PrivateKey, amount Minor) error {
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()
	wei, err := m.wei(ctx, amount)
	if err != nil {
		return err
	}
	data, err := wrapABI.Pack("withdraw", wei)
	if err != nil {
		return err
	}
	if _, err := m.chain.submit(ctx, key, m.collateral, big.NewInt(0), data); err != nil {
		return fmt.Errorf("unwrapping %s: %w", m.asset, err)
	}
	return nil
}

// wei is an amount in the collateral's own denomination, which for a wrapping
// market is also the coin value that mints or burns it, one for one.
func (m *evmMarket) wei(ctx context.Context, amount Minor) (*big.Int, error) {
	dp, err := m.chain.decimals(ctx, m.collateral)
	if err != nil {
		return nil, err
	}
	return m.chain.toWei(amount, dp), nil
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
	if err := m.prove(ctx); err != nil {
		return p, err
	}
	owner := addressOf(key)

	id, err := m.tokenID(ctx, owner)
	if err != nil {
		return p, err
	}
	if id.Sign() == 0 {
		return p, nil // no position yet
	}
	p.TokenID = id.Int64()

	// Collateral is counted in the collateral token, debt in the synthetic, and
	// the two need not share a decimal count — 8dp bridged BTC against an 18dp
	// synthetic differ by 1e10. Read each in its own unit.
	cdp, err := m.chain.decimals(ctx, m.collateral)
	if err != nil {
		return p, err
	}
	sdp, err := m.chain.decimals(ctx, m.synthetic)
	if err != nil {
		return p, err
	}
	var pos struct{ Collateral, Debt, Earmarked *big.Int }
	if err := m.chain.read(ctx, m.liquid, liquidABI, "getCDP", &pos, id); err != nil {
		return p, err
	}
	if p.Collateral, err = m.chain.toMinor(pos.Collateral, cdp); err != nil {
		return p, err
	}
	if p.Debt, err = m.chain.toMinor(pos.Debt, sdp); err != nil {
		return p, err
	}

	// getMaxBorrowable underflows rather than returning zero once a position is
	// past its ceiling, so an error here means no headroom, not a broken read.
	var max *big.Int
	if err := m.chain.read(ctx, m.liquid, liquidABI, "getMaxBorrowable", &max, id); err == nil {
		p.Borrowable, _ = m.chain.toMinor(max, sdp)
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
{"name":"yieldToken","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}]},
{"name":"debtToken","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}]},
{"name":"liquidPositionNFT","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}]},
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

// wrapABI is the surface a coin wrapper carries: deposit() takes the chain's own
// coin and mints one for one, withdraw() burns and pays the coin back.
var wrapABI = mustABI(`[
{"name":"deposit","type":"function","stateMutability":"payable","inputs":[],"outputs":[]},
{"name":"withdraw","type":"function","stateMutability":"nonpayable","inputs":[{"type":"uint256"}],"outputs":[]}
]`)
