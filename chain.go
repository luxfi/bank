package bank

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"strings"
)

// -----------------------------------------------------------------------------
// ChainBackend — the on-chain half of the wallet. It derives deposit addresses
// and broadcasts sends; the bank ledger (hold/settle) stays on the bank side.
// One implementation per environment, selected by chain(): simChain simulates
// on the internal testnet ledger today; a real backend (chain RPC + signer +
// broadcast) drops in behind this same interface when one is configured —
// exactly the seam the Issuer and FXProvider abstractions use. No caller
// touches txHash() or an address literal directly.
// -----------------------------------------------------------------------------

type ChainBackend interface {
	// Network is the chain identifier the wallet reports (lux-testnet / lux-mainnet).
	Network() string
	// Address is the deterministic deposit address for a principal + asset. BTC
	// is a bech32 address; EVM-family assets (LUX, ETH, DAI) are a 0x address.
	Address(seed, asset string) string
	// Send broadcasts a transfer and returns the on-chain tx hash. The sandbox
	// returns a random testnet hash and moves nothing on-chain; a real backend
	// signs and broadcasts.
	Send(asset, toAddress string, amount int64) (string, error)
}

// chain resolves the active backend. There is no real chain backend yet, so
// live mode has none — handleCryptoSend refuses on-chain sends outside sandbox
// (it never reaches chain()), and this returns the simulation for the sandbox
// paths (address derivation, faucet). A real backend selected by BANK_CHAIN
// slots in here.
func chain() ChainBackend {
	return simChain{}
}

// simChain simulates the testnet: deterministic display addresses, random tx
// hashes, no broadcast.
type simChain struct{}

func (simChain) Network() string { return networkName() }

func (simChain) Address(seed, asset string) string {
	if strings.ToUpper(asset) == "BTC" {
		return simBTCAddress(seed)
	}
	return evmAddress(seed, asset)
}

func (simChain) Send(_, _ string, _ int64) (string, error) {
	return simTxHash(), nil
}

// simTxHash returns a random 0x + 64-hex display hash for a sandbox transaction.
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
