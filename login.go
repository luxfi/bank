package bank

import (
	"net/http"
	"strings"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
	"golang.org/x/crypto/bcrypt"
)

// -----------------------------------------------------------------------------
// Sandbox password login
//
// Base's IAM-native rip removed local password auth for user collections and
// accepts a local token only for _superusers. So the sandbox demo login:
//   1. verifies email + password against the bcrypt hash in sandbox_credentials,
//   2. mints a _superusers auth token (record.NewAuthToken) — the one local
//      token bankd's external-auth middleware honours.
// The resulting session id (the superuser record id) owns the seeded demo
// account. Real customers still authenticate through IAM (lux.id).
//
// This route is registered ONLY when Sandbox() is true.
// -----------------------------------------------------------------------------

// ensureDemoSuperuser upserts the demo _superusers record and its bcrypt
// credential row, returning the superuser record.
func ensureDemoSuperuser(app core.App, email, password string) (*core.Record, error) {
	su, err := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, email)
	if err != nil || su == nil {
		col, cerr := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if cerr != nil {
			return nil, cerr
		}
		su = core.NewRecord(col)
		su.SetEmail(email)
		su.Set("verified", true)
		if serr := app.Save(su); serr != nil {
			return nil, serr
		}
	}

	// Upsert the bcrypt credential (hash only — never the plaintext).
	hash, herr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if herr != nil {
		return nil, herr
	}
	cred, _ := app.FindFirstRecordByFilter(collections.CredentialCollectionName,
		"email = {:e}", map[string]any{"e": email})
	if cred == nil {
		ccol, cerr := app.FindCollectionByNameOrId(collections.CredentialCollectionName)
		if cerr != nil {
			return nil, cerr
		}
		cred = core.NewRecord(ccol)
		cred.Set("email", email)
	}
	cred.Set("passwordHash", string(hash))
	cred.Set("superuserId", su.Id)
	if serr := app.Save(cred); serr != nil {
		return nil, serr
	}
	return su, nil
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// handleSandboxLogin verifies a sandbox credential and returns a superuser
// token the SPA stores and sends as a Bearer token to bankd.
func handleSandboxLogin(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var req loginRequest
		if err := e.BindBody(&req); err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		email := strings.ToLower(strings.TrimSpace(req.Email))
		if email == "" || req.Password == "" {
			return apis.NewBadRequestError("email and password are required", nil)
		}

		cred, err := app.FindFirstRecordByFilter(collections.CredentialCollectionName,
			"email = {:e}", map[string]any{"e": email})
		if err != nil || cred == nil {
			return apis.NewUnauthorizedError("invalid email or password", nil)
		}
		if bcrypt.CompareHashAndPassword([]byte(cred.GetString("passwordHash")), []byte(req.Password)) != nil {
			return apis.NewUnauthorizedError("invalid email or password", nil)
		}

		su, err := app.FindRecordById(core.CollectionNameSuperusers, cred.GetString("superuserId"))
		if err != nil || su == nil {
			return apis.NewInternalServerError("account unavailable", err)
		}
		token, err := su.NewAuthToken()
		if err != nil {
			return apis.NewInternalServerError("could not issue token", err)
		}

		return e.JSON(http.StatusOK, map[string]any{
			"token": token,
			"user":  map[string]any{"id": su.Id, "email": su.Email()},
		})
	}
}
