package bank

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/router"
)

// -----------------------------------------------------------------------------
// Issuer — the banking counterparty that opens card accounts, runs its own
// KYC/consent lifecycle, and issues cards. One implementation per upstream
// (sfprivate, banxe, ...); the /v1/bank/cards routes are issuer-neutral.
//
// The issuer's KYC is provider-scoped: its status/nextAction is the only
// authority for issuing its products. It runs in addition to platform KYC
// (iam + amld) and neither state substitutes for the other.
// -----------------------------------------------------------------------------

type Issuer interface {
	Name() string
	// CreateAccount opens an established general card account from the
	// cardholder profile.
	CreateAccount(ctx context.Context, userID string, profile json.RawMessage) (json.RawMessage, error)
	// Account returns account status, issuer KYC state, the additive
	// virtualAccount object, and all cards for the user.
	Account(ctx context.Context, userID string) (json.RawMessage, error)
	// KYC returns the issuer's KYC verification status. Callable before the
	// card account exists.
	KYC(ctx context.Context, userID string) (json.RawMessage, error)
	// CreateVirtual opens the provider-neutral virtual-card account.
	CreateVirtual(ctx context.Context, userID string) (json.RawMessage, error)
	// KYCURL returns the hosted KYC session URL. Sensitive: hand it straight
	// to the user's browser; never log or persist it.
	KYCURL(ctx context.Context, userID string) (string, error)
	// ConsentURL returns the consent-agreement URL. Same sensitivity as KYCURL.
	ConsentURL(ctx context.Context, userID string) (string, error)
	// OrderCard orders the single virtual card once the issuer reports
	// status=approved, nextAction=order_card.
	OrderCard(ctx context.Context, userID string) (json.RawMessage, error)
}

// issuer resolves the active implementation. Sandbox mode simulates the
// issuer so the demo works with no upstream credentials; live mode selects
// by BANK_ISSUER (default sfprivate).
func issuer() Issuer {
	if Sandbox() {
		return simIssuer{}
	}
	switch strings.ToLower(strings.TrimSpace(os.Getenv("BANK_ISSUER"))) {
	case "", "sfprivate":
		return newSFPrivate()
	default:
		return newSFPrivate()
	}
}

// -----------------------------------------------------------------------------
// Routes — issuer-neutral card account surface, keyed by the authenticated
// principal. Registered on the authenticated /v1/bank group.
// -----------------------------------------------------------------------------

func registerIssuerRoutes(g *router.RouterGroup[*core.RequestEvent]) {
	g.POST("/cards/account", issuerJSON(func(ctx context.Context, is Issuer, uid string, body json.RawMessage) (json.RawMessage, error) {
		return is.CreateAccount(ctx, uid, body)
	}))
	g.GET("/cards/account", issuerJSON(func(ctx context.Context, is Issuer, uid string, _ json.RawMessage) (json.RawMessage, error) {
		return is.Account(ctx, uid)
	}))
	g.GET("/cards/kyc", issuerJSON(func(ctx context.Context, is Issuer, uid string, _ json.RawMessage) (json.RawMessage, error) {
		return is.KYC(ctx, uid)
	}))
	g.POST("/cards/virtual", issuerJSON(func(ctx context.Context, is Issuer, uid string, _ json.RawMessage) (json.RawMessage, error) {
		return is.CreateVirtual(ctx, uid)
	}))
	g.GET("/cards/virtual/kyc-url", issuerURL(Issuer.KYCURL))
	g.GET("/cards/virtual/consent-url", issuerURL(Issuer.ConsentURL))
	g.POST("/cards/virtual/order", issuerJSON(func(ctx context.Context, is Issuer, uid string, _ json.RawMessage) (json.RawMessage, error) {
		return is.OrderCard(ctx, uid)
	}))
}

func issuerJSON(call func(context.Context, Issuer, string, json.RawMessage) (json.RawMessage, error)) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		var body json.RawMessage
		if e.Request.Method == http.MethodPost && e.Request.Body != nil {
			b, _ := io.ReadAll(io.LimitReader(e.Request.Body, 1<<20))
			body = b
		}
		out, err := call(e.Request.Context(), issuer(), e.Auth.Id, body)
		if err != nil {
			return e.JSON(http.StatusBadGateway, map[string]string{"error": err.Error()})
		}
		if len(out) == 0 {
			out = json.RawMessage(`{"status":"success"}`)
		}
		e.Response.Header().Set("Content-Type", "application/json")
		_, err = e.Response.Write(out)
		return err
	}
}

// issuerURL returns the hosted URL without ever writing it to logs or store.
func issuerURL(call func(Issuer, context.Context, string) (string, error)) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		u, err := call(issuer(), e.Request.Context(), e.Auth.Id)
		if err != nil {
			return e.JSON(http.StatusBadGateway, map[string]string{"error": err.Error()})
		}
		return e.JSON(http.StatusOK, map[string]string{"url": u})
	}
}

// -----------------------------------------------------------------------------
// Sandbox simulation — deterministic issuer states, no upstream calls.
// -----------------------------------------------------------------------------

