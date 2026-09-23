package bank

import (
	"net"
	"net/http"
	"net/netip"
	"strings"
	"sync"
	"time"
)

// throttle holds a fixed budget of attempts per key per window. An attempt is
// spent before the work it guards starts, so concurrent requests cannot all
// find budget left, and handed back when the work turns out to need no bound.
type throttle struct {
	limit  int
	window time.Duration
	keys   int // most keys held at once; past it a new key is refused
	now    func() time.Time

	mu    sync.Mutex
	spent map[string]*span
	swept time.Time
}

type span struct {
	start time.Time
	n     int
}

func newThrottle(limit int, window time.Duration) *throttle {
	return &throttle{limit: limit, window: window, keys: 1 << 17, now: time.Now, spent: map[string]*span{}}
}

// take spends one attempt for key. It returns the start of the window the
// attempt was spent in or, when none is left, how long until one is.
func (t *throttle) take(key string) (time.Time, time.Duration) {
	t.mu.Lock()
	defer t.mu.Unlock()

	now := t.now()
	if now.Sub(t.swept) >= t.window {
		for k, s := range t.spent {
			if now.Sub(s.start) >= t.window {
				delete(t.spent, k)
			}
		}
		t.swept = now
	}

	s := t.spent[key]
	switch {
	case s == nil && len(t.spent) >= t.keys:
		// A key it cannot remember is a key it cannot bound.
		return time.Time{}, t.window
	case s == nil || now.Sub(s.start) >= t.window:
		s = &span{start: now}
		t.spent[key] = s
	case s.n >= t.limit:
		return time.Time{}, s.start.Add(t.window).Sub(now)
	}
	s.n++
	return s.start, 0
}

// give hands back an attempt spent in the window that began at start.
func (t *throttle) give(key string, start time.Time) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if s := t.spent[key]; s != nil && s.start.Equal(start) && s.n > 0 {
		s.n--
	}
}

// clientAddress is the address a request is charged to.
//
// The ingress in front of bankd drops X-Forwarded-For from any peer outside
// the CDN's ranges and appends the peer it saw. So the header holds one entry
// for a client that reached the ingress directly, and at least two behind the
// CDN, where the entry before the ingress's own is the client the CDN saw;
// anything further left was written by the client and is ignored. An entry
// that is not an address falls back to the peer, never to its own text, so a
// caller cannot mint keys. IPv6 is charged per /64, the block one subscriber
// is given.
func clientAddress(r *http.Request) string {
	var hops []string
	for _, v := range r.Header.Values("X-Forwarded-For") {
		hops = append(hops, strings.Split(v, ",")...)
	}
	pick := ""
	switch n := len(hops); {
	case n >= 2:
		pick = hops[n-2]
	case n == 1:
		pick = hops[0]
	}
	addr, err := netip.ParseAddr(strings.TrimSpace(pick))
	if err != nil {
		host, _, _ := net.SplitHostPort(r.RemoteAddr)
		if addr, err = netip.ParseAddr(host); err != nil {
			return r.RemoteAddr
		}
	}
	addr = addr.Unmap().WithZone("")
	if addr.Is6() {
		p, _ := addr.Prefix(64)
		return p.String()
	}
	return addr.String()
}
