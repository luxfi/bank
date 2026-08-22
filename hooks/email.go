package hooks

import (
	"fmt"
	"log/slog"
	"net/smtp"
	"os"

	"github.com/hanzoai/base/core"
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

func sendEmail(to, subject, body string) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	from := os.Getenv("SMTP_FROM")

	if host == "" {
		slog.Warn("email: SMTP not configured, skipping")
		return nil
	}
	if port == "" {
		port = "587"
	}
	if from == "" {
		from = user
	}

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", from, to, subject, body)

	auth := smtp.PlainAuth("", user, pass, host)
	return smtp.SendMail(host+":"+port, auth, from, []string{to}, []byte(msg))
}
