package bank

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"math/big"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
)

// luxID is a stand-in lux.id: it serves one signing key as JWKS and answers the
// sign-in paths bankd relays, counting every request that reaches it.
type luxID struct {
	*httptest.Server
	key  *rsa.PrivateKey
	hits atomic.Int32
	last atomic.Value // path of the last relayed request
}

func newLuxID(t *testing.T) *luxID {
	t.Helper()
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatal(err)
	}
	l := &luxID{key: key}
	l.Server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/.well-known/jwks" {
			pub := key.PublicKey
			json.NewEncoder(w).Encode(map[string]any{"keys": []map[string]string{{
				"kty": "RSA", "kid": "cert-lux", "alg": "RS256", "use": "sig",
				"n": base64.RawURLEncoding.EncodeToString(pub.N.Bytes()),
				"e": base64.RawURLEncoding.EncodeToString(big.NewInt(int64(pub.E)).Bytes()),
			}}})
			return
		}
		l.hits.Add(1)
		l.last.Store(r.Method + " " + r.URL.Path)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"relayed":true}`))
	}))
	t.Cleanup(l.Close)
	return l
}

// token is an access token as lux.id issues it to lux-financial, with over
// applied on top.
func (l *luxID) token(t *testing.T, over jwt.MapClaims) string {
	t.Helper()
	c := jwt.MapClaims{
		"iss":       l.URL,
		"aud":       []string{"lux-financial"},
		"sub":       "0b6c2f0e-6f7a-4c43-9d7e-2f1b0f4c8a11",
		"owner":     "lux",
		"tokenType": "access-token",
		"email":     "ada@lux.financial",
		"name":      "ada",
		"orgs":      []map[string]string{{"org": "lux", "role": "member"}},
		"exp":       time.Now().Add(time.Hour).Unix(),
	}
	for k, v := range over {
		if v == nil {
			delete(c, k)
		} else {
			c[k] = v
		}
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodRS256, c)
	tok.Header["kid"] = "cert-lux"
	s, err := tok.SignedString(l.key)
	if err != nil {
		t.Fatal(err)
	}
	return s
}

func bankd(t *testing.T, l *luxID) (core.App, http.Handler) {
	t.Helper()
	app, err := tests.NewTestApp()
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(app.Cleanup)
	Identity{Issuer: l.URL, Client: "lux-financial", Org: "lux"}.Mount(app)
	return app, served(t, app)
}

func call(h http.Handler, method, path, token, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	if body != "" {
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	}
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	return rec
}

// Only an access token lux.id issued to lux-financial for the lux org signs a
// person in. Every other token, however validly signed, is no one.
func TestOnlyLuxIDSignsIn(t *testing.T) {
	l := newLuxID(t)
	_, h := bankd(t, l)

	other, _ := rsa.GenerateKey(rand.Reader, 2048)
	forged := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"iss": l.URL, "aud": "lux-financial", "sub": "x", "owner": "lux",
		"tokenType": "access-token", "exp": time.Now().Add(time.Hour).Unix(),
	})
	forged.Header["kid"] = "cert-lux"
	forgedTok, _ := forged.SignedString(other)
	none, _ := jwt.NewWithClaims(jwt.SigningMethodNone, jwt.MapClaims{
		"iss": l.URL, "aud": "lux-financial", "sub": "x", "owner": "lux",
		"tokenType": "access-token", "exp": time.Now().Add(time.Hour).Unix(),
	}).SignedString(jwt.UnsafeAllowNoneSignatureType)

	cases := map[string]struct {
		token string
		want  int
	}{
		"lux-financial":   {l.token(t, nil), http.StatusOK},
		"another brand":   {l.token(t, jwt.MapClaims{"iss": "https://hanzo.id"}), http.StatusUnauthorized},
		"another client":  {l.token(t, jwt.MapClaims{"aud": []string{"hanzo-cli"}}), http.StatusUnauthorized},
		"another org":     {l.token(t, jwt.MapClaims{"owner": "hanzo"}), http.StatusUnauthorized},
		"id token":        {l.token(t, jwt.MapClaims{"tokenType": "id-token"}), http.StatusUnauthorized},
		"expired":         {l.token(t, jwt.MapClaims{"exp": time.Now().Add(-time.Hour).Unix()}), http.StatusUnauthorized},
		"no expiry":       {l.token(t, jwt.MapClaims{"exp": nil}), http.StatusUnauthorized},
		"no subject":      {l.token(t, jwt.MapClaims{"sub": nil}), http.StatusUnauthorized},
		"another key":     {forgedTok, http.StatusUnauthorized},
		"unsigned":        {none, http.StatusUnauthorized},
		"not a jwt":       {"hk-0123456789abcdef", http.StatusUnauthorized},
		"no token at all": {"", http.StatusUnauthorized},
	}
	for name, tc := range cases {
		if rec := call(h, http.MethodGet, "/v1/bank/crypto/prices", tc.token, ""); rec.Code != tc.want {
			t.Errorf("%s: GET /v1/bank/crypto/prices = %d, want %d: %s", name, rec.Code, tc.want, rec.Body)
		}
	}
}

// SuperAdmin is membership of the reserved admin org, and nothing else: not the
// owner claim, not isAdmin, not a program's membership, not a local Base token.
func TestSuperAdminIsAdminOrgMembership(t *testing.T) {
	l := newLuxID(t)
	app, h := bankd(t, l)

	sus, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
	if err != nil {
		t.Fatal(err)
	}
	su := core.NewRecord(sus)
	su.SetEmail("local@lux.financial")
	if err := app.Save(su); err != nil {
		t.Fatal(err)
	}
	local, err := su.NewAuthToken()
	if err != nil {
		t.Fatal(err)
	}

	admin := []map[string]string{{"org": "lux"}, {"org": "admin"}}
	cases := map[string]struct {
		token string
		want  bool
	}{
		"admin org member":   {l.token(t, jwt.MapClaims{"orgs": admin}), true},
		"lux org admin":      {l.token(t, jwt.MapClaims{"isAdmin": true, "orgs": []map[string]string{{"org": "lux", "role": "admin"}}}), false},
		"isGlobalAdmin":      {l.token(t, jwt.MapClaims{"isGlobalAdmin": true}), false},
		"program in admin":   {l.token(t, jwt.MapClaims{"type": "application", "orgs": admin}), false},
		"local Base token":   {local, false},
		"plain lux customer": {l.token(t, nil), false},
	}
	for name, tc := range cases {
		rec := call(h, http.MethodGet, "/v1/collections/_superusers/records", tc.token, "")
		if got := rec.Code == http.StatusOK; got != tc.want {
			t.Errorf("%s: GET _superusers = %d, superuser %v, want %v", name, rec.Code, got, tc.want)
		}
	}
}

// bankd mints no token of its own: Base's auth-methods and auth-refresh are gone,
// even for a signed-in person.
func TestNoBaseSignIn(t *testing.T) {
	l := newLuxID(t)
	_, h := bankd(t, l)
	tok := l.token(t, nil)
	for _, p := range []string{
		"GET /v1/collections/users/auth-methods",
		"GET /v1/collections/_superusers/auth-methods",
		"POST /v1/collections/users/auth-refresh",
		"POST /v1/collections/_superusers/auth-refresh",
	} {
		method, path, _ := strings.Cut(p, " ")
		if rec := call(h, method, path, tok, ""); rec.Code != http.StatusNotFound {
			t.Errorf("%s = %d, want 404: %s", p, rec.Code, rec.Body)
		}
	}
}

// /v1/iam relays a console's sign-in to lux.id and nothing else: no password,
// signup or account form, and no grant but lux-financial's code and refresh.
func TestRelayCarriesOnlySignIn(t *testing.T) {
	l := newLuxID(t)
	_, h := bankd(t, l)

	relayed := map[string]string{
		"GET /v1/iam/.well-known/openid-configuration": "GET /.well-known/openid-configuration",
		"GET /v1/iam/oauth/userinfo":                   "GET /v1/iam/oauth/userinfo",
		"POST /v1/iam/v1/iam/oauth/logout":             "POST /v1/iam/oauth/logout",
	}
	for p, upstream := range relayed {
		method, path, _ := strings.Cut(p, " ")
		rec := call(h, method, path, "", "")
		if rec.Code != http.StatusOK || l.last.Load() != upstream {
			t.Errorf("%s = %d reaching %v, want 200 reaching %s", p, rec.Code, l.last.Load(), upstream)
		}
	}
	for _, body := range []string{
		"grant_type=authorization_code&client_id=lux-financial&code=c&code_verifier=v",
		"grant_type=refresh_token&client_id=lux-financial&refresh_token=r",
	} {
		rec := call(h, http.MethodPost, "/v1/iam/oauth/token", "", body)
		if rec.Code != http.StatusOK || l.last.Load() != "POST /v1/iam/oauth/token" {
			t.Errorf("token %q = %d reaching %v", body, rec.Code, l.last.Load())
		}
	}

	before := l.hits.Load()
	for _, body := range []string{
		"grant_type=password&client_id=lux-financial&username=z&password=guess",
		"grant_type=password&client_id=lux-bank&username=z&password=guess",
		"grant_type=client_credentials&client_id=lux-bank&client_secret=s",
		"grant_type=authorization_code&client_id=hanzo-cli&code=c",
	} {
		if rec := call(h, http.MethodPost, "/v1/iam/oauth/token", "", body); rec.Code != http.StatusBadRequest {
			t.Errorf("token %q = %d, want 400", body, rec.Code)
		}
	}
	for _, p := range []string{
		"POST /v1/iam/api/login",
		"POST /v1/iam/api/signup",
		"POST /v1/iam/login/oauth/access_token",
		"GET /v1/iam/oauth/authorize",
		"POST /v1/platform/auth/login",
		"POST /v1/platform/auth/signup",
	} {
		method, path, _ := strings.Cut(p, " ")
		if rec := call(h, method, path, "", "username=z&password=guess"); rec.Code != http.StatusNotFound {
			t.Errorf("%s = %d, want 404", p, rec.Code)
		}
	}
	if n := l.hits.Load() - before; n != 0 {
		t.Errorf("%d refused requests reached lux.id", n)
	}
}

// An account opened under an earlier release belongs to the same record id now.
func TestRecordIDIsStable(t *testing.T) {
	for sub, want := range map[string]string{
		"abcdefghijklmno":                      "abcdefghijklmno",
		"ada":                                  "ada____________",
		"Ada":                                  "99a563ab2f6e21e96998f9fd",
		"0b6c2f0e-6f7a-4c43-9d7e-2f1b0f4c8a11": "HASH",
	} {
		if want == "HASH" {
			h := sha256.Sum256([]byte(sub))
			want = hex.EncodeToString(h[:])[:24]
		}
		if got := recordID(sub); got != want {
			t.Errorf("recordID(%q) = %q, want %q", sub, got, want)
		}
	}
}
