package hooks

import (
	"log/slog"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// RegisterComplianceHooks attaches record-level hooks that enforce KYC / AML
// rules before certain operations are allowed:
//
//   - Transactions cannot be created against accounts that are not KYC-approved.
//   - Beneficiaries cannot be verified unless the parent account is active.
//   - High-risk accounts trigger a log entry on every transaction create
//     (placeholder for a real compliance queue integration).
func RegisterComplianceHooks(app core.App) {
	// Block transaction creation when the account is not KYC-approved.
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
			app.Logger().Warn("compliance: blocked transaction — account not KYC-approved",
				slog.String("accountId", accountId),
				slog.String("kycStatus", kycStatus),
			)
			return apis.NewForbiddenError("account has not passed KYC review", nil)
		}

		accountStatus := account.GetString("status")
		if accountStatus != "active" {
			app.Logger().Warn("compliance: blocked transaction — account not active",
				slog.String("accountId", accountId),
				slog.String("status", accountStatus),
			)
			return apis.NewForbiddenError("account is not active", nil)
		}

		// Flag high-risk accounts for review.
		if account.GetString("riskRating") == "high" {
			app.Logger().Info("compliance: high-risk transaction flagged for review",
				slog.String("accountId", accountId),
				slog.String("transactionType", e.Record.GetString("type")),
				slog.Float64("amount", e.Record.GetFloat("amount")),
			)
		}

		return e.Next()
	})

	// Block beneficiary verification when the parent account is not active.
	app.OnRecordUpdate(collections.BeneficiaryCollectionName).BindFunc(func(e *core.RecordEvent) error {
		// Only care when "verified" is being set to true.
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
	})

	// Log every account status change for audit trail.
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
