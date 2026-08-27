package bank

import (
	"errors"
	"math"
	"os"
	"strconv"
	"strings"

	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// Custodian — who holds an account's on-chain assets, and who signs when they
// move.
//
// There is one answer today and it is the answer this seam exists to end: the
// bank derives every customer's private key from a single mnemonic it keeps, so
// one compromised process is every customer at once. What replaces it differs
// only in who the holder is — a regulated custodian, the customer's own Safe,
// their own MPC nodes, a card holding the key in a secure element — and not at
// all in what the ledger needs from them. That is why one interface covers all
// of it.
//
// Every method names the ACCOUNT. None takes a derivation index, and that is
// the design rather than a preference: an index means something only to whoever
// holds the mnemonic it indexes, so a signature that accepts one has already
// answered the question. Exactly one function in the bank maps an account to an
// index — chainIndex, below — and only a custodian calls it.
//
// Reading the chain is not custody and is not here. Balances, token symbols and
// receipts belong to ChainBackend, keyed by an address, and stay legible no
// matter who holds the key.
// -----------------------------------------------------------------------------

type Custodian interface {
	Name() string
	// Wallet is what this custodian holds for the account in one asset.
	Wallet(app core.App, acct *core.Record, asset string) Wallet
	// Send moves the account's own holding to a destination and returns the
	// hash once it has settled.
	Send(app core.App, acct *core.Record, asset, to string, amount Minor) (string, error)
	// Market is the account's access to an asset's collateral market: nil when
	// there is none to reach and Earn belongs on the ledger, an error when the
	// custodian cannot act for this account at all. Reporting the second as the
	// first would credit a loan on the bank's own books that was meant to be a
	// position somebody is holding collateral against.
	Market(app core.App, acct *core.Record, asset string) (Market, error)
}

// Wallet is one account's holding in one asset as its custodian sees it: where
// it receives, and the reference the custodian knows it by — the handle an
// operator quotes when a deposit goes missing.
//
// The address is the dangerous field. A custodian that cannot name one leaves it
// empty, because an invented address points a customer at coins nobody will ever
// be able to spend.
type Wallet struct {
	Address string
	Ref     string
}

// wallet is what a custodian holding the account's keys by index answers with.
// The reference is written here and nowhere else: it reaches the customer
// through GET /accounts/{id}/wallets and an operator quotes it back, so the two
// index-holding custodians cannot be allowed to drift into two shapes of it.
func wallet(asset, index, address string) Wallet {
	return Wallet{Address: address, Ref: "mpc:" + asset + ":" + index}
}

// errUnheld says nobody the bank can name holds this account's keys — either the
// configured custodian is not one this build implements, or the account never
// claimed the identity the bank's own custody needs. Both ends are the same
// thing: no authority to move anything with, and refusing is the only answer
// that does not move money on a guess.
var errUnheld = errors.New("no custodian holds this account")

// custodian resolves who holds an account's on-chain assets.
//
// The sandbox stands in when no chain is configured at all: there is nothing to
// be custodian of. The predicate is the chain and not BANK_SANDBOX on purpose —
// a sandbox pointed at a real chain signs with real keys, and that is the demo
// everyone runs.
//
// BANK_CUSTODY names the holder. One name answers today and it is the bank's
// own. A name nobody implements gets nothing, because the alternative is a
// deployment that asked for the customer's Safe and quietly got the bank's key.
func custodian() Custodian {
	if !ChainConfigured() {
		return simCustodian{}
	}
	switch strings.ToLower(strings.TrimSpace(os.Getenv("BANK_CUSTODY"))) {
	case "", "bank":
		return deriving{}
	default:
		return unheld{}
	}
}

// chainIndex is the account's place in the deploy mnemonic's derivation path,
// claimed on first use and stored so the account's address never moves. Index 0
// belongs to the bank's own treasury, which is why accounts start at 1.
//
// It lives with the custodians because it is not a fact about the account. It is
// a fact about who holds the account's keys, and it goes when they do.
func chainIndex(app core.App, acct *core.Record) string {
	if n := int64(math.Round(acct.GetFloat("chainIndex"))); n > 0 {
		return strconv.FormatInt(n, 10)
	}
	// Claiming an index is a read of the current maximum and then a write, so
	// two accounts opened at the same moment both read the same number. The
	// unique index on chainIndex is what settles it: one save wins, the other
	// is refused and comes back here to take the next number. Without the
	// retry a loser would keep the index it lost, and two customers would sign
	// from one key, at one address, over one balance.
	for attempt := 0; attempt < 16; attempt++ {
		next := int64(1)
		if taken, _ := app.FindRecordsByFilter(collections.AccountCollectionName,
			"chainIndex > 0", "-chainIndex", 1, 0, nil); len(taken) > 0 {
			next = int64(math.Round(taken[0].GetFloat("chainIndex"))) + 1
		}
		acct.Set("chainIndex", next)
		if err := app.Save(acct); err == nil {
			return strconv.FormatInt(next, 10)
		}
	}
	// Every attempt lost the race. Returning no index refuses the operation,
	// which is the safe end: a wrong index would be a wrong key.
	acct.Set("chainIndex", 0)
	return ""
}

// -----------------------------------------------------------------------------
// deriving — the bank as custodian: one mnemonic, and every customer's key one
// hardened step off it at the index their account claimed.
//
// It is written down as an implementation rather than left as the shape of the
// code so that retiring it is a deletion, and so that a reader can see in one
// place what the bank currently is. The treasury is not here: that is the bank's
// own money, signed with the bank's own key, and it stays that way whoever comes
// to hold the customers'.
// -----------------------------------------------------------------------------

type deriving struct{}

func (deriving) Name() string { return "bank" }

// Wallet: one chain, one address. Every asset the account holds arrives at the
// same place, so the asset only names the row — it will mean more to a custodian
// holding BTC on Bitcoin. The identity is claimed before the chain is consulted,
// so an account opened during an outage keeps the number it was given, and both
// custodians hand identities out in the same order.
func (deriving) Wallet(app core.App, acct *core.Record, asset string) Wallet {
	i := chainIndex(app, acct)
	if i == "" {
		return Wallet{}
	}
	c := evm()
	if c == nil {
		return Wallet{}
	}
	return wallet(asset, i, c.address(i))
}

func (deriving) Send(app core.App, acct *core.Record, asset, to string, amount Minor) (string, error) {
	c := evm()
	if c == nil {
		return "", errChainDown
	}
	return c.send(chainIndex(app, acct), asset, to, amount)
}

// Market asks the chain what it lends against before asking the account for an
// identity, so a vault the chain carries no market for costs the account
// nothing — it falls to the ledger, which is where it was always going.
//
// A chain that cannot be reached is the other empty answer and not the same
// one. Bank custody is only chosen when a chain is configured, so nothing to
// ask means an outage, and answering "no market" would hand the movement to the
// ledger: a borrow credited against collateral no chain is holding, sized
// against a position the chain overwrites as soon as it returns. Send refuses
// over an outage and so does this.
func (deriving) Market(app core.App, acct *core.Record, asset string) (Market, error) {
	c := evm()
	if c == nil {
		return nil, errChainDown
	}
	if !c.lends(asset) {
		return nil, nil
	}
	i := chainIndex(app, acct)
	if i == "" {
		return nil, errUnheld
	}
	return c.market(asset, i), nil
}

// -----------------------------------------------------------------------------
// simCustodian — the stand-in for a holder when there is no chain to hold
// anything on. Deterministic display addresses, a hash nothing broadcast, and no
// market. Safe only because it is reachable only with nothing configured at all.
// -----------------------------------------------------------------------------

type simCustodian struct{}

func (simCustodian) Name() string { return "sandbox" }

func (simCustodian) Wallet(app core.App, acct *core.Record, asset string) Wallet {
	i := chainIndex(app, acct)
	if i == "" {
		return Wallet{}
	}
	return wallet(asset, i, simAddress(i, asset))
}

func (simCustodian) Send(_ core.App, _ *core.Record, asset, _ string, _ Minor) (string, error) {
	return txHashFor(asset), nil
}

func (simCustodian) Market(core.App, *core.Record, string) (Market, error) { return nil, nil }

// -----------------------------------------------------------------------------
// unheld — a custodian the bank was told to use and does not implement. It acts
// for nobody, and every operation says so.
// -----------------------------------------------------------------------------

type unheld struct{}

func (unheld) Name() string                                 { return "none" }
func (unheld) Wallet(core.App, *core.Record, string) Wallet { return Wallet{} }

func (unheld) Send(core.App, *core.Record, string, string, Minor) (string, error) {
	return "", errUnheld
}

func (unheld) Market(core.App, *core.Record, string) (Market, error) { return nil, errUnheld }
