package hooks

import (
	"errors"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// RegisterAuditHooks makes the audit_log collection immutable by blocking
// all update and delete operations unconditionally.
func RegisterAuditHooks(app core.App) {
	app.OnRecordUpdate(collections.AuditCollectionName).BindFunc(func(e *core.RecordEvent) error {
		return errors.New("audit log records are immutable")
	})

	app.OnRecordDelete(collections.AuditCollectionName).BindFunc(func(e *core.RecordEvent) error {
		return errors.New("audit log records are immutable")
	})
}
