package hooks

import (
	"fmt"
	"log/slog"
	"math"
	"time"

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
		// A membership raises what an account may move. It never lowers it.
		//
		// The entity-type limits are the baseline every account has, and the
		// tier replaced them outright — so the entry tier, which is the cheapest
		// thing a customer can buy, cut an individual from $50k a day to $10k.
		// Paying made you worse off than never subscribing, and the ladder is
		// advertised on the landing page, so it is a promise about to be sold.
		if plan, ok := collections.PlanByID(account.GetString("plan")); ok {
			limits.daily = max(limits.daily, plan.DailyLimit)
			limits.monthly = max(limits.monthly, plan.MonthlyLimit)
		}

		// Normalize the incoming amount to USD cents so it is comparable to the
		// USD-denominated limits and the USD-normalized running totals.
		//
		// A currency with no reference price normalizes to ZERO, and zero clears
		// every ceiling below — it would never exceed the daily limit and would
		// add nothing to the total it should have consumed. The currency field is
		// an unconstrained three-letter string, so this is reachable by typing
		// one. A limit cannot be enforced in a unit that cannot be converted, so
		// the transaction is refused rather than admitted at nothing.
		currency := e.Record.GetString("currency")
		if !collections.CanPrice(currency) {
			app.Logger().Warn("accounts: refusing a transaction in an unpriceable currency",
				slog.String("accountId", accountId),
				slog.String("currency", currency),
			)
			return apis.NewBadRequestError("currency is not priced by this bank", nil)
		}
		amount := collections.USDCents(int64(math.Round(e.Record.GetFloat("amount"))), currency)

		// Check daily limit.
		dailySpent, err := getDailySpent(app, accountId)
		if err != nil {
			app.Logger().Error("accounts: refusing a transaction whose daily total cannot be read",
				slog.String("accountId", accountId),
				slog.String("error", err.Error()),
			)
			return apis.NewForbiddenError("transaction limits cannot be checked right now", nil)
		}
		if dailySpent+amount > limits.daily {
			app.Logger().Warn("accounts: daily limit exceeded",
				slog.String("accountId", accountId),
				slog.Int64("dailySpentUsdCents", dailySpent),
				slog.Int64("amountUsdCents", amount),
				slog.Int64("limitUsdCents", limits.daily),
			)
			return apis.NewForbiddenError("daily transaction limit exceeded", nil)
		}

		// Check monthly limit.
		monthlySpent, err := getMonthlySpent(app, accountId)
		if err != nil {
			app.Logger().Error("accounts: refusing a transaction whose monthly total cannot be read",
				slog.String("accountId", accountId),
				slog.String("error", err.Error()),
			)
			return apis.NewForbiddenError("transaction limits cannot be checked right now", nil)
		}
		if monthlySpent+amount > limits.monthly {
			app.Logger().Warn("accounts: monthly limit exceeded",
				slog.String("accountId", accountId),
				slog.Int64("monthlySpentUsdCents", monthlySpent),
				slog.Int64("amountUsdCents", amount),
				slog.Int64("limitUsdCents", limits.monthly),
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

// getDailySpent sums today's debits as USD cents. Amounts are minor units in
// their own currency (cents for fiat, micro-units for crypto), so each is
// normalized to USD before summing — otherwise a crypto send and a fiat
// payment would be added as if they shared a unit, and the sum compared to a
// USD-denominated limit would be meaningless.
func getDailySpent(app core.App, accountId string) (int64, error) {
	return sumDebitsUSDCents(app,
		`account = {:accountId} && direction = "debit" && status != "failed" && status != "cancelled" && created >= @todayStart`,
		map[string]any{"accountId": accountId})
}

// getMonthlySpent sums the last 30 days of debits as USD cents.
func getMonthlySpent(app core.App, accountId string) (int64, error) {
	thirtyDaysAgo := time.Now().UTC().AddDate(0, 0, -30).Format("2006-01-02 15:04:05.000Z")
	return sumDebitsUSDCents(app,
		`account = {:accountId} && direction = "debit" && status != "failed" && status != "cancelled" && created >= {:since}`,
		map[string]any{"accountId": accountId, "since": thirtyDaysAgo})
}

// sumDebitsUSDCents totals what an account has already spent in a window, or
// says it cannot.
//
// Answering zero for a total it could not compute is the one answer that must
// not be given: nothing spent clears every ceiling, so a failed query and a row
// in a currency with no reference price both read as an account that has moved
// nothing today. A limit cannot be enforced in a unit that cannot be converted,
// and it cannot be enforced against a history that cannot be read — the same
// sentence the incoming amount is already held to.
func sumDebitsUSDCents(app core.App, filter string, params map[string]any) (int64, error) {
	records, err := app.FindRecordsByFilter(collections.TransactionCollectionName, filter, "", 0, 0, params)
	if err != nil {
		return 0, err
	}
	var total int64
	for _, r := range records {
		cur := r.GetString("currency")
		if !collections.CanPrice(cur) {
			return 0, fmt.Errorf("transaction %s is in %s, which has no reference price", r.Id, cur)
		}
		total += collections.USDCents(int64(math.Round(r.GetFloat("amount"))), cur)
	}
	return total, nil
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
