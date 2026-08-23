import { useState, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { formatMoney, formatUSD, capitalize } from '@/lib/format'
import { useConfig } from '@/lib/config'

// -- Icons (inline; no icon dependency) --

const paths: Record<string, string> = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5',
  card: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Zm0 4h20',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  swap: 'M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8',
  coins: 'M9 8.5A5.5 5.5 0 1 0 9 19.5 5.5 5.5 0 0 0 9 8.5Zm6.5-4a5.5 5.5 0 1 1-4.9 8',
  activity: 'M3 12h4l3 8 4-16 3 8h4',
  plus: 'M12 5v14M5 12h14',
  lock: 'M6 10V8a6 6 0 1 1 12 0v2M5 10h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z',
  unlock: 'M7 10V8a5 5 0 0 1 9.6-2M5 10h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  arrowDown: 'M12 5v14M19 12l-7 7-7-7',
  copy: 'M8 8h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM4 16V5a1 1 0 0 1 1-1h11',
  check: 'M20 6 9 17l-5-5',
  chevron: 'M9 6l6 6-6 6',
  wallet: 'M3 7a2 2 0 0 1 2-2h12v4M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2Zm14 5h.01',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z',
  bank: 'M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M12 3 3 8h18l-9-5ZM3 21h18',
  menu: 'M4 6h16M4 12h16M4 18h16',
}

export function Icon({ name, className = 'w-5 h-5' }: { name: keyof typeof paths | string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? ''} />
    </svg>
  )
}

// -- Button --

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
}
export function Button({ variant = 'primary', loading, children, className = '', disabled, ...rest }: BtnProps) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={disabled || loading} {...rest}>
      {loading ? <Spinner /> : children}
    </button>
  )
}

export function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// -- Money --

export function Money({
  minor, currency, decimals, className = '', sign,
}: { minor: number; currency: string; decimals?: number; className?: string; sign?: 'credit' | 'debit' }) {
  const prefix = sign === 'credit' ? '+' : sign === 'debit' ? '−' : ''
  const color = sign === 'credit' ? 'text-[var(--color-positive)]' : ''
  return (
    <span className={`tnum ${color} ${className}`}>
      {prefix}
      {formatMoney(minor, currency, decimals)}
    </span>
  )
}

// -- Status badge --

const statusStyle: Record<string, string> = {
  completed: 'text-[var(--color-positive)] border-[color:rgba(52,211,153,0.3)]',
  active: 'text-[var(--color-positive)] border-[color:rgba(52,211,153,0.3)]',
  approved: 'text-[var(--color-positive)] border-[color:rgba(52,211,153,0.3)]',
  pending: 'text-amber-300 border-[color:rgba(251,191,36,0.3)]',
  processing: 'text-amber-300 border-[color:rgba(251,191,36,0.3)]',
  frozen: 'text-sky-300 border-[color:rgba(125,211,252,0.3)]',
  failed: 'text-[var(--color-negative)] border-[color:rgba(248,113,113,0.3)]',
  cancelled: 'text-[var(--color-fg-subtle)] border-[color:var(--color-border)]',
}
export function StatusBadge({ status }: { status: string }) {
  const s = statusStyle[status] || 'text-[var(--color-fg-muted)] border-[color:var(--color-border)]'
  return <span className={`chip ${s}`}>{capitalize(status)}</span>
}

// -- Card container --

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>
}

// -- Section header --

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">{title}</h2>
      {action}
    </div>
  )
}

// -- Empty state --

export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-2xl grid place-items-center bg-[var(--color-surface-2)] border text-[var(--color-fg-muted)] mb-4">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-[var(--color-fg-subtle)] mt-1 max-w-xs">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// -- Copyable identifier row (IBAN, wallet address) --
//
// A missing identifier is a state, not a value: the row says what is missing
// and stays inert rather than offering a copy button for an empty string.

export function CopyRow({
  label, value, display, empty = 'Not available', className = '', mono = true,
}: { label: string; value?: string; display?: string; empty?: string; className?: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false)
  if (!value) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--color-fg-subtle)]">{label}</p>
          <p className="text-sm text-[var(--color-fg-muted)]">{empty}</p>
        </div>
      </div>
    )
  }
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className={`w-full flex items-center gap-3 text-left group hover:bg-[var(--color-surface-2)]/50 transition-colors ${className}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--color-fg-subtle)]">{label}</p>
        <p className={mono ? 'font-mono text-sm truncate' : 'text-sm'}>{display ?? value}</p>
      </div>
      <span className="text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)]">
        <Icon name={copied ? 'check' : 'copy'} className="w-4 h-4" />
      </span>
    </button>
  )
}

// -- Skeleton --

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

// -- Asset avatar --
//
// Every asset gets a mark of the same weight: LUX its triangle, each coin its
// own gradient, and fiat the currency's own symbol on one shared blue disc.
// The symbol comes from the currency itself, so a ledger that adds JPY or CHF
// draws them without a table to update here.

const assetColors: Record<string, string> = {
  BTC: 'from-amber-400 to-orange-500 text-black',
  ETH: 'from-indigo-400 to-violet-500 text-white',
  DAI: 'from-yellow-300 to-amber-400 text-black',
}

function currencyMark(code: string): string {
  try {
    const parts = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: code, currencyDisplay: 'narrowSymbol',
    }).formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value ?? code
  } catch {
    return code
  }
}

export function AssetAvatar({ code, className = 'w-9 h-9' }: { code: string; className?: string }) {
  const c = code.toUpperCase()
  // LUX ▼ mark — theme-aware disc so it reads on both dark and light surfaces.
  if (c === 'LUX') {
    return (
      <div className={`${className} rounded-full grid place-items-center bg-[var(--color-fg)] text-[var(--color-bg)]`}>
        <Triangle />
      </div>
    )
  }
  const crypto = assetColors[c]
  if (crypto) {
    return (
      <div className={`${className} rounded-full grid place-items-center bg-gradient-to-br ${crypto} text-[0.65rem] font-bold`}>
        {c.slice(0, 3)}
      </div>
    )
  }
  const mark = currencyMark(c)
  return (
    <div
      className={`${className} rounded-full grid place-items-center bg-gradient-to-br from-sky-400 to-blue-600 text-white font-semibold ${
        mark.length > 1 ? 'text-[0.6rem] tracking-tight' : 'text-[0.95rem]'
      }`}
      title={c}
    >
      {mark}
    </div>
  )
}
function Triangle() {
  return (
    <svg viewBox="0 0 100 100" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M50 78 L18 28 L82 28 Z" />
    </svg>
  )
}

// -- Modal / bottom sheet --

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md card p-5 rounded-t-2xl sm:rounded-2xl rise max-h-[92vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

// -- Field wrapper --

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="block text-[0.72rem] text-[var(--color-fg-subtle)]">{hint}</span>}
    </label>
  )
}

// -- Sandbox badge --

export function SandboxBadge({ className = '' }: { className?: string }) {
  const config = useConfig()
  if (config && !config.sandbox) return null
  return (
    <span className={`chip text-amber-300 border-[color:rgba(251,191,36,0.35)] bg-[color:rgba(251,191,36,0.06)] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
      Sandbox
    </span>
  )
}

// re-export for convenience
export { formatUSD }
