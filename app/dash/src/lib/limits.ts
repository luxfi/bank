import type { Txn } from '@/api/client'

// Spend ceilings by entity tier, mirroring bankd's account hooks. A card cannot
// spend past what the account it draws on is allowed to move.
const TIER: Record<string, { daily: number; monthly: number }> = {
  individual: { daily: 5_000_000, monthly: 50_000_000 },
  business: { daily: 50_000_000, monthly: 500_000_000 },
}

export const limitOf = (entityType: string) => TIER[entityType] ?? TIER.individual

// What the account has spent this calendar month in one currency — every debit
// that actually left (card, payment, conversion, withdrawal alike), so pending
// and failed attempts do not count. This mirrors bankd's account limit, which
// sums all debits regardless of type.
export function spent(txns: Txn[], currency: string): number {
  const month = new Date()
  month.setDate(1)
  month.setHours(0, 0, 0, 0)
  return txns
    .filter(
      (t) =>
        t.direction === 'debit' &&
        t.currency === currency &&
        t.status !== 'failed' &&
        t.status !== 'cancelled' &&
        Date.parse(t.created) >= month.getTime(),
    )
    .reduce((sum, t) => sum + t.amount, 0)
}
