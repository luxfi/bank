package collections

import "github.com/hanzoai/base/core"

// CredentialCollectionName is the store behind the sandbox password login that
// earlier releases served. Lux ID is the only way in now; nothing writes here.
const CredentialCollectionName = "sandbox_credentials"

// DropCredentials removes what the password login left in a database that
// already exists: its credential rows, and every token it minted. Each row names
// the _superusers record the login signed tokens for; a new token key voids them
// all, including any a holder kept alive through auth-refresh. Run on every boot;
// once the collection is gone it does nothing.
func DropCredentials(app core.App) error {
	col, err := app.FindCollectionByNameOrId(CredentialCollectionName)
	if err != nil {
		return nil
	}
	return app.RunInTransaction(func(tx core.App) error {
		rows, err := tx.FindAllRecords(col)
		if err != nil {
			return err
		}
		for _, row := range rows {
			su, err := tx.FindRecordById(core.CollectionNameSuperusers, row.GetString("superuserId"))
			if err != nil {
				continue
			}
			su.RefreshTokenKey()
			if err := tx.SaveNoValidate(su); err != nil {
				return err
			}
		}
		return tx.Delete(col)
	})
}
