package bank

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/hanzoai/base/tests"
	"github.com/luxfi/bank/collections"
)

// venue stands in for a DEX read surface serving the markets given. It is not a
// stand-in for the DEX — TestTheRealVenuePricesWhatItHasBooksFor runs against a
// real dexd — it is how the shapes a venue can return are enumerated: an empty
// book, one-sided quotes, a cross, a market this bank does not carry.
func venue(t *testing.T, markets []map[string]any) *dexPrices {
	t.Helper()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v1/dex/dex_get_markets" {
			http.NotFound(w, r)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"markets": markets})
	}))
	t.Cleanup(srv.Close)
	return newDexPrices(srv.URL, 10*time.Second)
}

// What a book yields as a mark, and what it does not. A market with nothing
// quoted has no price — it is not worth zero, it is worth nothing anybody has
// said — and the bank already refuses what it cannot value.
func TestAMarkComesFromTheBookOrNotAtAll(t *testing.T) {
	d := venue(t, []map[string]any{
		{"symbol": "LUX-USD", "bestBid": 12.0, "bestAsk": 13.0},
		{"symbol": "BTC-USD", "bestBid": 64000.0, "bestAsk": 0.0},
		{"symbol": "ETH-USD", "bestBid": 0.0, "bestAsk": 3400.0},
		{"symbol": "DAI-USD", "bestBid": 0.0, "bestAsk": 0.0},
		{"symbol": "EUR-GBP", "bestBid": 0.85, "bestAsk": 0.87},
		{"symbol": "nonsense", "bestBid": 1.0, "bestAsk": 2.0},
	})

	for cur, want := range map[string]float64{
		"LUX": 12.5,    // both sides quoted: the midpoint
		"BTC": 64000.0, // one side: that side
		"ETH": 3400.0,
	} {
		got, ok := d.UnitUSD(cur)
		if !ok || got != want {
			t.Errorf("%s marks at %v (priced=%v), want %v", cur, got, ok, want)
		}
	}

	// A dollar is worth one of itself. Asking the venue to price the ruler
	// would need a USD/USD market, and there is not one.
	if got, ok := d.UnitUSD("USD"); !ok || got != 1 {
		t.Errorf("USD marks at %v (priced=%v), want 1", got, ok)
	}

	for _, cur := range []string{
		"DAI",      // a market with an empty book
		"EUR",      // quoted only against GBP: a cross is not a dollar price
		"nonsense", // not a pair at all
		"ZZZ",      // no market
	} {
		if got, ok := d.UnitUSD(cur); ok {
			t.Errorf("%s was priced at %v from a book that says nothing", cur, got)
		}
	}
}

// A venue that blinks must not un-price the whole bank — every limit check
// reads a price, so an unreachable venue would refuse every transaction. The
// last marks stand for a moment. A venue that stays down is a different thing,
// and then the bank does refuse, because a stale mark is a wrong one.
func TestAVenueThatBlinksDoesNotUnpriceTheBank(t *testing.T) {
	var up bool
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !up {
			http.Error(w, "down", http.StatusBadGateway)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"markets": []map[string]any{
			{"symbol": "LUX-USD", "bestBid": 12.0, "bestAsk": 13.0},
		}})
	}))
	defer srv.Close()

	const hold = time.Minute
	d := newDexPrices(srv.URL, hold)

	up = false
	if _, ok := d.UnitUSD("LUX"); ok {
		t.Error("a venue that has never answered priced something")
	}

	up = true
	if _, ok := d.UnitUSD("LUX"); !ok {
		t.Fatal("a venue that is up did not price its own market")
	}

	// It blinks. Age the mark past its hold so the next read is a real
	// attempt rather than the cache — the clock is moved rather than waited
	// on, so what is being tested is the rule and not the timing.
	up = false
	d.mu.Lock()
	d.read = time.Now().Add(-hold - time.Second)
	d.mu.Unlock()
	if _, ok := d.UnitUSD("LUX"); !ok {
		t.Error("one failed read un-priced a market the venue had already marked")
	}

	// It stays down. A stale mark is a wrong one, so past twice the hold the
	// bank would rather not price it — which is a refusal it already knows how
	// to make.
	d.mu.Lock()
	d.read = time.Now().Add(-2*hold - time.Second)
	d.mu.Unlock()
	if _, ok := d.UnitUSD("LUX"); ok {
		t.Error("a venue that has been down for twice the hold is still being answered for")
	}
}

// Against a real dexd. The venue is the one this repo runs — DEX_URL points at
// it — and what it can price is whatever markets are open on it. A venue with
// no markets prices nothing, which is the honest answer and the one the bank
// refuses on.
func TestTheRealVenuePricesWhatItHasBooksFor(t *testing.T) {
	base := os.Getenv("DEX_URL")
	if base == "" {
		t.Skip("DEX_URL unset — no venue to ask")
	}
	d := newDexPrices(base, time.Second)

	// The dollar needs no market.
	if got, ok := d.UnitUSD("USD"); !ok || got != 1 {
		t.Errorf("USD marks at %v (priced=%v)", got, ok)
	}

	marks, err := d.current()
	if err != nil {
		t.Fatalf("the venue at %s did not answer: %v", base, err)
	}
	t.Logf("the venue prices %d asset(s) against the dollar", len(marks))
	for cur, mark := range marks {
		if mark <= 0 {
			t.Errorf("%s marks at %v", cur, mark)
		}
		if _, ok := d.UnitUSD(cur); !ok {
			t.Errorf("%s is in the marks and UnitUSD will not price it", cur)
		}
	}
}

// oneAsset prices LUX and nothing else, at a value no reference table carries,
// so any price a route reports must have come from here.
type oneAsset struct{}

func (oneAsset) UnitUSD(cur string) (float64, bool) {
	if cur == "LUX" {
		return 1.25, true
	}
	return 0, false
}

// The prices route reports what Source gives, not what the tables hold.
//
// It read collections.CryptoUSD directly, so with a venue configured the route
// reported the reference constants while conversions used the venue's marks.
// It also reported the whole catalogue, so an asset Source cannot price was
// reported at the table's constant; reporting 0 instead would render as a free
// asset, so such an asset is omitted.
func TestTheScreensQuoteTheSourceTheLedgerCharges(t *testing.T) {
	app := newBankApp(t)
	_, token := seedPrincipal(t, app)

	was := collections.Source
	collections.Source = oneAsset{}
	t.Cleanup(func() { collections.Source = was })

	run(t, app, tests.ApiScenario{
		Name:            "prices come from the source, and only what it prices",
		Method:          http.MethodGet,
		URL:             "/v1/bank/crypto/prices",
		Headers:         map[string]string{"Authorization": token},
		ExpectedStatus:  200,
		ExpectedContent: []string{`"asset":"LUX"`, `"usd":1.25`},
		// The table's LUX, and every asset this source cannot price. Omission
		// is the honest answer: the bank has no price for them.
		NotExpectedContent: []string{`12.5`, `"BTC"`, `"ETH"`, `"DAI"`},
	})
}
