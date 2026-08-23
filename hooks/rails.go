package hooks

// Payment rails and their flat fees.
// IOM MTL covers EU e-money (SEPA), UK (FPS), and international (SWIFT).
// All rails route through the forex service which has CurrencyCloud, LMAX, Circle.

// PaymentRail identifies the payment network to use.
type PaymentRail string

const (
	RailSEPA     PaymentRail = "sepa"      // EUR, EU/EEA — IOM MTL
	RailSEPAInst PaymentRail = "sepa_inst" // EUR instant — IOM MTL
	RailFPS      PaymentRail = "fps"       // GBP, UK — IOM MTL
	RailACH      PaymentRail = "ach"       // USD, US domestic
	RailWire     PaymentRail = "wire"      // USD, international (SWIFT)
	RailSWIFT    PaymentRail = "swift"     // Any currency, international
	RailInterac  PaymentRail = "interac"   // CAD, Canada
	RailInternal PaymentRail = "internal"  // Same-platform transfer
)

// RailFee returns the flat fee in minor units for a given rail.
func RailFee(rail PaymentRail) int64 {
	switch rail {
	case RailSEPA:
		return 500 // €5.00
	case RailSEPAInst:
		return 1000 // €10.00
	case RailFPS:
		return 0 // free
	case RailACH:
		return 0 // free
	case RailWire:
		return 2500 // $25.00
	case RailSWIFT:
		return 3500 // $35.00
	case RailInterac:
		return 150 // C$1.50
	case RailInternal:
		return 0
	default:
		return 2500
	}
}
