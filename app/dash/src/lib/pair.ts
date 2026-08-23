import type { Txn } from '@/api/client'

// A conversion is one movement the ledger records as two legs: the debit that
// leaves one currency and the credit that arrives in another. They carry the
// same reference and land in the same instant, so the pair is recoverable —
// and a customer who converted once should read one line, not two.
//
// Everything else passes through untouched. Nothing is dropped: the credit leg
// is carried on the entry as `into`, so both halves stay on screen.

export interface Entry {
  key: string
  txn: Txn
  into?: Txn
}

const INSTANT = 5_000 // ms — both legs are written by the same request

export function pair(txns: Txn[]): Entry[] {
  const entries: Entry[] = []
  const taken = new Set<string>()
  for (const t of txns) {
    if (taken.has(t.id)) continue
    taken.add(t.id)
    const mate = txns.find(
      (o) =>
        !taken.has(o.id) &&
        o.reference === t.reference &&
        o.direction !== t.direction &&
        (o.type === 'conversion' || t.type === 'conversion') &&
        Math.abs(Date.parse(o.created) - Date.parse(t.created)) < INSTANT,
    )
    if (!mate) {
      entries.push({ key: t.id, txn: t })
      continue
    }
    taken.add(mate.id)
    const [out, into] = t.direction === 'debit' ? [t, mate] : [mate, t]
    entries.push({ key: out.id, txn: out, into })
  }
  return entries
}
