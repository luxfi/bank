import { useEffect, useMemo, useState } from 'react'
import { listTransactions, type Txn } from '@/api/client'
import { TxnRow } from '@/components/TxnRow'
import { EmptyState, PageHeader, Skeleton, font } from '@/components/ui'
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
    <View className="page" style={{ display: 'grid' }}>
      <PageHeader title="Activity" subtitle="Every movement across your account." />

      <View
        style={{
          display: 'grid', gridAutoFlow: 'column', gap: 4, justifySelf: 'start',
          padding: 4, borderRadius: 9999, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
        }}
      >
        {FILTERS.map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            aria-pressed={filter === v}
            className="nav-link"
            style={{
              paddingInline: 16, paddingBlock: 6, borderRadius: 9999, ...font(14, 500),
              ...(filter === v
                ? { background: 'var(--color-fg)', color: 'var(--color-bg)' }
                : { color: 'var(--color-fg-muted)' }),
            }}
          >
            {label}
          </button>
        ))}
      </View>

      {txns === null ? (
        <View style={{ display: 'grid', gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} style={{ height: 64, borderRadius: 12 }} />)}
        </View>
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
              <p style={{ ...font(12, 500), color: 'var(--color-fg-subtle)', paddingInline: 4 }}>{day}</p>
              <View className="card" style={{ display: 'grid', overflow: 'hidden' }}>
                {items.map((e, i) => (
                  <View key={e.key} style={{ display: 'grid', borderTop: i ? '1px solid var(--color-border)' : undefined }}>
                    <TxnRow txn={e.txn} into={e.into} />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
