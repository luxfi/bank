package collections

// readRule returns the owner-scoped list/view rule for a collection. Records
// carrying customer PII are never world-readable, in any mode — even the
// sandbox demo data (seeded DOB / address) stays behind the owner rule. The
// demo dashboard reads through the authenticated /v1/bank routes, so nothing
// depends on anonymous collection reads.
func readRule(ownerScoped string) *string {
	s := ownerScoped
	return &s
}
