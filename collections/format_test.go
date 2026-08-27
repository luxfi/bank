package collections

import "testing"

// An amount is stored in minor units everywhere, so rendering it is where the
// unit has to be undone. Getting it wrong is not a rounding difference — it is
// a factor of a hundred, or of a million for crypto, on a number a customer
// reads as their own money.
func TestFormatUndoesTheMinorUnit(t *testing.T) {
	for _, tc := range []struct {
		minor int64
		cur   string
		want  string
	}{
		// Fiat: two places.
		{25000, "USD", "250.00"},
		{1, "USD", "0.01"},
		{0, "USD", "0.00"},
		{100, "EUR", "1.00"},
		{123456789, "GBP", "1234567.89"},

		// Yen has no minor unit, so it must not grow a decimal point.
		{25000, "JPY", "25000"},
		{0, "JPY", "0"},

		// Crypto: six places, and a whole unit is a million of them.
		{1000000, "BTC", "1.000000"},
		{1, "BTC", "0.000001"},
		{12500000, "LUX", "12.500000"},

		// The currency is read case-insensitively, like everywhere else.
		{25000, "usd", "250.00"},
		{1000000, "btc", "1.000000"},

		// An unknown currency falls to two places rather than refusing —
		// a notification is not the place to discover an unsupported code.
		{25000, "ZZZ", "250.00"},
	} {
		if got := Format(tc.minor, tc.cur); got != tc.want {
			t.Errorf("Format(%d, %q) = %q, want %q", tc.minor, tc.cur, got, tc.want)
		}
	}
}

// A negative amount is a refund or a reversal, and its sign is the whole
// meaning. Integer division truncates toward zero, so both halves of the number
// come back negative and a naive join prints -0.50 as 0.50 — a loss read as a
// gain.
func TestFormatKeepsTheSignOfALoss(t *testing.T) {
	for _, tc := range []struct {
		minor int64
		cur   string
		want  string
	}{
		{-25000, "USD", "-250.00"},
		{-50, "USD", "-0.50"},
		{-1, "USD", "-0.01"},
		{-1, "BTC", "-0.000001"},
		{-25000, "JPY", "-25000"},
		{-100, "USD", "-1.00"},
	} {
		if got := Format(tc.minor, tc.cur); got != tc.want {
			t.Errorf("Format(%d, %q) = %q, want %q", tc.minor, tc.cur, got, tc.want)
		}
	}
}

// The extremes hold too: the arithmetic is integer, so nothing here is a float
// wide enough to lose a cent in.
func TestFormatHoldsAtTheEdges(t *testing.T) {
	for _, tc := range []struct {
		minor int64
		cur   string
		want  string
	}{
		{9223372036854775807, "USD", "92233720368547758.07"},
		{-9223372036854775808, "USD", "-92233720368547758.08"},
		{9223372036854775807, "JPY", "9223372036854775807"},
	} {
		if got := Format(tc.minor, tc.cur); got != tc.want {
			t.Errorf("Format(%d, %q) = %q, want %q", tc.minor, tc.cur, got, tc.want)
		}
	}
}
