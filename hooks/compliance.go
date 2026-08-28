package hooks

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"math"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// AML screening threshold in minor units. Transactions above this trigger
// an external compliance check.
const amlThreshold int64 = 10_000_00 // $10,000

// RegisterComplianceHooks attaches record-level hooks that enforce KYC, AML,
// sanctions, and PEP rules:
//
//   - KYC gate: block transactions on non-approved accounts
//   - AML screening: external check for transactions above threshold
//   - Sanctions check: screen beneficiaries on creation
//   - PEP screening: screen accounts on creation
//   - Audit logging for status and KYC transitions
func RegisterComplianceHooks(app core.App) {
	// KYC gate + account status check on transaction creation.
	app.OnRecordCreate(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		accountId := e.Record.GetString("account")
		if accountId == "" {
			return e.Next()
		}

		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			return err
		}

		kycStatus := account.GetString("kycStatus")
		if kycStatus != "approved" {
			app.Logger().Warn("compliance: blocked — KYC not approved",
				slog.String("accountId", accountId),
				slog.String("kycStatus", kycStatus),
			)
			return apis.NewForbiddenError("account has not passed KYC review", nil)
		}

		accountStatus := account.GetString("status")
		if accountStatus != "active" {
			app.Logger().Warn("compliance: blocked — account not active",
				slog.String("accountId", accountId),
				slog.String("status", accountStatus),
			)
			return apis.NewForbiddenError("account is not active", nil)
		}

		// Flag high-risk accounts.
		if account.GetString("riskRating") == "high" {
			app.Logger().Info("compliance: high-risk transaction flagged",
				slog.String("accountId", accountId),
				slog.String("type", e.Record.GetString("type")),
				slog.Float64("amount", e.Record.GetFloat("amount")),
			)
		}

		// AML screening above threshold — normalized to USD cents so a
		// high-value crypto send can't slip under a USD threshold (and a
		// trivial stablecoin transfer isn't needlessly screened).
		//
		// The same normalization answers ZERO for a currency it cannot price,
		// which is below every threshold — so an unpriced transfer of any size
		// would skip screening entirely, which is the exact evasion the sentence
		// above says this exists to stop. Screen it rather than price it at
		// nothing: unable to value is not the same as small. The limit gate in
		// accounts.go refuses these outright; this does not depend on running
		// after it.
		currency := e.Record.GetString("currency")
		amount := collections.USDCents(int64(math.Round(e.Record.GetFloat("amount"))), currency)
		if !collections.CanPrice(currency) {
			amount = amlThreshold
		}
		if amount >= amlThreshold {
			if err := screenAML(app, accountId, e.Record); err != nil {
				return apis.NewForbiddenError("transaction blocked by AML screening", nil)
			}
		}

		return e.Next()
	})

	// A frozen account does not gain a verified place to send money to. The
	// rule is bound to both doors because a beneficiary reaches "verified" by
	// either: an update flips the flag, and a create arrives with it already
	// set. Bound only to the update, the create walked straight past it — the
	// route sets verified on the way in, so the flag was never flipped and the
	// hook never fired.
	verifiedOnActiveAccount := func(e *core.RecordEvent) error {
		if !e.Record.GetBool("verified") {
			return e.Next()
		}

		accountId := e.Record.GetString("account")
		if accountId == "" {
			return e.Next()
		}

		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			return err
		}

		if account.GetString("status") != "active" {
			return apis.NewForbiddenError("cannot verify beneficiary — parent account is not active", nil)
		}

		return e.Next()
	}
	app.OnRecordUpdate(collections.BeneficiaryCollectionName).BindFunc(verifiedOnActiveAccount)
	app.OnRecordCreate(collections.BeneficiaryCollectionName).BindFunc(verifiedOnActiveAccount)

	// Sanctions check on beneficiary creation.
	app.OnRecordCreate(collections.BeneficiaryCollectionName).BindFunc(func(e *core.RecordEvent) error {
		name := e.Record.GetString("bankAccountHolder")
		country := e.Record.GetString("country")

		if err := screenSanctions(app, name, country); err != nil {
			return apis.NewForbiddenError("beneficiary blocked by sanctions screening", nil)
		}

		return e.Next()
	})

	// PEP screening on account creation.
	app.OnRecordCreate(collections.AccountCollectionName).BindFunc(func(e *core.RecordEvent) error {
		entityName := e.Record.GetString("entityName")
		country := e.Record.GetString("country")

		if err := screenPEP(app, entityName, country); err != nil {
			// PEP match does not block — it sets risk rating to high.
			app.Logger().Warn("compliance: PEP match on account creation",
				slog.String("entityName", entityName),
				slog.String("country", country),
			)
			e.Record.Set("riskRating", "high")
		}

		return e.Next()
	})

	// Audit trail for account status and KYC changes.
	app.OnRecordUpdate(collections.AccountCollectionName).BindFunc(func(e *core.RecordEvent) error {
		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus != newStatus {
			app.Logger().Info("compliance: account status changed",
				slog.String("accountId", e.Record.Id),
				slog.String("from", oldStatus),
				slog.String("to", newStatus),
			)
		}

		oldKYC := e.Record.Original().GetString("kycStatus")
		newKYC := e.Record.GetString("kycStatus")

		if oldKYC != newKYC {
			app.Logger().Info("compliance: KYC status changed",
				slog.String("accountId", e.Record.Id),
				slog.String("from", oldKYC),
				slog.String("to", newKYC),
			)
		}

		return e.Next()
	})
}

