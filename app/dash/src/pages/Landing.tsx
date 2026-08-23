import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Wordmark } from '@/components/Brand'
import { useBrand } from '@/hooks/brand'
import { useConfig } from '@/lib/config'
import { getPlans, type Plan } from '@/api/client'
import { Icon, SandboxBadge } from '@/components/ui'
import { View } from '@/gui'

const STATS: [string, string][] = [
  ['30+', 'Currencies'],
  ['<2 min', 'To open'],
  ['T+0', 'Settlement'],
  ['0', 'Branches'],
]

const FEATURES = [
  { icon: 'bank', title: 'Multi-currency IBAN accounts', body: 'Hold 30+ currencies with a dedicated IBAN. Real-time available and pending balances.' },
  { icon: 'send', title: 'Global payments & instant FX', body: 'SWIFT, SEPA, ACH and wires worldwide, with conversion at institutional rates — no hidden spread.' },
  { icon: 'wallet', title: 'Built-in crypto wallet', body: 'Every account ships with a non-custodial wallet secured by threshold MPC — no single key.' },
  { icon: 'card', title: 'Cards, virtual to metal', body: 'Issue a virtual card in a tap; carry plastic or metal on higher tiers. Pairs with lux.credit.' },
  { icon: 'earn', title: 'Earn & borrow — Liquid Protocol', body: 'Collateralize crypto in non-custodial vaults and borrow against it while yield repays you. Lux’s native lending protocol, built in.' },
  { icon: 'shield', title: 'Bank-grade security', body: 'Lux ID sign-in, KMS-managed secrets, and continuous KYC / AML / sanctions screening.' },
]

export function Landing() {
  return (
    <View className="app-ambience" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', minHeight: '100vh' }}>
      <View className="relative z-10" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', alignContent: 'start' }}>
        <Nav />
        <Hero />
        <Stats />
        <Features />
        <Plans />
        <Closing />
        <Footer />
      </View>
    </View>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--color-border)] bg-[var(--color-bg)]/70 backdrop-blur-xl">
      <View
        className="w-full mx-auto max-w-6xl px-5 md:px-8 h-16"
        style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}
      >
        <Wordmark className="text-lg" />
        <nav
          aria-label="Main"
          className="gap-2 md:gap-3"
          style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'center' }}
        >
          <Link to="/login" className="btn btn-ghost hidden sm:inline-grid">Sign in</Link>
          <Link to="/signup" className="btn btn-primary">Open account</Link>
        </nav>
      </View>
    </header>
  )
}

function Hero() {
  return (
    <section className="w-full mx-auto max-w-6xl px-5 md:px-8 pt-16 md:pt-28 pb-16 text-center">
      <View className="mb-6" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center' }}><SandboxBadge /></View>
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-3xl mx-auto">
        Banking without borders.
        <br />
        <span className="text-[var(--color-fg-muted)]">Money and crypto, together.</span>
      </h1>
      <p className="mt-5 text-lg text-[var(--color-fg-muted)] max-w-xl mx-auto">
        Open a multi-currency account with a built-in crypto wallet in under two minutes.
        Send globally, convert instantly, spend anywhere.
      </p>
      <View
        className="mt-8 gap-3"
        style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        <Link to="/signup" className="btn btn-primary text-base px-6 py-3">Open your account <Icon name="chevron" className="w-4 h-4" /></Link>
        <Link to="/login" className="btn btn-secondary text-base px-6 py-3">Sign in</Link>
      </View>
      <View className="mt-16 max-w-3xl mx-auto" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}><HeroPreview /></View>
    </section>
  )
}

// The preview is the demo account, balance for balance — open one and this is
// the screen you land on. A hero that quotes a different figure than the app
// behind it reads as two different companies.
const DEMO_BALANCES: [string, string, number][] = [
  ['USD', '$12,500.00', 12500],
  ['EUR', '€3,200.00', 3478.26],
  ['GBP', '£1,750.00', 2215.19],
  ['LUX', '250 LUX', 3125],
  ['DAI', '500 DAI', 500],
]
const DEMO_TOTAL = DEMO_BALANCES.reduce((s, [, , usd]) => s + usd, 0)
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

function HeroPreview() {
  return (
    <View
      className="relative rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] p-6 md:p-8 text-left overflow-hidden"
      style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}
    >
      <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full accent-glow" />
      <p className="text-sm text-[var(--color-fg-muted)] relative">Total balance</p>
      <p className="text-4xl md:text-5xl font-semibold tracking-tight tnum mt-1 relative">{usd(DEMO_TOTAL)}</p>
      <p className="text-xs text-[var(--color-fg-subtle)] mt-2 relative">
        Across {DEMO_BALANCES.length} balances · estimated in USD
      </p>
      <View className="grid-cols-3 sm:grid-cols-5 gap-3 mt-6 relative" style={{ display: 'grid', alignContent: 'start' }}>
        {DEMO_BALANCES.map(([code, held, value]) => (
          <View key={code} className="card-2 p-3" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            <p className="text-xs text-[var(--color-fg-subtle)]">{code}</p>
            <p className="font-medium tnum text-sm mt-0.5">{held}</p>
            <p className="text-[0.7rem] text-[var(--color-fg-subtle)] tnum mt-0.5">{usd(value)}</p>
          </View>
        ))}
      </View>
    </View>
  )
}

function Stats() {
  return (
    <section className="w-full mx-auto max-w-6xl px-5 md:px-8 py-10">
      <View className="grid-cols-2 md:grid-cols-4 gap-3" style={{ display: 'grid', alignContent: 'start' }}>
        {STATS.map(([n, l]) => (
          <View key={l} className="card-2 p-5 text-center" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">{n}</p>
            <p className="text-xs text-[var(--color-fg-subtle)] mt-1">{l}</p>
          </View>
        ))}
      </View>
    </section>
  )
}

