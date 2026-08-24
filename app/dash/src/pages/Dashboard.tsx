import { Link } from 'react-router'
import { useOverview } from '@/hooks/overview'
import { useBrand } from '@/hooks/brand'
import { SectionHeader, ActionTile, AssetRow, Icon, Skeleton, EmptyState, formatUSD, font, truncate } from '@/components/ui'
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

// The panel a hero is cut from.
const panel = {
  borderRadius: 'var(--radius-card)',
  border: '1px solid var(--color-border)',
  background: 'linear-gradient(to bottom right, var(--color-surface-2), var(--color-surface))',
  overflow: 'hidden',
} as const

const display = { fontWeight: 600, letterSpacing: '-0.025em' } as const
const muted = { color: 'var(--color-fg-muted)' } as const
const subtle = { color: 'var(--color-fg-subtle)' } as const
// A list card clips its rows to the card's own corners.
const list = { display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', overflow: 'hidden' } as const

// "See all" / "Manage" — the small print that opens the full screen. Its
// colour, at rest and under the pointer, comes from .link.
const seeAll = font(12)

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
    <View className="page" style={{ display: 'grid' }}>
      {/* Total balance hero. The right of it carries the mix behind the
          figure — what the total is made of, at a glance. */}
      <section className="hero" style={{ ...panel, position: 'relative' }}>
        <div className="accent-glow" style={{ position: 'absolute', top: -96, right: -64, width: 288, height: 288, borderRadius: 9999 }} />
        {/* Figure on the left, the mix it is made of on the right — one column
            on a phone, two from md up. */}
        <View className="hero-split" style={{ display: 'grid', position: 'relative' }}>
          <View className="self-end" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', minWidth: 0 }}>
            <p style={{ ...font(14), ...muted }}>
              {firstName ? `Welcome back, ${firstName}` : 'Total balance'}
            </p>
            <p className="figure tnum" style={{ ...display, marginTop: 6 }}>{formatUSD(totalUsd)}</p>
            <p style={{ ...font(12), ...subtle, marginTop: 8 }}>
              Across {balances.length} balance{balances.length === 1 ? '' : 's'} · estimated in USD
            </p>
          </View>
          <Allocation
            items={balances.map((b) => ({ code: b.currency, valueUsd: b.valueUsd }))}
            className="mix self-end"
          />
        </View>
      </section>

      {/* Quick actions */}
      <section className="tiles" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {actions.map((a) => <ActionTile key={a.to} to={a.to} label={a.label} icon={a.icon} />)}
      </section>

      {/* Balances */}
      <section>
        <SectionHeader
          title="Balances"
          action={<Link to="/app/accounts" className="link" style={seeAll}>See all</Link>}
        />
        {balances.length === 0 ? (
          <EmptyState icon="bank" title="No balances yet" body="Fund the account or convert into a currency to see it here." />
        ) : (
        <View className="card list" style={list}>
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
            action={<Link to="/app/earn" className="link" style={seeAll}>Manage</Link>}
          />
          <Link to="/app/earn" className="card lift" style={{ display: 'block', padding: 20 }}>
            <View className="line" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto auto', alignItems: 'center' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 9999, background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}>
                <Icon name="earn" size={18} />
              </span>
              <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', minWidth: 0 }}>
                <p style={{ ...font(12), ...subtle }}>Net position</p>
                <p className="tnum" style={{ ...font(20), ...display, ...truncate }}>{formatUSD(earn.netUsd / 100)}</p>
              </View>
              <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', textAlign: 'right' }}>
                <p className="tnum" style={{ fontWeight: 500, color: 'var(--color-positive)' }}>{formatPercent(earn.netApy)}</p>
                <p style={{ ...font(12), ...subtle }}>Net APY</p>
              </View>
              <span style={{ display: 'grid', ...subtle }}><Icon name="chevron" size={16} /></span>
            </View>
            <p style={{ ...font(12), ...subtle, marginTop: 12 }}>
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
            action={<Link to="/app/cards" className="link" style={seeAll}>Manage</Link>}
          />
          <Link to="/app/cards" className="lift" style={{ display: 'block', maxWidth: 384, borderRadius: 'var(--radius-card)' }}>
            <CardFace card={cards[0]} />
          </Link>
        </section>
      )}

      {/* Recent activity */}
      <section>
        <SectionHeader
          title="Recent activity"
          action={<Link to="/app/activity" className="link" style={seeAll}>See all</Link>}
        />
        {txns.length === 0 ? (
          <EmptyState icon="activity" title="No activity yet" body="Your transactions will appear here as you move money." />
        ) : (
          <View className="card list" style={list}>
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
      <Skeleton style={{ height: 160, borderRadius: 'var(--radius-card)' }} />
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={{ height: 96, borderRadius: 12 }} />)}
      </View>
      <Skeleton style={{ height: 224, borderRadius: 'var(--radius-card)' }} />
    </View>
  )
}
