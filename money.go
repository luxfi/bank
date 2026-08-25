package bank

import (
	"math"

	"github.com/hanzoai/base/core"
)

// The ledger counts two different things, and any sum that mixes them is wrong.
//
//	Cents — US dollars in hundredths. Every *Usd field, and all fiat.
//	Minor — one asset's smallest unit at the ledger's resolution, which is not
//	        the token's resolution on chain; see evmChain.scale for that gap.
//
// Both are whole counts of a smallest unit, so both were int64 and the compiler
// was content to add them. It did: a vault position worth +$340 rendered as
// -$5,600, because a debt counted in the collateral's own units was subtracted
// from a total counted in cents. Naming them ends that at compile time. The
// only way across is usd, and usd needs a price.
type (
	Cents int64
	Minor int64
)

// money reads a whole-unit amount off a record.
//
// Base keeps every number as a float, so a read has to round rather than
// truncate: a cent that arrives as 0.9999999999 is one cent, and int64 of it is
// nothing. That rounding was spelled out at thirty call sites, which is thirty
// chances to leave it out — and one of them had.
func money[T ~int64](rec *core.Record, field string) T {
	return T(math.Round(rec.GetFloat(field)))
}

// round turns a computed float into whole units the same way, for the places
// that price or scale an amount rather than read one.
func round[T ~int64](v float64) T { return T(math.Round(v)) }
