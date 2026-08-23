package bank

import "github.com/hanzoai/base/core"

// One shape for every handler-level response, so the wire contract is uniform
// and stated in one place rather than re-spelled at each return.

// errJSON writes {"error": msg} with the given status.
func errJSON(e *core.RequestEvent, status int, msg string) error {
	return e.JSON(status, map[string]string{"error": msg})
}

// bindBody decodes the request body into T, returning it typed. Replaces the
// `var req T; e.BindBody(&req)` dance at every handler with one call whose
// result is already the right type.
func bindBody[T any](e *core.RequestEvent) (T, error) {
	var v T
	err := e.BindBody(&v)
	return v, err
}
