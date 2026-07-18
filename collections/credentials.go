package collections

import "github.com/hanzoai/base/core"

const CredentialCollectionName = "sandbox_credentials"

// EnsureCredentialCollection creates the sandbox_credentials collection.
//
// Base's IAM-native rip removed local password auth, so the sandbox demo login
// needs its own credential store. Passwords are ALWAYS stored bcrypt-hashed
// (never plaintext); each row maps an email to a hash and the _superusers
// record id whose token the login endpoint mints on success. Sandbox only.
func EnsureCredentialCollection(app core.App) error {
	_, err := app.FindCollectionByNameOrId(CredentialCollectionName)
	if err == nil {
		return nil
	}

	c := core.NewBaseCollection(CredentialCollectionName, CredentialCollectionName)
	// All rules nil — superuser only; never exposed via the record API.

	c.Fields.Add(
		&core.TextField{Name: "email", Required: true},
		&core.TextField{Name: "passwordHash", Required: true}, // bcrypt
		&core.TextField{Name: "superuserId", Required: true},
		&core.AutodateField{Name: "created", OnCreate: true},
		&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
	)

	return app.Save(c)
}
