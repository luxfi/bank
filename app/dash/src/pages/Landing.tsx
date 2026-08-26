import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Wordmark } from '@/components/Brand'
import { useBrand } from '@/hooks/brand'
import { useConfig } from '@/lib/config'
import { getPlans, listVaults, type Plan, type Vault } from '@/api/client'
import { AssetAvatar, Icon, SandboxBadge, font, pill, truncate } from '@/components/ui'
import { Custody } from '@/components/Custody'
import { formatPercent } from '@/lib/format'
import { View } from '@/gui'

const STATS: [string, string][] = [
  ['30+', 'Currencies'],
  ['<2 min', 'To open'],
  ['T+0', 'Settlement'],
  ['0', 'Branches'],
]

const FEATURES = [
  { icon: 'bank', title: 'Multi-currency IBAN accounts', body: 'Hold 30+ currencies with a dedicated IBAN. Real-time available and pending balances.' },
  { icon: 'send', title: 'Global payments & FX', body: 'SWIFT, SEPA, ACH and wires worldwide. Every conversion is quoted, spread included, before you confirm it.' },
  { icon: 'wallet', title: 'Built-in crypto wallet', body: 'Every account ships with a crypto wallet. We hold its key and sign on your instruction — the same custody as your cash balances.' },
  { icon: 'card', title: 'Cards, virtual to metal', body: 'Issue a virtual card in a tap; carry plastic or metal on higher tiers. Pairs with lux.credit.' },
  { icon: 'earn', title: 'Earn & borrow — Liquid Protocol', body: 'Deposit crypto collateral into a Liquid vault and borrow the vault’s synthetic against it, up to its LTV. Collateral yield is applied to the debt. We hold the key and sign each movement.' },
  { icon: 'shield', title: 'Sign-in and screening', body: 'Lux ID sign-in, KMS-managed secrets, and continuous KYC / AML / sanctions screening.' },
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
    // The gui runtime paints the body with its own theme, unlayered, so an
    // inherited foreground stays white whichever brand is resolved. Stating
    // both ends of the page from the tokens once here is what makes the light
    // brand real: everything below inherits the brand rather than the runtime.
    <View
      className="app-ambience"
      style={{
        display: 'grid',
        alignContent: 'start',
        gridTemplateColumns: 'minmax(0,1fr)',
        minHeight: '100vh',
        color: 'var(--color-fg)',
        background: 'var(--color-bg)',
      }}
    >
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', alignContent: 'start', position: 'relative', zIndex: 10 }}>
        <Nav />
        <Hero />
        <Stats />
        <Features />
        <Liquid />
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
        Send globally, convert between currencies, spend on card.
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

// -- Liquid Protocol ---------------------------------------------------------
//
// The other half of "money and crypto, together". A wallet that only holds is
// a feature; this is what the holding does. It answers the question the crypto
// card above raises rather than opening a second pitch, so it reads as the
// bank's lending layer and not as a protocol that happens to share a page.

const BEATS: { icon: string; title: string; body: string }[] = [
  {
    // Down then up: what goes in, then what comes out against it.
    icon: 'arrowDown',
    title: 'Collateral that already earns',
    body: 'wstETH, rETH, USDC, stLUX and more go into a Liquid vault and keep accruing the yield they carry outside it.',
  },
  {
    icon: 'arrowUp',
    title: 'Borrow against it, up to 90%',
    body: 'Draw the vault’s x* token against what you put in, up to the vault’s LTV. It is an ERC-20 and transfers like one.',
  },
  {
    icon: 'earn',
    title: 'The yield goes to the debt',
    body: 'Mix-Yield Token strategies allocate the collateral across the protocols that vault names, and the yield they return is applied to what you owe. Nothing to schedule.',
  },
  {
    icon: 'swap',
    title: 'Convert back on a fixed cycle',
    body: 'x* tokens redeem for the underlying through the transmuter over ninety days, as transmuter capacity allows.',
  },
]

// Six debt tokens. Which network each one lives on is a fact the catalog owns,
// so the copy names the four networks and the grid names the tokens.
const XTOKENS = ['xLUX', 'xETH', 'xUSD', 'xZOO', 'xAI', 'xPARS']

const MYT: [string, string][] = [
  ['Rocket Pool', 'rETH'],
  ['Frax', 'sfrxETH'],
  ['EigenLayer', 'eETH'],
  ['Tokemak', 'tokeETH'],
  ['Yearn', 'yvUSDC'],
  ['Morpho', 'mUSDC'],
  ['Lux staking', 'stLUX'],
  ['Zoo staking', 'stZOO'],
  ['AI compute', 'stAI'],
  ['Pars staking', 'stPARS'],
]

// One position, priced twice. The quantities are what hold across the pair —
// only the dollar column moves — so the two cards print the same ratio.
const COLLATERAL = 10
const DEBT = 9
const PRICES = [3000, 1800]
// Read off the prices rather than written into the caption, so the sentence
// cannot drift away from the figures it is describing.
const DROP = Math.round((1 - Math.min(...PRICES) / Math.max(...PRICES)) * 100)

// Whole dollars here: these figures are round by construction and cents would
// only add noise to a comparison that is about the ratio.
const dollars = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

// Pool-scale money, cents in ("$295.9M" out).
const compact = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1,
  }).format(cents / 100)

