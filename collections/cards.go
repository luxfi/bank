package collections

import "github.com/hanzoai/base/core"

const CardCollectionName = "cards"

// EnsureCardCollection creates the cards collection if it does not exist.
// Each card belongs to an account and represents a virtual, sandbox-only
// payment card. No real PAN, CVV, or track data is ever stored — only the
// last four digits and a display token. CVV is returned once at issue time
// and never persisted (PCI-safe by construction).
func EnsureCardCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(CardCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(CardCollectionName, CardCollectionName)

	// Owner-scoped read; mutations happen through custom /v1/bank routes only.
	rule := `account.owner = @request.auth.id`
	c.ListRule = &rule
	c.ViewRule = &rule

	c.Fields.Add(
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},
		// Cardholder display name.
		&core.TextField{Name: "holderName", Required: true},
		// Card scheme (sandbox): visa | mastercard.
		&core.SelectField{
			Name:      "brand",
			Values:    []string{"visa", "mastercard"},
			Required:  true,
			MaxSelect: 1,
		},
		// Virtual only in the sandbox.
		&core.SelectField{
			Name:      "type",
			Values:    []string{"virtual"},
			Required:  true,
			MaxSelect: 1,
		},
		// Last four digits (all we retain of the PAN).
		&core.TextField{Name: "last4", Required: true, Min: 4, Max: 4},
		// Masked display number, e.g. "4242 42•• •••• 1234".
		&core.TextField{Name: "display"},
		&core.NumberField{Name: "expMonth", Required: true},
		&core.NumberField{Name: "expYear", Required: true},
		// Spending currency.
		&core.TextField{Name: "currency", Required: true, Min: 3, Max: 3},
		// Lifecycle: active | frozen | cancelled.
		&core.SelectField{
			Name:      "status",
			Values:    []string{"active", "frozen", "cancelled"},
			Required:  true,
			MaxSelect: 1,
		},
		// Cosmetic gradient key for the UI card face.
		&core.TextField{Name: "design"},
		&core.AutodateField{Name: "created", OnCreate: true},
		&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
	)

	return app.Save(c)
}
