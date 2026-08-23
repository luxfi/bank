import { Link } from 'react-router'
import { useOverview } from '@/hooks/overview'
import { useBrand } from '@/hooks/brand'
import { Money, Icon, SectionHeader, AssetAvatar, Skeleton, EmptyState, formatUSD } from '@/components/ui'
import { TxnRow } from '@/components/TxnRow'
import { CardFace } from '@/components/CardFace'
import { pair } from '@/lib/pair'

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
  // Display the seeded demo identity under the active brand (avoid leaking the
  // seed's "Lux Demo" name onto a white-label surface).
  const rawName = overview.account?.entityName || ''
  const firstName = (rawName === 'Lux Demo' ? brand.demoName : rawName).split(' ')[0]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Total balance hero */}
      <section className="rise">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] p-6 md:p-8">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full accent-glow" />
          <p className="text-sm text-[var(--color-fg-muted)]">
            {firstName ? `Welcome back, ${firstName}` : 'Total balance'}
          </p>
          <p className="text-4xl md:text-5xl font-semibold tracking-tight tnum mt-1.5">{formatUSD(totalUsd)}</p>
          <p className="text-xs text-[var(--color-fg-subtle)] mt-2">
            Across {balances.length} balance{balances.length === 1 ? '' : 's'} · estimated in USD
          </p>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-4 gap-2 md:gap-3">
        {actions.map((a) => (
          <Link key={a.to} to={a.to} className="card-2 flex flex-col items-center gap-2 py-4 hover:bg-[var(--color-surface-3)] transition-colors">
            <span className="w-10 h-10 rounded-full grid place-items-center bg-[var(--color-surface-3)] border">
              <Icon name={a.icon} className="w-[18px] h-[18px]" />
            </span>
            <span className="text-xs font-medium">{a.label}</span>
          </Link>
        ))}
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
        <div className="card divide-y divide-[color:var(--color-border)]">
          {balances.map((b) => (
            <div key={b.currency} className="flex items-center gap-3 px-4 py-3.5">
              <AssetAvatar code={b.currency} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{b.currency}</p>
                <p className="text-xs text-[var(--color-fg-subtle)] capitalize">{b.kind}</p>
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

      {/* Cards preview */}
      {cards.length > 0 && (
        <section>
          <SectionHeader
            title="Cards"
            action={<Link to="/app/cards" className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Manage</Link>}
          />
          <Link to="/app/cards" className="block max-w-sm">
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
          <div className="card divide-y divide-[color:var(--color-border)]">
            {pair(txns).map((e) => <TxnRow key={e.key} txn={e.txn} into={e.into} />)}
          </div>
        )}
      </section>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-40 rounded-[var(--radius-card)]" />
      <div className="grid grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      <Skeleton className="h-56 rounded-[var(--radius-card)]" />
    </div>
  )
}
