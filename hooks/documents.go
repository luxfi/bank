package hooks

import (
	"log/slog"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// RegisterDocumentHooks attaches hooks for KYC document lifecycle.
func RegisterDocumentHooks(app core.App) {
	// Set default status on create.
	app.OnRecordCreate(collections.DocumentCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if e.Record.GetString("status") == "" {
			e.Record.Set("status", "pending")
		}

		// Validate document type.
		validTypes := map[string]bool{
			"passport": true, "drivers_license": true, "utility_bill": true,
			"bank_statement": true, "selfie": true, "proof_of_address": true,
		}
		if !validTypes[e.Record.GetString("type")] {
			return apis.NewBadRequestError("invalid document type", nil)
		}

		return e.Next()
	})

	// Audit trail on status change (approved/rejected).
	app.OnRecordUpdateExecute(collections.DocumentCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus != newStatus {
			writeAudit(app, e.Record.GetString("account"), "system", "document_"+newStatus, map[string]any{
				"documentId": e.Record.Id,
				"type":       e.Record.GetString("type"),
				"from":       oldStatus,
				"to":         newStatus,
			})

			app.Logger().Info("document status changed",
				slog.String("documentId", e.Record.Id),
				slog.String("from", oldStatus),
				slog.String("to", newStatus),
			)
		}

		return nil
	})
}