function Liquid() {
  const [vaults, setVaults] = useState<Vault[] | null>(null)
  useEffect(() => {
    listVaults().then(setVaults).catch(() => {})
  }, [])
  // A figure this page cannot read is a figure it does not print. The story
  // below stands on its own; only the live bands wait on the catalog.
  return (
    <section className="section" id="liquid">
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center', textAlign: 'center' }}>
        <span
          className="chip"
          style={{
            ...pill('0.35rem'),
            color: 'var(--color-accent)',
            borderColor: 'color-mix(in srgb, var(--color-accent) 35%, transparent)',
            background: 'color-mix(in srgb, var(--color-accent) 8%, transparent)',
          }}
        >
          Liquid Protocol V3
        </span>
        <h2 className="h1" style={{ ...display, marginTop: 16 }}>The yield on your collateral goes to the debt.</h2>
        <p style={{ ...muted, marginTop: 12, maxWidth: 560 }}>
          Liquid is Lux’s lending layer, and it sits in the same account as your balances. Deposit
          yield-bearing collateral, borrow x* tokens against it up to the vault’s LTV, and the
          collateral’s yield is applied to what you owe. How long that takes to clear the debt
          depends on the yield, which moves.
        </p>
      </View>
      {vaults?.length ? <Figures vaults={vaults} /> : null}
      {/* Read before the mechanics, because everything below describes moving
          money on a chain and a reader who knows DeFi will assume they sign for
          it themselves. Here they do not. */}
      <View style={{ display: 'grid', maxWidth: 640, marginInline: 'auto', marginTop: 24 }}>
        <Custody
          subject="every vault position opened here"
          also="Liquid is reached through your account, not through a wallet you connect."
        />
      </View>
      <Beats />
      <LikeKind />
      <Machinery />
      {vaults?.length ? <Vaults vaults={vaults} /> : null}
    </section>
  )
}

// The band reports what the catalog actually publishes. Borrowed and open
// positions are protocol-wide totals bankd does not serve yet, and a landing
// page is the last place to guess at them.
function Figures({ vaults }: { vaults: Vault[] }) {
  const tvl = vaults.reduce((sum, v) => sum + v.tvlUsd, 0)
  const apy = vaults.map((v) => v.apy)
  const rows: [string, string][] = [
    [compact(tvl), 'Total value locked'],
    [String(vaults.length), vaults.length === 1 ? 'Vault' : 'Vaults'],
    [formatPercent(Math.max(...vaults.map((v) => v.maxLtv)) * 100, 0), 'Max LTV'],
    [`${Math.min(...apy).toFixed(1)}–${Math.max(...apy).toFixed(1)}%`, 'Collateral yield'],
  ]
  return (
    <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 40 }}>
      {rows.map(([n, l]) => (
        <View key={l} className="card-2" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 20, textAlign: 'center' }}>
          <p className="h2 tnum" style={display}>{n}</p>
          <p style={{ ...font(12), ...subtle, marginTop: 4 }}>{l}</p>
        </View>
      ))}
    </View>
  )
}

