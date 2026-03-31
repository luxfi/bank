package collections

import "github.com/hanzoai/base/core"

const BalanceCollectionName = "balances"

// EnsureBalanceCollection creates the balances collection if it does not exist.
// Each record tracks a single currency balance for an account.
// Accounts can have multiple balance records (one per currency).
func EnsureBalanceCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(BalanceCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(BalanceCollectionName)

	// API rules: all nil — superuser only. Balances are read via custom routes.

	c.Fields.Add(
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},

		// ISO 4217 currency code.
		&core.TextField{
			Name:     "currency",
			Required: true,
			Min:      3,
			Max:      3,
		},

		// Available balance in minor units (cents).
		&core.NumberField{
			Name:     "available",
			Required: true,
		},

		// Held (pending) balance in minor units.
		&core.NumberField{
			Name: "held",
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
