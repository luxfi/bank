package hooks

import (
	"log/slog"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// Fee schedule: amount in basis points (1 bp = 0.01%).
// Applied to the transaction amount in minor units.

// Tiered fee rates by account entity type.
var tierFees = map[string]int64{
	"individual": 50, // 0.50%
	"business":   30, // 0.30%
}

// Additional fee per payment type (flat, minor units).
var paymentTypeFees = map[string]map[string]int64{
	"payment": {
		"wire_fee": 2500, // $25.00 flat wire fee
		"sepa_fee": 500,  // $5.00 flat SEPA fee
	},
	"conversion": {
		"conversion_spread": 0, // calculated as bp on amount
	},
}

// Conversion spread in basis points.
const conversionSpreadBP = 25 // 0.25%

// Volume discount thresholds (monthly volume in minor units → discount bp).
// Discounts subtract from the tier rate.
var volumeDiscounts = []struct {
	threshold int64
	discount  int64
}{
	{100_000_00, 5},  // > $100k/mo → 5bp off
	{500_000_00, 10}, // > $500k/mo → 10bp off
	{1_000_000_00, 15}, // > $1M/mo → 15bp off
}

// CalculateFee returns the fee in minor units for a transaction.
// entityType is "individual" or "business".
// txType is "payment", "conversion", etc.
// amount is in minor units. monthlyVolume is the rolling 30-day volume.
func CalculateFee(entityType, txType string, amount, monthlyVolume int64) (feeAmount int64, feeType string) {
	rateBP, ok := tierFees[entityType]
	if !ok {
		rateBP = tierFees["individual"] // default to highest
	}

	// Apply volume discount.
	for i := len(volumeDiscounts) - 1; i >= 0; i-- {
		if monthlyVolume >= volumeDiscounts[i].threshold {
			rateBP -= volumeDiscounts[i].discount
			break
		}
	}
	if rateBP < 0 {
		rateBP = 0
	}

	feeType = "service_fee"

	switch txType {
	case "conversion":
		// Conversion uses spread instead of tier fee.
		feeAmount = amount * conversionSpreadBP / 10000
		feeType = "conversion_spread"
		return

	case "payment":
		// Percentage fee.
		feeAmount = amount * rateBP / 10000
		// Add flat wire fee (use wire for now; SEPA detection would come from
		// beneficiary payment type which is outside this function's scope).
		feeAmount += paymentTypeFees["payment"]["wire_fee"]
		feeType = "wire_fee"
		return

	default:
		// Deposits, withdrawals, etc. — percentage only.
		feeAmount = amount * rateBP / 10000
		return
	}
}

// RegisterFeeHooks attaches a hook that creates a fee record after every
// transaction is created (when the fee is > 0).
func RegisterFeeHooks(app core.App) {
	app.OnRecordCreateExecute(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		amount := int64(e.Record.GetFloat("amount"))
		if amount <= 0 {
			return nil
		}

		// Look up account to get entity type.
		accountId := e.Record.GetString("account")
		if accountId == "" {
			return nil
		}

		account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
		if err != nil {
			app.Logger().Warn("fees: could not find account for fee calculation",
				slog.String("accountId", accountId),
			)
			return nil // don't block the transaction
		}

		entityType := account.GetString("entityType")
		txType := e.Record.GetString("type")

		// Get monthly volume for discount calculation.
		monthlyVolume := getMonthlyVolume(app, accountId)

		feeAmount, feeType := CalculateFee(entityType, txType, amount, monthlyVolume)
		if feeAmount <= 0 {
			return nil
		}

		// Create fee record.
		feeCollection, err := app.FindCollectionByNameOrId(collections.FeeCollectionName)
		if err != nil {
			app.Logger().Error("fees: fee collection not found", slog.String("error", err.Error()))
			return nil
		}

		feeRecord := core.NewRecord(feeCollection)
		feeRecord.Set("transaction", e.Record.Id)
		feeRecord.Set("type", feeType)
		feeRecord.Set("amount", feeAmount)
		feeRecord.Set("currency", e.Record.GetString("currency"))

		if err := app.Save(feeRecord); err != nil {
			app.Logger().Error("fees: failed to create fee record",
				slog.String("transactionId", e.Record.Id),
				slog.String("error", err.Error()),
			)
		}

		return nil
	})
}

// getMonthlyVolume sums completed transaction amounts for an account in the
// last 30 days.
func getMonthlyVolume(app core.App, accountId string) int64 {
	records, err := app.FindRecordsByFilter(
		collections.TransactionCollectionName,
		`account = {:accountId} && status = "completed" && created >= @thirtyDaysAgo`,
		"",
		0,
		0,
		map[string]any{
			"accountId":    accountId,
			"thirtyDaysAgo": "@now -30d",
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
