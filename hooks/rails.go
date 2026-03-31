package hooks

// Payment rail detection based on currency + jurisdiction.
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

// EUR-zone countries (SEPA participants).
var sepaCountries = map[string]bool{
	"AT": true, "BE": true, "BG": true, "HR": true, "CY": true,
	"CZ": true, "DK": true, "EE": true, "FI": true, "FR": true,
	"DE": true, "GR": true, "HU": true, "IS": true, "IE": true,
	"IT": true, "LV": true, "LI": true, "LT": true, "LU": true,
	"MT": true, "MC": true, "NL": true, "NO": true, "PL": true,
	"PT": true, "RO": true, "SM": true, "SK": true, "SI": true,
	"ES": true, "SE": true, "CH": true, "GB": true, "IM": true, // IOM included
}

// DetectRail determines the appropriate payment rail for a transaction.
func DetectRail(currency, senderCountry, recipientCountry string) PaymentRail {
	// Internal transfers (same platform) are handled separately.

	switch currency {
	case "EUR":
		if sepaCountries[senderCountry] && sepaCountries[recipientCountry] {
			return RailSEPA
		}
		return RailSWIFT

	case "GBP":
		if (senderCountry == "GB" || senderCountry == "IM") &&
			(recipientCountry == "GB" || recipientCountry == "IM") {
			return RailFPS
		}
		return RailSWIFT

	case "USD":
		if senderCountry == "US" && recipientCountry == "US" {
			return RailACH
		}
		return RailWire

	case "CAD":
		if senderCountry == "CA" && recipientCountry == "CA" {
			return RailInterac
		}
		return RailSWIFT

	default:
		return RailSWIFT
	}
}

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