// Screener is the compliance service every screen is put to, or "" when none is
// configured. It is read here and nowhere else.
//
// Nothing to screen against means nothing is screened, and AML and sanctions
// are declared fail-closed — so the likeliest failure of all, the service
// simply not being configured, was the one that let everything through
// quietly. A sandbox has no screener and wants none; a deployment that has
// declared itself real is refused at startup rather than run without one, so
// the gap cannot exist unnoticed. bankd asks this before it mounts anything.
func Screener() string { return strings.TrimSpace(os.Getenv("COMPLIANCE_SERVICE_URL")) }

// screen runs one payload through the compliance service, the single place
// that reads COMPLIANCE_SERVICE_URL and applies fail policy. A missing service
// always allows (dev mode). blockValue is the result string that rejects
// ("blocked" or "match"); failOpen decides whether an unreachable service
// allows (true) or blocks (false). Callers declare the payload and the policy;
// this owns the mechanism.
func screen(app core.App, kind, blockValue string, failOpen bool, payload map[string]any) error {
	url := Screener()
	if url == "" {
		return nil
	}
	result, err := callComplianceService(url+"/v1/screen", payload)
	if err != nil {
		if failOpen {
			return nil
		}
		app.Logger().Error("compliance: "+kind+" service error", slog.String("error", err.Error()))
		return err
	}
	if result == blockValue {
		return apis.NewForbiddenError(kind+" blocked", nil)
	}
	return nil
}

// screenAML — transaction AML, fail-closed.
func screenAML(app core.App, accountId string, record *core.Record) error {
	return screen(app, "AML", "blocked", false, map[string]any{
		"type": "aml", "accountId": accountId,
		"amount":    record.GetFloat("amount"),
		"currency":  record.GetString("currency"),
		"direction": record.GetString("direction"),
	})
}

// screenSanctions — name/country sanctions, fail-closed.
func screenSanctions(app core.App, name, country string) error {
	return screen(app, "sanctions", "blocked", false, map[string]any{
		"type": "sanctions", "name": name, "country": country,
	})
}

// screenPEP — politically-exposed-person, fail-open (a screening outage does
// not block onboarding).
func screenPEP(app core.App, name, country string) error {
	return screen(app, "PEP", "match", true, map[string]any{
		"type": "pep", "name": name, "country": country,
	})
}

// complianceResponse is the expected shape from the compliance service.
type complianceResponse struct {
	Result string `json:"result"` // "clear", "blocked", "match"
}

func callComplianceService(url string, payload map[string]any) (string, error) {
	body, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return "blocked", nil // treat service errors as blocked (fail closed)
	}

	var result complianceResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.Result, nil
}
