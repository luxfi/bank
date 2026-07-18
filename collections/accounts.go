package collections

import "github.com/hanzoai/base/core"

const AccountCollectionName = "accounts"

// EnsureAccountCollection creates the accounts collection if it does not exist.
// Schema mirrors the NestJS bank: owner (auth user), account holder info,
// CurrencyCloud account ID, status, and KYC state.
func EnsureAccountCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(AccountCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(AccountCollectionName, AccountCollectionName)

	// API rules: list/view scoped to owner in prod; public in sandbox so the
	// seeded demo records are readable. Mutations superuser only (nil).
	r := readRule(`owner = @request.auth.id`)
	c.ListRule = r
	c.ViewRule = r

	c.Fields.Add(
		// Owner — the authenticated principal id. A plain id (not a relation)
		// so it can hold either an IAM-mapped users record id or, for the
		// sandbox demo login, a _superusers record id. Ownership is enforced
		// in the custom /v1/bank routes by comparing to the request auth id.
		&core.TextField{
			Name:     "owner",
			Required: true,
		},

		// CurrencyCloud external account id.
		&core.TextField{
			Name: "ccAccountId",
		},

		// Legal entity name or individual full name.
		&core.TextField{
			Name:     "entityName",
			Required: true,
		},

		// Entity type: individual | business.
		&core.SelectField{
			Name:      "entityType",
			Values:    []string{"individual", "business"},
			Required:  true,
			MaxSelect: 1,
		},

		// ISO-3166 country code.
		&core.TextField{
			Name:     "country",
			Required: true,
			Min:      2,
			Max:      2,
		},

		// ISO 4217 base currency.
		&core.TextField{
			Name:     "currency",
			Required: true,
			Min:      3,
			Max:      3,
		},

		// Account status.
		&core.SelectField{
			Name:      "status",
			Values:    []string{"pending", "active", "suspended", "closed"},
			Required:  true,
			MaxSelect: 1,
		},

		// KYC / compliance approval state.
		&core.SelectField{
			Name:      "kycStatus",
			Values:    []string{"not_started", "pending", "approved", "rejected"},
			Required:  true,
			MaxSelect: 1,
		},

		// Risk rating assigned after compliance review.
		&core.SelectField{
			Name:      "riskRating",
			Values:    []string{"low", "medium", "high"},
			MaxSelect: 1,
		},

		// Free-form metadata blob (e.g. CurrencyCloud extra fields).
		&core.JSONField{
			Name:    "metadata",
			MaxSize: 1 << 20, // 1 MB
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
