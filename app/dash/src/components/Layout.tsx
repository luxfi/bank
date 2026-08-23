import { useState, type CSSProperties } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useBrand } from '@/hooks/brand'
import { REAL_DEMO_EMAIL } from '@/lib/brand'
import { OverviewProvider, useOverview } from '@/hooks/overview'
import { Wordmark } from '@/components/Brand'
import { Button, EmptyState, Icon, SandboxBadge, Spinner, line, split, stack } from '@/components/ui'
import { Onboarding } from '@/pages/Onboarding'
import { View } from '@/gui'

const nav = [
  { to: '/app', label: 'Home', icon: 'home', primary: true },
  { to: '/app/cards', label: 'Cards', icon: 'card', primary: true },
  { to: '/app/send', label: 'Send', icon: 'send', primary: true },
  { to: '/app/exchange', label: 'Exchange', icon: 'swap', primary: true },
  { to: '/app/wallet', label: 'Wallet', icon: 'wallet', primary: true },
  { to: '/app/earn', label: 'Earn', icon: 'earn', primary: true },
  { to: '/app/accounts', label: 'Accounts', icon: 'bank', primary: false },
  { to: '/app/activity', label: 'Activity', icon: 'activity', primary: false },
] as const

export function Layout() {
  return (
    <OverviewProvider>
      <Shell />
    </OverviewProvider>
  )
}

function Shell() {
  const { overview, loading, error, refresh } = useOverview()

  if (loading) {
    return (
      <View className="min-h-screen text-[var(--color-fg-subtle)]" style={{ display: 'grid', placeItems: 'center' }}>
        <View className="text-sm" style={line(12)}>
          <Spinner /><span>Loading your account…</span>
        </View>
      </View>
    )
  }
  // Nothing came back: show why, and a way out. Without this every page below
  // renders its own blank frame.
  if (!overview) {
    return (
      <View className="min-h-screen px-6" style={{ display: 'grid', placeItems: 'center' }}>
        <View className="w-full max-w-sm" style={stack()}>
          <EmptyState
            icon="shield"
            title="Could not load your account"
            body={error ?? 'The bank did not answer.'}
            action={<Button onClick={() => void refresh()}>Try again</Button>}
          />
        </View>
      </View>
    )
  }
  if (!overview.onboarded) {
    return <Onboarding onDone={refresh} />
  }
  return <AppShell />
}

