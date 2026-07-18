package collections

import (
	"os"
	"strings"
)

// sandboxOpenReads reports whether the daemon runs in sandbox/demo mode, in
// which the seeded (fake, testnet) records are world-readable so the admin
// surface and any anonymous reader can see the shared demo data. Mirrors
// bank.Sandbox() (kept here to avoid a package import cycle). Default on.
func sandboxOpenReads() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("BANK_SANDBOX"))) {
	case "false", "0", "no", "off":
		return false
	default:
		return true
	}
}

// readRule returns a public ("") list/view rule in sandbox mode, otherwise the
// given owner-scoped production rule. Applied to the demo-visible collections.
func readRule(ownerScoped string) *string {
	if sandboxOpenReads() {
		open := ""
		return &open
	}
	s := ownerScoped
	return &s
}
