package bank

import (
	"crypto/rsa"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/hook"
	"github.com/hanzoai/base/tools/router"
	"github.com/hanzoai/base/tools/security"
)

// Identity is the one way into bankd: an access token lux.id issued to the
// lux-financial client, the client both consoles sign in through, for the lux
// org. Every other token, a local Base token included, leaves the request
// anonymous, and the collection rules decide what an anonymous caller may read.
type Identity struct {
	Issuer string // the iss every accepted token carries, and where its keys are
	Client string // the aud: the client the token was issued to
	Org    string // the owner: IAM stamps it with the client's org
}

// adminOrg is the reserved org whose members are SuperAdmins.
const adminOrg = "admin"

// Mount replaces Base's token loader with id, and relays the part of lux.id a
// console's sign-in needs. Base's loader accepted a token signed by any brand's
// IAM and made an org admin a superuser; it is unbound, not wrapped.
func (id Identity) Mount(app core.App) {
	// Keeps Base's first-superuser installer off: no account is made here.
	app.Store().Set(apis.StoreKeyExternalAuthOnly, true)

	keys := &keyring{
		url:    strings.TrimRight(id.Issuer, "/") + "/.well-known/jwks",
		client: &http.Client{Timeout: 5 * time.Second},
	}

	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Id: "bankIdentity",
		Func: func(e *core.ServeEvent) error {
			e.Router.Unbind(apis.DefaultLoadAuthTokenMiddlewareId)
			e.Router.Bind(&hook.Handler[*core.RequestEvent]{
				Id:       "bankIdentity",
				Priority: apis.DefaultLoadAuthTokenMiddlewarePriority,
				Func: func(re *core.RequestEvent) error {
					if baseSignIn(re.Request.URL.Path) {
						return re.NotFoundError("", nil)
					}
					token, ok := strings.CutPrefix(re.Request.Header.Get("Authorization"), "Bearer ")
					if ok && token != "" {
						record, err := id.person(re.App, keys, token)
						if err != nil {
							re.App.Logger().Debug("bank: token refused", "error", err)
						} else {
							re.Auth = record
						}
					}
					return re.Next()
				},
			})
			id.relay(e.Router)
			return e.Next()
		},
	})
}

// baseSignIn reports whether path is one of the sign-in routes Base keeps for its
// own accounts: auth-methods, and auth-refresh, which mints a Base token. bankd
// has no account of its own to sign in to.
func baseSignIn(path string) bool {
	return strings.HasPrefix(path, "/v1/collections/") &&
		(strings.HasSuffix(path, "/auth-methods") || strings.HasSuffix(path, "/auth-refresh"))
}

// claims is what bankd reads of a lux.id access token.
type claims struct {
	jwt.RegisteredClaims
	Owner     string `json:"owner"`
	TokenType string `json:"tokenType"`
	Type      string `json:"type"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Display   string `json:"displayName"`
	Orgs      []struct {
		Org string `json:"org"`
	} `json:"orgs"`
}

// sudo is SuperAdmin: a person in the reserved admin org. It reads membership,
// never the owner claim, which names the client's org, and never isAdmin, which
// is admin of one's own org. Same predicate as hanzoai/authz Claims.Sudo.
func (c *claims) sudo() bool {
	if c.Type == "application" {
		return false
	}
	for _, m := range c.Orgs {
		if m.Org == adminOrg {
			return true
		}
	}
	return false
}

// person verifies token and returns the auth record it stands for: _superusers
// for a SuperAdmin, users for everyone else. The record is built for this request
// and never saved; lux.id is the user store.
func (id Identity) person(app core.App, keys *keyring, token string) (*core.Record, error) {
	var c claims
	_, err := jwt.ParseWithClaims(token, &c, keys.find,
		jwt.WithValidMethods([]string{"RS256", "RS384", "RS512"}),
		jwt.WithIssuer(id.Issuer),
		jwt.WithAudience(id.Client),
		jwt.WithExpirationRequired(),
		jwt.WithLeeway(time.Minute),
	)
	switch {
	case err != nil:
		return nil, err
	case c.TokenType != "access-token":
		return nil, fmt.Errorf("tokenType %q is not an access token", c.TokenType)
	case c.Owner != id.Org:
		return nil, fmt.Errorf("owner %q is not %q", c.Owner, id.Org)
	case c.Subject == "":
		return nil, errors.New("token names no subject")
	}

	from := "users"
	if c.sudo() {
		from = core.CollectionNameSuperusers
	}
	col, err := app.FindCachedCollectionByNameOrId(from)
	if err != nil {
		return nil, err
	}
	record := core.NewRecord(col)
	record.Id = recordID(c.Subject)
	record.Set("email", c.Email)
	name := c.Name
	if name == "" {
		name = c.Display
	}
	if name != "" {
		record.Set("name", name)
	}
	if col.Fields.GetByName("org_id") != nil {
		record.Set("org_id", c.Owner)
	}
	record.SetVerified(true)
	return record, nil
}

// recordID is the record id a subject has always mapped to (Base v1.4.2
// subToRecordID), so an account opened under an earlier release keeps its owner:
// a short lowercase id as is, padded to 15 with '_'; anything else, the first 24
// hex digits of its SHA-256.
func recordID(sub string) string {
	plain := true
	for _, r := range sub {
		if !(r >= 'a' && r <= 'z' || r >= '0' && r <= '9' || r == '_') {
			plain = false
			break
		}
	}
	if plain && len(sub) <= 15 {
		return sub + strings.Repeat("_", 15-len(sub))
	}
	h := sha256.Sum256([]byte(sub))
	return hex.EncodeToString(h[:])[:24]
}

// keyring holds lux.id's signing keys by kid. The set is fetched again after ten
// minutes, or sooner for a kid it lacks, but never more than once in thirty
// seconds, so a token naming a made-up kid costs IAM nothing.
type keyring struct {
	url    string
	client *http.Client

	mu   sync.Mutex
	keys map[string]*rsa.PublicKey
	at   time.Time
}

func (k *keyring) find(t *jwt.Token) (any, error) {
	kid, _ := t.Header["kid"].(string)
	if kid == "" {
		return nil, errors.New("token names no key")
	}
	k.mu.Lock()
	defer k.mu.Unlock()
	key, ok := k.keys[kid]
	if age := time.Since(k.at); (!ok || age > 10*time.Minute) && age > 30*time.Second {
		if err := k.fetch(); err != nil && !ok {
			return nil, err
		}
		key, ok = k.keys[kid]
	}
	if !ok {
		return nil, fmt.Errorf("no key %q", kid)
	}
	return key, nil
}

func (k *keyring) fetch() error {
	k.at = time.Now()
	resp, err := k.client.Get(k.url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("jwks: %s", resp.Status)
	}
	var set struct {
		Keys []security.JWK `json:"keys"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&set); err != nil {
		return err
	}
	keys := make(map[string]*rsa.PublicKey, len(set.Keys))
	for i := range set.Keys {
		if pk, err := set.Keys[i].PublicKey(); err == nil && set.Keys[i].Kid != "" {
			keys[set.Keys[i].Kid] = pk
		}
	}
	if len(keys) == 0 {
		return errors.New("jwks: no usable key")
	}
	k.keys = keys
	return nil
}

