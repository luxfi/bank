import { useState, type CSSProperties } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useBrand } from '@/hooks/brand'
import { REAL_DEMO_EMAIL } from '@/lib/brand'
import { OverviewProvider, useOverview } from '@/hooks/overview'
import { Wordmark } from '@/components/Brand'
import { Button, EmptyState, Icon, SandboxBadge, Spinner, font, line, split, stack, truncate } from '@/components/ui'
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
      <View style={{ display: 'grid', placeItems: 'center', color: 'var(--color-fg-subtle)' }}>
        <View style={{ ...line(12), ...font(14) }}>
          <Spinner /><span>Loading your account…</span>
        </View>
      </View>
    )
  }
  // Nothing came back: show why, and a way out. Without this every page below
  // renders its own blank frame.
  if (!overview) {
    return (
      <View style={{ display: 'grid', placeItems: 'center', paddingInline: 24 }}>
        <View style={{ ...stack(), width: '100%', maxWidth: 384 }}>
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
    <View className="app-ambience" style={stack()}>
      {/* The sidebar is fixed to the viewport, so the shell is one column and
          the main column simply clears it at lg. */}
      <View style={{ ...stack(), position: 'relative', zIndex: 10 }}>
        {/* Desktop sidebar. Whether it is there at all is a question of width,
            so `desk-only` — not an inline display — decides it. */}
        <aside
          className="desk-only"
          style={{
            gridTemplateRows: 'auto 1fr auto',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            width: 240,
            borderRight: '1px solid var(--color-border)',
            background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <View style={{ display: 'grid', alignItems: 'center', justifyItems: 'start', height: 64, paddingInline: 20 }}>
            <Link to="/app"><Wordmark /></Link>
          </View>
          <nav aria-label="Sections" style={{ ...stack(4), alignContent: 'start', paddingInline: 12 }}>
            {nav.map((n) => (
              <SideLink key={n.to} to={n.to} label={n.label} icon={n.icon} />
            ))}
          </nav>
          <View style={{ ...stack(4), padding: 12, borderTop: '1px solid var(--color-border)' }}>
            <View style={{ ...stack(), paddingInline: 8, paddingBlock: 6 }}>
              <p style={{ ...font(14, 500), ...truncate }}>{name}</p>
              <p style={{ ...font(12), color: 'var(--color-fg-subtle)', ...truncate }}>{email}</p>
            </View>
            <button onClick={signOut} className="btn btn-ghost" style={{ ...navRow, textAlign: 'left' }}>
              <Icon name="logout" size={18} /> Sign out
            </button>
          </View>
        </aside>

        {/* Main */}
        <View className="shell-main" style={stack()}>
          {/* Top bar */}
          <header
            className="topbar"
            style={{
              ...split(12),
              borderBottom: '1px solid var(--color-border)',
              background: 'color-mix(in srgb, var(--color-bg) 80%, transparent)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="phone-only"><Link to="/app"><Wordmark /></Link></div>
            <div className="desk-only" style={{ gridTemplateColumns: 'minmax(0, 1fr)', ...font(14), color: 'var(--color-fg-muted)' }}>
              <span style={truncate}>{name}</span>
            </div>
            <View style={line(8)}>
              <SandboxBadge />
              <button onClick={signOut} className="phone-only btn btn-ghost" style={{ paddingInline: 8 }} aria-label="Sign out">
                <Icon name="logout" size={18} />
              </button>
            </View>
          </header>

          {/* Keyed on the route so each screen arrives instead of cutting in.
              A grid item is centred by the track, not by auto margins — those
              would drop it to its content width. */}
          <main
            key={pathname}
            className="enter shell-pad"
            style={{ justifySelf: 'center', width: '100%', maxWidth: 1024 }}
          >
            <Outlet />
          </main>
        </View>
      </View>

      {/* Mobile: "More" sheet — reveals the pages that don't fit the tab bar
          (Accounts, Activity) plus Sign out, so every screen is reachable. */}
      {moreOpen && (
        <div className="phone-only" style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMoreOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} />
          <nav
            aria-label="More"
            onClick={(e) => e.stopPropagation()}
            style={{
              ...stack(),
              position: 'absolute',
              bottom: 'calc(4.25rem + env(safe-area-inset-bottom))',
              left: 12,
              right: 12,
              borderRadius: 16,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {nav.filter((n) => !n.primary).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMoreOpen(false)}
                className="row"
                style={{ ...sheetRow, borderBottom: '1px solid var(--color-border)', color: 'var(--color-fg)' }}
              >
                <Icon name={n.icon} size={18} /> {n.label}
              </NavLink>
            ))}
            <button
              onClick={() => { setMoreOpen(false); signOut() }}
              className="row"
              style={{ ...sheetRow, color: 'var(--color-fg-muted)' }}
            >
              <Icon name="logout" size={18} /> Sign out
            </button>
          </nav>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Primary"
        className="phone-only"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          borderTop: '1px solid var(--color-border)',
          background: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
          backdropFilter: 'blur(24px)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* The track is sized from the nav itself (+1 for More), so adding a
            destination never leaves a column count behind to fix by hand. */}
        <View
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${nav.filter((n) => n.primary).length + 1}, minmax(0, 1fr))`,
          }}
        >
          {nav.filter((n) => n.primary).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/app'} className="tab" style={({ isActive }) => tabCell(isActive)}>
              <Icon name={n.icon} size={22} />
              <span style={tabLabel}>{n.label}</span>
            </NavLink>
          ))}
          <button type="button" onClick={() => setMoreOpen((v) => !v)} className="tab" style={tabCell(moreOpen)}>
            <Icon name="menu" size={22} />
            <span style={tabLabel}>More</span>
          </button>
        </View>
      </nav>
    </View>
  )
}

// A navigation line: mark then label, packed to the start of the row.
const navRow: CSSProperties = { ...line(12), width: '100%' }

// A line of the "More" sheet — the same navigation line, at list weight.
const sheetRow: CSSProperties = { ...navRow, paddingInline: 16, paddingBlock: 14, ...font(14, 500) }

// A tab cell: mark over label, centred in its column.
const tabCell = (isActive: boolean): CSSProperties => ({
  display: 'grid',
  justifyItems: 'center',
  alignContent: 'center',
  gap: 4,
  minWidth: 0,
  paddingBlock: 10,
  color: isActive ? 'var(--color-fg)' : 'var(--color-fg-subtle)',
})

const tabLabel: CSSProperties = { fontSize: 9.92, fontWeight: 500, maxWidth: '100%', paddingInline: 2, ...truncate }

// A sidebar destination. Where it stands and where the pointer is are the same
// question — both just tint the row — so the component answers both, and
// `.nav-link` fades between the answers.
function SideLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  const [hot, setHot] = useState(false)
  return (
    <NavLink
      to={to}
      end={to === '/app'}
      className="nav-link"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={({ isActive }) => ({
        ...navRow,
        borderRadius: 12,
        paddingInline: 12,
        paddingBlock: 10,
        ...font(14, 500),
        background: isActive
          ? 'var(--color-surface-2)'
          : hot ? 'color-mix(in srgb, var(--color-surface-2) 60%, transparent)' : 'transparent',
        color: isActive || hot ? 'var(--color-fg)' : 'var(--color-fg-muted)',
      })}
    >
      <Icon name={icon} size={18} />
      {label}
    </NavLink>
  )
}
