package bank

import (
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"math"
	"math/big"
	"os"
	"strings"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// Sandbox mode
//
// The bank runs as a SANDBOX/DEMO for the investor build: testnet crypto, no
// real-money rails, seeded demo data, and instant deterministic settlement.
// Every money-moving primitive here is clearly labelled sandbox. Nothing in
// this file talks to a real payment processor.
// -----------------------------------------------------------------------------

// DemoEmail names the identity the sandbox demo signs in as. It is a name, not
// a credential: IAM holds the password and IAM checks it. The value is surfaced
// on the config route so the demo can prefill the field, and nowhere else.
func DemoEmail() string {
	if v := strings.TrimSpace(os.Getenv("BANK_DEMO_EMAIL")); v != "" {
		return v
	}
	return "z@lux.financial"
}

// Sandbox reports whether the daemon is running in sandbox/demo mode.
// Enabled by default unless BANK_SANDBOX is explicitly "false"/"0" — this is a
// demo product, so alive-out-of-the-box is the safe default.
func Sandbox() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("BANK_SANDBOX"))) {
	case "false", "0", "no", "off":
		return false
	default:
		return true
	}
}

// -----------------------------------------------------------------------------
// FX + asset pricing (sandbox tables)
// -----------------------------------------------------------------------------

// Pricing is decomplected into collections/pricing.go so the hooks package
// can normalize transaction value to USD without importing this one. The
// lowercase names below stay as thin aliases for the local call sites.
var cryptoUSD = collections.CryptoUSD
var perUSD = collections.PerUSD

const cryptoDecimals = collections.CryptoDecimals

// SupportedFiat / SupportedCrypto drive the UI pickers.
var SupportedFiat = []string{"USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "SGD", "AED", "HKD"}
var SupportedCrypto = []string{"LUX", "BTC", "ETH", "DAI"}

func isCrypto(cur string) bool             { return collections.IsCrypto(cur) }
func decimalsFor(cur string) int           { return collections.DecimalsFor(cur) }
func unitPriceUSD(cur string) float64      { return collections.UnitPriceUSD(cur) }
func minorToUSD(m Minor, c string) float64 { return collections.MinorToUSD(int64(m), c) }

// usdToMinor converts a USD float value into minor units of cur.
func usdToMinor(usd float64, cur string) Minor {
	price := unitPriceUSD(cur)
	if price == 0 {
		return 0
	}
	return round[Minor](usd / price * math.Pow10(decimalsFor(cur)))
}

// convertMinor converts a minor-unit amount from one currency to another,
// applying a small sandbox spread. Returns the destination minor amount and
// the effective rate (dst whole units per 1 src whole unit).
func convertMinor(amount Minor, from, to string) (Minor, float64) {
	const spread = 0.002 // 0.2% sandbox spread
	usd := minorToUSD(amount, from) * (1 - spread)
	dstMinor := usdToMinor(usd, to)
	rate := 0.0
	if unitPriceUSD(to) != 0 {
		rate = unitPriceUSD(from) / unitPriceUSD(to) * (1 - spread)
	}
	return dstMinor, rate
}

// -----------------------------------------------------------------------------
// Ledger helpers (package-local, so route handlers don't reach into hooks)
// -----------------------------------------------------------------------------

// setBalance force-sets an account's balance for a currency (used by seeding).
func setBalance(app core.App, accountID, currency string, available Minor) error {
	col, err := app.FindCollectionByNameOrId(collections.BalanceCollectionName)
	if err != nil {
		return err
	}
	bal, _ := app.FindFirstRecordByFilter(
		collections.BalanceCollectionName,
		`account = {:a} && currency = {:c}`,
		map[string]any{"a": accountID, "c": currency},
	)
	if bal == nil {
		bal = core.NewRecord(col)
		bal.Set("account", accountID)
		bal.Set("currency", currency)
	}
	bal.Set("available", available)
	bal.Set("held", 0)
	return app.Save(bal)
}

// newTx creates a transaction record (triggers the standard hooks: debit hold,
// limit checks) in the given status.
func newTx(app core.App, fields map[string]any) (*core.Record, error) {
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		return nil, err
	}
	rec := core.NewRecord(col)
	for k, v := range fields {
		rec.Set(k, v)
	}
	if rec.GetString("status") == "" {
		rec.Set("status", "pending")
	}
	if err := app.Save(rec); err != nil {
		return nil, err
	}
	// Return a freshly loaded record. The instance just saved still carries its
	// pre-create snapshot as Original(), so a caller that amends it — to record
	// a transaction hash, say — would look to the status guard like a move out
	// of nothing and be refused. Reloading here spares every caller the trap.
	return app.FindRecordById(collections.TransactionCollectionName, rec.Id)
}