// Four moves that carry their own order: each title picks up the noun the one
// before it left, so the sequence reads without being counted out.
function Beats() {
  return (
    <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16, marginTop: 56 }}>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {BEATS.map((b) => (
          <View key={b.title} className="card" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 24 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 12, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-fg)', marginBottom: 16 }}>
              <Icon name={b.icon} size={18} />
            </span>
            <h3 style={{ fontWeight: 500 }}>{b.title}</h3>
            <p style={{ ...font(14), ...muted, marginTop: 6, lineHeight: 1.625 }}>{b.body}</p>
          </View>
        ))}
      </View>
      <View className="card-2" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 6, padding: 20 }}>
        <p style={{ ...font(12, 600), ...subtle, textTransform: 'uppercase', letterSpacing: '0.04em' }}>One path through</p>
        <p style={{ ...font(14), ...muted, lineHeight: 1.625 }}>
          Deposit wstETH. Borrow xETH up to 90%. The xETH is yours to move, and Lido and EigenLayer
          staking yield is applied to the loan behind you. Convert xETH back to ETH through the
          transmuter when you want out.
        </p>
      </View>
    </View>
  )
}

// -- Why 90% holds -----------------------------------------------------------
//
// The old page asserted "no liquidation fear" and left the reason out. The
// reason is the most interesting true thing here, so it gets the panel with the
// glow on it and the arithmetic to back it up.

function LikeKind() {
  // Debt over collateral, with no price term anywhere in it. That absence is
  // the argument: the same two quantities give the same ratio at every price,
  // which is why both cards below print the identical number.
  const ltv = DEBT / COLLATERAL
  return (
    <View className="hero" style={{ ...panel, display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', position: 'relative', marginTop: 56 }}>
      <div className="accent-glow" style={{ ...glow(420), top: -140, right: -80 }} />
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', position: 'relative', maxWidth: 640 }}>
        <h3 className="h2" style={display}>Both sides of the loan are the same asset.</h3>
        <p style={{ ...muted, marginTop: 16, lineHeight: 1.625 }}>
          You borrow xETH against ETH, never dollars against ETH. When the price of ETH moves, the
          collateral and the debt move together, and the ratio between them is unchanged by price
          alone.
        </p>
        <p style={{ ...muted, marginTop: 12, lineHeight: 1.625 }}>
          A dollar loan against volatile collateral has a liquidation price: the point where the
          collateral stops covering what you owe. A like-kind loan has no such price. That is what
          a 90% ceiling rests on — arithmetic, not a view about where the market goes.
        </p>
      </View>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 28, position: 'relative' }}>
        {PRICES.map((p) => <Priced key={p} price={p} ltv={ltv} />)}
      </View>
      {/* The argument is sound only while the synthetic tracks its underlying,
          and that tracking is set by how each vault is configured at deploy —
          the protocol takes three token addresses and does not check they are
          like-kind. Stating the ceiling without stating what it rests on is the
          half that would not survive review. */}
      <p style={{ ...font(12), ...subtle, marginTop: 16, position: 'relative', lineHeight: 1.625, maxWidth: 640 }}>
        The same position at two prices, {DROP}% apart. Both sides fall together, so the ratio
        holds. It holds while the synthetic tracks its underlying — a property of how each vault is
        configured, not one the protocol enforces.
      </p>
    </View>
  )
}

function Priced({ price, ltv }: { price: number; ltv: number }) {
  const rows: [string, string, number][] = [
    ['Collateral', `${COLLATERAL} ETH`, COLLATERAL * price],
    ['Debt', `${DEBT} xETH`, DEBT * price],
  ]
  return (
    <View className="card-2" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 12, padding: 20 }}>
      <p style={{ ...font(12), ...subtle }}>ETH at {dollars(price)}</p>
      <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8 }}>
        {rows.map(([label, held, worth]) => (
          <View key={label} style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', alignItems: 'baseline', gap: 12 }}>
            <dt style={{ ...font(14), ...subtle }}>{label}</dt>
            <dd className="tnum" style={{ ...font(14), textAlign: 'right' }}>{held}</dd>
            <dd className="tnum" style={{ ...font(14), ...muted }}>{dollars(worth)}</dd>
          </View>
        ))}
      </dl>
      <View style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', gap: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
        <span style={{ ...font(14), ...subtle }}>Loan to value</span>
        <span className="tnum" style={{ ...font(18, 600), color: 'var(--color-positive)' }}>{formatPercent(ltv * 100, 0)}</span>
      </View>
    </View>
  )
}

// -- What it is built out of -------------------------------------------------

