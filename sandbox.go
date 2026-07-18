package bank

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
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

// DemoEmail / DemoPassword are the hero sandbox login credential. Defaults are
// baked in for the investor demo; overridable via env. Only the bcrypt hash of
// the password is ever persisted (see EnsureCredentialCollection).
func DemoEmail() string {
	if v := strings.TrimSpace(os.Getenv("BANK_DEMO_EMAIL")); v != "" {
		return v
	}
	return "z@lux.financial"
}

func DemoPassword() string {
	if v := os.Getenv("BANK_DEMO_PASSWORD"); v != "" {
		return v
	}
	return "IloveLux2026!!!"
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

// perUSD holds units of each fiat currency per 1 USD. Sandbox reference rates.
var perUSD = map[string]float64{
	"USD": 1.00,
	"EUR": 0.92,
	"GBP": 0.79,
	"JPY": 157.0,
	"CHF": 0.89,
	"CAD": 1.37,
	"AUD": 1.52,
	"SGD": 1.35,
	"AED": 3.67,
	"HKD": 7.81,
}

// cryptoUSD holds the USD price of one whole unit of each supported asset.
// All codes are 3 chars (ISO-width) so they validate against the existing
// currency fields without a schema change — DAI is the sandbox stablecoin.
var cryptoUSD = map[string]float64{
	"LUX": 12.50,
	"BTC": 64000.0,
	"ETH": 3400.0,
	"DAI": 1.00,
}

// SupportedFiat / SupportedCrypto drive the UI pickers.
var SupportedFiat = []string{"USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "SGD", "AED", "HKD"}
var SupportedCrypto = []string{"LUX", "BTC", "ETH", "DAI"}

// cryptoDecimals is the fixed-point precision used to store crypto balances in
// the balances collection (integer micro-units, 6 dp) — enough resolution for
// the demo and safely within int64 for every listed asset.
const cryptoDecimals = 6

func isCrypto(cur string) bool {
	_, ok := cryptoUSD[strings.ToUpper(cur)]
	return ok
}

// decimalsFor returns the minor-unit precision for a currency.
func decimalsFor(cur string) int {
	cur = strings.ToUpper(cur)
	if isCrypto(cur) {
		return cryptoDecimals
	}
	switch cur {
	case "JPY", "KRW":
		return 0
	default:
		return 2
	}
}

// unitPriceUSD returns the USD value of one whole unit of the currency.
func unitPriceUSD(cur string) float64 {
	cur = strings.ToUpper(cur)
	if p, ok := cryptoUSD[cur]; ok {
		return p
	}
	if r, ok := perUSD[cur]; ok && r != 0 {
		return 1.0 / r
	}
	return 0
}

// minorToUSD converts a minor-unit amount in cur to a USD float value.
func minorToUSD(minor int64, cur string) float64 {
	return float64(minor) / math.Pow10(decimalsFor(cur)) * unitPriceUSD(cur)
}

// usdToMinor converts a USD float value into minor units of cur.
func usdToMinor(usd float64, cur string) int64 {
	price := unitPriceUSD(cur)
	if price == 0 {
		return 0
	}
	return int64(math.Round(usd / price * math.Pow10(decimalsFor(cur))))
}

// convertMinor converts a minor-unit amount from one currency to another,
// applying a small sandbox spread. Returns the destination minor amount and
// the effective rate (dst whole units per 1 src whole unit).
func convertMinor(amount int64, from, to string) (int64, float64) {
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
func setBalance(app core.App, accountID, currency string, available int64) error {
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
	return rec, nil
}

// settle drives a pending transaction through processing → completed, which
// runs the real settlement hooks (release debit hold / credit available). This
// is how sandbox transfers, conversions and card/crypto trades settle instantly.
//
// Each step re-reads the record: a record instance's Original() snapshot is not
// refreshed between saves, so reusing one instance would make the second
// transition see a stale "pending" baseline and the status-transition guard
// would reject pending → completed. Reloading per step keeps the baseline correct.
func settle(app core.App, rec *core.Record) error {
	cur, err := app.FindRecordById(collections.TransactionCollectionName, rec.Id)
	if err != nil {
		return err
	}
	if cur.GetString("status") != "pending" {
		return nil
	}
	for _, next := range []string{"processing", "completed"} {
		fresh, err := app.FindRecordById(collections.TransactionCollectionName, rec.Id)
		if err != nil {
			return err
		}
		fresh.Set("status", next)
		if err := app.Save(fresh); err != nil {
			return err
		}
	}
	return nil
}

// -----------------------------------------------------------------------------
// Identity generation (sandbox / testnet)
// -----------------------------------------------------------------------------

// luxTestnetAddress derives a deterministic, display-only Lux testnet (EVM)
// address from a seed. Not a real key — the production wallet is provisioned by
// threshold MPC (see onboard notes); this is a stable sandbox stand-in.
func luxTestnetAddress(seed string) string {
	sum := sha256.Sum256([]byte("lux-testnet:" + seed))
	return "0x" + hex.EncodeToString(sum[12:32])
}

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
