package collections

import "github.com/hanzoai/base/core"

const DocumentCollectionName = "documents"

func EnsureDocumentCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(DocumentCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(DocumentCollectionName)

	c.Fields.Add(
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},
		&core.TextField{
			Name:     "type",
			Required: true,
		},
		&core.FileField{
			Name:      "file",
			Required:  true,
			MaxSelect: 1,
			MaxSize:   10 << 20, // 10MB
			MimeTypes: []string{
				"application/pdf",
				"image/jpeg",
				"image/png",
			},
		},
		&core.TextField{
			Name:     "status",
			Required: true,
		},
		&core.TextField{Name: "reviewedBy"},
		&core.TextField{Name: "reviewNote"},
		&core.AutodateField{Name: "created", OnCreate: true},
		&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
	)

	// Owner-scoped read, superuser-only mutations.
	listRule := `account.owner = @request.auth.id`
	c.ListRule = &listRule
	c.ViewRule = &listRule

	return app.Save(c)
}