type simIssuer struct{}

func (simIssuer) Name() string { return "sandbox" }

func (simIssuer) CreateAccount(_ context.Context, _ string, _ json.RawMessage) (json.RawMessage, error) {
	return json.RawMessage(`{"status":"success","message":"Card account created successfully","data":null}`), nil
}

func (simIssuer) Account(_ context.Context, userID string) (json.RawMessage, error) {
	out := map[string]any{
		"status": "success",
		"data": map[string]any{
			"status":         "active",
			"kycStatus":      "verified",
			"virtualAccount": map[string]any{"status": "approved", "nextAction": "order_card"},
			"cards":          []any{},
			"userId":         userID,
		},
	}
	b, err := json.Marshal(out)
	return b, err
}

func (simIssuer) KYC(_ context.Context, _ string) (json.RawMessage, error) {
	return json.RawMessage(`{"status":"success","data":{"status":"verified"}}`), nil
}

func (simIssuer) CreateVirtual(_ context.Context, _ string) (json.RawMessage, error) {
	return json.RawMessage(`{"status":"success","data":{"status":"approved","nextAction":"order_card"}}`), nil
}

func (simIssuer) KYCURL(_ context.Context, _ string) (string, error) {
	return "https://sandbox.lux.financial/kyc", nil
}

func (simIssuer) ConsentURL(_ context.Context, _ string) (string, error) {
	return "https://sandbox.lux.financial/consent", nil
}

func (simIssuer) OrderCard(_ context.Context, _ string) (json.RawMessage, error) {
	return json.RawMessage(`{"status":"success","message":"Card ordered"}`), nil
}

// -----------------------------------------------------------------------------
// sfprivate — SF Private Bank card platform client.
// Account Management + Virtual Cards API integration guides are the wire
// contract; endpoints are keyed by the upstream user id (provisioned 1:1
// with the IAM principal at onboarding).
// -----------------------------------------------------------------------------

type sfprivate struct {
	base string
	key  string
	http *http.Client
}

func newSFPrivate() *sfprivate {
	return &sfprivate{
		base: strings.TrimRight(os.Getenv("SFPRIVATE_URL"), "/"),
		key:  os.Getenv("SFPRIVATE_API_KEY"),
		http: &http.Client{Timeout: 30 * time.Second},
	}
}

func (s *sfprivate) Name() string { return "sfprivate" }

func (s *sfprivate) call(ctx context.Context, method, path string, body json.RawMessage) (json.RawMessage, error) {
	if s.base == "" || s.key == "" {
		return nil, fmt.Errorf("issuer not configured")
	}
	var rd io.Reader
	if body != nil {
		rd = bytes.NewReader(body)
	}
	req, err := http.NewRequestWithContext(ctx, method, s.base+path, rd)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+s.key)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	res, err := s.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("issuer unreachable")
	}
	defer res.Body.Close()
	out, err := io.ReadAll(io.LimitReader(res.Body, 1<<20))
	if err != nil {
		return nil, err
	}
	if res.StatusCode >= 400 {
		return nil, fmt.Errorf("issuer returned %d", res.StatusCode)
	}
	return out, nil
}

func (s *sfprivate) CreateAccount(ctx context.Context, userID string, profile json.RawMessage) (json.RawMessage, error) {
	return s.call(ctx, http.MethodPost, "/account/"+userID, profile)
}

func (s *sfprivate) Account(ctx context.Context, userID string) (json.RawMessage, error) {
	return s.call(ctx, http.MethodGet, "/account/"+userID, nil)
}

func (s *sfprivate) KYC(ctx context.Context, userID string) (json.RawMessage, error) {
	return s.call(ctx, http.MethodGet, "/account/"+userID+"/kyc-status", nil)
}

func (s *sfprivate) CreateVirtual(ctx context.Context, userID string) (json.RawMessage, error) {
	return s.call(ctx, http.MethodPost, "/account/"+userID+"/virtual", nil)
}

func (s *sfprivate) urlField(ctx context.Context, path string) (string, error) {
	raw, err := s.call(ctx, http.MethodGet, path, nil)
	if err != nil {
		return "", err
	}
	var out struct {
		URL  string `json:"url"`
		Data struct {
			URL string `json:"url"`
		} `json:"data"`
	}
	if err := json.Unmarshal(raw, &out); err != nil {
		return "", err
	}
	if out.URL != "" {
		return out.URL, nil
	}
	return out.Data.URL, nil
}

func (s *sfprivate) KYCURL(ctx context.Context, userID string) (string, error) {
	return s.urlField(ctx, "/account/"+userID+"/virtual/kyc-url")
}

func (s *sfprivate) ConsentURL(ctx context.Context, userID string) (string, error) {
	return s.urlField(ctx, "/account/"+userID+"/virtual/consent-agreement-url")
}

func (s *sfprivate) OrderCard(ctx context.Context, userID string) (json.RawMessage, error) {
	// The single-card order endpoint from the Virtual Cards guide.
	return s.call(ctx, http.MethodPost, "/account/"+userID+"/virtual/order", nil)
}
