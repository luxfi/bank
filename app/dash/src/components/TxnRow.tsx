import type { Txn } from '@/api/client'
import { Icon, Money, center, font, stack, truncate } from '@/components/ui'
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
    <View className="row" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 12, paddingInline: 16, paddingBlock: 14 }}>
      <span
        style={{
          ...center,
          width: 36,
          height: 36,
          borderRadius: 9999,
          border: '1px solid var(--color-border)',
          ...(credit && !into
            ? { color: 'var(--color-positive)', background: 'rgba(52,211,153,0.08)' }
            : { background: 'var(--color-surface-2)', color: 'var(--color-fg-muted)' }),
        }}
      >
        <Icon name={icon} size={16} />
      </span>
      <View style={{ ...stack(), minWidth: 0 }}>
        <p style={{ ...font(14, 500), ...truncate }}>{title}</p>
        {/* One line, always: the kind and the age of a movement should not
            reflow the row it describes. */}
        <p style={{ ...font(12), color: 'var(--color-fg-subtle)', ...truncate }}>
          {capitalize(into ? 'conversion' : txn.type)} · {relativeTime(txn.created)}
        </p>
      </View>
      <View style={{ ...stack(), textAlign: 'right' }}>
        {/* Two amounts on one line need the room; on a narrow screen they give
            some back so the reference beside them stays readable. */}
        <p className={into ? 'pair' : undefined} style={{ fontWeight: 500, whiteSpace: 'nowrap', ...(into ? null : font(14)) }}>
          <Money minor={txn.amount} currency={txn.currency} decimals={txn.decimals} sign={credit ? 'credit' : 'debit'} />
          {into && (
            <>
              <span style={{ marginInline: 4, color: 'var(--color-fg-subtle)' }}>→</span>
              <Money minor={into.amount} currency={into.currency} decimals={into.decimals} sign="credit" />
            </>
          )}
        </p>
        {txn.status !== 'completed' && (
          <p style={{ fontSize: 10.88, color: 'var(--color-fg-subtle)', textTransform: 'capitalize' }}>{txn.status}</p>
        )}
      </View>
    </View>
  )
}