function Machinery() {
  return (
    <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16, marginTop: 56 }}>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <View className="card" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 24 }}>
          <h3 style={{ fontWeight: 500 }}>x* tokens</h3>
          <p style={{ ...font(14), ...muted, marginTop: 6, lineHeight: 1.625 }}>
            The x is for multiplied. Six debt tokens across Lux, Zoo, Hanzo and Pars, each one
            redeemable for its own underlying through that vault’s transmuter.
          </p>
          {/* Six tokens read as two rows of three; letting them auto-fit strands
              the last one on a line of its own at most widths. */}
          <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, marginTop: 16 }}>
            {XTOKENS.map((t) => (
              <View key={t} className="card-2" style={{ display: 'grid', placeItems: 'center', paddingBlock: 10 }}>
                <p style={font(14, 500)}>{t}</p>
              </View>
            ))}
          </View>
        </View>
        <View className="card" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 24 }}>
          <h3 style={{ fontWeight: 500 }}>Positions are NFTs</h3>
          <p style={{ ...font(14), ...muted, marginTop: 6, lineHeight: 1.625 }}>
            Every position is an NFT: transferable, composable, tradeable wherever the standard is
            supported. The collateral and the debt travel together with the token, so selling the
            position sells both halves at once.
          </p>
        </View>
      </View>
      <View className="card" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 24 }}>
        <h3 style={{ fontWeight: 500 }}>Mix-Yield Token strategies</h3>
        <p style={{ ...font(14), ...muted, marginTop: 6, lineHeight: 1.625 }}>
          Where the collateral actually works. Each vault names the strategies it allocates to, and
          the yield they return is applied to your debt. Nothing to schedule.
        </p>
        <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 8, marginTop: 16 }}>
          {MYT.map(([protocol, ticker]) => (
            <View key={ticker} className="card-2" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 2, paddingInline: 12, paddingBlock: 10 }}>
              <p style={{ ...font(12), ...subtle, ...truncate }}>{protocol}</p>
              <p style={{ ...font(14, 500), ...truncate }}>{ticker}</p>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

// -- The live catalog --------------------------------------------------------
//
// The same card the Earn screen draws, from the same endpoint. A landing page
// that quotes different vaults than the app behind it reads as two companies.

function Vaults({ vaults }: { vaults: Vault[] }) {
  return (
    <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', marginTop: 56 }}>
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center', textAlign: 'center' }}>
        <h3 className="h2" style={display}>Open vaults</h3>
        <p style={{ ...muted, marginTop: 12, maxWidth: 512 }}>
          Each one takes a single collateral and issues its own synthetic against it. Rates are
          today’s, and they move.
        </p>
      </View>
      {/* Wide enough that four vaults land two by two rather than three and a
          straggler, and that a vault name never has to truncate. The min() is
          load-bearing: a bare 380px track cannot shrink under a 390px phone and
          would push the whole page sideways. */}
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 16, marginTop: 32 }}>
        {vaults.map((v) => (
          <View key={v.id} className="card" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16, padding: 20, textAlign: 'left' }}>
            <View style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', alignItems: 'start', gap: 12 }}>
              <AssetAvatar code={v.underlying} />
              <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)' }}>
                <p style={{ fontWeight: 500, ...truncate }}>{v.name}</p>
                <p style={{ ...font(12), ...subtle, ...truncate }}>{v.collateral} → {v.synthetic}</p>
              </View>
              <View style={{ display: 'grid', textAlign: 'right' }}>
                <p className="tnum" style={{ fontWeight: 500, color: 'var(--color-positive)' }}>{formatPercent(v.apy)}</p>
                <p style={{ ...font(12), ...subtle }}>APY</p>
              </View>
            </View>
            <p style={{ ...font(14), ...muted, lineHeight: 1.625 }}>{v.description}</p>
            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', columnGap: 20 }}>
              <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 2 }}>
                <dt style={{ ...font(12), ...subtle }}>Max LTV</dt>
                <dd className="tnum" style={{ ...font(14, 500) }}>{formatPercent(v.maxLtv * 100, 0)}</dd>
              </View>
              <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 2 }}>
                <dt style={{ ...font(12), ...subtle }}>Value locked</dt>
                <dd className="tnum" style={{ ...font(14, 500) }}>{compact(v.tvlUsd)}</dd>
              </View>
            </dl>
          </View>
        ))}
      </View>
    </View>
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
