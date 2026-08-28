package bank

import (
	"strings"
	"testing"
)

// An unknown BANK_ISSUER used to fall through to sfprivate, so a deployment
// asking for a counterparty this build does not implement got a different bank
// and no indication of it. It has to be refused by name.
func TestUnknownIssuerIsRefusedByName(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("BANK_ISSUER", "banxe")
	t.Setenv("SFPRIVATE_URL", "https://example.invalid")
	t.Setenv("SFPRIVATE_API_KEY", "k")

	err := IssuerReady()
	if err == nil {
		t.Fatal("an issuer this build does not implement was accepted")
	}
	if !strings.Contains(err.Error(), "banxe") {
		t.Fatalf("the refusal does not name what was asked for: %v", err)
	}
}

// A known issuer with no credentials mounts a card surface over nothing, and
// fails on the first upstream call rather than at boot.
func TestIssuerWithoutCredentialsIsRefused(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "false")
	t.Setenv("BANK_ISSUER", "sfprivate")
	t.Setenv("SFPRIVATE_URL", "")
	t.Setenv("SFPRIVATE_API_KEY", "")

	if err := IssuerReady(); err == nil {
		t.Fatal("an issuer with no credentials was accepted")
	}
}

// The sandbox simulates the issuer deliberately and must not be asked for
// credentials it has no use for.
func TestSandboxNeedsNoIssuerCredentials(t *testing.T) {
	t.Setenv("BANK_SANDBOX", "true")
	t.Setenv("BANK_ISSUER", "")
	t.Setenv("SFPRIVATE_URL", "")
	t.Setenv("SFPRIVATE_API_KEY", "")

	if err := IssuerReady(); err != nil {
		t.Fatalf("the sandbox was refused: %v", err)
	}
	if got := issuer().Name(); got != "sandbox" {
		t.Fatalf("the sandbox resolved to %q", got)
	}
}
