import type { Txn } from '@/api/client'
import { Icon, Money } from '@/components/ui'
import { relativeTime, capitalize } from '@/lib/format'

const typeIcon: Record<string, string> = {
  deposit: 'arrowDown',
  payment: 'arrowUp',
  withdrawal: 'arrowUp',
  conversion: 'swap',
  fee: 'activity',
}

export function TxnRow({ txn }: { txn: Txn }) {
  const credit = txn.direction === 'credit'
  const icon = typeIcon[txn.type] || (credit ? 'arrowDown' : 'arrowUp')
  const title = txn.reference || capitalize(txn.type)
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className={`w-9 h-9 rounded-full grid place-items-center border ${credit ? 'text-[var(--color-positive)] bg-[color:rgba(52,211,153,0.08)]' : 'bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]'}`}>
        <Icon name={icon} className="w-4 h-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-[var(--color-fg-subtle)]">
          {capitalize(txn.type)} · {relativeTime(txn.created)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <Money minor={txn.amount} currency={txn.currency} decimals={txn.decimals} sign={credit ? 'credit' : 'debit'} className="text-sm font-medium" />
        {txn.status !== 'completed' && (
          <p className="text-[0.68rem] text-[var(--color-fg-subtle)] capitalize">{txn.status}</p>
        )}
      </div>
    </div>
  )
}
