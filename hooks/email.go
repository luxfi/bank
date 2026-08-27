package hooks

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strings"
	"time"

	"github.com/hanzoai/base/core"
	"github.com/hanzoai/notify"
	"github.com/hanzoai/notify/service/mail"
	"github.com/luxfi/bank/collections"
)

// RegisterEmailHooks sends notifications on key lifecycle events.
func RegisterEmailHooks(app core.App) {
	// Notify on transaction completion.
	app.OnRecordUpdateExecute(collections.TransactionCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus != newStatus && newStatus == "completed" {
			go sendTransactionEmail(app, e.Record)
		}

		return nil
	})

	// Notify on KYC document status change.
	app.OnRecordUpdateExecute(collections.DocumentCollectionName).BindFunc(func(e *core.RecordEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		oldStatus := e.Record.Original().GetString("status")
		newStatus := e.Record.GetString("status")

		if oldStatus != newStatus && (newStatus == "approved" || newStatus == "rejected") {
			go sendDocumentEmail(app, e.Record, newStatus)
		}

		return nil
	})
}

func sendTransactionEmail(app core.App, record *core.Record) {
	// Best-effort notification: a failure (or a DB access racing daemon
	// shutdown) must never crash the process from this detached goroutine.
	defer func() { _ = recover() }()

	accountId := record.GetString("account")
	account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
	if err != nil {
		return
	}

	owner, err := app.FindRecordById("users", account.GetString("owner"))
	if err != nil {
		return
	}

	email := owner.GetString("email")
	if email == "" {
		return
	}

	subject := "Transaction Completed"
	body := fmt.Sprintf("Your %s transaction of %s %s has been completed.",
		record.GetString("type"),
		record.GetString("currency"),
		record.GetString("amount"),
	)

	if err := sendEmail(email, subject, body); err != nil {
		app.Logger().Warn("email: failed to send transaction notification",
			slog.String("to", email),
			slog.String("error", err.Error()),
		)
	}
}

func sendDocumentEmail(app core.App, record *core.Record, status string) {
	defer func() { _ = recover() }()

	accountId := record.GetString("account")
	account, err := app.FindRecordById(collections.AccountCollectionName, accountId)
	if err != nil {
		return
	}

	owner, err := app.FindRecordById("users", account.GetString("owner"))
	if err != nil {
		return
	}

	email := owner.GetString("email")
	if email == "" {
		return
	}

	subject := fmt.Sprintf("KYC Document %s", status)
	body := fmt.Sprintf("Your %s document has been %s.", record.GetString("type"), status)

	if err := sendEmail(email, subject, body); err != nil {
		app.Logger().Warn("email: failed to send document notification",
			slog.String("to", email),
			slog.String("error", err.Error()),
		)
	}
}

// sendEmail hands a notice to hanzoai/notify.
//
// It used to assemble the message itself — "From: %s\r\nTo: %s\r\n..." into
// smtp.SendMail — which meant this repo owned an email format, a header-escaping
// problem it had to solve by hand, and no path to any other channel. notify is
// the estate's answer for that, and it carries SMS beside email behind the same
// Notifier.Send, so a notice can reach a phone without a second sender being
// written here.
//
// Header forgery is still ours to guard, and NOT where you would expect.
// Measured against the library: a line break in the SUBJECT is Q-encoded and
// harmless (`Subject: =?UTF-8?q?Receipt=0D=0ABcc:...?=`), but one in the
// RECIPIENT is obeyed — jordan-wright/email splits it and a real
// `Bcc: thief@evil.com` header lands in the message. So the address is checked
// here, and the subject with it, because relying on the encoding of one field
// while the field beside it forges freely is a distinction nobody should have to
// remember.
func sendEmail(to, subject, body string) error {
	if strings.ContainsAny(to, "\r\n") || strings.ContainsAny(subject, "\r\n") {
		return errors.New("email: a line break in the recipient or subject would forge a header")
	}

	host := os.Getenv("SMTP_HOST")
	if host == "" {
		slog.Warn("email: SMTP not configured, skipping")
		return nil
	}
	port := os.Getenv("SMTP_PORT")
	if port == "" {
		port = "587"
	}
	user := os.Getenv("SMTP_USER")
	from := os.Getenv("SMTP_FROM")
	if from == "" {
		from = user
	}

	m := mail.New(from, host+":"+port)
	if user != "" {
		m.AuthenticateSMTP("", user, os.Getenv("SMTP_PASS"), host)
	}
	m.AddReceivers(to)
	m.BodyFormat(mail.PlainText)

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	return notify.NewWithServices(m).Send(ctx, subject, body)
}
