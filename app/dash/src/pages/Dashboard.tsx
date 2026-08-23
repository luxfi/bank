import { Link } from 'react-router'
import { useOverview } from '@/hooks/overview'
import { useBrand } from '@/hooks/brand'
import { SectionHeader, ActionTile, AssetRow, Icon, Skeleton, EmptyState, formatUSD } from '@/components/ui'
import { Allocation } from '@/components/Allocation'
import { TxnRow } from '@/components/TxnRow'
import { CardFace } from '@/components/CardFace'
import { capitalize, formatPercent } from '@/lib/format'
import { pair } from '@/lib/pair'
import { View } from '@/gui'

const actions = [
  { to: '/app/send', label: 'Send', icon: 'send' },
  { to: '/app/exchange', label: 'Exchange', icon: 'swap' },
  { to: '/app/wallet', label: 'Crypto', icon: 'coins' },
  { to: '/app/cards', label: 'Cards', icon: 'card' },
] as const

export function Dashboard() {
  const { overview, loading } = useOverview()
  const brand = useBrand()

  if (loading) return <DashboardSkeleton />
  if (!overview?.onboarded) return null

  const balances = overview.balances ?? []
  const totalUsd = balances.reduce((s, b) => s + b.valueUsd, 0)
  const txns = overview.recentTransactions ?? []
  const cards = overview.cards ?? []
  const earn = overview.earn
  // Display the seeded demo identity under the active brand (avoid leaking the
  // seed's "Lux Demo" name onto a white-label surface).
  const rawName = overview.account?.entityName || ''
  const firstName = (rawName === 'Lux Demo' ? brand.demoName : rawName).split(' ')[0]

  return (
    <View className="gap-6 md:gap-8" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
      {/* Total balance hero. The right of it carries the mix behind the
          figure — what the total is made of, at a glance. */}
      <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] p-6 md:p-8">
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full accent-glow" />
        {/* Figure on the left, the mix it is made of on the right — one column
            on a phone, two from md up. */}
        <View
          className="relative gap-7 grid-cols-[minmax(0,1fr)] md:gap-12 md:grid-cols-[minmax(0,1fr)_auto]"
          style={{ display: 'grid', alignItems: 'end' }}
        >
          <View className="min-w-0" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            <p className="text-sm text-[var(--color-fg-muted)]">
              {firstName ? `Welcome back, ${firstName}` : 'Total balance'}
            </p>
            <p className="text-4xl md:text-5xl font-semibold tracking-tight tnum mt-1.5">{formatUSD(totalUsd)}</p>
            <p className="text-xs text-[var(--color-fg-subtle)] mt-2">
              Across {balances.length} balance{balances.length === 1 ? '' : 's'} · estimated in USD
            </p>
          </View>
          <Allocation
            items={balances.map((b) => ({ code: b.currency, valueUsd: b.valueUsd }))}
            className="w-full md:w-52 lg:w-60"
          />
        </View>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-4 gap-2 md:gap-3">
        {actions.map((a) => <ActionTile key={a.to} to={a.to} label={a.label} icon={a.icon} />)}
      </section>

      {/* Balances */}
      <section>
        <SectionHeader
          title="Balances"
          action={<Link to="/app/accounts" className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">See all</Link>}
        />
        {balances.length === 0 ? (
          <EmptyState icon="bank" title="No balances yet" body="Fund the account or convert into a currency to see it here." />
        ) : (
        <View className="card divide-y divide-[color:var(--color-border)] overflow-hidden" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
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

      {/* Earn — only for an account that has collateral working. What it is
          worth net of the debt, and what that debt is being repaid at. */}
      {earn && earn.positions > 0 && (
        <section>
          <SectionHeader
            title="Earn"
            action={<Link to="/app/earn" className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Manage</Link>}
          />
          <Link to="/app/earn" className="card lift block p-5">
            <View
              className="gap-3 sm:gap-4"
              style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto auto', alignItems: 'center' }}
            >
              <span className="w-10 h-10 rounded-full grid place-items-center bg-[var(--color-surface-3)] border">
                <Icon name="earn" className="w-[18px] h-[18px]" />
              </span>
              <View className="min-w-0" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
                <p className="text-xs text-[var(--color-fg-subtle)]">Net position</p>
                <p className="text-xl font-semibold tracking-tight tnum truncate">{formatUSD(earn.netUsd / 100)}</p>
              </View>
              <View className="text-right" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
                <p className="tnum font-medium text-[var(--color-positive)]">{formatPercent(earn.netApy)}</p>
                <p className="text-xs text-[var(--color-fg-subtle)]">Net APY</p>
              </View>
              <Icon name="chevron" className="w-4 h-4 text-[var(--color-fg-subtle)]" />
            </View>
            <p className="text-xs text-[var(--color-fg-subtle)] mt-3">
              {formatUSD(earn.collateralUsd / 100)} of collateral against {formatUSD(earn.debt / 100)} borrowed —
              the yield repays it.
            </p>
          </Link>
        </section>
      )}

      {/* Cards preview */}
      {cards.length > 0 && (
        <section>
          <SectionHeader
            title="Cards"
            action={<Link to="/app/cards" className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Manage</Link>}
          />
          <Link to="/app/cards" className="lift block max-w-sm rounded-[var(--radius-card)]">
            <CardFace card={cards[0]} />
          </Link>
        </section>
      )}

      {/* Recent activity */}
      <section>
        <SectionHeader
          title="Recent activity"
          action={<Link to="/app/activity" className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">See all</Link>}
        />
        {txns.length === 0 ? (
          <EmptyState icon="activity" title="No activity yet" body="Your transactions will appear here as you move money." />
        ) : (
          <View className="card divide-y divide-[color:var(--color-border)] overflow-hidden" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            {pair(txns).map((e) => <TxnRow key={e.key} txn={e.txn} into={e.into} />)}
          </View>
        )}
      </section>
    </View>
  )
}

function DashboardSkeleton() {
  return (
    <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 32 }}>
      <Skeleton className="h-40 rounded-[var(--radius-card)]" />
      <View className="grid-cols-4 gap-3" style={{ display: 'grid', alignContent: 'start' }}>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</View>
      <Skeleton className="h-56 rounded-[var(--radius-card)]" />
    </View>
  )
}
