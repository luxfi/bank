import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Wordmark } from '@/components/Brand'
import { useBrand } from '@/hooks/brand'
import { useConfig } from '@/lib/config'
import { getPlans, type Plan } from '@/api/client'
import { Icon, SandboxBadge, font } from '@/components/ui'
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

// The panel every hero and closing band is cut from.
const panel = {
  borderRadius: 'var(--radius-card)',
  border: '1px solid var(--color-border)',
  background: 'linear-gradient(to bottom right, var(--color-surface-2), var(--color-surface))',
  overflow: 'hidden',
} as const

// Display type sets its own size through the responsive classes; what stays
// here is the weight and the tightening that goes with it.
const display = { fontWeight: 600, letterSpacing: '-0.025em' } as const
const muted = { color: 'var(--color-fg-muted)' } as const
const subtle = { color: 'var(--color-fg-subtle)' } as const
// The glow behind a hero — a circle of brand light, off-canvas.
const glow = (size: number) => ({ position: 'absolute', width: size, height: size, borderRadius: 9999 } as const)

export function Landing() {
  return (
    <View className="app-ambience" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', minHeight: '100vh' }}>
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', alignContent: 'start', position: 'relative', zIndex: 10 }}>
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
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        borderBottom: '1px solid var(--color-border)',
        background: 'color-mix(in srgb, var(--color-bg) 70%, transparent)',
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <View className="section section-bar" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
        <span style={{ display: 'grid', justifyItems: 'start', ...font(18) }}><Wordmark /></span>
        <nav
          aria-label="Main"
          style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'center', gap: 12 }}
        >
          <Link to="/login" className="btn btn-ghost desk-only">Sign in</Link>
          <Link to="/signup" className="btn btn-primary">Open account</Link>
        </nav>
      </View>
    </header>
  )
}

function Hero() {
  return (
    <section className="section section-hero">
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center', marginBottom: 24 }}><SandboxBadge /></View>
      <h1 className="display" style={{ ...display, maxWidth: 768, marginInline: 'auto' }}>
        Banking without borders.
        <br />
        <span style={muted}>Money and crypto, together.</span>
      </h1>
      <p style={{ ...font(18), ...muted, marginTop: 20, maxWidth: 576, marginInline: 'auto' }}>
        Open a multi-currency account with a built-in crypto wallet in under two minutes.
        Send globally, convert instantly, spend anywhere.
      </p>
      <View style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 32, gap: 12 }}>
        <Link to="/signup" className="btn btn-primary" style={{ ...font(16), paddingInline: 24, paddingBlock: 12 }}>
          Open your account <Icon name="chevron" size={16} />
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ ...font(16), paddingInline: 24, paddingBlock: 12 }}>Sign in</Link>
      </View>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', marginTop: 64, maxWidth: 768, marginInline: 'auto' }}><HeroPreview /></View>
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
      className="hero"
      style={{ ...panel, display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', position: 'relative', textAlign: 'left' }}
    >
      <div className="accent-glow" style={{ ...glow(320), top: -96, right: -64 }} />
      <p style={{ ...font(14), ...muted, position: 'relative' }}>Total balance</p>
      <p className="figure tnum" style={{ ...display, marginTop: 4, position: 'relative' }}>{usd(DEMO_TOTAL)}</p>
      <p style={{ ...font(12), ...subtle, marginTop: 8, position: 'relative' }}>
        Across {DEMO_BALANCES.length} balances · estimated in USD
      </p>
      {/* Five marks that fit the phone three-up and the desktop in one line. */}
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))', gap: 12, marginTop: 24, position: 'relative' }}>
        {DEMO_BALANCES.map(([code, held, value]) => (
          <View key={code} className="card-2" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 12 }}>
            <p style={{ ...font(12), ...subtle }}>{code}</p>
            <p className="tnum" style={{ ...font(14, 500), marginTop: 2 }}>{held}</p>
            <p className="tnum" style={{ fontSize: 11.2, ...subtle, marginTop: 2 }}>{usd(value)}</p>
          </View>
        ))}
      </View>
    </View>
  )
}

function Stats() {
  return (
    <section className="section section-sm">
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {STATS.map(([n, l]) => (
          <View key={l} className="card-2" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 20, textAlign: 'center' }}>
            <p className="h2" style={display}>{n}</p>
            <p style={{ ...font(12), ...subtle, marginTop: 4 }}>{l}</p>
          </View>
        ))}
      </View>
    </section>
  )
}

