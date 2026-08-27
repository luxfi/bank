package bank

import (
	"encoding/hex"
	"net/http"
	"strings"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"golang.org/x/crypto/sha3"
)

// -----------------------------------------------------------------------------
// Crypto send + receive. The route contract is the product; behind it sits
// the sandbox testnet ledger today and a live backend (chain MPC, venue, or
// issuer custody) when one is configured — same shape either way.
// -----------------------------------------------------------------------------

type cryptoSendReq struct {
	Asset     string `json:"asset"`
	Amount    Minor  `json:"amount"` // minor units (6 dp for crypto)
	ToAddress string `json:"toAddress"`
}

type cryptoDepositReq struct {
	Asset  string `json:"asset"`
	Amount Minor  `json:"amount"`
}

// networkName is the on-chain network for the current mode. The literal is
// derived here, never hardcoded at call sites, so a production deployment never
// mislabels itself as testnet.
func networkName() string {
	if Sandbox() {
		return "lux-testnet"
	}
	return "lux-mainnet"
}

// validAddress checks the destination against the asset's chain family with a
// real checksum, not just a length window — a transposed character must be
// rejected before it becomes irreversible on-chain loss. EVM assets (LUX, ETH,
// DAI) require an EIP-55 checksummed (or all-one-case) 0x address; BTC requires
// a bech32 address whose polymod checks out.
func validAddress(asset, addr string) bool {
	if strings.ToUpper(asset) == "BTC" {
		return validBech32(addr)
	}
	return validEVMAddress(addr)
}

func validEVMAddress(addr string) bool {
	if len(addr) != 42 || !strings.HasPrefix(addr, "0x") {
		return false
	}
	body := addr[2:]
	if _, err := hex.DecodeString(body); err != nil {
		return false
	}
	// All-lowercase or all-uppercase carries no checksum; accept it.
	if body == strings.ToLower(body) || body == strings.ToUpper(body) {
		return true
	}
	return body == eip55(strings.ToLower(body))
}

// eip55 returns the EIP-55 mixed-case checksum of a 40-char lowercase hex body.
func eip55(lower string) string {
	h := sha3.NewLegacyKeccak256()
	h.Write([]byte(lower))
	digest := h.Sum(nil)
	out := []byte(lower)
	for i, c := range out {
		if c < 'a' || c > 'f' {
			continue
		}
		if (digest[i/2]>>(4-4*(uint(i)%2)))&0xf >= 8 {
			out[i] = c - 32
		}
	}
	return string(out)
}

const bech32Charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"

// validBech32 verifies a bech32/bech32m string's HRP separator, charset, and
// polymod checksum (BIP-173 / BIP-350). Sufficient to catch typos; it does not
// decode the witness program.
func validBech32(s string) bool {
	if len(s) < 8 || len(s) > 90 {
		return false
	}
	lower := strings.ToLower(s)
	if lower != s && strings.ToUpper(s) != s {
		return false // mixed case is invalid in bech32
	}
	s = lower
	pos := strings.LastIndexByte(s, '1')
	if pos < 1 || pos+7 > len(s) {
		return false
	}
	hrp, data := s[:pos], s[pos+1:]
	values := make([]int, 0, len(data))
	for i := 0; i < len(data); i++ {
		idx := strings.IndexByte(bech32Charset, data[i])
		if idx < 0 {
			return false
		}
		values = append(values, idx)
	}
	poly := bech32Polymod(hrp, values)
	return poly == 1 || poly == 0x2bc830a3 // bech32 (v0) or bech32m (v1+)
}

func bech32Polymod(hrp string, values []int) uint32 {
	gen := []uint32{0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3}
	chk := uint32(1)
	step := func(v int) {
		b := chk >> 25
		chk = (chk&0x1ffffff)<<5 ^ uint32(v)
		for i := 0; i < 5; i++ {
			if (b>>uint(i))&1 == 1 {
				chk ^= gen[i]
			}
		}
	}
	for i := 0; i < len(hrp); i++ {
		step(int(hrp[i]) >> 5)
	}
	step(0)
	for i := 0; i < len(hrp); i++ {
		step(int(hrp[i]) & 31)
	}
	for _, v := range values {
		step(v)
	}
	return chk
}

