package hooks

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/hanzoai/base/core"
)

func sign(secret, body string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(body))
	return hex.EncodeToString(mac.Sum(nil))
}

// drive runs the HMAC middleware against a request and returns the status the
// caller would see (200 means it called e.Next, i.e. passed the gate).
func drive(t *testing.T, secret, sigHeader, body string) int {
	t.Helper()
	if secret != "" {
		t.Setenv("WEBHOOK_HMAC_SECRET", secret)
	} else {
		t.Setenv("WEBHOOK_HMAC_SECRET", "")
	}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/v1/bank/webhooks/x", io.NopCloser(stringReader(body)))
	if sigHeader != "" {
		req.Header.Set("X-Signature", sigHeader)
	}
	e := &core.RequestEvent{}
	e.Request = req
	e.Response = rec
	// e.Next is nil; on a pass the middleware calls it. Guard by recovering:
	// a nil-Next panic still proves the gate passed. Simpler: assert on the
	// recorder status the middleware itself writes on rejection.
	h := RequireHMACAuth()
	func() {
		defer func() { _ = recover() }()
		_ = h.Func(e)
	}()
	if rec.Code == 200 && rec.Body.Len() == 0 {
		// middleware wrote nothing → it passed to (nil) Next.
		return 200
	}
	return rec.Code
}

type sr struct {
	s string
	i int
}

func stringReader(s string) *sr { return &sr{s: s} }
func (r *sr) Read(p []byte) (int, error) {
	if r.i >= len(r.s) {
		return 0, io.EOF
	}
	n := copy(p, r.s[r.i:])
	r.i += n
	return n, nil
}

func TestHMACValidSignaturePasses(t *testing.T) {
	body := `{"event":"payment.settled"}`
	if code := drive(t, "sekret", sign("sekret", body), body); code != 200 {
		t.Errorf("valid signature: gate returned %d, want pass(200)", code)
	}
}

func TestHMACRejects(t *testing.T) {
	body := `{"event":"x"}`
	if code := drive(t, "sekret", "deadbeef", body); code != 401 {
		t.Errorf("bad signature = %d, want 401", code)
	}
	if code := drive(t, "sekret", "", body); code != 401 {
		t.Errorf("missing header = %d, want 401", code)
	}
	if code := drive(t, "", sign("x", body), body); code != 401 {
		t.Errorf("unconfigured secret = %d, want 401", code)
	}
}
