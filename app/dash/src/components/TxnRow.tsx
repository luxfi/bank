import type { Txn } from '@/api/client'
import { Icon, Money, center, stack } from '@/components/ui'
import { relativeTime, capitalize } from '@/lib/format'
import { View } from '@/gui'

const typeIcon: Record<string, string> = {
  deposit: 'arrowDown',
  payment: 'arrowUp',
  withdrawal: 'arrowUp',
  conversion: 'swap',
  fee: 'activity',
}

// `into` is the arriving half of a conversion. When it is there the row shows
// the whole movement — what left and what landed — because that is what
// happened: one trade, not a debit next to an unrelated credit.
export function TxnRow({ txn, into }: { txn: Txn; into?: Txn }) {
  const credit = txn.direction === 'credit'
  const icon = into ? 'swap' : typeIcon[txn.type] || (credit ? 'arrowDown' : 'arrowUp')
  const title = txn.reference || capitalize(txn.type)
  return (
    <View className="row px-4 py-3.5" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 12 }}>
      <span className={`w-9 h-9 rounded-full border ${credit && !into ? 'text-[var(--color-positive)] bg-[color:rgba(52,211,153,0.08)]' : 'bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]'}`} style={center}>
        <Icon name={icon} className="w-4 h-4" />
      </span>
      <View className="min-w-0" style={stack()}>
        <p className="text-sm font-medium truncate">{title}</p>
        {/* One line, always: the kind and the age of a movement should not
            reflow the row it describes. */}
        <p className="text-xs text-[var(--color-fg-subtle)] truncate">
          {capitalize(into ? 'conversion' : txn.type)} · {relativeTime(txn.created)}
        </p>
      </View>
      <View className="text-right" style={stack()}>
        {/* Two amounts on one line need the room; on a narrow screen they give
            some back so the reference beside them stays readable. */}
        <p className={`font-medium whitespace-nowrap ${into ? 'text-[0.8rem] sm:text-sm' : 'text-sm'}`}>
          <Money minor={txn.amount} currency={txn.currency} decimals={txn.decimals} sign={credit ? 'credit' : 'debit'} />
          {into && (
            <>
              <span className="mx-1 text-[var(--color-fg-subtle)]">→</span>
              <Money minor={into.amount} currency={into.currency} decimals={into.decimals} sign="credit" />
            </>
          )}
        </p>
        {txn.status !== 'completed' && (
          <p className="text-[0.68rem] text-[var(--color-fg-subtle)] capitalize">{txn.status}</p>
        )}
      </View>
    </View>
  )
}
