package collections

import "github.com/hanzoai/base/core"

const AuditCollectionName = "audit_log"

// EnsureAuditCollection creates the audit_log collection if it does not exist.
// Immutable append-only log for compliance-relevant events (freeze, unfreeze,
// limit changes, KYC transitions, etc.).
func EnsureAuditCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(AuditCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(AuditCollectionName)

	// API rules: all nil — superuser only. Audit log is not user-accessible.

	c.Fields.Add(
		// The account this event relates to.
		&core.RelationField{
			Name:         "account",
			CollectionId: AccountCollectionName,
			Required:     true,
			MaxSelect:    1,
		},

		// Who performed the action (user id or "system").
		&core.TextField{
			Name:     "actor",
			Required: true,
		},

		// What happened.
		&core.TextField{
			Name:     "action",
			Required: true,
		},

		// Structured detail blob.
		&core.JSONField{
			Name:    "detail",
			MaxSize: 1 << 20,
		},

		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},
	)

	return app.Save(c)
}
