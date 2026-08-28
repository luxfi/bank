package bank

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// Prices from the DEX.
//
// A price on an order book is one somebody would trade at. A constant in a table
// is one somebody typed, and it stays wrong quietly — every limit, every AML
// threshold and every screen carries the error until a person notices. So the
// bank asks the venue.
//
// It asks for all of them at once: dex_get_markets carries every market's best
// bid and ask in one body, so pricing fourteen assets is one request rather than
// fourteen. Marks are held for a moment because a price is read on the path of
// every transaction — the limit gate normalizes to USD before it can decide —
// and a fresh round trip per debit would put the venue in the way of the ledger.
//
// A market with no book has no price, and this says so rather than inventing
// one. The bank already refuses what it cannot value; those refusals are the
// same ones a currency outside the tables always got.
// -----------------------------------------------------------------------------

// dexPrices reads marks from a DEX venue's read surface.
type dexPrices struct {
	base string
	http *http.Client
	hold time.Duration

	mu     sync.Mutex
	marks  map[string]float64
	read   time.Time
	failed bool
}

// DexEndpoint names the venue the bank prices from, or "" when none is
// configured. It is read here and nowhere else.
func DexEndpoint() string { return strings.TrimRight(strings.TrimSpace(os.Getenv("DEX_URL")), "/") }

// newDexPrices builds the source. hold is how long a mark stands before it is
// asked for again.
func newDexPrices(base string, hold time.Duration) *dexPrices {
	return &dexPrices{
		base:  base,
		http:  &http.Client{Timeout: 5 * time.Second},
		hold:  hold,
		marks: map[string]float64{},
	}
}

// UnitUSD is the USD value of one whole unit of cur.
//
// The dollar is the unit everything is quoted in, so it is worth one of itself —
// there is no USD/USD market and asking the venue for one would be asking it to
// price the ruler.
func (d *dexPrices) UnitUSD(cur string) (float64, bool) {
	cur = strings.ToUpper(strings.TrimSpace(cur))
	if cur == "USD" {
		return 1, true
	}
	marks, err := d.current()
	if err != nil {
		return 0, false
	}
	p, ok := marks[cur]
	return p, ok && p > 0
}

// current returns the marks, refreshing them when they have stood longer than
// the hold. A refresh that fails leaves the last marks in place and says so on
// the next read: a venue that blinks should not un-price the whole bank, and a
// venue that stays down should not be answered for indefinitely — so a failure
// keeps the marks only until they are older than twice the hold.
func (d *dexPrices) current() (map[string]float64, error) {
	d.mu.Lock()
	defer d.mu.Unlock()

	fresh := time.Since(d.read) < d.hold
	if fresh && len(d.marks) > 0 {
		return d.marks, nil
	}

	marks, err := d.fetch()
	if err != nil {
		d.failed = true
		if len(d.marks) > 0 && time.Since(d.read) < 2*d.hold {
			return d.marks, nil
		}
		return nil, err
	}
	d.marks, d.read, d.failed = marks, time.Now(), false
	return d.marks, nil
}

// fetch asks the venue for every market and reduces each to one mark.
func (d *dexPrices) fetch() (map[string]float64, error) {
	if d.base == "" {
		return nil, errors.New("no DEX configured")
	}
	res, err := d.http.Get(d.base + "/v1/dex/dex_get_markets")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode >= 400 {
		return nil, errors.New("dex returned " + res.Status)
	}
	var body struct {
		Markets []struct {
			Symbol  string  `json:"symbol"`
			BestBid float64 `json:"bestBid"`
			BestAsk float64 `json:"bestAsk"`
		} `json:"markets"`
	}
	if err := json.NewDecoder(io.LimitReader(res.Body, 4<<20)).Decode(&body); err != nil {
		return nil, err
	}

	out := make(map[string]float64, len(body.Markets))
	for _, m := range body.Markets {
		base, quote, ok := splitPair(m.Symbol)
		if !ok || quote != "USD" {
			// Only a market quoted in dollars says what a unit is worth in
			// them. A cross would have to be walked through a third market,
			// and a mark derived from two thin books is worse than none.
			continue
		}
		if mark, ok := mid(m.BestBid, m.BestAsk); ok {
			out[base] = mark
		}
	}
	return out, nil
}

// mid is the mark a book yields: the midpoint when both sides are quoted, and
// the one side when only one is. A book with neither has no price — an empty
// market is not worth zero, it is worth nothing anybody has said.
func mid(bid, ask float64) (float64, bool) {
	switch {
	case bid > 0 && ask > 0:
		return (bid + ask) / 2, true
	case bid > 0:
		return bid, true
	case ask > 0:
		return ask, true
	}
	return 0, false
}

// splitPair reads "LUX-USD" as its base and quote. The venue writes a market's
// symbol this way; anything else is a market this bank does not recognise.
func splitPair(symbol string) (base, quote string, ok bool) {
	parts := strings.Split(strings.ToUpper(strings.TrimSpace(symbol)), "-")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return "", "", false
	}
	return parts[0], parts[1], true
}

// PriceFromDex points the bank's one price source at the venue DEX_URL names.
// Without one the reference tables stand, which is what every deployment used
// before the venue existed.
func PriceFromDex() {
	if base := DexEndpoint(); base != "" {
		collections.Source = newDexPrices(base, 10*time.Second)
	}
}
