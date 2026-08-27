package hooks

import (
	"strings"
	"testing"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
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

// The recipient guard is not belt-and-braces over a library that already checks.
// Measured against jordan-wright/email directly: a line break in the SUBJECT is
// Q-encoded and inert, and one in the RECIPIENT is obeyed — the address splits
// and a real Bcc header lands in the message. This pins the half that matters,
// so removing the guard on the argument that "the library handles it" fails
// here.
func TestTheRecipientIsWhereTheLibraryWouldLetAHeaderThrough(t *testing.T) {
	t.Setenv("SMTP_HOST", "smtp.invalid.example")

	err := sendEmail("a@x.com\r\nBcc: thief@evil.com", "Receipt", "body")
	if err == nil {
		t.Fatal("a recipient carrying a line break was accepted")
	}
	if !strings.Contains(err.Error(), "forge a header") {
		t.Fatalf("err = %v — refused, but not by the guard; the library does not refuse this", err)
	}
}

// What a customer is told their money was. The amount lives in minor units, so
// a notification that prints the stored number tells someone their $250.00
// transfer was 25000 — and for crypto it is off by a million.
func TestATransactionNoticeSaysTheAmountAPersonSent(t *testing.T) {
	app := limitApp(t)
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}

	for _, tc := range []struct {
		kind, currency string
		amount         int64
		want, wrong    string
	}{
		{"transfer", "USD", 25000, "USD 250.00", "25000"},
		{"deposit", "EUR", 1, "EUR 0.01", " 1 "},
		{"withdrawal", "BTC", 1000000, "BTC 1.000000", "1000000"},
		{"transfer", "JPY", 25000, "JPY 25000", "250.00"},
	} {
		r := core.NewRecord(col)
		r.Set("type", tc.kind)
		r.Set("currency", tc.currency)
		r.Set("amount", tc.amount)

		subject, body := transactionNotice(r)
		if subject != "Transaction Completed" {
			t.Errorf("subject = %q", subject)
		}
		if !strings.Contains(body, tc.want) {
			t.Errorf("a %d %s %s reads as %q, and should say %q",
				tc.amount, tc.currency, tc.kind, body, tc.want)
		}
		if strings.Contains(body, tc.wrong) {
			t.Errorf("a %d %s %s still shows %q: %q", tc.amount, tc.currency, tc.kind, tc.wrong, body)
		}
		if !strings.Contains(body, tc.kind) {
			t.Errorf("the notice does not say what kind of transaction it was: %q", body)
		}
	}
}

// The KYC decision has to be in the message, since approved and rejected are
// the same mail otherwise.
func TestADocumentNoticeCarriesTheDecision(t *testing.T) {
	app := limitApp(t)
	if err := collections.EnsureDocumentCollection(app); err != nil {
		t.Fatalf("ensure documents: %v", err)
	}
	col, err := app.FindCollectionByNameOrId(collections.DocumentCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("type", "passport")

	for _, status := range []string{"approved", "rejected"} {
		subject, body := documentNotice(r, status)
		if !strings.Contains(subject, status) {
			t.Errorf("subject %q does not carry the decision %q", subject, status)
		}
		if !strings.Contains(body, status) || !strings.Contains(body, "passport") {
			t.Errorf("body %q does not say the passport was %s", body, status)
		}
	}
}

// Nobody to tell is not a failure. A record whose account or owner has gone
// leaves no address, and the notification stops there rather than raising.
func TestNoOwnerLeavesNobodyToTell(t *testing.T) {
	app := limitApp(t)
	col, err := app.FindCollectionByNameOrId(collections.TransactionCollectionName)
	if err != nil {
		t.Fatal(err)
	}
	r := core.NewRecord(col)
	r.Set("account", "nosuchaccountid")

	if to := recipient(app, r); to != "" {
		t.Errorf("recipient of a transaction with no account = %q, want none", to)
	}
}
