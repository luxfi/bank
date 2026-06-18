import { Link } from 'react-router'
import { Triangle, Wordmark } from '@/components/Brand'

// Public marketing landing for lux.financial — positioning mirrors the
// canonical Lux Financial site (luxfi/financial app/site): enterprise crypto
// infrastructure, post-quantum secure. Lux look & feel: black/white, the ▼
// mark, minimalist. CTAs route into the account app (/login → /app).

const STATS: [string, string][] = [
  ['<10s', 'Cross-Chain Teleport'],
  ['15+', 'Blockchain Networks'],
  ['20+', 'Staking Networks'],
  ['PQ', 'Post-Quantum Ready'],
]

const BADGES = ['Teleport', 'MPC + HSM', 'Post-Quantum', 'Staking']

const FEATURES = [
  {
    title: 'Teleport: Instant Cross-Chain',
    body: 'Move assets between Ethereum, Polygon, Arbitrum, Base, Solana and 15+ chains in seconds. No bridges, no delays, no risk.',
  },
  {
    title: 'MPC + KMS + HSM Security',
    body: 'Multi-party computation custody with enterprise key management. HSM integration for AWS CloudHSM, Azure, and Thales.',
  },
  {
    title: 'Omni-Chain Treasury',
    body: 'Unified wallet and treasury across all chains — real-time balance aggregation, automated rebalancing, and FX optimization.',
  },
  {
    title: 'Post-Quantum Ready',
    body: 'Future-proof cryptography with CRYSTALS-Dilithium, Kyber, and SPHINCS+. Banking-grade security for the quantum era.',
  },
  {
    title: 'Staking & Validators',
    body: 'Run validators and stake across 20+ PoS networks. Liquid staking, automated compounding, institutional-grade yields.',
  },
  {
    title: 'Global Fiat Rails',
    body: 'Convert crypto to local currency in 40+ countries. Real-time settlement via ACH, SEPA, SWIFT, PIX, SPEI, and UPI.',
  },
]

export function Landing() {
  return (
    <div className="min-h-full bg-white text-black dark:bg-black dark:text-white">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Closing />
      <Footer />
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Wordmark className="text-xl" />
        <nav className="flex items-center gap-2 text-sm">
          <a href="#platform" className="hidden px-3 py-2 opacity-70 hover:opacity-100 sm:inline">
            Platform
          </a>
          <Link to="/login" className="px-3 py-2 opacity-70 hover:opacity-100">
            Login
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Triangle className="pointer-events-none absolute -right-16 -top-24 h-[34rem] w-[34rem] text-black/[0.03] dark:text-white/[0.04]" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-1 text-xs font-medium opacity-70 dark:border-white/15">
          Institutional-grade digital asset infrastructure
        </span>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          Enterprise crypto infrastructure. Post-quantum secure.
        </h1>
        <p className="mt-6 max-w-2xl text-lg opacity-70 md:text-xl">
          Teleport assets across 15+ chains instantly. MPC custody with HSM integration.
          Treasury management, staking, and validators — everything banks, funds, and crypto
          corporates need.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/login"
            className="rounded-full bg-black px-6 py-3 font-medium text-white dark:bg-white dark:text-black"
          >
            Get Started
          </Link>
          <a
            href="mailto:sales@lux.financial"
            className="rounded-full border border-black/20 px-6 py-3 font-medium hover:bg-black/[0.03] dark:border-white/20 dark:hover:bg-white/[0.05]"
          >
            Talk to Sales
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <span
              key={b}
              className="rounded-full border border-black/15 px-3 py-1 text-xs opacity-70 dark:border-white/15"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="border-y border-black/10 dark:border-white/10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
        {STATS.map(([v, l]) => (
          <div key={l} className="px-6 py-10 text-center">
            <div className="text-4xl font-semibold tracking-tight">{v}</div>
            <div className="mt-1 text-sm opacity-60">{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="platform" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
        Everything you need to operate in crypto.
      </h2>
      <p className="mt-4 max-w-2xl opacity-60">
        Teleport, custody, treasury, staking, validators, and global fiat rails — post-quantum
        secure, available standalone or fully white-labeled.
      </p>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/10 dark:bg-white/10">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-white p-8 dark:bg-black">
            <Triangle className="h-5 w-5 opacity-90" />
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-60">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="bg-black text-white dark:bg-white dark:text-black">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          Banks adding crypto. Funds deploying to DeFi. Corporates managing treasury.
        </h2>
        <p className="mt-4 max-w-xl opacity-70">All on post-quantum secure infrastructure.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded-full bg-white px-6 py-3 font-medium text-black dark:bg-black dark:text-white"
          >
            Get Started
          </Link>
          <a
            href="mailto:sales@lux.financial"
            className="rounded-full border border-white/30 px-6 py-3 font-medium hover:bg-white/10 dark:border-black/30 dark:hover:bg-black/5"
          >
            Talk to Sales
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm opacity-60 sm:flex-row">
      <Wordmark />
      <span>© Lux Financial. Institutional-grade, post-quantum secure.</span>
    </footer>
  )
}
