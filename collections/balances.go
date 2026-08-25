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

	c := core.NewBaseCollection(BalanceCollectionName, BalanceCollectionName)

	// Superuser only (nil rules) in every mode — balances are read through the
	// authenticated /v1/bank routes, never as anonymous collection reads.

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
		//
		// NOT Required: a required number field refuses its zero value ("available:
		// cannot be blank"), and zero is the balance every account opens with. The
		// hook that creates a balance on account creation set it to 0 and was
		// refused every time — it logs and returns nil, so each new customer was
		// created with no balance row at all and nothing said so. `held` was never
		// marked required, which is what the pair should always have looked like.
		&core.NumberField{
			Name: "available",
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
