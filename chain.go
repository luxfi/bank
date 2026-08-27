package bank

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"
)

// -----------------------------------------------------------------------------
// ChainBackend — what the chain itself can answer: which chain this is, what it
// carries, whether a destination is well formed, and what an address holds.
// Every one of those is a read, and a read needs no key, which is why none of it
// takes a principal. Who holds the keys and who signs is Custodian's, next door.
//
// Three implementations, chosen by chain(): evmChain against a real EVM,
// simChain for the sandbox, and offChain for a chain that was configured and
// cannot be reached.
// -----------------------------------------------------------------------------

type ChainBackend interface {
	// Network is the chain identifier the wallet reports (lux-testnet / lux-mainnet).
	Network() string
	// Assets is every asset this chain carries, mapped to its token contract.
	// The chain's own coin has no contract, so its entry is empty — which is
	// how the wallet view tells a native balance from a token balance.
	Assets() map[string]string
	// Valid reports whether a destination is well formed for an asset here.
	Valid(asset, addr string) bool
	// Balance is the asset's balance at an address.
	Balance(addr, asset string) (Minor, error)
}

// chain resolves the active backend: the real EVM when one is configured, the
// simulation when none is. The simulation stays the default deliberately — the
// sandbox demo has to run with nothing configured at all.
//
// The third case is the one that matters. A bank configured for a chain it
// cannot reach must not fall back to the simulation, because the simulation
// answers a send with a receipt for a transfer that never happened. It refuses.
func chain() ChainBackend {
	if c := evm(); c != nil {
		return c
	}
	if ChainConfigured() {
		return offChain{}
	}
	return simChain{}
}

// offChain stands in for a chain the bank was told to use and cannot reach.
// Every operation fails; nothing is invented.
type offChain struct{}

var errChainDown = errors.New("the configured chain is unreachable")

func (offChain) Network() string                       { return networkName() }
func (offChain) Assets() map[string]string             { return map[string]string{} }
func (offChain) Valid(_, addr string) bool             { return validEVMAddress(addr) }
func (offChain) Balance(string, string) (Minor, error) { return 0, errChainDown }

// simChain simulates the testnet: it names the network, lists the assets, and
// has nothing to read a balance from. Its stand-in addresses and receipts belong
// to simCustodian, because inventing those is custody, not chain.
type simChain struct{}

func (simChain) Network() string { return networkName() }

// simAddress is the simulation's display address for an account in an asset. The
// simulation models each asset as its own chain, so BTC is bech32 and everything
// else is 0x — a shape a real EVM does not have, and one more reason the
// simulation is reachable only with no chain configured at all.
func simAddress(index, asset string) string {
	if strings.ToUpper(asset) == "BTC" {
		return simBTCAddress(index)
	}
	return evmAddress(index, asset)
}

// Assets: the simulation models each asset as its own chain, so none of them is
// a token contract on a shared one.
func (simChain) Assets() map[string]string {
	out := make(map[string]string, len(SupportedCrypto))
	for _, asset := range SupportedCrypto {
		out[asset] = ""
	}
	return out
}

func (simChain) Valid(asset, addr string) bool { return validAddress(asset, addr) }

// Balance: the simulation has no chain to read, so the ledger is the truth.
func (simChain) Balance(string, string) (Minor, error) {
	return 0, errors.New("no chain configured")
}

// txHashFor returns a random display tx hash in the shape of the asset's chain:
// Bitcoin hashes are 64 bare hex chars; EVM-family hashes are 0x + 64 hex.
func txHashFor(asset string) string {
	if strings.ToUpper(asset) == "BTC" {
		var b [32]byte
		rand.Read(b[:])
		return hex.EncodeToString(b[:])
	}
	return simTxHash()
}

// simTxHash returns a random 0x + 64-hex display hash for an EVM transaction.
func simTxHash() string {
	var b [32]byte
	rand.Read(b[:])
	return "0x" + hex.EncodeToString(b[:])
}

// evmAddress derives a deterministic, display-only EVM (0x) address from a seed
// and asset. Not a real key — production wallets are provisioned by threshold
// MPC; this is a stable sandbox stand-in, distinct per asset.
func evmAddress(seed, asset string) string {
	sum := sha256.Sum256([]byte("lux-evm:" + strings.ToUpper(asset) + ":" + seed))
	return "0x" + hex.EncodeToString(sum[12:32])
}

// simBTCAddress derives a deterministic, display-only native-SegWit v0 (bc1q)
// address whose bech32 checksum verifies, so a BTC deposit address the sandbox
// shows also passes validAddress and never reads as invalid to the sender. The
// 20-byte witness program is derived from the seed (not a spendable key) — a
// sandbox stand-in, valid in shape and checksum but not backed by a real key.
func simBTCAddress(seed string) string {
	sum := sha256.Sum256([]byte("lux-btc:" + seed))
	return bech32Encode("bc", 0, sum[:20])
}

// bech32Encode builds a BIP-173 SegWit address: hrp + '1' + witver + the
// 8→5-bit-repacked program + a 6-symbol checksum.
func bech32Encode(hrp string, witver byte, program []byte) string {
	data := append([]int{int(witver)}, convertBits(program, 8, 5, true)...)
	// Checksum: polymod over hrp-expanded data + 6 zero symbols, XOR 1.
	polymod := bech32Polymod(hrp, append(append([]int{}, data...), 0, 0, 0, 0, 0, 0)) ^ 1
	for i := 0; i < 6; i++ {
		data = append(data, int((polymod>>uint(5*(5-i)))&31))
	}
	var b strings.Builder
	b.WriteString(hrp)
	b.WriteByte('1')
	for _, d := range data {
		b.WriteByte(bech32Charset[d])
	}
	return b.String()
}

// convertBits repacks a byte stream from `from`-bit to `to`-bit groups.
func convertBits(data []byte, from, to uint, pad bool) []int {
	acc, bits := 0, uint(0)
	maxv := (1 << to) - 1
	out := make([]int, 0, len(data)*int(from)/int(to)+1)
	for _, b := range data {
		acc = (acc << from) | int(b)
		bits += from
		for bits >= to {
			bits -= to
			out = append(out, (acc>>bits)&maxv)
		}
	}
	if pad && bits > 0 {
		out = append(out, (acc<<(to-bits))&maxv)
	}
	return out
}
