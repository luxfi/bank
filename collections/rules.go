package collections

import "github.com/hanzoai/base/core"

// reads is who may list and view each collection's records through the
// generic collection API. A nil rule is superuser only. Mutations are superuser
// only on every collection and go through the authenticated /v1/bank routes.
//
// Records carrying customer PII are never world-readable, in any mode — the
// sandbox demo reads through the /v1/bank routes too.
var reads = map[string]*string{
	AccountCollectionName:     rule(`owner = @request.auth.id`),
	BeneficiaryCollectionName: rule(`account.owner = @request.auth.id`),
	TransactionCollectionName: rule(`account.owner = @request.auth.id`),
	FeeCollectionName:         nil,
	SessionCollectionName:     rule(`user = @request.auth.id`),
	BalanceCollectionName:     nil,
	AuditCollectionName:       nil,
	DocumentCollectionName:    rule(`account.owner = @request.auth.id`),
	WalletCollectionName:      rule(`account.owner = @request.auth.id`),
	ConversionCollectionName:  rule(`account.owner = @request.auth.id`),
	CardCollectionName:        rule(`account.owner = @request.auth.id`),
}

func rule(s string) *string { return &s }

// readable sets a new collection's rules from reads.
func readable(c *core.Collection) {
	c.ListRule, c.ViewRule = reads[c.Name], reads[c.Name]
	c.CreateRule, c.UpdateRule, c.DeleteRule = nil, nil, nil
}

// EnforceReads makes every existing collection's rules the ones in reads. An
// Ensure creates its collection once and returns early ever after, so a rule
// tightened in a later release never reached a database that already held the
// collection: the rules a database was created with stayed in force through
// every upgrade. Run on every boot, after the Ensures.
func EnforceReads(app core.App) error {
	for name := range reads {
		c, err := app.FindCollectionByNameOrId(name)
		if err != nil {
			continue
		}
		want := reads[name]
		if same(c.ListRule, want) && same(c.ViewRule, want) &&
			c.CreateRule == nil && c.UpdateRule == nil && c.DeleteRule == nil {
			continue
		}
		readable(c)
		// SaveNoValidate, not Save: Base refuses to update a collection whose
		// name equals its id (see EnsureAccountCollection).
		if err := app.SaveNoValidate(c); err != nil {
			return err
		}
	}
	return nil
}

func same(a, b *string) bool {
	if a == nil || b == nil {
		return a == b
	}
	return *a == *b
}

// CloseSignup makes the built-in users collection superuser-create only. An
// earlier release opened it to anyone ("") for a local email/password signup;
// identity is Hanzo IAM, so no anonymous caller creates a users record.
func CloseSignup(app core.App) error {
	users, err := app.FindCollectionByNameOrId("users")
	if err != nil || users.CreateRule == nil {
		return nil
	}
	users.CreateRule = nil
	return app.SaveNoValidate(users)
}
