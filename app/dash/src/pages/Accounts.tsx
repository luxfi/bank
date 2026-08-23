import { useOverview } from '@/hooks/overview'
import { useBrand } from '@/hooks/brand'
import { Money, AssetAvatar, SectionHeader, StatusBadge, Skeleton, formatUSD, CopyRow, EmptyState } from '@/components/ui'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">One multi-currency account, {balances.length} balances.</p>
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
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
          <CopyRow label="Account number (IBAN)" value={a.iban} empty="No IBAN on this account yet" />
        </div>
      </div>

      <section>
        <SectionHeader title="Balances" action={<span className="text-sm tnum text-[var(--color-fg-muted)]">{formatUSD(totalUsd)}</span>} />
        {balances.length === 0 ? (
          <EmptyState icon="bank" title="No balances yet" body="Fund the account or convert into a currency to see it here." />
        ) : (
        <div className="card divide-y divide-[color:var(--color-border)]">
          {balances.map((b) => (
            <div key={b.currency} className="flex items-center gap-3 px-4 py-3.5">
              <AssetAvatar code={b.currency} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{b.currency}</p>
                <p className="text-xs text-[var(--color-fg-subtle)]">{capitalize(b.kind)}</p>
              </div>
              <div className="text-right">
                <Money minor={b.available} currency={b.currency} decimals={b.decimals} className="font-medium" />
                <p className="text-xs text-[var(--color-fg-subtle)] tnum">{formatUSD(b.valueUsd)}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>
    </div>
  )
}
