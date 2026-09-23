package bank

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

const (
	demoEmail    = "z@lux.financial"
	demoPassword = "correct horse battery staple"
	ingressPeer  = "10.42.0.6:41000"
)

// loginApp is a test app holding the demo credential, as SeedSandbox leaves it.
func loginApp(t *testing.T) *tests.TestApp {
	t.Helper()
	t.Setenv("hz_test_env", "0123456789abcdef0123456789abcdef")
	t.Setenv("BANK_SANDBOX", "true")
	app, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("new test app: %v", err)
	}
	t.Cleanup(app.Cleanup)
	if err := collections.EnsureCredentialCollection(app); err != nil {
		t.Fatalf("credential collection: %v", err)
	}
	if _, err := ensureDemoSuperuser(app, demoEmail, demoPassword); err != nil {
		t.Fatalf("demo superuser: %v", err)
	}
	return app
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

// login posts a credential as the ingress forwards it: from its own pod, with
// X-Forwarded-For carrying the chain.
func login(h http.Handler, forwarded, email, password string) *httptest.ResponseRecorder {
	body := fmt.Sprintf(`{"email":%q,"password":%q}`, email, password)
	req := httptest.NewRequest(http.MethodPost, "/v1/bank/login", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.RemoteAddr = ingressPeer
	req.Header.Set("X-Forwarded-For", forwarded)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	return rec
}

func behindCDN(client string) string { return client + ", 162.158.1.1" }

func wantRefused(t *testing.T, rec *httptest.ResponseRecorder, what string) {
	t.Helper()
	if rec.Code != http.StatusTooManyRequests {
		t.Fatalf("%s: got %d %s, want 429", what, rec.Code, rec.Body.String())
	}
	secs, err := strconv.Atoi(rec.Header().Get("Retry-After"))
	if err != nil || secs < 1 || secs > int(loginWindow/time.Second) {
		t.Fatalf("%s: Retry-After %q, want 1..%d seconds", what, rec.Header().Get("Retry-After"), int(loginWindow/time.Second))
	}
}

func wantStatus(t *testing.T, rec *httptest.ResponseRecorder, code int, what string) {
	t.Helper()
	if rec.Code != code {
		t.Fatalf("%s: got %d %s, want %d", what, rec.Code, rec.Body.String(), code)
	}
}

// The login mints a superuser token, so every guess at it is a guess at the
// whole bank. A guesser gets a handful per account and a few more per address,
// then waits; nobody else is made to wait with them.
func TestLoginRefusesAGuesserPastTheBudget(t *testing.T) {
	h := served(t, loginApp(t))
	guesser := behindCDN("203.0.113.7")

	for i := 1; i <= 20; i++ {
		rec := login(h, guesser, demoEmail, fmt.Sprintf("guess-%d", i))
		if i <= loginPerAccount {
			wantStatus(t, rec, http.StatusUnauthorized, fmt.Sprintf("guess %d", i))
		} else {
			wantRefused(t, rec, fmt.Sprintf("guess %d", i))
		}
	}

	// Moving address does not buy more guesses at the same account, and the
	// right password is not tried either: a 200 here would say which it was.
	wantRefused(t, login(h, behindCDN("198.51.100.20"), demoEmail, "another-guess"), "same account, new address")
	wantRefused(t, login(h, behindCDN("198.51.100.21"), demoEmail, demoPassword), "right password while spent")

	// A client-written X-Forwarded-For entry changes nothing.
	wantRefused(t, login(h, "192.0.2.99, "+guesser, demoEmail, "spoofed"), "spoofed left entry")

	// Spraying many accounts from one address runs out too.
	sprayer := behindCDN("203.0.113.8")
	for i := 1; i <= loginPerAddress; i++ {
		wantStatus(t, login(h, sprayer, fmt.Sprintf("nobody%d@example.com", i), "pw"), http.StatusUnauthorized, fmt.Sprintf("spray %d", i))
	}
	wantRefused(t, login(h, sprayer, "one-more@example.com", "pw"), "spray past the address budget")

	// Someone else, somewhere else, is answered normally.
	wantStatus(t, login(h, behindCDN("198.51.100.30"), "someone@example.com", "pw"), http.StatusUnauthorized, "bystander")
}

// A correct password hands its attempt back, so the people who know it — the
// demo is one shared login — never run the budget down by signing in.
func TestLoginCorrectPasswordSpendsNothing(t *testing.T) {
	h := served(t, loginApp(t))
	from := behindCDN("203.0.113.9")

	for i := 1; i < loginPerAccount; i++ {
		wantStatus(t, login(h, from, demoEmail, "typo"), http.StatusUnauthorized, "typo")
	}
	for i := 0; i < 3*loginPerAccount; i++ {
		wantStatus(t, login(h, from, demoEmail, demoPassword), http.StatusOK, fmt.Sprintf("sign-in %d", i))
	}
	wantStatus(t, login(h, from, demoEmail, "typo"), http.StatusUnauthorized, "last typo in budget")
	wantRefused(t, login(h, from, demoEmail, "typo"), "typo past the budget")
}

// The budget comes back when the window closes.
func TestLoginBudgetReturnsAfterTheWindow(t *testing.T) {
	app := loginApp(t)
	clock := time.Unix(1_800_000_000, 0)
	now := func() time.Time { return clock }
	address, account := newThrottle(loginPerAddress, loginWindow), newThrottle(loginPerAccount, loginWindow)
	address.now, account.now = now, now

	r, err := apis.NewRouter(app)
	if err != nil {
		t.Fatalf("router: %v", err)
	}
	r.POST("/v1/bank/login", handleSandboxLogin(app, address, account))
	h, err := r.BuildMux()
	if err != nil {
		t.Fatalf("mux: %v", err)
	}
	from := behindCDN("203.0.113.10")

	for i := 0; i < loginPerAccount; i++ {
		wantStatus(t, login(h, from, demoEmail, "guess"), http.StatusUnauthorized, "guess")
	}
	wantRefused(t, login(h, from, demoEmail, "guess"), "spent")

	clock = clock.Add(loginWindow - time.Second)
	rec := login(h, from, demoEmail, "guess")
	wantRefused(t, rec, "one second before the window closes")
	if got := rec.Header().Get("Retry-After"); got != "1" {
		t.Fatalf("Retry-After one second before the window closes = %q, want 1", got)
	}

	clock = clock.Add(time.Second)
	wantStatus(t, login(h, from, demoEmail, "guess"), http.StatusUnauthorized, "after the window")
	wantStatus(t, login(h, from, demoEmail, demoPassword), http.StatusOK, "right password after the window")
}

// Attempts are spent before the password is checked, so a burst of concurrent
// guesses cannot all find budget left.
func TestThrottleHoldsUnderABurst(t *testing.T) {
	th := newThrottle(loginPerAccount, loginWindow)
	var (
		wg      sync.WaitGroup
		mu      sync.Mutex
		allowed int
	)
	for i := 0; i < 200; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if _, wait := th.take(demoEmail); wait == 0 {
				mu.Lock()
				allowed++
				mu.Unlock()
			}
		}()
	}
	wg.Wait()
	if allowed != loginPerAccount {
		t.Fatalf("burst of 200 allowed %d, want %d", allowed, loginPerAccount)
	}
}

