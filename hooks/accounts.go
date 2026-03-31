package hooks

import (
	"log/slog"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// Account tier daily/monthly limits in minor units (cents).
var accountLimits = map[string]struct {
	daily   int64
	monthly int64
}{
	"individual": {daily: 50_000_00, monthly: 500_000_00},    // $50k / $500k
	"business":   {daily: 500_000_00, monthly: 5_000_000_00}, // $500k / $5M
}

// RegisterAccountHooks attaches record-level hooks for account management:
//   - Block transactions that exceed daily limits
//   - Block operations on frozen (suspended) accounts
//   - Audit trail on freeze/unfreeze transitions
//   - Initialize balance record on account creation
func RegisterAccountHooks(app core.App) {
	// Create a default balance record when an account is created.
	app.OnRecordCreateExecute(collections.AccountCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		balCollection, err := app.FindCollectionByNameOrId(collections.BalanceCollectionName)
		if err != nil {
			app.Logger().Error("accounts: balance collection not found", slog.String("error", err.Error()))
			return nil
		}

		bal := core.NewRecord(balCollection)
		bal.Set("account", e.Record.Id)
		bal.Set("currency", e.Record.GetString("currency"))
		bal.Set("available", 0)
		bal.Set("held", 0)

		if err := app.Save(bal); err != nil {
			app.Logger().Error("accounts: failed to create balance",
				slog.String("accountId", e.Record.Id),
				slog.String("error", err.Error()),
			)
		}

		return nil
	})

	// Enforce daily limits on transaction creation.
	app.OnRecordCreate(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		accountId := e.Record.GetString("account")
		if accountId == "" {
			return e.Next()
		}

		direction := e.Record.GetString("direction")
		if direction != "debit" {
			return e.Next() // limits only on outbound
		}

		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			return err
		}

		// Check account is not suspended.
		if account.GetString("status") == "suspended" {
			return apis.NewForbiddenError("account is frozen", nil)
		}

		entityType := account.GetString("entityType")
		limits, ok := accountLimits[entityType]
		if !ok {
			limits = accountLimits["individual"]
		}

		amount := int64(e.Record.GetFloat("amount"))

		// Check daily limit.
		dailySpent := getDailySpent(app, accountId)
		if dailySpent+amount > limits.daily {
			app.Logger().Warn("accounts: daily limit exceeded",
				slog.String("accountId", accountId),
				slog.Int64("dailySpent", dailySpent),
				slog.Int64("amount", amount),
				slog.Int64("limit", limits.daily),
			)
			return apis.NewForbiddenError("daily transaction limit exceeded", nil)
		}

		// Check monthly limit.
		monthlySpent := getMonthlySpent(app, accountId)
		if monthlySpent+amount > limits.monthly {
			app.Logger().Warn("accounts: monthly limit exceeded",
				slog.String("accountId", accountId),
				slog.Int64("monthlySpent", monthlySpent),
				slog.Int64("amount", amount),
				slog.Int64("limit", limits.monthly),
			)
			return apis.NewForbiddenError("monthly transaction limit exceeded", nil)
		}

		return e.Next()
	})

	// Audit trail on account freeze/unfreeze.
	app.OnRecordUpdate(collections.AccountCollectionName).BindFunc(func(e *core.RecordEvent) error {
		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus == newStatus {
			return e.Next()
		}

		// Only audit freeze/unfreeze transitions.
		if (oldStatus == "active" && newStatus == "suspended") ||
			(oldStatus == "suspended" && newStatus == "active") {

			action := "account_frozen"
			if newStatus == "active" {
				action = "account_unfrozen"
			}

			writeAudit(app, e.Record.Id, "system", action, map[string]any{
				"previousStatus": oldStatus,
				"newStatus":      newStatus,
			})
		}

		return e.Next()
	})
}

// getDailySpent sums debit transaction amounts for today.
func getDailySpent(app core.App, accountId string) int64 {
	records, err := app.FindRecordsByFilter(
		collections.TransactionCollectionName,
		`account = {:accountId} && direction = "debit" && status != "failed" && status != "cancelled" && created >= @todayStart`,
		"",
		0,
		0,
		map[string]any{
			"accountId":  accountId,
			"todayStart": "@todayStart",
		},
	)
	if err != nil {
		return 0
	}
	var total int64
	for _, r := range records {
		total += int64(r.GetFloat("amount"))
	}
	return total
}

// getMonthlySpent sums debit transaction amounts for the last 30 days.
func getMonthlySpent(app core.App, accountId string) int64 {
	records, err := app.FindRecordsByFilter(
		collections.TransactionCollectionName,
		`account = {:accountId} && direction = "debit" && status != "failed" && status != "cancelled" && created >= @monthAgo`,
		"",
		0,
		0,
		map[string]any{
			"accountId": accountId,
			"monthAgo":  "@now -30d",
		},
	)
	if err != nil {
		return 0
	}
	var total int64
	for _, r := range records {
		total += int64(r.GetFloat("amount"))
	}
	return total
}

// writeAudit creates an audit_log record.
func writeAudit(app core.App, accountId, actor, action string, detail map[string]any) {
	auditCollection, err := app.FindCollectionByNameOrId(collections.AuditCollectionName)
	if err != nil {
		app.Logger().Error("audit: collection not found", slog.String("error", err.Error()))
		return
	}

	record := core.NewRecord(auditCollection)
	record.Set("account", accountId)
	record.Set("actor", actor)
	record.Set("action", action)
	record.Set("detail", detail)

	if err := app.Save(record); err != nil {
		app.Logger().Error("audit: failed to write",
			slog.String("accountId", accountId),
			slog.String("action", action),
			slog.String("error", err.Error()),
		)
	}
}
