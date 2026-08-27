package bank

import (
	"context"
	"crypto/ecdsa"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/luxfi/crypto"
	ethereum "github.com/luxfi/geth"
	"github.com/luxfi/geth/accounts"
	"github.com/luxfi/geth/accounts/abi"
	"github.com/luxfi/geth/common"
	"github.com/luxfi/geth/core/types"
	"github.com/luxfi/geth/ethclient"
	bip32 "github.com/luxfi/go-bip32"
	bip39 "github.com/luxfi/go-bip39"
)

// -----------------------------------------------------------------------------
// evmChain — the ChainBackend backed by a real EVM. It reads balances from the
// chain, and it holds the deploy mnemonic, so it is also what turns an index
// into a key and broadcasts what that key signs. Whose index that is, is the
// custodian's question and not asked here; only deriving composes the two.
// Which chain is configuration: Lux, Zoo and Hanzo are sovereign L1s with their
// own EVM chain ids, and each has its own deployment file, so pointing the bank
// at a different one is an env change.
//
// The design correction a real EVM forces: an account has ONE address, and it
// receives the native coin and every token at that same address. Per-asset
// addresses only made sense while each asset pretended to be its own chain.
// Assets here are token contracts, not addresses.
// -----------------------------------------------------------------------------

// deployment is the address book a deploy run leaves behind, one file per chain.
type deployment struct {
	ChainID   int64             `json:"chainId"`
	MaxLTVBps int64             `json:"maxLtvBps"`
	Tokens    map[string]string `json:"tokens"`
	Markets   map[string]struct {
		Liquid     string `json:"liquid"`
		Collateral string `json:"collateral"`
		Synthetic  string `json:"synthetic"`
		Position   string `json:"position"`
	} `json:"markets"`
}

type evmChain struct {
	client  *ethclient.Client
	chainID *big.Int
	network string
	deploy  deployment

	// prefix is the account-key derivation path shared by every account on this
	// chain; each account is one hardened-free index below it.
	prefix accounts.DerivationPath
	master *bip32.Key

	// assets maps a bank asset symbol to its ERC-20 contract. The chain's own
	// coin maps to the zero address — it has no contract.
	assets map[string]common.Address

	mu      sync.Mutex
	keys    map[string]*ecdsa.PrivateKey
	tokenDp map[common.Address]int32

	// One key has one nonce sequence, and the treasury's is shared by every
	// customer it funds. Two concurrent top-ups read the same pending nonce and
	// the second is rejected as a replacement — so the treasury signs one at a
	// time. Customers' own sends are unaffected: each has its own key.
	spend sync.Mutex
}

// The backend is built once per configured endpoint and reused: dialing and
// re-reading the address book on every request would be wasteful, but pinning it
// forever would mean the process could never be pointed anywhere else.
var (
	evmMu   sync.Mutex
	evmInst *evmChain
	evmFrom string

	// The backoff is remembered per endpoint. One shared timestamp meant a
	// failed dial to one chain suppressed a good dial to another for the whole
	// window — the process could be re-pointed and would refuse to notice.
	evmFailed = map[string]time.Time{}
)

// evmRetryAfter is how long a failed dial is remembered. Dialing happens under
// the lock, so without this every caller during an outage queues behind its own
// fresh timeout and a chain outage becomes a bank outage. One caller pays the
// timeout per window; the rest are refused immediately, which is the same
// answer they were going to get.
const evmRetryAfter = 5 * time.Second

// ChainConfigured reports whether the bank has been pointed at a chain at all.
// It is the difference between "no chain here" and "the chain is down", which
// are the same silence but must not get the same answer.
func ChainConfigured() bool { return strings.TrimSpace(os.Getenv("BANK_CHAIN_RPC")) != "" }

// evm returns the configured EVM backend, or nil when BANK_CHAIN_RPC is unset.
func evm() *evmChain {
	rpc := strings.TrimSpace(os.Getenv("BANK_CHAIN_RPC"))
	evmMu.Lock()
	defer evmMu.Unlock()
	if rpc == "" {
		evmInst, evmFrom = nil, ""
		return nil
	}
	if evmInst != nil && evmFrom == rpc {
		return evmInst
	}
	if time.Since(evmFailed[rpc]) < evmRetryAfter {
		return nil
	}
	c, err := newEVM(rpc)
	if err != nil {
		evmFailed[rpc] = time.Now()
		// A configured-but-unreachable chain must not quietly degrade into the
		// simulation: that would hand a customer a fabricated receipt for a
		// transfer nothing broadcast. Leave the backend unset so the on-chain
		// routes refuse, the way the exchange refuses without a rate source.
		evmInst, evmFrom = nil, ""
		return nil
	}
	evmInst, evmFrom = c, rpc
	delete(evmFailed, rpc)
	return c
}