// Memory is bounded: past its key limit the throttle refuses new keys rather
// than forgetting old ones, and a closed window frees its keys.
func TestThrottleRefusesKeysItCannotHold(t *testing.T) {
	clock := time.Unix(1_800_000_000, 0)
	th := newThrottle(1, time.Minute)
	th.keys, th.now = 2, func() time.Time { return clock }

	for _, k := range []string{"a", "b"} {
		if _, wait := th.take(k); wait != 0 {
			t.Fatalf("take %s refused", k)
		}
	}
	if _, wait := th.take("c"); wait == 0 {
		t.Fatal("a third key was accepted past the limit")
	}
	clock = clock.Add(time.Minute)
	if _, wait := th.take("c"); wait != 0 {
		t.Fatal("a closed window did not free its keys")
	}
}

func TestClientAddress(t *testing.T) {
	for _, c := range []struct{ name, remote, forwarded, want string }{
		{"no proxy", "198.51.100.9:1234", "", "198.51.100.9"},
		{"direct to the ingress", ingressPeer, "198.51.100.9", "198.51.100.9"},
		{"behind the CDN", ingressPeer, "203.0.113.7, 162.158.1.1", "203.0.113.7"},
		{"client-written entries ignored", ingressPeer, "6.6.6.6, 5.5.5.5, 203.0.113.7, 162.158.1.1", "203.0.113.7"},
		{"IPv4-mapped", ingressPeer, "::ffff:203.0.113.7, 162.158.1.1", "203.0.113.7"},
		{"IPv6 per /64", ingressPeer, "2001:db8:1:2:3::4, 162.158.1.1", "2001:db8:1:2::/64"},
		{"same /64", ingressPeer, "2001:db8:1:2:ffff::9, 162.158.1.1", "2001:db8:1:2::/64"},
		{"not an address", ingressPeer, "anything-at-all, 162.158.1.1", "10.42.0.6"},
	} {
		req := httptest.NewRequest(http.MethodPost, "/v1/bank/login", nil)
		req.RemoteAddr = c.remote
		if c.forwarded != "" {
			req.Header.Set("X-Forwarded-For", c.forwarded)
		}
		if got := clientAddress(req); got != c.want {
			t.Errorf("%s: clientAddress = %q, want %q", c.name, got, c.want)
		}
	}
}
