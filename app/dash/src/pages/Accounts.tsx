import { useOverview } from '@/hooks/overview'
import { useBrand } from '@/hooks/brand'
import { AssetRow, PageHeader, SectionHeader, StatusBadge, Skeleton, formatUSD, EmptyState, font, truncate } from '@/components/ui'
import { Coordinates } from '@/components/Coordinates'
import { capitalize } from '@/lib/format'
import { View } from '@/gui'

export function Accounts() {
  const { overview, loading } = useOverview()
  const brand = useBrand()
  if (loading) return <Skeleton style={{ height: 288, borderRadius: 'var(--radius-card)' }} />
  if (!overview?.account) return null

  const a = overview.account
  const balances = overview.balances ?? []
  const totalUsd = balances.reduce((s, b) => s + b.valueUsd, 0)

  return (
    <View className="page" style={{ display: 'grid' }}>
      <PageHeader title="Accounts" subtitle={`One multi-currency account, ${balances.length} balances.`} />

      <View className="card" style={{ display: 'grid', gap: 16, padding: 20 }}>
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'start', gap: 12 }}>
          <View style={{ display: 'grid' }}>
            <p style={{ ...font(18, 500), ...truncate }}>
              {a.entityName === 'Lux Demo' ? brand.demoName : a.entityName}
            </p>
            <p style={{ ...font(14), color: 'var(--color-fg-subtle)', textTransform: 'capitalize' }}>{a.entityType} · {a.country}</p>
          </View>
          <View style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'start', gap: 8 }}>
            <StatusBadge status={a.status} />
            <StatusBadge status={a.kycStatus} />
          </View>
        </View>
        <View style={{ display: 'grid', gap: 12, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
          <p className="label">Receive money · {a.currency}</p>
          <Coordinates account={a} />
        </View>
      </View>

      <section>
        <SectionHeader
          title="Balances"
          action={<span className="tnum" style={{ ...font(14), color: 'var(--color-fg-muted)' }}>{formatUSD(totalUsd)}</span>}
        />
        {balances.length === 0 ? (
          <EmptyState icon="bank" title="No balances yet" body="Fund the account or convert into a currency to see it here." />
        ) : (
        <View className="card" style={{ display: 'grid', overflow: 'hidden' }}>
          {balances.map((b, i) => (
            <View key={b.currency} style={{ display: 'grid', borderTop: i ? '1px solid var(--color-border)' : undefined }}>
              <AssetRow
                code={b.currency}
                note={capitalize(b.kind)}
                minor={b.available}
                decimals={b.decimals}
                valueUsd={b.valueUsd}
              />
            </View>
          ))}
        </View>
        )}
      </section>
    </View>
  )
}