function AppShell() {
  const { user, logout } = useAuth()
  const { overview } = useOverview()
  const brand = useBrand()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  // The seeded demo identity displays under the active brand (e.g. ACM Demo /
  // z@acmglobaltech.com for brand=acm); real IAM customers show their own.
  const rawEmail = (user?.email as string) || ''
  const isDemo = rawEmail === REAL_DEMO_EMAIL
  const email = isDemo ? brand.demoEmail : rawEmail
  const name = isDemo ? brand.demoName : overview?.account?.entityName || (user?.name as string) || 'Your account'

  function signOut() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <View className="app-ambience min-h-screen" style={stack()}>
      {/* The sidebar is fixed to the viewport, so the shell is one column and
          the main column simply clears it at lg. */}
      <View className="relative z-10" style={stack()}>
        {/* Desktop sidebar. Its display is responsive, so it stays in the class
            names (`hidden lg:grid`) — an inline display would beat `hidden`. */}
        <aside
          className="hidden lg:grid fixed inset-y-0 left-0 w-60 border-r border-[color:var(--color-border)] bg-[var(--color-surface)]/60 backdrop-blur-xl"
          style={{ gridTemplateRows: 'auto 1fr auto' }}
        >
          <View className="px-5" style={{ display: 'grid', alignItems: 'center', justifyItems: 'start', height: 64 }}>
            <Link to="/app"><Wordmark /></Link>
          </View>
          <nav aria-label="Sections" className="px-3" style={{ ...stack(4), alignContent: 'start' }}>
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/app'} className={sideLink} style={navRow}>
                <Icon name={n.icon} className="w-[18px] h-[18px]" />
                {n.label}
              </NavLink>
            ))}
          </nav>
          <View className="p-3 border-t border-[color:var(--color-border)]" style={stack(4)}>
            <View className="px-2 py-1.5" style={stack()}>
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs text-[var(--color-fg-subtle)] truncate">{email}</p>
            </View>
            <button onClick={signOut} className="w-full btn btn-ghost text-left" style={navRow}>
              <Icon name="logout" className="w-[18px] h-[18px]" /> Sign out
            </button>
          </View>
        </aside>

        {/* Main */}
        <View className="lg:ml-60 min-w-0" style={stack()}>
          {/* Top bar */}
          <header
            className="sticky top-0 z-20 h-14 lg:h-16 px-4 md:px-8 border-b border-[color:var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl"
            style={split(12)}
          >
            <div className="lg:hidden"><Link to="/app"><Wordmark /></Link></div>
            <div className="hidden lg:block text-sm text-[var(--color-fg-muted)] truncate">{name}</div>
            <View style={line(8)}>
              <SandboxBadge />
              <button onClick={signOut} className="lg:hidden btn btn-ghost px-2" aria-label="Sign out">
                <Icon name="logout" className="w-[18px] h-[18px]" />
              </button>
            </View>
          </header>

          {/* Keyed on the route so each screen arrives instead of cutting in.
              A grid item is centred by the track, not by auto margins — those
              would drop it to its content width. */}
          <main
            key={pathname}
            className="enter px-4 md:px-8 py-5 md:py-8 pb-28 lg:pb-10 w-full max-w-5xl"
            style={{ justifySelf: 'center' }}
          >
            <Outlet />
          </main>
        </View>
      </View>

      {/* Mobile: "More" sheet — reveals the pages that don't fit the tab bar
          (Accounts, Activity) plus Sign out, so every screen is reachable. */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <nav
            aria-label="More"
            className="absolute bottom-[calc(4.25rem+env(safe-area-inset-bottom))] inset-x-3 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={stack()}
          >
            {nav.filter((n) => !n.primary).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMoreOpen(false)}
                className="row px-4 py-3.5 text-sm font-medium border-b border-[color:var(--color-border)] text-[var(--color-fg)]"
                style={navRow}
              >
                <Icon name={n.icon} className="w-[18px] h-[18px]" /> {n.label}
              </NavLink>
            ))}
            <button
              onClick={() => { setMoreOpen(false); signOut() }}
              className="row w-full px-4 py-3.5 text-sm font-medium text-[var(--color-fg-muted)]"
              style={navRow}
            >
              <Icon name="logout" className="w-[18px] h-[18px]" /> Sign out
            </button>
          </nav>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <nav aria-label="Primary" className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[color:var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        {/* The track is sized from the nav itself (+1 for More), so adding a
            destination never leaves a column count behind to fix by hand. */}
        <View
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${nav.filter((n) => n.primary).length + 1}, minmax(0, 1fr))`,
          }}
        >
          {nav.filter((n) => n.primary).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/app'} className={tabLink} style={tabCell}>
              <Icon name={n.icon} className="w-[22px] h-[22px]" />
              <span className="text-[0.62rem] font-medium max-w-full truncate px-0.5">{n.label}</span>
            </NavLink>
          ))}
          <button type="button" onClick={() => setMoreOpen((v) => !v)} className={tabLink({ isActive: moreOpen })} style={tabCell}>
            <Icon name="menu" className="w-[22px] h-[22px]" />
            <span className="text-[0.62rem] font-medium max-w-full truncate px-0.5">More</span>
          </button>
        </View>
      </nav>
    </View>
  )
}

// A navigation line: mark then label, packed to the start of the row.
const navRow: CSSProperties = { ...line(12), width: '100%' }

// A tab cell: mark over label, centred in its column.
const tabCell: CSSProperties = { display: 'grid', justifyItems: 'center', alignContent: 'center', gap: 4 }

function sideLink({ isActive }: { isActive: boolean }) {
  return `nav-link rounded-xl px-3 py-2.5 text-sm font-medium ${
    isActive
      ? 'bg-[var(--color-surface-2)] text-[var(--color-fg)]'
      : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]/60'
  }`
}
function tabLink({ isActive }: { isActive: boolean }) {
  return `tab min-w-0 py-2.5 ${isActive ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-subtle)]'}`
}
