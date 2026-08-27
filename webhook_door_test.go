package bank

import (
	"net/http"
	"strings"
	"testing"

	"github.com/hanzoai/base/tests"
)

const paymentWebhook = "/v1/bank/webhooks/payments/callback"

// The webhook is the one door an unauthenticated caller can knock on, so what
// it does before it knows who is knocking is what matters. It reads the whole
// body to compute a signature over it — which is the only way to check one —
// so an oversized body has to be refused by the time that read happens.
func TestAnOversizedWebhookBodyIsRefused(t *testing.T) {
	app := newBankApp(t)
	t.Setenv("WEBHOOK_HMAC_SECRET", "sekret")

	// Comfortably past any sane limit, and signed correctly, so nothing but
	// the size can be what refuses it.
	body := `{"pad":"` + strings.Repeat("A", 64<<20) + `"}`

	run(t, app, tests.ApiScenario{
		Name:            "a 64MiB webhook body is refused",
		Method:          http.MethodPost,
		URL:             paymentWebhook,
		Body:            strings.NewReader(body),
		Headers:         map[string]string{"X-Signature": hmacSign("sekret", body), "Content-Type": "application/json"},
		ExpectedStatus:  413,
		ExpectedContent: []string{"message"},
	})
}

// And the ordinary shapes, through the real mount rather than the middleware on
// its own: the route exists, an unsigned call is refused, a wrongly signed one
// is refused, and a correctly signed one gets past the door.
func TestTheWebhookDoorChecksItsSignature(t *testing.T) {
	app := newBankApp(t)
	t.Setenv("WEBHOOK_HMAC_SECRET", "sekret")
	const body = `{"transactionId":"nosuchtx","status":"settled"}`

	for _, tc := range []struct {
		name string
		sig  string
		want int
	}{
		{"no signature at all", "", http.StatusUnauthorized},
		{"a signature over other content", hmacSign("sekret", `{"different":true}`), http.StatusUnauthorized},
		{"a signature under another secret", hmacSign("wrong", body), http.StatusUnauthorized},
	} {
		h := map[string]string{"Content-Type": "application/json"}
		if tc.sig != "" {
			h["X-Signature"] = tc.sig
		}
		run(t, app, tests.ApiScenario{
			Name:            tc.name + " is refused",
			Method:          http.MethodPost,
			URL:             paymentWebhook,
			Body:            strings.NewReader(body),
			Headers:         h,
			ExpectedStatus:  tc.want,
			ExpectedContent: []string{"error"},
		})
	}

	// Correctly signed: past the door. What the handler makes of an unknown
	// transaction is its own business — it acknowledges rather than erroring,
	// so a sender does not retry something we will never recognise — and the
	// point here is that the call got that far.
	run(t, app, tests.ApiScenario{
		Name:            "a correctly signed call reaches the handler",
		Method:          http.MethodPost,
		URL:             paymentWebhook,
		Body:            strings.NewReader(body),
		Headers:         map[string]string{"X-Signature": hmacSign("sekret", body), "Content-Type": "application/json"},
		ExpectedStatus:  http.StatusOK,
		ExpectedContent: []string{"ignored"},
	})
}

// With no secret configured the door does not open. A webhook moves money on
// somebody else's say-so, so an unconfigured deployment must refuse rather than
// accept anything that arrives.
func TestAnUnconfiguredWebhookRefusesEveryCaller(t *testing.T) {
	app := newBankApp(t)
	t.Setenv("WEBHOOK_HMAC_SECRET", "")
	const body = `{"transactionId":"x","status":"settled"}`

	run(t, app, tests.ApiScenario{
		Name:            "no secret configured refuses even a signed call",
		Method:          http.MethodPost,
		URL:             paymentWebhook,
		Body:            strings.NewReader(body),
		Headers:         map[string]string{"X-Signature": hmacSign("sekret", body), "Content-Type": "application/json"},
		ExpectedStatus:  http.StatusUnauthorized,
		ExpectedContent: []string{"error"},
	})
}
