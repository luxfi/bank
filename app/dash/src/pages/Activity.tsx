import { useEffect, useMemo, useState } from 'react'
import { listTransactions, type Txn } from '@/api/client'
import { TxnRow } from '@/components/TxnRow'
import { EmptyState, PageHeader, Skeleton } from '@/components/ui'
import { formatDateShort } from '@/lib/format'
import { pair, type Entry } from '@/lib/pair'
import { View } from '@/gui'

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

  // Filter first, then pair: asking for money out should show the leg that
  // left, on its own, rather than smuggling the arriving half back in.
  const groups = useMemo(() => {
    if (!txns) return []
    const filtered = filter === 'all' ? txns : txns.filter((t) => t.direction === filter)
    const byDay = new Map<string, Entry[]>()
    for (const e of pair(filtered)) {
      const day = formatDateShort(e.txn.created)
      const arr = byDay.get(day) ?? []
      arr.push(e)
      byDay.set(day, arr)
    }
    return Array.from(byDay.entries())
  }, [txns, filter])

  return (
    <View className="gap-6 md:gap-8" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)' }}>
      <PageHeader title="Activity" subtitle="Every movement across your account." />

      <View
        className="p-1 rounded-full bg-[var(--color-surface-2)] border"
        style={{ display: 'grid', gridAutoFlow: 'column', gap: 4, justifySelf: 'start' }}
      >
        {FILTERS.map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            aria-pressed={filter === v}
            className={`nav-link px-4 py-1.5 rounded-full text-sm font-medium ${
              filter === v
                ? 'bg-[var(--color-fg)] text-[var(--color-bg)]'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
            }`}
          >
            {label}
          </button>
        ))}
      </View>

      {txns === null ? (
        <View style={{ display: 'grid', gap: 8 }}>{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</View>
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
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 20 }}>
          {groups.map(([day, items]) => (
            <View key={day} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8 }}>
              <p className="text-xs font-medium text-[var(--color-fg-subtle)] px-1">{day}</p>
              <View className="card divide-y divide-[color:var(--color-border)] overflow-hidden" style={{ display: 'grid' }}>
                {items.map((e) => <TxnRow key={e.key} txn={e.txn} into={e.into} />)}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
