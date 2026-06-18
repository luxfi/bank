import { Link } from 'react-router'
import { Triangle, Wordmark } from '@/components/Brand'

// Customer-focused B2C landing for the consumer bank (Lux Financial). The
// institutional story lives on the main site (lux.financial); this page sells
// the personal/business account and routes new customers into signup.

const STATS: [string, string][] = [
  ['30+', 'Currencies'],
  ['<2 min', 'To open an account'],
  ['T+0', 'Internal transfers'],
  ['24/7', 'Access'],
]

const FEATURES = [
  {
    title: 'Multi-currency accounts',
    body: 'Hold 30+ currencies in one account — personal or business. See available and pending balances in real time.',
  },
  {
    title: 'Send money worldwide',
    body: 'Pay people and businesses globally with the right rail chosen for you. Clear fees up front, status tracked end to end.',
  },
  {
    title: 'Convert at great rates',
    body: 'Lock an FX rate and convert between your balances instantly — institutional pricing, no hidden spread.',
  },
  {
    title: 'A crypto wallet, built in',
    body: 'Every account comes with a non-custodial MPC wallet — your keys protected by threshold cryptography, not a single point of failure.',
  },
  {
    title: 'Bank-grade security',
    body: 'Hanzo IAM sign-in, KMS-managed secrets, and continuous compliance — KYC, sanctions, and AML screening built in.',
  },
  {
    title: 'Open in minutes',
    body: 'Sign up, verify, and start moving money the same day. No branches, no paperwork, no waiting.',
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
          <a href="#features" className="hidden px-3 py-2 opacity-70 hover:opacity-100 sm:inline">
            Features
          </a>
          <Link to="/login" className="px-3 py-2 opacity-70 hover:opacity-100">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black"
          >
            Open account
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
          Personal & business banking
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          Money without borders.
        </h1>
        <p className="mt-6 max-w-xl text-lg opacity-70 md:text-xl">
          One account to hold, send, and convert money across 30+ currencies — with a built-in
          non-custodial crypto wallet. Open yours in minutes.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/signup"
            className="rounded-full bg-black px-6 py-3 font-medium text-white dark:bg-white dark:text-black"
          >
            Open an account
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-black/20 px-6 py-3 font-medium hover:bg-black/[0.03] dark:border-white/20 dark:hover:bg-white/[0.05]"
          >
            Sign in
          </Link>
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
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
        Everything your money needs, in one account.
      </h2>
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
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
          Open your account today.
        </h2>
        <Link
          to="/signup"
          className="rounded-full bg-white px-6 py-3 font-medium text-black dark:bg-black dark:text-white"
        >
          Get started
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm opacity-60 sm:flex-row">
      <Wordmark />
      <span>© Lux Financial. Banking, FX, and a non-custodial wallet.</span>
    </footer>
  )
}