// settle drives a pending transaction to completed, running the settlement
// hooks that release a debit hold or credit available funds. This is how
// sandbox transfers, conversions and card/crypto trades settle instantly.
//
// One transition, not two. "processing" is what an external rail reports while
// it still holds a payment; nothing in the ledger reads it, and the settlement
// hook fires once on arrival at "completed" either way. Walking through it here
// bought a second durable write on the hottest path and nothing else.
//
// The record is re-read rather than trusted: that is what makes settling twice
// harmless, and a caller may have amended its copy since.
func settle(app core.App, rec *core.Record) error {
	cur, err := app.FindRecordById(collections.TransactionCollectionName, rec.Id)
	if err != nil {
		return err
	}
	if cur.GetString("status") != "pending" {
		return nil
	}
	cur.Set("status", "completed")
	return app.Save(cur)
}

// release fails a pending transaction, returning the funds its hold reserved.
// It is settle's counterpart: exactly one of the two must run for every pending
// debit, or money stays held against a movement that never happened.
func release(app core.App, rec *core.Record) error {
	fresh, err := app.FindRecordById(collections.TransactionCollectionName, rec.Id)
	if err != nil {
		return err
	}
	if fresh.GetString("status") != "pending" {
		return nil
	}
	fresh.Set("status", "failed")
	return app.Save(fresh)
}

// -----------------------------------------------------------------------------
// Identity generation (sandbox / testnet)
// -----------------------------------------------------------------------------

// randDigits returns n cryptographically-random decimal digits.
func randDigits(n int) string {
	var b strings.Builder
	for i := 0; i < n; i++ {
		d, _ := rand.Int(rand.Reader, big.NewInt(10))
		b.WriteString(d.String())
	}
	return b.String()
}

// sandboxIBAN builds a display-only IBAN-style account number for a currency.
func sandboxIBAN(currency string) string {
	cc := "GB"
	switch strings.ToUpper(currency) {
	case "EUR":
		cc = "DE"
	case "USD":
		cc = "US"
	case "SGD":
		cc = "SG"
	case "AED":
		cc = "AE"
	}
	return fmt.Sprintf("%s29LUXF%s", cc, randDigits(16))
}

// detDigits returns n decimal digits derived deterministically from a seed, so
// an account's receiving coordinates are stable across reads (unlike randDigits).
func detDigits(seed string, n int) string {
	var b strings.Builder
	h := sha256.Sum256([]byte(seed))
	for i := 0; b.Len() < n; i++ {
		if i >= len(h) { // extend the stream if more digits are needed
			h = sha256.Sum256(h[:])
			i = 0
		}
		fmt.Fprintf(&b, "%d", int(h[i])%10)
	}
	return b.String()[:n]
}

// ibanCountry maps a currency to the country code its IBAN carries.
var ibanCountry = map[string]string{"EUR": "DE", "GBP": "GB", "CHF": "CH", "SGD": "SG", "AED": "AE"}

// receivingFor derives the bank-rail coordinates to pay an account, shaped for
// its currency. US accounts get ABA routing + account number (no IBAN); IBAN
// markets get an IBAN + BIC. Both carry a SWIFT for inbound international wires.
// Deterministic in the account id, so the details never shuffle between reads.
func receivingFor(acct *core.Record) *receivingView {
	// The coordinates below are invented — a bank name, a SWIFT, and digits
	// derived from the account id. In the sandbox that is the demo, and the
	// determinism is so the details do not shuffle between reads.
	//
	// Outside it they are the details a customer hands a payer, and a wire
	// lands wherever those digits actually point. No coordinates is a customer
	// who asks; wrong ones are somebody's money gone. Until a rail issues them,
	// there are none.
	if !Sandbox() {
		return nil
	}

	holder := acct.GetString("entityName")
	cur := strings.ToUpper(acct.GetString("currency"))
	seed := acct.Id
	r := &receivingView{
		BankName:      "SF Private Bank",
		AccountHolder: holder,
		Swift:         "SFPBUS6S",
		BankAddress:   "1 Sansome Street, San Francisco, CA 94104, US",
	}
	if cc, ok := ibanCountry[cur]; ok {
		r.IBAN = fmt.Sprintf("%s29SFPB%s", cc, detDigits(seed+cur, 16))
		r.Swift = "SFPBGB2L"
		r.BankAddress = "25 Old Broad Street, London EC2N 1HQ, GB"
		return r
	}
	// USD and anything else settle US-style.
	r.RoutingNumber = "0" + detDigits(seed+"aba", 8)
	r.AccountNumber = detDigits(seed+"acct", 10)
	r.AccountType = "Checking"
	return r
}
