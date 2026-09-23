package collections

import (
	"testing"

	"github.com/hanzoai/base/core"
)

// A database created by a release that opened the customer collections ("" is
// anyone) keeps those rules through every upgrade unless boot re-asserts them:
// each Ensure returns early once its collection exists.
func TestEnforceReadsClosesAnOpenDatabase(t *testing.T) {
	app := newApp(t)
	for _, e := range ensures {
		if err := e.ensure(app); err != nil {
			t.Fatalf("%s: %v", e.name, err)
		}
	}

	// The state an older release left behind: every collection readable by
	// anyone, and writable by anyone for good measure.
	anyone := ""
	for name := range reads {
		c, err := app.FindCollectionByNameOrId(name)
		if err != nil {
			t.Fatalf("%s: %v", name, err)
		}
		c.ListRule, c.ViewRule, c.CreateRule, c.UpdateRule, c.DeleteRule = &anyone, &anyone, &anyone, &anyone, &anyone
		if err := app.SaveNoValidate(c); err != nil {
			t.Fatalf("%s: open: %v", name, err)
		}
	}

	// An Ensure alone leaves them open — this is the defect.
	for _, e := range ensures {
		if err := e.ensure(app); err != nil {
			t.Fatalf("%s: re-Ensure: %v", e.name, err)
		}
	}
	if c, _ := app.FindCollectionByNameOrId(AccountCollectionName); c.ListRule == nil || *c.ListRule != "" {
		t.Fatalf("precondition: accounts should still be open after Ensure, got %v", c.ListRule)
	}

	for pass := 0; pass < 2; pass++ { // the second pass proves it is idempotent
		if err := EnforceReads(app); err != nil {
			t.Fatalf("EnforceReads pass %d: %v", pass, err)
		}
		assertDeclared(t, app)
	}
}

// A fresh database gets the declared rules at creation.
func TestEnsureCreatesDeclaredRules(t *testing.T) {
	app := newApp(t)
	for _, e := range ensures {
		if err := e.ensure(app); err != nil {
			t.Fatalf("%s: %v", e.name, err)
		}
	}
	assertDeclared(t, app)
}

func TestCloseSignup(t *testing.T) {
	app := newApp(t)
	users, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		t.Fatalf("users: %v", err)
	}
	anyone := ""
	users.CreateRule = &anyone
	if err := app.SaveNoValidate(users); err != nil {
		t.Fatalf("open users: %v", err)
	}
	if err := CloseSignup(app); err != nil {
		t.Fatalf("CloseSignup: %v", err)
	}
	users, _ = app.FindCollectionByNameOrId("users")
	if users.CreateRule != nil {
		t.Fatalf("users.createRule = %q, want superuser only", *users.CreateRule)
	}
}

func assertDeclared(t *testing.T, app core.App) {
	t.Helper()
	for name, want := range reads {
		c, err := app.FindCollectionByNameOrId(name)
		if err != nil {
			t.Fatalf("%s: %v", name, err)
		}
		if !same(c.ListRule, want) || !same(c.ViewRule, want) {
			t.Errorf("%s: list/view = %s/%s, want %s", name, show(c.ListRule), show(c.ViewRule), show(want))
		}
		if c.CreateRule != nil || c.UpdateRule != nil || c.DeleteRule != nil {
			t.Errorf("%s: a mutation rule is open: create=%s update=%s delete=%s", name, show(c.CreateRule), show(c.UpdateRule), show(c.DeleteRule))
		}
	}
}

func show(r *string) string {
	if r == nil {
		return "superuser"
	}
	return "\"" + *r + "\""
}
