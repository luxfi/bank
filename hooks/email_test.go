package hooks

import (
	"strings"
	"testing"
)

// With no SMTP host the notification is skipped, not failed. A bank that cannot
// mail a receipt has still moved the money, and treating that as an error would
// make a best-effort notice look like a failed transaction.
func TestNoSMTPConfiguredSkipsQuietly(t *testing.T) {
	t.Setenv("SMTP_HOST", "")
	if err := sendEmail("someone@example.com", "Transaction Completed", "body"); err != nil {
		t.Fatalf("sendEmail with no host: %v, want nil", err)
	}
}

// The message is assembled by hand, so a CR or LF in a header value closes that
// header and opens whatever follows — a Bcc to somewhere else, a replaced From.
// Nothing sends user-written text through here today, which is exactly why the
// refusal belongs in the helper rather than in each caller's head.
func TestALineBreakInAHeaderIsRefused(t *testing.T) {
	t.Setenv("SMTP_HOST", "smtp.invalid")
	t.Setenv("SMTP_PORT", "587")

	for _, tc := range []struct{ name, to, subject string }{
		{"bcc smuggled through the recipient", "a@x.com\r\nBcc: thief@evil.com", "Receipt"},
		{"newline alone in the recipient", "a@x.com\nBcc: thief@evil.com", "Receipt"},
		{"header smuggled through the subject", "a@x.com", "Receipt\r\nBcc: thief@evil.com"},
		{"carriage return alone in the subject", "a@x.com", "Receipt\rX-Spoof: 1"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			err := sendEmail(tc.to, tc.subject, "body")
			if err == nil {
				t.Fatal("accepted a header value carrying a line break")
			}
			if !strings.Contains(err.Error(), "forge a header") {
				t.Fatalf("err = %v, want it to name the forged header", err)
			}
		})
	}
}

// The body is exempt: line breaks are what a body is made of, and it sits after
// the blank line where no header is being parsed. Refusing them would break
// every multi-line notice.
//
// SMTP_HOST points at a name that does not resolve, so this gets past the
// header check and fails at the send — which is the proof it was not refused
// earlier.
func TestTheBodyMayContainLineBreaks(t *testing.T) {
	t.Setenv("SMTP_HOST", "smtp.invalid.example")
	t.Setenv("SMTP_PORT", "587")

	err := sendEmail("a@x.com", "Receipt", "Line one\r\nLine two\r\n\r\nRegards")
	if err != nil && strings.Contains(err.Error(), "forge a header") {
		t.Fatalf("a multi-line body was refused as a forged header: %v", err)
	}
}
