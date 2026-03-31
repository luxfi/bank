package hooks

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
	"os"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/base/tools/hook"
)

// RequireHMACAuth returns a middleware that validates the X-Signature header
// against HMAC-SHA256(secret, requestBody). The secret is read from
// WEBHOOK_HMAC_SECRET env var. Returns 401 if missing or invalid.
func RequireHMACAuth() *hook.Handler[*core.RequestEvent] {
	return &hook.Handler[*core.RequestEvent]{
		Id: "bankRequireHMACAuth",
		Func: func(e *core.RequestEvent) error {
			secret := os.Getenv("WEBHOOK_HMAC_SECRET")
			if secret == "" {
				return e.JSON(http.StatusUnauthorized, map[string]string{"error": "webhook secret not configured"})
			}

			sig := e.Request.Header.Get("X-Signature")
			if sig == "" {
				return e.JSON(http.StatusUnauthorized, map[string]string{"error": "missing X-Signature header"})
			}

			body, err := io.ReadAll(e.Request.Body)
			if err != nil {
				return e.JSON(http.StatusBadRequest, map[string]string{"error": "failed to read body"})
			}
			// Reset body so downstream handlers can read it.
			e.Request.Body = io.NopCloser(bytes.NewReader(body))

			mac := hmac.New(sha256.New, []byte(secret))
			mac.Write(body)
			expected := hex.EncodeToString(mac.Sum(nil))

			if !hmac.Equal([]byte(sig), []byte(expected)) {
				return e.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid signature"})
			}

			return e.Next()
		},
	}
}
