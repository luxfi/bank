import { useEffect, useMemo, useState } from 'react'
import { listTransactions, type Txn } from '@/api/client'
import { TxnRow } from '@/components/TxnRow'
import { EmptyState, Skeleton } from '@/components/ui'
import { formatDateShort } from '@/lib/format'

const FILTERS = [
  ['all', 'All'],
  ['credit', 'In'],
  ['debit', 'Out'],
] as const

export function Activity() {
  const [txns, setTxns] = useState<Txn[] | null>(null)
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all')

  useEffect(() => {
    listTransactions().then(setTxns).catch(() => setTxns([]))
  }, [])

  const groups = useMemo(() => {
    if (!txns) return []
    const filtered = filter === 'all' ? txns : txns.filter((t) => t.direction === filter)
    const byDay = new Map<string, Txn[]>()
    for (const t of filtered) {
      const day = formatDateShort(t.created)
      const arr = byDay.get(day) ?? []
      arr.push(t)
      byDay.set(day, arr)
    }
    return Array.from(byDay.entries())
  }, [txns, filter])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Every movement across your account.</p>
      </div>

      <div className="inline-flex gap-1 p-1 rounded-full bg-[var(--color-surface-2)] border">
        {FILTERS.map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === v ? 'bg-[var(--color-fg)] text-black' : 'text-[var(--color-fg-muted)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {txns === null ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : groups.length === 0 ? (
        filter === 'all' ? (
          <EmptyState icon="activity" title="Nothing here yet" body="Your transactions will appear here as you move money." />
        ) : (
          <EmptyState
            icon="activity"
            title={filter === 'credit' ? 'Nothing came in' : 'Nothing went out'}
            body="Every transaction on this account is under All."
            action={<button onClick={() => setFilter('all')} className="btn btn-secondary">Show all</button>}
          />
        )
      ) : (
        <div className="space-y-5">
          {groups.map(([day, items]) => (
            <div key={day}>
              <p className="text-xs font-medium text-[var(--color-fg-subtle)] mb-2 px-1">{day}</p>
              <div className="card divide-y divide-[color:var(--color-border)]">
                {items.map((t) => <TxnRow key={t.id} txn={t} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
