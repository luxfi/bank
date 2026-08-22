package bank

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
)

// The issuer card routes run against the deterministic sandbox simulation
// (BANK_SANDBOX default on), covering registerIssuerRoutes, issuerJSON,
// issuerURL and the simIssuer methods end to end over HTTP.
func TestIssuerCardRoutesSandbox(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)
	h := map[string]string{"Authorization": token, "Content-Type": "application/json"}

	profile := `{"firstName":"John","lastName":"Smith","cardHolderFirstName":"John","cardHolderLastName":"Smith","gender":1,"dateOfBirth":"1990-06-15","placeOfBirth":"GB","occupation":1,"phoneNumber":"+447911123456","phoneNumberCountryCode":"GB","address":{"addressLine1":"1 High St","subdivision":"London","city":"London","postalCode":"EC1A 1BB","country":"GB"}}`

	cases := []struct {
		name, method, url, body string
		want                    string
	}{
		{"create account", http.MethodPost, "/v1/bank/cards/account", profile, `"status":"success"`},
		{"account state", http.MethodGet, "/v1/bank/cards/account", "", `"nextAction":"order_card"`},
		{"kyc status", http.MethodGet, "/v1/bank/cards/kyc", "", `"verified"`},
		{"create virtual", http.MethodPost, "/v1/bank/cards/virtual", "", `"approved"`},
		{"kyc url", http.MethodGet, "/v1/bank/cards/virtual/kyc-url", "", `"url":"https://`},
		{"consent url", http.MethodGet, "/v1/bank/cards/virtual/consent-url", "", `"url":"https://`},
		{"order card", http.MethodPost, "/v1/bank/cards/virtual/order", "", `"success"`},
	}
	for _, c := range cases {
		s := tests.ApiScenario{
			Name:            c.name,
			Method:          c.method,
			URL:             c.url,
			Headers:         h,
			ExpectedStatus:  200,
			ExpectedContent: []string{c.want},
		}
		if c.body != "" {
			s.Body = strings.NewReader(c.body)
		}
		run(t, app, s)
	}
}

// The live sfprivate client against a mock upstream — covers call(), the
// per-endpoint methods, the Bearer auth header, and the URL-field extraction.
func TestSFPrivateClient(t *testing.T) {
	var gotAuth, gotPath string
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotAuth = r.Header.Get("Authorization")
		gotPath = r.URL.Path
		w.Header().Set("Content-Type", "application/json")
		switch {
		case strings.HasSuffix(r.URL.Path, "/kyc-url"):
			_, _ = w.Write([]byte(`{"data":{"url":"https://kyc.example/session"}}`))
		case strings.HasSuffix(r.URL.Path, "/consent-agreement-url"):
			_, _ = w.Write([]byte(`{"url":"https://consent.example/agree"}`))
		default:
			_, _ = w.Write([]byte(`{"status":"success","data":null}`))
		}
	}))
	defer srv.Close()

	c := &sfprivate{base: srv.URL, key: "test-key", http: srv.Client()}
	ctx := context.Background()

	if _, err := c.CreateAccount(ctx, "user1", json.RawMessage(`{"firstName":"A"}`)); err != nil {
		t.Fatalf("CreateAccount: %v", err)
	}
	if gotAuth != "Bearer test-key" {
		t.Errorf("auth header = %q, want Bearer test-key", gotAuth)
	}
	if gotPath != "/account/user1" {
		t.Errorf("path = %q, want /account/user1", gotPath)
	}
	if _, err := c.Account(ctx, "user1"); err != nil {
		t.Errorf("Account: %v", err)
	}
	if _, err := c.KYC(ctx, "user1"); err != nil {
		t.Errorf("KYC: %v", err)
	}
	if _, err := c.CreateVirtual(ctx, "user1"); err != nil {
		t.Errorf("CreateVirtual: %v", err)
	}
	if _, err := c.OrderCard(ctx, "user1"); err != nil {
		t.Errorf("OrderCard: %v", err)
	}
	if u, err := c.KYCURL(ctx, "user1"); err != nil || u != "https://kyc.example/session" {
		t.Errorf("KYCURL = (%q, %v)", u, err)
	}
	if u, err := c.ConsentURL(ctx, "user1"); err != nil || u != "https://consent.example/agree" {
		t.Errorf("ConsentURL = (%q, %v)", u, err)
	}
}

// An unconfigured client refuses rather than calling out.
func TestSFPrivateUnconfigured(t *testing.T) {
	c := &sfprivate{base: "", key: "", http: http.DefaultClient}
	if _, err := c.Account(context.Background(), "u"); err == nil {
		t.Error("expected error from unconfigured issuer")
	}
}

// An upstream error is collapsed to a status-only message — no body/URL/key leak.
func TestSFPrivateErrorOpaque(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "upstream secret detail", http.StatusBadGateway)
	}))
	defer srv.Close()
	c := &sfprivate{base: srv.URL, key: "k", http: srv.Client()}
	_, err := c.Account(context.Background(), "u")
	if err == nil || strings.Contains(err.Error(), "secret") {
		t.Errorf("error should be opaque, got %v", err)
	}
}
