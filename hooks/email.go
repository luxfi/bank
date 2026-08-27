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

// recipient is the address the account's owner reads, or "" when there is
// nobody to tell — a record whose account or owner has gone is not an error
// worth raising from a notification.
func recipient(app core.App, record *core.Record) string {
	account, err := app.FindRecordById(collections.AccountCollectionName, record.GetString("account"))
	if err != nil {
		return ""
	}
	owner, err := app.FindRecordById("users", account.GetString("owner"))
	if err != nil {
		return ""
	}
	return owner.GetString("email")
}

// tell sends one notification and records a failure to deliver it. Notifying is
// best effort by design: nothing the customer did depends on the mail arriving,
// so a dead SMTP host must not turn a settled transaction into an error.
func tell(app core.App, to, subject, body string) {
	if err := sendEmail(to, subject, body); err != nil {
		app.Logger().Warn("email: notification not sent",
			slog.String("to", to),
			slog.String("subject", subject),
			slog.String("error", err.Error()),
		)
	}
}

// transactionNotice is what a settled transaction says. It is a function of the
// record alone, so what a customer reads can be checked without sending
// anything.
//
// The amount is held in minor units, so it is rendered rather than printed: the
// stored number for a $250.00 transfer is 25000, and that is the figure the
// customer was being given as their own.
func transactionNotice(record *core.Record) (subject, body string) {
	cur := record.GetString("currency")
	return "Transaction Completed", fmt.Sprintf(
		"Your %s transaction of %s %s has been completed.",
		record.GetString("type"), cur,
		collections.Format(int64(record.GetFloat("amount")), cur))
}

// documentNotice is what a KYC decision says.
func documentNotice(record *core.Record, status string) (subject, body string) {
	return "KYC Document " + status,
		fmt.Sprintf("Your %s document has been %s.", record.GetString("type"), status)
}

func sendTransactionEmail(app core.App, record *core.Record) {
	// Best-effort notification: a failure (or a DB access racing daemon
	// shutdown) must never crash the process from this detached goroutine.
	defer func() { _ = recover() }()

	if to := recipient(app, record); to != "" {
		subject, body := transactionNotice(record)
		tell(app, to, subject, body)
	}
}

func sendDocumentEmail(app core.App, record *core.Record, status string) {
	defer func() { _ = recover() }()

	if to := recipient(app, record); to != "" {
		subject, body := documentNotice(record, status)
		tell(app, to, subject, body)
	}
}

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
