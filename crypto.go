package bank

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"strings"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
)

// -----------------------------------------------------------------------------
// Crypto send + receive. The route contract is the product; behind it sits
// the sandbox testnet ledger today and a live backend (chain MPC, venue, or
// issuer custody) when one is configured — same shape either way.
// -----------------------------------------------------------------------------

type cryptoSendReq struct {
	Asset     string `json:"asset"`
	Amount    int64  `json:"amount"` // minor units (6 dp for crypto)
	ToAddress string `json:"toAddress"`
}

type cryptoDepositReq struct {
	Asset  string `json:"asset"`
	Amount int64  `json:"amount"`
}

// txHash returns a random display hash for a sandbox testnet transaction.
func txHash() string {
	var b [32]byte
	rand.Read(b[:])
	return "0x" + hex.EncodeToString(b[:])
}

// validAddress checks the destination shape per asset family: EVM assets
// take 0x + 40 hex; BTC takes a base58/bech32-length string.
func validAddress(asset, addr string) bool {
	if strings.ToUpper(asset) == "BTC" {
		return len(addr) >= 26 && len(addr) <= 62 && !strings.HasPrefix(addr, "0x")
	}
	if len(addr) != 42 || !strings.HasPrefix(addr, "0x") {
		return false
	}
	_, err := hex.DecodeString(addr[2:])
	return err == nil
}

// handleCryptoSend debits the wallet balance and records the on-chain send.
func handleCryptoSend(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		var req cryptoSendReq
		if err := e.BindBody(&req); err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		asset := strings.ToUpper(req.Asset)
		if !isCrypto(asset) || req.Amount <= 0 {
			return apis.NewBadRequestError("invalid asset or amount", nil)
		}
		if !validAddress(asset, req.ToAddress) {
			return apis.NewBadRequestError("invalid destination address", nil)
		}
		hash := txHash()
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "withdrawal", "direction": "debit",
			"amount": req.Amount, "currency": asset, "status": "pending",
			"reference": "Send " + asset + " to " + req.ToAddress,
			"metadata": map[string]any{
				"txHash": hash, "toAddress": req.ToAddress, "network": "lux-testnet",
			},
		})
		if err != nil {
			return e.JSON(http.StatusUnprocessableEntity, map[string]string{"error": err.Error()})
		}
		if err := settle(app, tx); err != nil {
			return apis.NewInternalServerError("settlement failed", err)
		}
		return e.JSON(http.StatusOK, map[string]any{
			"txHash": hash, "network": "lux-testnet", "asset": asset,
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
		var req cryptoDepositReq
		if err := e.BindBody(&req); err != nil {
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
		hash := txHash()
		tx, err := newTx(app, map[string]any{
			"account": acct.Id, "type": "deposit", "direction": "credit",
			"amount": req.Amount, "currency": asset, "status": "pending",
			"reference": "Testnet deposit " + asset,
			"metadata":  map[string]any{"txHash": hash, "network": "lux-testnet"},
		})
		if err != nil {
			return e.JSON(http.StatusUnprocessableEntity, map[string]string{"error": err.Error()})
		}
		if err := settle(app, tx); err != nil {
			return apis.NewInternalServerError("settlement failed", err)
		}
		return e.JSON(http.StatusOK, map[string]any{
			"txHash": hash, "network": "lux-testnet", "asset": asset, "amount": req.Amount,
			"balances": viewBalances(app, acct.Id),
		})
	}
}
