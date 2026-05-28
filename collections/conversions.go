package collections

import "github.com/hanzoai/base/core"

const ConversionCollectionName = "conversions"

func EnsureConversionCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(ConversionCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(ConversionCollectionName, ConversionCollectionName)

	c.Fields.Add(
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},
		&core.TextField{Name: "sellCurrency", Required: true, Min: 3, Max: 3},
		&core.TextField{Name: "buyCurrency", Required: true, Min: 3, Max: 3},
		&core.NumberField{Name: "sellAmount", Required: true},
		&core.NumberField{Name: "buyAmount"},
		&core.NumberField{Name: "rate"},
		&core.TextField{Name: "quoteId"},
		&core.TextField{Name: "ccConversionId"},
		&core.TextField{Name: "status"}, // pending, completed, failed, cancelled
		&core.AutodateField{Name: "created", OnCreate: true},
		&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
	)

	listRule := `account.owner = @request.auth.id`
	c.ListRule = &listRule
	c.ViewRule = &listRule

	return app.Save(c)
}