// relay mounts the part of lux.id a console's sign-in reaches through bankd, so
// the browser makes no cross-origin call to IAM: discovery and keys, the code
// exchange and its refresh, userinfo and logout, at the paths @hanzo/iam asks for.
// Nothing else is relayed, so no password, signup or account form reaches lux.id
// through bankd, and the token exchange carries only this client's two grants.
func (id Identity) relay(r *router.Router[*core.RequestEvent]) {
	upstream := strings.TrimRight(id.Issuer, "/")
	client := &http.Client{Timeout: 15 * time.Second}

	pass := func(re *core.RequestEvent, path string, body io.Reader, auth bool) error {
		req, err := http.NewRequestWithContext(re.Request.Context(), re.Request.Method, upstream+path, body)
		if err != nil {
			return re.InternalServerError("", err)
		}
		req.Header.Set("Accept", "application/json")
		if ct := re.Request.Header.Get("Content-Type"); ct != "" && body != nil {
			req.Header.Set("Content-Type", ct)
		}
		if a := re.Request.Header.Get("Authorization"); auth && a != "" {
			req.Header.Set("Authorization", a)
		}
		resp, err := client.Do(req)
		if err != nil {
			return re.Error(http.StatusBadGateway, "Lux ID is unreachable.", err)
		}
		defer resp.Body.Close()
		for _, h := range []string{"Content-Type", "Cache-Control", "Pragma"} {
			if v := resp.Header.Get(h); v != "" {
				re.Response.Header().Set(h, v)
			}
		}
		re.Response.WriteHeader(resp.StatusCode)
		_, _ = io.Copy(re.Response, io.LimitReader(resp.Body, 1<<20))
		return nil
	}

	r.GET("/v1/iam/.well-known/openid-configuration", func(re *core.RequestEvent) error {
		return pass(re, "/.well-known/openid-configuration", nil, false)
	})
	r.GET("/v1/iam/.well-known/jwks", func(re *core.RequestEvent) error {
		return pass(re, "/.well-known/jwks", nil, false)
	})
	r.POST("/v1/iam/oauth/token", func(re *core.RequestEvent) error {
		raw, err := io.ReadAll(io.LimitReader(re.Request.Body, 16<<10))
		if err != nil {
			return re.BadRequestError("", err)
		}
		form, err := url.ParseQuery(string(raw))
		grant := form.Get("grant_type")
		if err != nil || form.Get("client_id") != id.Client ||
			(grant != "authorization_code" && grant != "refresh_token") {
			return re.JSON(http.StatusBadRequest, map[string]string{
				"error":             "unauthorized_client",
				"error_description": "only " + id.Client + " signs in here, by code or refresh",
			})
		}
		return pass(re, "/v1/iam/oauth/token", strings.NewReader(string(raw)), false)
	})
	r.GET("/v1/iam/oauth/userinfo", func(re *core.RequestEvent) error {
		return pass(re, "/v1/iam/oauth/userinfo", nil, true)
	})
	r.POST("/v1/iam/v1/iam/oauth/logout", func(re *core.RequestEvent) error {
		return pass(re, "/v1/iam/oauth/logout", nil, true)
	})
}