function Features() {
  return (
    <section className="w-full mx-auto max-w-6xl px-5 md:px-8 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">Everything, in one account</h2>
      <p className="text-center text-[var(--color-fg-muted)] mt-3 max-w-lg mx-auto">A complete banking-as-a-service stack — accounts, payments, FX, cards and crypto.</p>
      <View className="grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-4 mt-10" style={{ display: 'grid', alignContent: 'start' }}>
        {FEATURES.map((f) => (
          <View key={f.title} className="card p-6" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            <span className="w-11 h-11 rounded-xl grid place-items-center bg-[var(--color-surface-2)] border text-[var(--color-fg)] mb-4">
              <Icon name={f.icon} className="w-5 h-5" />
            </span>
            <h3 className="font-medium">{f.title}</h3>
            <p className="text-sm text-[var(--color-fg-muted)] mt-1.5 leading-relaxed">{f.body}</p>
          </View>
        ))}
      </View>
    </section>
  )
}

const money = (minor: number) => `$${(minor / 100).toLocaleString()}`

function Plans() {
  const [plans, setPlans] = useState<Plan[] | null>(null)
  useEffect(() => {
    getPlans().then(setPlans).catch(() => {})
  }, [])
  if (!plans?.length) return null
  return (
    <section className="w-full mx-auto max-w-6xl px-5 md:px-8 py-16" id="plans">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">Membership</h2>
      <p className="text-center text-[var(--color-fg-muted)] mt-3 max-w-lg mx-auto">
        One ladder, Silver to Sovereign. Every tier pairs with a lux.credit card.
      </p>
      <View className="grid-cols-[minmax(0,1fr)] md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10" style={{ display: 'grid', alignContent: 'start' }}>
        {plans.map((p) => (
          // Name, price, perks, call to action — the perk list takes the slack
          // so every card's button sits on the same line.
          <View
            key={p.id}
            className={`card lift p-6 ${p.id === 'black' ? 'border-[color:var(--color-fg)]' : ''}`}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gridTemplateRows: 'auto auto 1fr auto' }}
          >
            <h3 className="font-medium text-lg">{p.name}</h3>
            <p className="mt-2">
              <span className="text-3xl font-semibold tracking-tight tnum">{money(p.monthly)}</span>
              <span className="text-sm text-[var(--color-fg-subtle)]"> / month</span>
            </p>
            <ul
              className="mt-4 text-sm text-[var(--color-fg-muted)]"
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8, alignContent: 'start' }}
            >
              <li>{p.card === 'virtual' ? 'Virtual card' : p.card === 'plastic' ? 'Plastic card' : 'Metal card'}{p.iban ? ' + IBAN account' : ''}</li>
              <li>{money(p.dailyLimit)} / day · {money(p.monthlyLimit)} / month</li>
              <li>FX from {p.fxPct}% · {p.freeWires > 0 ? `${p.freeWires} free wire${p.freeWires > 1 ? 's' : ''}/mo` : `wires ${money(p.wireFee)}`}</li>
              {p.perks.map((perk) => (
                <li key={perk} className="text-[var(--color-fg-subtle)]">{perk}</li>
              ))}
            </ul>
            <Link
              to="/signup"
              className={`btn mt-6 w-full ${p.id === 'black' ? 'btn-primary' : 'btn-secondary'}`}
            >
              {p.invite ? 'Request invitation' : `Choose ${p.name}`}
            </Link>
          </View>
        ))}
      </View>
      <p className="text-center text-xs text-[var(--color-fg-subtle)] mt-6">
        Full fee schedule in your agreement. Cards issued by our banking partner.
      </p>
    </section>
  )
}

function Closing() {
  return (
    <section className="w-full mx-auto max-w-6xl px-5 md:px-8 py-16">
      <View
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] p-10 md:p-16 text-center"
        style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full accent-glow" />
        <h2 className="relative text-3xl md:text-4xl font-semibold tracking-tight">Ready in two minutes</h2>
        <p className="relative text-[var(--color-fg-muted)] mt-3 max-w-md mx-auto">No branches, no paperwork. Sign up with your Lux ID and start moving money today.</p>
        <View className="relative mt-8" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center' }}>
          <Link to="/signup" className="btn btn-primary text-base px-7 py-3">Open your account</Link>
        </View>
      </View>
    </section>
  )
}

function Footer() {
  const brand = useBrand()
  const config = useConfig()
  const disclaimer =
    config?.disclaimer ??
    'Banking services are provided by our licensed banking partner.'
  return (
    <footer className="border-t border-[color:var(--color-border)] mt-8">
      <View className="w-full mx-auto max-w-6xl px-5 md:px-8 py-10" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
        <View style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16 }}>
          <Wordmark />
          <SandboxBadge />
        </View>
        <p className="text-xs text-[var(--color-fg-subtle)] max-w-2xl leading-relaxed">
          {disclaimer} © {new Date().getFullYear()} {brand.legalName}.
        </p>
        {config?.partner && (
          <p className="text-xs text-[var(--color-fg-subtle)]">
            <a href={config.partner.terms} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-fg-muted)]">
              {config.partner.name} Terms
            </a>
            <span className="mx-2">·</span>
            <a href={config.partner.privacy} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-fg-muted)]">
              {config.partner.name} Privacy Policy
            </a>
          </p>
        )}
      </View>
    </footer>
  )
}