// newEVM dials the chain, learns its id, and loads that chain's address book.
func newEVM(rpc string) (*evmChain, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	client, err := ethclient.DialContext(ctx, rpc)
	if err != nil {
		return nil, fmt.Errorf("dial: %w", err)
	}
	chainID, err := client.ChainID(ctx)
	if err != nil {
		return nil, fmt.Errorf("chain id: %w", err)
	}

	c := &evmChain{
		client:  client,
		chainID: chainID,
		network: envOr("BANK_CHAIN_NETWORK", "lux-local"),
		keys:    map[string]*ecdsa.PrivateKey{},
		tokenDp: map[common.Address]int32{},
		assets:  map[string]common.Address{},
	}

	// The mnemonic never reaches a log line, an error string or a record; it is
	// read once here and reduced to a master key. In production it comes from
	// KMS (providers/<org>/deploy-mnemonic), not from the environment.
	mnemonic := strings.TrimSpace(os.Getenv("BANK_CHAIN_MNEMONIC"))
	if mnemonic == "" {
		return nil, errors.New("BANK_CHAIN_MNEMONIC is not set")
	}
	if !bip39.IsMnemonicValid(mnemonic) {
		return nil, errors.New("BANK_CHAIN_MNEMONIC is not a valid BIP-39 mnemonic")
	}
	if c.master, err = bip32.NewMasterKey(bip39.NewSeed(mnemonic, "")); err != nil {
		return nil, errors.New("master key derivation failed")
	}

	// m/9000'/<networkId>'/<envId>' — the Lux scheme. networkId is the primary
	// network (1 main, 2 test, 3 local, 1337 localnet), not the EVM chain id,
	// and envId is 0 main / 1 test / 2 dev.
	c.prefix, err = accounts.ParseDerivationPath(fmt.Sprintf("m/9000'/%s'/%s'",
		envOr("BANK_CHAIN_NETWORK_ID", "3"), envOr("BANK_CHAIN_ENV_ID", "2")))
	if err != nil {
		return nil, fmt.Errorf("derivation path: %w", err)
	}

	if err := c.load(envOr("BANK_CHAIN_DEPLOY", "chain/deploy")); err != nil {
		return nil, err
	}
	return c, nil
}