function Features() {
  return (
    <section className="section">
      <h2 className="h1" style={{ ...display, textAlign: 'center' }}>Everything, in one account</h2>
      <p style={{ ...muted, textAlign: 'center', marginTop: 12, maxWidth: 512, marginInline: 'auto' }}>A complete banking-as-a-service stack — accounts, payments, FX, cards and crypto.</p>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 40 }}>
        {FEATURES.map((f) => (
          <View key={f.title} className="card" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 24 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-fg)', marginBottom: 16 }}>
              <Icon name={f.icon} size={20} />
            </span>
            <h3 style={{ fontWeight: 500 }}>{f.title}</h3>
            <p style={{ ...font(14), ...muted, marginTop: 6, lineHeight: 1.625 }}>{f.body}</p>
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
    <section className="section" id="plans">
      <h2 className="h1" style={{ ...display, textAlign: 'center' }}>Membership</h2>
      <p style={{ ...muted, textAlign: 'center', marginTop: 12, maxWidth: 512, marginInline: 'auto' }}>
        One ladder, Silver to Sovereign. Every tier pairs with a lux.credit card.
      </p>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 40 }}>
        {plans.map((p) => (
          // Name, price, perks, call to action — the perk list takes the slack
          // so every card's button sits on the same line.
          <View
            key={p.id}
            className="card lift"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr)',
              gridTemplateRows: 'auto auto 1fr auto',
              padding: 24,
              ...(p.id === 'black' ? { borderColor: 'var(--color-fg)' } : null),
            }}
          >
            <h3 style={{ ...font(18, 500) }}>{p.name}</h3>
            <p style={{ marginTop: 8 }}>
              <span className="tnum" style={{ ...display, fontSize: 30, lineHeight: '36px' }}>{money(p.monthly)}</span>
              <span style={{ ...font(14), ...subtle }}> / month</span>
            </p>
            <ul style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8, alignContent: 'start', marginTop: 16, ...font(14), ...muted }}>
              <li>{p.card === 'virtual' ? 'Virtual card' : p.card === 'plastic' ? 'Plastic card' : 'Metal card'}{p.iban ? ' + IBAN account' : ''}</li>
              <li>{money(p.dailyLimit)} / day · {money(p.monthlyLimit)} / month</li>
              <li>FX from {p.fxPct}% · {p.freeWires > 0 ? `${p.freeWires} free wire${p.freeWires > 1 ? 's' : ''}/mo` : `wires ${money(p.wireFee)}`}</li>
              {p.perks.map((perk) => (
                <li key={perk} style={subtle}>{perk}</li>
              ))}
            </ul>
            <Link
              to="/signup"
              className={`btn ${p.id === 'black' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ marginTop: 24, width: '100%' }}
            >
              {p.invite ? 'Request invitation' : `Choose ${p.name}`}
            </Link>
          </View>
        ))}
      </View>
      <p style={{ ...font(12), ...subtle, textAlign: 'center', marginTop: 24 }}>
        Full fee schedule in your agreement. Cards issued by our banking partner.
      </p>
    </section>
  )
}

function Closing() {
  return (
    <section className="section">
      <View
        className="band"
        style={{ ...panel, display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', position: 'relative', textAlign: 'center' }}
      >
        <div className="accent-glow" style={{ ...glow(512), top: -96, left: '50%', transform: 'translateX(-50%)' }} />
        <h2 className="h1" style={{ ...display, position: 'relative' }}>Ready in two minutes</h2>
        <p style={{ ...muted, position: 'relative', marginTop: 12, maxWidth: 448, marginInline: 'auto' }}>No branches, no paperwork. Sign up with your Lux ID and start moving money today.</p>
        <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center', position: 'relative', marginTop: 32 }}>
          <Link to="/signup" className="btn btn-primary" style={{ ...font(16), paddingInline: 28, paddingBlock: 12 }}>Open your account</Link>
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
    <footer style={{ borderTop: '1px solid var(--color-border)', marginTop: 32 }}>
      <View className="section section-sm" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
        <View style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16 }}>
          <Wordmark />
          <SandboxBadge />
        </View>
        <p style={{ ...font(12), ...subtle, maxWidth: 672, lineHeight: 1.625 }}>
          {disclaimer} © {new Date().getFullYear()} {brand.legalName}.
        </p>
        {config?.partner && (
          <p style={{ ...font(12), ...subtle }}>
            <a href={config.partner.terms} target="_blank" rel="noopener noreferrer" className="link-quiet">
              {config.partner.name} Terms
            </a>
            <span style={{ marginInline: 8 }}>·</span>
            <a href={config.partner.privacy} target="_blank" rel="noopener noreferrer" className="link-quiet">
              {config.partner.name} Privacy Policy
            </a>
          </p>
        )}
      </View>
    </footer>
  )
}