// handleCryptoSend debits the wallet balance and records the on-chain send.
func handleCryptoSend(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		cb, cu := chain(), custodian()
		// A send has to reach a chain that can actually carry it. The sandbox
		// settles against its own testnet ledger; a configured chain signs and
		// broadcasts. With neither, refuse rather than debit funds against a
		// receipt nothing broadcast — the same discipline the exchange applies
		// when it has no rate source.
		if _, live := cb.(*evmChain); !live && !Sandbox() {
			return errJSON(e, http.StatusServiceUnavailable, "on-chain send unavailable")
		}
		req, err := bindBody[cryptoSendReq](e)
		if err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		asset := strings.ToUpper(req.Asset)
		if !isCrypto(asset) || req.Amount <= 0 {
			return apis.NewBadRequestError("invalid asset or amount", nil)
		}
		// The address family is the chain's to judge: the simulation models
		// separate chains, so BTC is bech32 there, while on one EVM every asset
		// including bridged BTC is sent to a 0x address.
		if !cb.Valid(asset, req.ToAddress) {
			return apis.NewBadRequestError("invalid destination address", nil)
		}
		// The ledger reserves first and the chain moves second. A pending debit
		// holds the funds, so an account that cannot cover the send is refused
		// before anything is broadcast — and nothing irreversible happens on
		// behalf of money the bank has not already accounted for. Broadcasting
		// first meant the balance check arrived after the coins were gone.
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "withdrawal", "direction": "debit",
			"amount": req.Amount, "currency": asset, "status": "pending",
			"reference": "Send " + asset + " to " + req.ToAddress,
			"metadata": map[string]any{
				"toAddress": req.ToAddress, "network": cb.Network(),
			},
		})
		if err != nil {
			return errJSON(e, http.StatusUnprocessableEntity, err.Error())
		}
		// Whoever holds the key signs. Today that is the bank itself, which is
		// what the seam exists to change; the route says only "this account's
		// custodian moves this asset" and does not know or care which one.
		hash, err := cu.Send(app, acct, asset, req.ToAddress, req.Amount)
		if err != nil {
			// The caller is told only that it failed — a chain error can carry
			// an address or a balance. The reason goes to the log, because a
			// send that fails without a recorded cause takes hours to diagnose,
			// and which custodian refused is half of that diagnosis.
			app.Logger().Error("on-chain send failed",
				"asset", asset, "account", acct.Id, "custodian", cu.Name(), "err", err)
			if rerr := release(app, tx); rerr != nil {
				app.Logger().Error("hold survived a failed send",
					"tx", tx.Id, "err", rerr)
			}
			return errJSON(e, http.StatusBadGateway, "on-chain send failed")
		}
		tx.Set("metadata", map[string]any{
			"txHash": hash, "toAddress": req.ToAddress, "network": cb.Network(),
		})
		if err := app.Save(tx); err != nil {
			return apis.NewInternalServerError("could not record the transaction", err)
		}
		if err := settle(app, tx); err != nil {
			return apis.NewInternalServerError("settlement failed", err)
		}
		return e.JSON(http.StatusOK, map[string]any{
			"txHash": hash, "network": cb.Network(), "asset": asset,
			"amount": req.Amount, "toAddress": req.ToAddress,
			"balances": viewBalances(app, acct.Id),
		})
	}
}

// handleCryptoDeposit is the sandbox faucet: it credits testnet crypto so the
// full receive → hold → convert → send loop can be exercised end to end.
// Registered in sandbox mode only.
func handleCryptoDeposit(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		req, err := bindBody[cryptoDepositReq](e)
		if err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		asset := strings.ToUpper(req.Asset)
		if !isCrypto(asset) || req.Amount <= 0 {
			return apis.NewBadRequestError("invalid asset or amount", nil)
		}
		// Faucet ceiling: $25k equivalent per call keeps demo balances sane.
		if minorToUSD(req.Amount, asset) > 25_000 {
			return apis.NewBadRequestError("faucet limit is $25,000 equivalent per request", nil)
		}
		hash := txHashFor(asset)
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "deposit", "direction": "credit",
			"amount": req.Amount, "currency": asset, "status": "pending",
			"reference": "Testnet deposit " + asset,
			"metadata":  map[string]any{"txHash": hash, "network": chain().Network()},
		})
		if err != nil {
			return errJSON(e, http.StatusUnprocessableEntity, err.Error())
		}
		if err := settle(app, tx); err != nil {
			return apis.NewInternalServerError("settlement failed", err)
		}
		return e.JSON(http.StatusOK, map[string]any{
			"txHash": hash, "network": chain().Network(), "asset": asset, "amount": req.Amount,
			"balances": viewBalances(app, acct.Id),
		})
	}
}