// load reads the address book for this chain and maps bank assets onto it. The
// file is named for the chain id, so one directory serves every chain the bank
// knows and nothing has to be re-pointed when the target changes.
func (c *evmChain) load(dir string) error {
	raw, err := os.ReadFile(filepath.Join(dir, c.chainID.String()+".json"))
	if err != nil {
		return fmt.Errorf("no deployment for chain %s in %s: %w", c.chainID, dir, err)
	}
	if err := json.Unmarshal(raw, &c.deploy); err != nil {
		return fmt.Errorf("deployment for chain %s is unreadable: %w", c.chainID, err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// LUX is the chain's own coin — the zero address, no contract. ETH and BTC
	// are held as the bridged tier, which is what a bridge mints when the real
	// asset arrives; the liquid tier of the same names is debt, not a holding.
	c.assets["LUX"] = common.Address{}
	for _, asset := range []string{"ETH", "BTC"} {
		hex, ok := c.deploy.Tokens[asset]
		if !ok {
			continue
		}
		token := common.HexToAddress(hex)
		// Addresses are not stable across chains — deployment order has already
		// put two different tokens at the same address on two Lux-family chains.
		// So an address is trusted only after the contract at it says who it is.
		var symbol string
		if err := c.read(ctx, token, erc20ABI, "symbol", &symbol); err != nil {
			return fmt.Errorf("no token at %s on chain %s: %w", hex, c.chainID, err)
		}
		if !strings.EqualFold(symbol, asset) {
			return fmt.Errorf("chain %s: %s is recorded as %s but the contract there is %s",
				c.chainID, asset, hex, symbol)
		}
		c.assets[asset] = token
	}
	return nil
}

func envOr(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

// -----------------------------------------------------------------------------
// ChainBackend
// -----------------------------------------------------------------------------

func (c *evmChain) Network() string { return c.network }

// Assets is every asset this chain carries, mapped to its token contract. The
// chain's own coin has no contract, so its entry is empty — which is also how
// the wallet view tells "native" from "token".
func (c *evmChain) Assets() map[string]string {
	out := make(map[string]string, len(c.assets))
	for asset, addr := range c.assets {
		if (addr == common.Address{}) {
			out[asset] = ""
			continue
		}
		out[asset] = addr.Hex()
	}
	return out
}

// address is what the key at an index controls. One address per account, not per
// asset: everything the account holds arrives here.
func (c *evmChain) address(index string) string {
	key, err := c.key(index)
	if err != nil {
		return ""
	}
	return addressOf(key).Hex()
}

// Valid reports whether a destination is well formed. One chain, one address
// family — a bridged BTC balance is sent to a 0x address like anything else.
func (c *evmChain) Valid(_, addr string) bool { return validEVMAddress(addr) }

// Balance reads the asset's balance at an address, from the chain. It refuses an
// address it cannot read rather than falling back on HexToAddress, which pads
// anything short and would answer for the zero address as if it were somebody's.
func (c *evmChain) Balance(addr, asset string) (Minor, error) {
	token, ok := c.assets[strings.ToUpper(asset)]
	if !ok {
		return 0, fmt.Errorf("%s is not on %s", asset, c.network)
	}
	if !validEVMAddress(addr) {
		return 0, fmt.Errorf("%q is not an address on %s", addr, c.network)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	owner := common.HexToAddress(addr)

	if (token == common.Address{}) {
		wei, err := c.client.BalanceAt(ctx, owner, nil)
		if err != nil {
			return 0, err
		}
		return c.toMinor(wei, 18)
	}
	var out *big.Int
	if err := c.read(ctx, token, erc20ABI, "balanceOf", &out, owner); err != nil {
		return 0, err
	}
	dp, err := c.decimals(ctx, token)
	if err != nil {
		return 0, err
	}
	return c.toMinor(out, dp)
}

// send signs a transfer from the key at an index and broadcasts it, then waits
// for the receipt so the hash it returns is a hash that settled.
func (c *evmChain) send(index, asset, to string, amount Minor) (string, error) {
	token, ok := c.assets[strings.ToUpper(asset)]
	if !ok {
		return "", fmt.Errorf("%s is not on %s", asset, c.network)
	}
	if !validEVMAddress(to) {
		return "", errors.New("destination is not an address on this chain")
	}
	key, err := c.key(index)
	if err != nil {
		return "", err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()
	dest := common.HexToAddress(to)

	if (token == common.Address{}) {
		return c.submit(ctx, key, dest, c.toWei(amount, 18), nil)
	}
	dp, err := c.decimals(ctx, token)
	if err != nil {
		return "", err
	}
	data, err := erc20ABI.Pack("transfer", dest, c.toWei(amount, dp))
	if err != nil {
		return "", err
	}
	return c.submit(ctx, key, token, big.NewInt(0), data)
}

// -----------------------------------------------------------------------------
// Keys — one account, one index, one address.
// -----------------------------------------------------------------------------

// key derives the signing key at an index — a number the bank assigns to an
// account once and stores, so a key is reproducible from the mnemonic alone and
// two accounts can never collide onto one address, which is exactly what hashing
// an account id into an index would eventually do.
func (c *evmChain) key(index string) (*ecdsa.PrivateKey, error) {
	n, err := strconv.ParseUint(strings.TrimSpace(index), 10, 31)
	if err != nil {
		return nil, fmt.Errorf("chain index %q is not a number", index)
	}
	return c.derive(customer, uint32(n))
}

// hardened is BIP-32's 2^31 offset, and every step of a bank key's path carries
// it — the account index included.
//
// An unhardened last step runs backwards. CKDpriv is k_i = IL + k_par (mod n),
// where IL comes from the parent's PUBLIC key and chain code, so anyone holding
// one child key and the parent xpub subtracts and recovers k_par — and from
// there every sibling. The xpub is not secret by design; that is the whole point
// of a watch-only wallet. So one exported customer key would be every customer's
// key. Hardening derives from the parent's private key instead, and there is
// nothing to subtract.
const hardened = uint32(0x80000000)

// Whose money a key signs for. Customers and the bank are different in kind, so
// they get different branches rather than different numbers on one branch: the
// treasury is not account zero, and no arithmetic on an account index arrives
// at it.
const (
	customer = uint32(0)
	treasury = uint32(1)
)

// derive walks m/9000'/<net>'/<env>'/<branch>'/<index>' and caches the result.
func (c *evmChain) derive(branch, index uint32) (*ecdsa.PrivateKey, error) {
	c.mu.Lock()
	defer c.mu.Unlock()
	name := fmt.Sprintf("%d/%d", branch, index)
	if k, ok := c.keys[name]; ok {
		return k, nil
	}
	node, err := c.master, error(nil)
	path := append(append(accounts.DerivationPath{}, c.prefix...), branch|hardened, index|hardened)
	for _, step := range path {
		if node, err = node.NewChildKey(step); err != nil {
			return nil, errors.New("key derivation failed")
		}
	}
	k, err := crypto.ToECDSA(node.Key)
	if err != nil {
		return nil, errors.New("derived key is not a valid signing key")
	}
	c.keys[name] = k
	return k, nil
}

// addressOf is the account address a signing key controls. luxfi/crypto and
// luxfi/geth each carry their own Address type over the same twenty bytes, so
// the conversion happens here once rather than at every call site.
func addressOf(key *ecdsa.PrivateKey) common.Address {
	a := crypto.PubkeyToAddress(key.PublicKey)
	return common.BytesToAddress(a[:])
}

// Treasury is the bank's own address on this chain — the account that holds the
// deployment and funds gas.
func (c *evmChain) Treasury() (*ecdsa.PrivateKey, error) {
	return c.derive(treasury, 0)
}

// -----------------------------------------------------------------------------
// Transactions
// -----------------------------------------------------------------------------

// submit builds, signs, broadcasts and confirms one transaction, funding the
// sender's gas from the treasury first if it cannot cover the fee. A custodial
// bank pays its customers' gas; the alternative is a customer whose transfer
// fails because they never held the chain's coin.
func (c *evmChain) submit(ctx context.Context, key *ecdsa.PrivateKey, to common.Address, value *big.Int, data []byte) (string, error) {
	from := addressOf(key)

	// Which fee market this chain runs. One that publishes a base fee takes an
	// EIP-1559 transaction; one that does not — a dev node, an older chain —
	// takes a legacy one priced by gas price alone. Both are real transactions,
	// and assuming only the first strands the bank on chains it can serve.
	tip, err := c.client.SuggestGasTipCap(ctx)
	if err != nil {
		tip = big.NewInt(1e9)
	}
	var feeCap *big.Int
	legacy := true
	if head, herr := c.client.HeaderByNumber(ctx, nil); herr == nil && head.BaseFee != nil {
		legacy = false
		feeCap = new(big.Int).Add(tip, new(big.Int).Mul(head.BaseFee, big.NewInt(2)))
	} else if feeCap, err = c.client.SuggestGasPrice(ctx); err != nil {
		return "", fmt.Errorf("no fee market on chain %s: %w", c.chainID, err)
	}

	gas, err := c.client.EstimateGas(ctx, ethereum.CallMsg{From: from, To: &to, Value: value, Data: data})
	if err != nil {
		return "", revertReason(err)
	}
	gas = gas * 12 / 10

	// The treasury pays GAS, and only gas. Putting `value` in here made the bank
	// the source of the transfer itself: a customer holding nothing could ask to
	// send any amount and the treasury would hand it over, because a shortfall
	// was indistinguishable from an empty gas tank. What a customer can send is
	// what a customer holds.
	if err := c.fund(ctx, from, new(big.Int).Mul(feeCap, new(big.Int).SetUint64(gas))); err != nil {
		return "", err
	}

	nonce, err := c.client.PendingNonceAt(ctx, from)
	if err != nil {
		return "", err
	}
	var inner types.TxData = &types.DynamicFeeTx{
		ChainID: c.chainID, Nonce: nonce, To: &to, Value: value, Data: data,
		Gas: gas, GasTipCap: tip, GasFeeCap: feeCap,
	}
	if legacy {
		inner = &types.LegacyTx{
			Nonce: nonce, To: &to, Value: value, Data: data,
			Gas: gas, GasPrice: feeCap,
		}
	}
	tx, err := types.SignNewTx(key, types.LatestSignerForChainID(c.chainID), inner)
	if err != nil {
		return "", err
	}
	if err := c.client.SendTransaction(ctx, tx); err != nil {
		return "", revertReason(err)
	}
	if err := c.confirm(ctx, tx.Hash()); err != nil {
		return "", err
	}
	return tx.Hash().Hex(), nil
}

// fund tops the sender up from the treasury when it cannot cover a transaction.
// The treasury funds itself, so it is skipped.
func (c *evmChain) fund(ctx context.Context, who common.Address, need *big.Int) error {
	key, err := c.Treasury()
	if err != nil {
		return err
	}
	if addressOf(key) == who {
		return nil
	}
	have, err := c.client.BalanceAt(ctx, who, nil)
	if err != nil {
		return err
	}
	if have.Cmp(need) >= 0 {
		return nil
	}
	c.spend.Lock()
	defer c.spend.Unlock()
	// Re-read under the lock: while this caller waited its turn, the top-up it
	// was queued behind may already have covered it.
	if have, err = c.client.BalanceAt(ctx, who, nil); err != nil {
		return err
	}
	if have.Cmp(need) >= 0 {
		return nil
	}
	// Twice the shortfall, so a customer is not back at the window on their next
	// transfer. `need` is one transaction's fee, so twice it is two — a bounded
	// amount of the chain's own coin, not a fraction of anyone's balance.
	top := new(big.Int).Mul(new(big.Int).Sub(need, have), big.NewInt(2))
	if _, err := c.submit(ctx, key, who, top, nil); err != nil {
		return fmt.Errorf("gas funding failed: %w", err)
	}
	return nil
}

// confirm waits for the receipt and fails on a reverted transaction, so a hash
// only ever leaves this package once the chain has accepted what it did.
func (c *evmChain) confirm(ctx context.Context, hash common.Hash) error {
	for {
		receipt, err := c.client.TransactionReceipt(ctx, hash)
		if err == nil {
			if receipt.Status == types.ReceiptStatusSuccessful {
				return nil
			}
			return fmt.Errorf("transaction %s reverted", hash.Hex())
		}
		select {
		case <-ctx.Done():
			return fmt.Errorf("transaction %s did not confirm", hash.Hex())
		case <-time.After(200 * time.Millisecond):
		}
	}
}

// read makes one eth_call and unpacks the single return value into out.
func (c *evmChain) read(ctx context.Context, to common.Address, a abi.ABI, method string, out any, args ...any) error {
	data, err := a.Pack(method, args...)
	if err != nil {
		return err
	}
	raw, err := c.client.CallContract(ctx, ethereum.CallMsg{To: &to, Data: data}, nil)
	if err != nil {
		return err
	}
	return a.UnpackIntoInterface(out, method, raw)
}

// revertReason turns a node's rejection into the protocol's own error name
// where it carries one, so an over-LTV borrow surfaces as "Undercollateralized"
// rather than as a hex blob. Anything unrecognised is passed through intact.
func revertReason(err error) error {
	if err == nil {
		return nil
	}
	var data interface{ ErrorData() interface{} }
	if !errors.As(err, &data) {
		return err
	}
	hex, ok := data.ErrorData().(string)
	if !ok || len(hex) < 10 {
		return err
	}
	if name, known := liquidErrors[strings.ToLower(hex[:10])]; known {
		return errors.New(name)
	}
	return err
}

// liquidErrors are the selectors of the protocol errors the bank can provoke.
// Undercollateralized is the one that matters: it is the LTV ceiling refusing a
// borrow, decided on chain.
var liquidErrors = map[string]string{
	"0xfddafdf5": "Undercollateralized",
	"0x9a124c80": "IllegalArgument",
	"0x4a613c41": "IllegalState",
	"0x82b42900": "Unauthorized",
	"0x72812ba5": "CannotRepayOnMintBlock",
	"0xd42c86b6": "BurnLimitExceeded",
	"0xe7e40b5b": "ERC20CallFailed",
	"0x60ab04f6": "UnauthorizedAccountAccess",
}

// -----------------------------------------------------------------------------
// Units — the ledger counts crypto in 6 decimal places, the chain in the
// token's own. Everything crossing this boundary is scaled here and nowhere
// else, so no caller ever holds a number in the wrong denomination.
// -----------------------------------------------------------------------------

// scale is the factor between a token's own units and the ledger's, and whether
// it is reached by multiplying or dividing. A token with FEWER decimals than the
// ledger has to divide, which one factor cannot express: big.Int holds no
// fractions, and Exp with a negative exponent returns 1 — so a 2-decimal token
// silently scaled by 1 and every amount was ten thousand times too large.
// powers of ten, computed once. A token declares somewhere between 0 and 18
// decimals and the ledger counts 6, so every factor either side of that gap is
// already here. Computing 10^n with big.Int.Exp instead cost three allocations
// on the path of every balance read, for one of about thirty answers.
//
// The returned factor is shared, so a caller must not write to it. Both do the
// same thing — pass it as an operand to Mul or Div, which write to their own
// receiver — and a caller that needs to keep one should copy it.
var powers = func() [40]*big.Int {
	var p [40]*big.Int
	for i := range p {
		p[i] = new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(i)), nil)
	}
	return p
}()

func tenTo(n int64) *big.Int {
	if n >= 0 && int(n) < len(powers) {
		return powers[n]
	}
	// A contract can declare any decimals it likes. Nothing sane lands here,
	// but answering is cheaper than deciding what a refusal would mean.
	return new(big.Int).Exp(big.NewInt(10), big.NewInt(n), nil)
}

func (c *evmChain) scale(dp int32) (factor *big.Int, up bool) {
	d := int64(dp) - int64(cryptoDecimals)
	if d < 0 {
		return tenTo(-d), false
	}
	return tenTo(d), true
}

func (c *evmChain) toWei(minor Minor, dp int32) *big.Int {
	factor, up := c.scale(dp)
	if up {
		return new(big.Int).Mul(big.NewInt(int64(minor)), factor)
	}
	return new(big.Int).Div(big.NewInt(int64(minor)), factor)
}

// toMinor converts a chain amount into ledger minor units, and refuses rather
// than answers when the holding will not fit. Int64 on an oversized big.Int
// wraps, and a balance that came back negative would satisfy every "is there
// enough" test in the bank.
func (c *evmChain) toMinor(amount *big.Int, dp int32) (Minor, error) {
	factor, up := c.scale(dp)
	v := new(big.Int)
	if up {
		v.Div(amount, factor)
	} else {
		v.Mul(amount, factor)
	}
	if !v.IsInt64() {
		return 0, fmt.Errorf("balance %s does not fit the ledger's precision", v)
	}
	return Minor(v.Int64()), nil
}

// decimals reads and remembers a token's decimals.
func (c *evmChain) decimals(ctx context.Context, token common.Address) (int32, error) {
	c.mu.Lock()
	dp, ok := c.tokenDp[token]
	c.mu.Unlock()
	if ok {
		return dp, nil
	}
	var out uint8
	if err := c.read(ctx, token, erc20ABI, "decimals", &out); err != nil {
		return 0, err
	}
	c.mu.Lock()
	c.tokenDp[token] = int32(out)
	c.mu.Unlock()
	return int32(out), nil
}

// -----------------------------------------------------------------------------
// ABIs — only the calls the bank actually makes.
// -----------------------------------------------------------------------------

var erc20ABI = mustABI(`[
{"name":"balanceOf","type":"function","stateMutability":"view","inputs":[{"type":"address"}],"outputs":[{"type":"uint256"}]},
{"name":"symbol","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}]},
{"name":"decimals","type":"function","stateMutability":"view","inputs":[],"outputs":[{"type":"uint8"}]},
{"name":"allowance","type":"function","stateMutability":"view","inputs":[{"type":"address"},{"type":"address"}],"outputs":[{"type":"uint256"}]},
{"name":"approve","type":"function","stateMutability":"nonpayable","inputs":[{"type":"address"},{"type":"uint256"}],"outputs":[{"type":"bool"}]},
{"name":"transfer","type":"function","stateMutability":"nonpayable","inputs":[{"type":"address"},{"type":"uint256"}],"outputs":[{"type":"bool"}]}
]`)

func mustABI(s string) abi.ABI {
	a, err := abi.JSON(strings.NewReader(s))
	if err != nil {
		panic(err)
	}
	return a
}
