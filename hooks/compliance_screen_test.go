package hooks

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// complianceStub answers /v1/screen with a fixed verdict, or refuses to answer
// at all when status is 0 — the outage case, which is where the fail-open and
// fail-closed postures diverge.
func complianceStub(t *testing.T, status int, body string) string {
	t.Helper()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasSuffix(r.URL.Path, "/v1/screen") {
			t.Errorf("screened at %s, want /v1/screen", r.URL.Path)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		_, _ = w.Write([]byte(body))
	}))
	t.Cleanup(srv.Close)
	return srv.URL
}

func txRecord(t *testing.T, app core.App) *core.Record {
	t.Helper()
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("amount", 250_000.0)
	r.Set("currency", "USD")
	r.Set("direction", "debit")
	return r
}

// A deployment that configures no compliance service screens nobody. That is
// the sandbox and the default, so it is stated rather than assumed.
func TestNoServiceConfiguredScreensNothing(t *testing.T) {
	t.Setenv("COMPLIANCE_SERVICE_URL", "")
	app := limitApp(t)
	if err := screenAML(app, "acct-1", txRecord(t, app)); err != nil {
		t.Fatalf("AML: %v", err)
	}
	if err := screenSanctions(app, "Ada Lovelace", "GB"); err != nil {
		t.Fatalf("sanctions: %v", err)
	}
	if err := screenPEP(app, "Ada Lovelace", "GB"); err != nil {
		t.Fatalf("PEP: %v", err)
	}
}

// A clear verdict lets the movement through; the blocking verdict stops it. The
// two screens block on different words — "blocked" for AML and sanctions,
// "match" for PEP — so each is checked against its own.
func TestAVerdictIsHonoured(t *testing.T) {
	app := limitApp(t)

	t.Setenv("COMPLIANCE_SERVICE_URL", complianceStub(t, 200, `{"result":"clear"}`))
	if err := screenAML(app, "acct-1", txRecord(t, app)); err != nil {
		t.Fatalf("a clear AML verdict was treated as a block: %v", err)
	}
	if err := screenSanctions(app, "Ada", "GB"); err != nil {
		t.Fatalf("a clear sanctions verdict was treated as a block: %v", err)
	}
	if err := screenPEP(app, "Ada", "GB"); err != nil {
		t.Fatalf("a clear PEP verdict was treated as a match: %v", err)
	}

	t.Setenv("COMPLIANCE_SERVICE_URL", complianceStub(t, 200, `{"result":"blocked"}`))
	if err := screenAML(app, "acct-1", txRecord(t, app)); err == nil {
		t.Fatal("a blocked AML verdict let the transaction through")
	}
	if err := screenSanctions(app, "Ada", "GB"); err == nil {
		t.Fatal("a blocked sanctions verdict let the name through")
	}

	t.Setenv("COMPLIANCE_SERVICE_URL", complianceStub(t, 200, `{"result":"match"}`))
	if err := screenPEP(app, "Ada", "GB"); err == nil {
		t.Fatal("a PEP match was let through")
	}
}

// The posture, which is the whole design and the thing that must not silently
// flip: when the screening service cannot be reached, AML and sanctions REFUSE
// and PEP ADMITS.
//
// Money that moves unscreened cannot be recalled, so an outage stops it. A PEP
// hit is a review flag rather than a bar, so an outage must not stop somebody
// opening an account.
func TestAnOutageRefusesMoneyAndAdmitsOnboarding(t *testing.T) {
	app := limitApp(t)
	// A URL that resolves to nothing: the transport fails, which is the shape of
	// an outage rather than a verdict.
	t.Setenv("COMPLIANCE_SERVICE_URL", "http://127.0.0.1:1")

	if err := screenAML(app, "acct-1", txRecord(t, app)); err == nil {
		t.Fatal("AML admitted a transaction it could not screen — money moves unscreened")
	}
	if err := screenSanctions(app, "Ada", "GB"); err == nil {
		t.Fatal("sanctions admitted a name it could not screen")
	}
	if err := screenPEP(app, "Ada", "GB"); err != nil {
		t.Fatalf("PEP refused onboarding over a screening outage: %v", err)
	}
}

// A service answering 4xx/5xx is not an outage — it is a service saying no, and
// callComplianceService turns any error status into the literal "blocked".
//
// That word is what the fail-closed screens compare against, so they refuse. PEP
// compares against "match" and is therefore unaffected, which is not an oversight
// but the same posture arriving by a second road: a screening service in trouble
// must not stop somebody opening an account.
func TestAnErrorStatusBlocksTheFailClosedScreensOnly(t *testing.T) {
	app := limitApp(t)
	t.Setenv("COMPLIANCE_SERVICE_URL", complianceStub(t, 503, `{"result":"clear"}`))

	if err := screenAML(app, "acct-1", txRecord(t, app)); err == nil {
		t.Fatal("a 503 from the screening service let the transaction through")
	}
	if err := screenSanctions(app, "Ada", "GB"); err == nil {
		t.Fatal("a 503 from the screening service let the name through")
	}
	if err := screenPEP(app, "Ada", "GB"); err != nil {
		t.Fatalf("a 503 stopped onboarding: PEP is fail-open on both roads, got %v", err)
	}
}

// Screener is the one place the compliance service is named, and both the
// screens and bankd's startup ask it — so what counts as "configured" has to be
// the same answer to both. Whitespace is not a URL: read untrimmed it is a
// non-empty string that every screen would then try to POST to, and outside the
// sandbox bankd refuses to start on exactly this answer.
func TestScreenerTreatsWhitespaceAsNoService(t *testing.T) {
	for name, tc := range map[string]struct{ set, want string }{
		"a real service":  {"https://compliance.example", "https://compliance.example"},
		"padded":          {"  https://compliance.example  ", "https://compliance.example"},
		"whitespace only": {"   ", ""},
		"empty":           {"", ""},
	} {
		t.Setenv("COMPLIANCE_SERVICE_URL", tc.set)
		if got := Screener(); got != tc.want {
			t.Errorf("%s: Screener() = %q, want %q", name, got, tc.want)
		}
	}
}
