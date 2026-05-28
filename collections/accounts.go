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

	// API rules: list/view scoped to owner; create/update/delete superuser only (nil).
	ownerRule := `owner = @request.auth.id`
	c.ListRule = &ownerRule
	c.ViewRule = &ownerRule

	c.Fields.Add(
		// Owner — relation to the "users" auth collection.
		&core.RelationField{
			Name:         "owner",
			CollectionId: "_users_auth_",
			Required:     true,
			MaxSelect:    1,
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
