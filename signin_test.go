package bank

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
)

// Lux ID is the only way in. No route bankd serves takes a password, in sandbox
// or out of it, and the config route names no login identity.
func TestNoPasswordLogin(t *testing.T) {
	for _, sandbox := range []string{"true", "false"} {
		t.Setenv("BANK_SANDBOX", sandbox)
		app, err := tests.NewTestApp()
		if err != nil {
			t.Fatalf("new test app: %v", err)
		}
		t.Cleanup(app.Cleanup)
		h := served(t, app)

		for _, path := range []string{
			"/v1/bank/login",
			"/v1/collections/_superusers/auth-with-password",
			"/v1/collections/users/auth-with-password",
		} {
			body := `{"email":"z@lux.financial","identity":"z@lux.financial","password":"guess"}`
			req := httptest.NewRequest(http.MethodPost, path, strings.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rec := httptest.NewRecorder()
			h.ServeHTTP(rec, req)
			if rec.Code != http.StatusNotFound {
				t.Errorf("sandbox=%s POST %s = %d, want 404", sandbox, path, rec.Code)
			}
		}

		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/v1/bank/config", nil))
		if rec.Code != http.StatusOK {
			t.Fatalf("sandbox=%s config = %d", sandbox, rec.Code)
		}
		for _, leak := range []string{"demoEmail", "demoLogin", "@lux.financial"} {
			if strings.Contains(rec.Body.String(), leak) {
				t.Errorf("sandbox=%s config names %q: %s", sandbox, leak, rec.Body)
			}
		}
	}
}

// served is the app's router exactly as bankd serves it.
func served(t *testing.T, app core.App) http.Handler {
	t.Helper()
	RegisterRoutes(app)
	r, err := apis.NewRouter(app)
	if err != nil {
		t.Fatalf("router: %v", err)
	}
	var mux http.Handler
	err = app.OnServe().Trigger(&core.ServeEvent{App: app, Router: r}, func(e *core.ServeEvent) error {
		var berr error
		mux, berr = e.Router.BuildMux()
		return berr
	})
	if err != nil {
		t.Fatalf("serve: %v", err)
	}
	return mux
}
