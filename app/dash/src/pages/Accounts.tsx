import { useOverview } from '@/hooks/overview'
import { useBrand } from '@/hooks/brand'
import { AssetRow, PageHeader, SectionHeader, StatusBadge, Skeleton, formatUSD, EmptyState } from '@/components/ui'
import { Coordinates } from '@/components/Coordinates'
import { capitalize } from '@/lib/format'
import { View } from '@/gui'

export function Accounts() {
  const { overview, loading } = useOverview()
  const brand = useBrand()
  if (loading) return <Skeleton className="h-72 rounded-[var(--radius-card)]" />
  if (!overview?.account) return null

  const a = overview.account
  const balances = overview.balances ?? []
  const totalUsd = balances.reduce((s, b) => s + b.valueUsd, 0)

  return (
    <View className="gap-6 md:gap-8" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)' }}>
      <PageHeader title="Accounts" subtitle={`One multi-currency account, ${balances.length} balances.`} />

      <View className="card p-5" style={{ display: 'grid', gap: 16 }}>
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'start', gap: 12 }}>
          <View style={{ display: 'grid' }}>
            <p className="font-medium text-lg truncate">{a.entityName === 'Lux Demo' ? brand.demoName : a.entityName}</p>
            <p className="text-sm text-[var(--color-fg-subtle)] capitalize">{a.entityType} · {a.country}</p>
          </View>
          <View style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'start', gap: 8 }}>
            <StatusBadge status={a.status} />
            <StatusBadge status={a.kycStatus} />
          </View>
        </View>
        <View className="pt-4 border-t border-[color:var(--color-border)]" style={{ display: 'grid', gap: 12 }}>
          <p className="label">Receive money · {a.currency}</p>
          <Coordinates account={a} />
        </View>
      </View>

      <section>
        <SectionHeader title="Balances" action={<span className="text-sm tnum text-[var(--color-fg-muted)]">{formatUSD(totalUsd)}</span>} />
        {balances.length === 0 ? (
          <EmptyState icon="bank" title="No balances yet" body="Fund the account or convert into a currency to see it here." />
        ) : (
        <View className="card divide-y divide-[color:var(--color-border)] overflow-hidden" style={{ display: 'grid' }}>
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
        </View>
        )}
      </section>
    </View>
  )
}
