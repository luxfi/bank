package collections

import "github.com/hanzoai/base/core"

const AccountCollectionName = "accounts"

// EnsureAccountCollection creates the accounts collection if it does not exist.
// Schema mirrors the NestJS bank: owner (auth user), account holder info,
// CurrencyCloud account ID, status, and KYC state.
func EnsureAccountCollection(app core.App) error {
	if existing, err := app.FindCollectionByNameOrId(AccountCollectionName); err == nil {
		added := false
		if existing.Fields.GetByName("plan") == nil {
			existing.Fields.Add(planField())
			added = true
		}
		if existing.Fields.GetByName("chainIndex") == nil {
			existing.Fields.Add(chainIndexField())
			added = true
		}
		if idx := chainIndexUnique(); !hasIndex(existing.Indexes, idx) {
			existing.Indexes = append(existing.Indexes, idx)
			added = true
		}
		if added {
			// Not app.Save. Base refuses to update any collection whose name
			// equals its own id — checkUniqueName looks for a collection with
			// that id and does not exclude the one being saved, so it finds
			// itself and calls the name a duplicate. Every collection here is
			// built as NewBaseCollection(name, name), so every one of them is
			// creatable once and never updatable, and a running bank cannot
			// take a schema addition without failing to boot.
			//
			// Nothing here changes the name, so there is no uniqueness question
			// to answer. The fields and indexes still go through their own
			// validation on the way to the table.
			return app.SaveNoValidate(existing)
		}
		return nil
	}

	c := core.NewBaseCollection(AccountCollectionName, AccountCollectionName)

	// API rules: list/view scoped to owner in prod; public in sandbox so the
	// seeded demo records are readable. Mutations superuser only (nil).
	r := readRule(`owner = @request.auth.id`)
	c.ListRule = r
	c.ViewRule = r

	c.Fields.Add(
		// Owner — the authenticated principal id. A plain id (not a relation)
		// so it can hold either an IAM-mapped users record id or, for the
		// sandbox demo login, a _superusers record id. Ownership is enforced
		// in the custom /v1/bank routes by comparing to the request auth id.
		&core.TextField{
			Name:     "owner",
			Required: true,
		},

		// CurrencyCloud external account id.
		&core.TextField{
			Name: "ccAccountId",
		},

		// Legal entity name or individual full name.
		&core.TextField{
			Name:     "entityName",
			Required: true,
		},

		// Entity type: individual | business.
		&core.SelectField{
			Name:      "entityType",
			Values:    []string{"individual", "business"},
			Required:  true,
			MaxSelect: 1,
		},

		// ISO-3166 country code.
		&core.TextField{
			Name:     "country",
			Required: true,
			Min:      2,
			Max:      2,
		},

		// ISO 4217 base currency.
		&core.TextField{
			Name:     "currency",
			Required: true,
			Min:      3,
			Max:      3,
		},

		// Account status.
		&core.SelectField{
			Name:      "status",
			Values:    []string{"pending", "active", "suspended", "closed"},
			Required:  true,
			MaxSelect: 1,
		},

		// KYC / compliance approval state.
		&core.SelectField{
			Name:      "kycStatus",
			Values:    []string{"not_started", "pending", "approved", "rejected"},
			Required:  true,
			MaxSelect: 1,
		},

		// Risk rating assigned after compliance review.
		&core.SelectField{
			Name:      "riskRating",
			Values:    []string{"low", "medium", "high"},
			MaxSelect: 1,
		},

		planField(),
		chainIndexField(),
	)
	c.Indexes = append(c.Indexes, chainIndexUnique())
	c.Fields.Add(

		// Free-form metadata blob (e.g. CurrencyCloud extra fields).
		&core.JSONField{
			Name:    "metadata",
			MaxSize: 1 << 20, // 1 MB
		},

		&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		},
		&core.AutodateField{
			Name:     "updated",
			OnCreate: true,
			OnUpdate: true,
		},
	)

	return app.Save(c)
}

// chainIndexField is the account's place in the deploy mnemonic's derivation
// path — the one number its on-chain address and signing key come from. It is
// assigned once and never reused, so an address is reproducible from the
// mnemonic alone. Deriving it from the account id instead would mean hashing
// into a 2^31 space, where a few hundred thousand accounts is enough for two of
// them to land on one address and share a balance.
func chainIndexField() *core.NumberField {
	return &core.NumberField{Name: "chainIndex", OnlyInt: true}
}

// chainIndexUnique is what actually keeps two accounts off one key. Claiming an
// index is a read of the current maximum followed by a write, so two accounts
// opened at the same moment read the same number and both try to take it. The
// database refuses the second, and the loser reads again and takes the next —
// which is only true while this index exists. Unassigned accounts hold 0, so
// the constraint is partial.
func chainIndexUnique() string {
	return "CREATE UNIQUE INDEX `idx_accounts_chainIndex` ON `accounts` (`chainIndex`) WHERE `chainIndex` > 0"
}

func hasIndex(indexes []string, want string) bool {
	for _, got := range indexes {
		if got == want {
			return true
		}
	}
	return false
}
