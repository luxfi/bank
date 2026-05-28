package collections

import "github.com/hanzoai/base/core"

const WalletCollectionName = "wallets"

func EnsureWalletCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(WalletCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(WalletCollectionName, WalletCollectionName)

	c.Fields.Add(
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},
		&core.TextField{
			Name:     "currency",
			Required: true,
			Min:      3,
			Max:      3,
		},
		&core.TextField{Name: "walletId"},   // external ID (CurrencyCloud)
		&core.TextField{Name: "status"},     // active, suspended, closed
		&core.AutodateField{Name: "created", OnCreate: true},
		&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
	)

	listRule := `account.owner = @request.auth.id`
	c.ListRule = &listRule
	c.ViewRule = &listRule

	return app.Save(c)
}
