import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useBrand } from '@/hooks/brand'
import { REAL_DEMO_EMAIL } from '@/lib/brand'
import { OverviewProvider, useOverview } from '@/hooks/overview'
import { Wordmark } from '@/components/Brand'
import { Button, EmptyState, Icon, SandboxBadge, Spinner } from '@/components/ui'
import { Onboarding } from '@/pages/Onboarding'

const nav = [
  { to: '/app', label: 'Home', icon: 'home', primary: true },
  { to: '/app/cards', label: 'Cards', icon: 'card', primary: true },
  { to: '/app/send', label: 'Send', icon: 'send', primary: true },
  { to: '/app/exchange', label: 'Exchange', icon: 'swap', primary: true },
  { to: '/app/wallet', label: 'Wallet', icon: 'wallet', primary: true },
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
      <div className="min-h-screen grid place-items-center text-[var(--color-fg-subtle)]">
        <div className="flex items-center gap-3 text-sm">
          <Spinner /> Loading your account…
        </div>
      </div>
    )
  }
  // Nothing came back: show why, and a way out. Without this every page below
  // renders its own blank frame.
  if (!overview) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="w-full max-w-sm">
          <EmptyState
            icon="shield"
            title="Could not load your account"
            body={error ?? 'The bank did not answer.'}
            action={<Button onClick={() => void refresh()}>Try again</Button>}
          />
        </div>
      </div>
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
    <div className="app-ambience min-h-screen">
      <div className="relative z-10 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-[color:var(--color-border)] bg-[var(--color-surface)]/60 backdrop-blur-xl">
          <div className="h-16 flex items-center px-5">
            <Link to="/app"><Wordmark /></Link>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/app'} className={sideLink}>
                <Icon name={n.icon} className="w-[18px] h-[18px]" />
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-[color:var(--color-border)]">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs text-[var(--color-fg-subtle)] truncate">{email}</p>
            </div>
            <button onClick={signOut} className="mt-1 w-full btn btn-ghost justify-start">
              <Icon name="logout" className="w-[18px] h-[18px]" /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 lg:ml-60 min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-20 h-14 lg:h-16 flex items-center justify-between gap-3 px-4 md:px-8 border-b border-[color:var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
            <div className="lg:hidden"><Link to="/app"><Wordmark /></Link></div>
            <div className="hidden lg:block text-sm text-[var(--color-fg-muted)] truncate">{name}</div>
            <div className="flex items-center gap-2">
              <SandboxBadge />
              <button onClick={signOut} className="lg:hidden btn btn-ghost px-2" aria-label="Sign out">
                <Icon name="logout" className="w-[18px] h-[18px]" />
              </button>
            </div>
          </header>

          <main className="px-4 md:px-8 py-5 md:py-8 pb-28 lg:pb-10 max-w-5xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile: "More" sheet — reveals the pages that don't fit the tab bar
          (Accounts, Activity) plus Sign out, so every screen is reachable. */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute bottom-[calc(4.25rem+env(safe-area-inset-bottom))] inset-x-3 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {nav.filter((n) => !n.primary).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium border-b border-[color:var(--color-border)] text-[var(--color-fg)]"
              >
                <Icon name={n.icon} className="w-[18px] h-[18px]" /> {n.label}
              </NavLink>
            ))}
            <button
              onClick={() => { setMoreOpen(false); signOut() }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-[var(--color-fg-muted)]"
            >
              <Icon name="logout" className="w-[18px] h-[18px]" /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[color:var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-6">
          {nav.filter((n) => n.primary).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/app'} className={tabLink}>
              <Icon name={n.icon} className="w-[22px] h-[22px]" />
              <span className="text-[0.62rem] font-medium">{n.label}</span>
            </NavLink>
          ))}
          <button type="button" onClick={() => setMoreOpen((v) => !v)} className={tabLink({ isActive: moreOpen })}>
            <Icon name="menu" className="w-[22px] h-[22px]" />
            <span className="text-[0.62rem] font-medium">More</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

function sideLink({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[var(--color-surface-2)] text-[var(--color-fg)]'
      : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]/60'
  }`
}
function tabLink({ isActive }: { isActive: boolean }) {
  return `flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
    isActive ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-subtle)]'
  }`
}
