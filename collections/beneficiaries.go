package collections

import "github.com/hanzoai/base/core"

const BeneficiaryCollectionName = "beneficiaries"

// EnsureBeneficiaryCollection creates the beneficiaries collection if it does
// not exist. Each beneficiary belongs to an account and stores bank routing
// details for outbound payments (wires, SEPA, ACH).
func EnsureBeneficiaryCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(BeneficiaryCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(BeneficiaryCollectionName)

	c.Fields.Add(
		// Parent account.
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},

		// CurrencyCloud beneficiary id.
		&core.TextField{
			Name: "ccBeneficiaryId",
		},

		// Display name for this beneficiary.
		&core.TextField{
			Name:     "name",
			Required: true,
		},

		// Bank account holder name (may differ from display name).
		&core.TextField{
			Name:     "bankAccountHolder",
			Required: true,
		},

		// ISO 4217 currency code.
		&core.TextField{
			Name:     "currency",
			Required: true,
			Min:      3,
			Max:      3,
		},

		// ISO-3166 country code.
		&core.TextField{
			Name:     "country",
			Required: true,
			Min:      2,
			Max:      2,
		},

		// Payment type: regular | priority.
		&core.SelectField{
			Name:      "paymentType",
			Values:    []string{"regular", "priority"},
			MaxSelect: 1,
		},

		// Bank routing details stored as structured JSON:
		// { "iban": "...", "bic": "...", "sortCode": "...", "accountNumber": "..." }
		&core.JSONField{
			Name:     "bankDetails",
			Required: true,
			MaxSize:  1 << 20,
		},

		// Beneficiary address (JSON: street, city, postCode, country).
		&core.JSONField{
			Name:    "address",
			MaxSize: 1 << 20,
		},

		&core.BoolField{
			Name: "verified",
		},

		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},
		&core.AutodateField{
			Name:     "updated",
			OnCreate: true,
			OnUpdate: true,
		},
	)

	return app.Save(c)
}
