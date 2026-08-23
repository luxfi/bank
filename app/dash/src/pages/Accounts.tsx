import { useOverview } from '@/hooks/overview'
import { useBrand } from '@/hooks/brand'
import { AssetRow, PageHeader, SectionHeader, StatusBadge, Skeleton, formatUSD, EmptyState } from '@/components/ui'
import { Coordinates } from '@/components/Coordinates'
import { capitalize } from '@/lib/format'

export function Accounts() {
  const { overview, loading } = useOverview()
  const brand = useBrand()
  if (loading) return <Skeleton className="h-72 rounded-[var(--radius-card)]" />
  if (!overview?.account) return null

  const a = overview.account
  const balances = overview.balances ?? []
  const totalUsd = balances.reduce((s, b) => s + b.valueUsd, 0)

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Accounts" subtitle={`One multi-currency account, ${balances.length} balances.`} />

      <div className="card p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="font-medium text-lg truncate">{a.entityName === 'Lux Demo' ? brand.demoName : a.entityName}</p>
            <p className="text-sm text-[var(--color-fg-subtle)] capitalize">{a.entityType} · {a.country}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <StatusBadge status={a.status} />
            <StatusBadge status={a.kycStatus} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[color:var(--color-border)]">
          <p className="label mb-3">Receive money · {a.currency}</p>
          <Coordinates account={a} />
        </div>
      </div>

      <section>
        <SectionHeader title="Balances" action={<span className="text-sm tnum text-[var(--color-fg-muted)]">{formatUSD(totalUsd)}</span>} />
        {balances.length === 0 ? (
          <EmptyState icon="bank" title="No balances yet" body="Fund the account or convert into a currency to see it here." />
        ) : (
        <div className="card divide-y divide-[color:var(--color-border)] overflow-hidden">
          {balances.map((b) => (
            <AssetRow
              key={b.currency}
              code={b.currency}
              note={capitalize(b.kind)}
              minor={b.available}
              decimals={b.decimals}
              valueUsd={b.valueUsd}
            />
          ))}
        </div>
        )}
      </section>
    </div>
  )
}
