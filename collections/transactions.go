package collections

import "github.com/hanzoai/base/core"

const (
	TransactionCollectionName = "transactions"
	FeeCollectionName         = "fees"
	SessionCollectionName     = "sessions"
)

// EnsureTransactionCollection creates the transactions collection.
// Each record represents a single payment or conversion event.
func EnsureTransactionCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(TransactionCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(TransactionCollectionName, TransactionCollectionName)

	// API rules: list/view scoped to account owner (public in sandbox); mutations superuser only (nil).
	txRule := readRule(`account.owner = @request.auth.id`)
	c.ListRule = txRule
	c.ViewRule = txRule

	c.Fields.Add(
		// Source account.
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},

		// Target beneficiary (nil for conversions / internal moves).
		&core.RelationField{
			Name:         "beneficiary",
			CollectionId: BeneficiaryCollectionName,
			MaxSelect:    1,
		},

		// CurrencyCloud payment/conversion id.
		&core.TextField{
			Name: "ccTransactionId",
		},

		// Transaction type. `card` is a card purchase — a debit like a payment
		// but on the card rail, so it carries no wire fee and is not routed to
		// forex; the Cards screen lists these specifically. `earn` is a Liquid
		// Protocol vault movement (deposit/borrow/repay/withdraw), carrying no
		// fee and no forex routing.
		&core.SelectField{
			Name:      "type",
			Values:    []string{"payment", "card", "conversion", "deposit", "withdrawal", "earn", "fee"},
			Required:  true,
			MaxSelect: 1,
		},

		// Direction relative to the account.
		&core.SelectField{
			Name:      "direction",
			Values:    []string{"credit", "debit"},
			Required:  true,
			MaxSelect: 1,
		},

		// Amount in minor units (cents / satoshis).
		&core.NumberField{
			Name:     "amount",
			Required: true,
		},

		// ISO 4217 currency.
		&core.TextField{
			Name:     "currency",
			Required: true,
			Min:      3,
			Max:      3,
		},

		// Status lifecycle.
		&core.SelectField{
			Name:      "status",
			Values:    []string{"pending", "processing", "completed", "failed", "cancelled"},
			Required:  true,
			MaxSelect: 1,
		},

		// Payment reference / memo.
		&core.TextField{
			Name: "reference",
		},

		// Reason for failure or cancellation.
		&core.TextField{
			Name: "reason",
		},

		// Settlement date (when funds actually move).
		&core.DateField{
			Name: "settlementDate",
		},

		// Conversion-specific fields.
		&core.NumberField{
			Name: "buyAmount",
		},
		&core.TextField{
			Name: "buyCurrency",
			Min:  3,
			Max:  3,
		},
		&core.NumberField{
			Name: "sellAmount",
		},
		&core.TextField{
			Name: "sellCurrency",
			Min:  3,
			Max:  3,
		},

		// IFX or CurrencyCloud exchange rate.
		&core.NumberField{
			Name: "exchangeRate",
		},

		// Arbitrary provider metadata.
		&core.JSONField{
			Name:    "metadata",
			MaxSize: 1 << 20,
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

// EnsureFeeCollection creates the fees collection. Fees are linked to
// transactions and track markup, spread, and compliance surcharges.
func EnsureFeeCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(FeeCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(FeeCollectionName, FeeCollectionName)

	// API rules: all nil — superuser only. Fees are internal records.

	c.Fields.Add(
		&core.RelationField{
			Name:         "transaction",
			CollectionId: TransactionCollectionName,
			Required:     true,
			MaxSelect:    1,
		},
		&core.SelectField{
			Name:      "type",
			Values:    []string{"wire_fee", "conversion_spread", "service_fee", "compliance_surcharge"},
			Required:  true,
			MaxSelect: 1,
		},
		// Amount in minor units.
		&core.NumberField{
			Name:     "amount",
			Required: true,
		},
		&core.TextField{
			Name:     "currency",
			Required: true,
			Min:      3,
			Max:      3,
		},
		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},
	)

	return app.Save(c)
}

// EnsureSessionCollection creates the sessions collection for tracking
// user login events and JWT token metadata.
func EnsureSessionCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(SessionCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(SessionCollectionName, SessionCollectionName)

	// API rules: list/view scoped to session owner; mutations superuser only (nil).
	sessRule := `user = @request.auth.id`
	c.ListRule = &sessRule
	c.ViewRule = &sessRule

	c.Fields.Add(
		&core.RelationField{
			Name:         "user",
			CollectionId: "_users_auth_",
			Required:     true,
			MaxSelect:    1,
		},
		&core.TextField{
			Name:     "ipAddress",
			Required: true,
		},
		&core.TextField{
			Name: "userAgent",
		},
		&core.DateField{
			Name: "expiresAt",
		},
		&core.BoolField{
			Name: "revoked",
		},
		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},
	)

	return app.Save(c)
}
