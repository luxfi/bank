package collections

import (
	"testing"

	"github.com/hanzoai/base/core"
)

// A database the password login ran against holds its credential rows and a
// superuser whose tokens are still out there. DropCredentials must void those
// tokens and remove the rows, and do nothing on every boot after.
func TestDropCredentialsVoidsMintedTokens(t *testing.T) {
	app := newApp(t)

	col := core.NewBaseCollection(CredentialCollectionName, CredentialCollectionName)
	col.Fields.Add(
		&core.TextField{Name: "email"},
		&core.TextField{Name: "passwordHash"},
		&core.TextField{Name: "superuserId"},
	)
	if err := app.Save(col); err != nil {
		t.Fatalf("credential collection: %v", err)
	}

	sus, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
	if err != nil {
		t.Fatalf("superusers: %v", err)
	}
	su := core.NewRecord(sus)
	su.SetEmail("z@lux.financial")
	su.Set("verified", true)
	if err := app.Save(su); err != nil {
		t.Fatalf("superuser: %v", err)
	}
	row := core.NewRecord(col)
	row.Set("email", "z@lux.financial")
	row.Set("passwordHash", "$2a$10$x")
	row.Set("superuserId", su.Id)
	if err := app.Save(row); err != nil {
		t.Fatalf("credential row: %v", err)
	}

	token, err := su.NewAuthToken()
	if err != nil {
		t.Fatalf("token: %v", err)
	}
	if _, err := app.FindAuthRecordByToken(token, core.TokenTypeAuth); err != nil {
		t.Fatalf("token should be valid before the drop: %v", err)
	}

	if err := DropCredentials(app); err != nil {
		t.Fatalf("drop: %v", err)
	}
	if _, err := app.FindAuthRecordByToken(token, core.TokenTypeAuth); err == nil {
		t.Fatal("a token the password login minted still authenticates")
	}
	if _, err := app.FindCollectionByNameOrId(CredentialCollectionName); err == nil {
		t.Fatal("the credential collection is still there")
	}
	if err := DropCredentials(app); err != nil {
		t.Fatalf("second boot: %v", err)
	}
}
