import { useState, type ReactNode, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { formatMoney, formatUSD, capitalize } from '@/lib/format'
import { useConfig } from '@/lib/config'
import { View } from '@/gui'

// -- Layout vocabulary --
//
// Every arrangement in the product is one of a handful of grids, so they are
// named once here rather than spelled out at each call site. `line` is a row of
// items along a track; `split` pushes the last item to the far edge; `stack` is
// vertical rhythm.

export const line = (gap: number, align: CSSProperties['alignItems'] = 'center'): CSSProperties =>
  ({ display: 'grid', gridAutoFlow: 'column', justifyContent: 'start', alignItems: align, gap })

export const split = (gap: number, align: CSSProperties['alignItems'] = 'center'): CSSProperties =>
  ({ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: align, gap })

export const stack = (gap = 0): CSSProperties => ({ display: 'grid', gap })

export const center: CSSProperties = { display: 'grid', placeItems: 'center' }

// A pill (.btn, .chip) is a single row of content centred in its own box.
export const pill = (gap: number | string, justify: CSSProperties['justifyContent'] = 'center'): CSSProperties =>
  ({ display: 'inline-grid', gridAutoFlow: 'column', alignItems: 'center', justifyContent: justify, gap })

// .chip's own gap, so a badge measures the same as the class it wears.
const chip = pill('0.35rem')

// -- Type --
//
// A size carries its own leading, so a 12px line always occupies 16px of
// rhythm and a two-line row measures the same wherever it lands. Sizes off the
// scale keep the inherited leading — that is what they were drawn against.

const LEADING: Record<number, number> = { 12: 16, 14: 20, 16: 24, 18: 28, 20: 28, 24: 32 }

export const font = (size: number, weight?: number): CSSProperties =>
  ({ fontSize: size, lineHeight: `${LEADING[size] ?? 24}px`, ...(weight === undefined ? null : { fontWeight: weight }) })

// A line that gives up its tail rather than its row.
export const truncate: CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

// Two hues the product borrows from outside the token set. They are states, not
// brand: a warning reads amber and a freeze reads cold under every brand.
const AMBER = 'oklch(0.879 0.169 91.605)'
const SKY = 'oklch(0.828 0.111 230.318)'

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
  close: 'M6 6l12 12M18 6 6 18',
  // A sprout: one stem, two leaves. Yield that grows on what you already hold.
  earn: 'M12 21V11M12 11c0-5 4-8 9-8 0 5-4 8-9 8ZM12 16c0-4.5-3.5-8-9-8 0 4.5 3.5 8 9 8Z',
}

// A mark is square, so one number sizes it. `size` is the SVG's own width and
// height, which a caller's width class still overrides — CSS outranks an
// attribute — so a screen can size a mark either way while it is being moved.
export function Icon({ name, size = 20, className }: { name: keyof typeof paths | string; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
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
    <button className={`btn btn-${variant} ${className}`} disabled={disabled || loading} style={pill(8)} {...rest}>
      {loading ? <Spinner /> : children}
    </button>
  )
}

// The arc turns, the ring stays. The turn lives in the drawing rather than in a
// stylesheet, so a spinner spins wherever it is dropped.
export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

// -- Money --

export function Money({
  minor, currency, decimals, className = '', style, sign,
}: { minor: number; currency: string; decimals?: number; className?: string; style?: CSSProperties; sign?: 'credit' | 'debit' }) {
  const prefix = sign === 'credit' ? '+' : sign === 'debit' ? '−' : ''
  return (
    <span className={`tnum ${className}`} style={{ ...(sign === 'credit' ? { color: 'var(--color-positive)' } : null), ...style }}>
      {prefix}
      {formatMoney(minor, currency, decimals)}
    </span>
  )
}

// -- Status badge --

const statusStyle: Record<string, CSSProperties> = {
  completed: { color: 'var(--color-positive)', borderColor: 'rgba(52,211,153,0.3)' },
  active: { color: 'var(--color-positive)', borderColor: 'rgba(52,211,153,0.3)' },
  approved: { color: 'var(--color-positive)', borderColor: 'rgba(52,211,153,0.3)' },
  pending: { color: AMBER, borderColor: 'rgba(251,191,36,0.3)' },
  processing: { color: AMBER, borderColor: 'rgba(251,191,36,0.3)' },
  frozen: { color: SKY, borderColor: 'rgba(125,211,252,0.3)' },
  failed: { color: 'var(--color-negative)', borderColor: 'rgba(248,113,113,0.3)' },
  cancelled: { color: 'var(--color-fg-subtle)', borderColor: 'var(--color-border)' },
}
export function StatusBadge({ status }: { status: string }) {
  const s = statusStyle[status] || { color: 'var(--color-fg-muted)', borderColor: 'var(--color-border)' }
  return <span className="chip" style={{ ...chip, ...s }}>{capitalize(status)}</span>
}

// -- Card container --

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`card ${className}`} style={{ ...stack(), alignContent: 'start', padding: 20 }}>{children}</View>
}

// -- Section header --

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={{ ...split(12), marginBottom: 12 }}>
      <h2 style={{ ...font(14, 600), color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{title}</h2>
      {action}
    </View>
  )
}

// -- Page header --
//
// Every screen opens the same way: what it is, then what it is for. One
// component so the two lines never drift apart across pages.

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <View style={split(16, 'start')}>
      <View style={{ ...stack(2), minWidth: 0 }}>
        <h1 style={{ ...font(24, 600), letterSpacing: '-0.025em' }}>{title}</h1>
        <p style={{ ...font(14), color: 'var(--color-fg-muted)' }}>{subtitle}</p>
      </View>
      {action}
    </View>
  )
}

// -- Action tile --
//
// The square affordances that open the next screen (Send, Exchange, Buy…) or
// toggle a panel in place. Both shapes carry the same weight and the same
// press, because to the hand they are the same thing.

export function ActionTile({
  label, icon, to, onClick, active,
}: { label: string; icon: string; to?: string; onClick?: () => void; active?: boolean }) {
  const face = (
    <>
      <span style={{ ...center, width: 40, height: 40, borderRadius: 9999, background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}>
        <Icon name={icon} size={18} />
      </span>
      <span style={font(12, 500)}>{label}</span>
    </>
  )
  const cls = 'card-2 tile'
  const box: CSSProperties = { ...stack(8), justifyItems: 'center', paddingBlock: 16 }
  return to ? (
    <Link to={to} className={cls} style={box}>{face}</Link>
  ) : (
    <button type="button" onClick={onClick} aria-pressed={active} className={cls} style={box}>{face}</button>
  )
}

// -- Asset row --
//
// One line of a holdings list: the mark, what it is, how much is there and what
// that is worth. Dashboard, Accounts and Wallet all show the same line, and it
// goes the same place — the pair that trades this asset.

export function AssetRow({
  code, note, minor, decimals, valueUsd,
}: { code: string; note: string; minor: number; decimals?: number; valueUsd: number }) {
  return (
    <Link
      to={`/app/exchange?from=${code}&to=${code === 'USD' ? 'EUR' : 'USD'}`}
      className="row"
      style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 12, paddingInline: 16, paddingBlock: 14 }}
    >
      <AssetAvatar code={code} />
      <View style={{ ...stack(), minWidth: 0 }}>
        <p style={{ fontWeight: 500 }}>{code}</p>
        <p style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>{note}</p>
      </View>
      <View style={{ ...stack(), textAlign: 'right' }}>
        <Money minor={minor} currency={code} decimals={decimals} style={{ fontWeight: 500 }} />
        <p className="tnum" style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>{formatUSD(valueUsd)}</p>
      </View>
    </Link>
  )
}

// -- Empty state --

export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body: string; action?: ReactNode }) {
  return (
    <View className="card" style={{ display: 'grid', justifyItems: 'center', alignContent: 'center', textAlign: 'center', paddingBlock: 56, paddingInline: 24 }}>
      <View style={{ ...center, width: 48, height: 48, borderRadius: 16, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-fg-muted)', marginBottom: 16 }}>
        <Icon name={icon} size={24} />
      </View>
      <p style={{ fontWeight: 500 }}>{title}</p>
      <p style={{ ...font(14), color: 'var(--color-fg-subtle)', marginTop: 4, maxWidth: 320 }}>{body}</p>
      {action && <View style={{ ...stack(), marginTop: 20 }}>{action}</View>}
    </View>
  )
}

// -- Copyable identifier row (IBAN, wallet address) --
//
// A missing identifier is a state, not a value: the row says what is missing
// and stays inert rather than offering a copy button for an empty string.

export function CopyRow({
  label, value, display, empty = 'Not available', className = '', style, mono = true,
}: { label: string; value?: string; display?: string; empty?: string; className?: string; style?: CSSProperties; mono?: boolean }) {
  const [copied, setCopied] = useState(false)
  const [hot, setHot] = useState(false)
  if (!value) {
    return (
      <View className={className} style={{ ...split(12), ...style }}>
        <View style={{ ...stack(), minWidth: 0 }}>
          <p style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>{label}</p>
          <p style={{ ...font(14), color: 'var(--color-fg-muted)' }}>{empty}</p>
        </View>
      </View>
    )
  }
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      className={`row ${className}`}
      style={{ ...split(12), width: '100%', textAlign: 'left', borderRadius: 8, ...style }}
    >
      <View style={{ ...stack(), minWidth: 0 }}>
        <p style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>{label}</p>
        <p style={mono ? { fontFamily: 'var(--font-mono)', ...font(14), ...truncate } : font(14)}>{display ?? value}</p>
      </View>
      <span style={{ color: hot ? 'var(--color-fg)' : 'var(--color-fg-muted)' }}>
        <Icon name={copied ? 'check' : 'copy'} size={16} />
      </span>
    </button>
  )
}

// -- Skeleton --

export function Skeleton({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />
}

// -- Asset avatar --
//
// Every asset gets a mark of the same weight: LUX its triangle, each coin its
// own gradient, and fiat the currency's own symbol on one shared blue disc.
// The symbol comes from the currency itself, so a ledger that adds JPY or CHF
// draws them without a table to update here.

const assetColors: Record<string, CSSProperties> = {
  BTC: { background: 'linear-gradient(to bottom right, oklch(0.828 0.189 84.429), oklch(0.705 0.213 47.604))', color: '#000' },
  ETH: { background: 'linear-gradient(to bottom right, oklch(0.673 0.182 276.935), oklch(0.606 0.25 292.717))', color: '#fff' },
  DAI: { background: 'linear-gradient(to bottom right, oklch(0.905 0.182 98.111), oklch(0.828 0.189 84.429))', color: '#000' },
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

export function AssetAvatar({ code, size = 36, className = '' }: { code: string; size?: number; className?: string }) {
  const c = code.toUpperCase()
  const disc: CSSProperties = { ...center, width: size, height: size, borderRadius: 9999 }
  // LUX ▼ mark — theme-aware disc so it reads on both dark and light surfaces.
  if (c === 'LUX') {
    return (
      <View className={className} style={{ ...disc, background: 'var(--color-fg)', color: 'var(--color-bg)' }}>
        <Triangle size={16} />
      </View>
    )
  }
  const crypto = assetColors[c]
  if (crypto) {
    return (
      <View className={className} style={{ ...disc, ...crypto, fontSize: 10.4 }}>
        <span>{c.slice(0, 3)}</span>
      </View>
    )
  }
  const mark = currencyMark(c)
  return (
    <div
      className={className}
      style={{
        ...disc,
        background: 'linear-gradient(to bottom right, oklch(0.746 0.16 232.661), oklch(0.546 0.245 262.881))',
        color: '#fff',
        fontWeight: 600,
        ...(mark.length > 1 ? { fontSize: 9.6, letterSpacing: '-0.025em' } : { fontSize: 15.2 }),
      }}
      title={c}
    >
      {mark}
    </div>
  )
}
function Triangle({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M50 78 L18 28 L82 28 Z" />
    </svg>
  )
}

// -- Modal / bottom sheet --

// A dialog belongs to the viewport, not to whatever panel opened it. Rendering
// into the body puts it outside the shell's stacking context, so it covers the
// mobile tab bar instead of losing its bottom edge — and its own bar under it —
// to a nav that sits higher in the tree.

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return createPortal(
    <div
      className="overlay"
      style={{ display: 'grid', position: 'fixed', inset: 0, zIndex: 50 }}
      role="dialog"
      aria-modal="true"
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      {/* .sheet is the bottom-sheet-then-card shape: width, corners and the
          safe-area inset all belong to it, so nothing here sets them. */}
      <View
        className="card rise sheet"
        style={{ ...stack(), alignContent: 'start', position: 'relative', zIndex: 10, paddingTop: 20, paddingInline: 20, maxHeight: '92vh', overflowY: 'auto' }}
      >
        {children}
      </View>
    </div>,
    document.body,
  )
}

// -- Field wrapper --

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label style={stack(6)}>
      <span className="label">{label}</span>
      {children}
      {hint && <span style={{ fontSize: 11.52, color: 'var(--color-fg-subtle)' }}>{hint}</span>}
    </label>
  )
}

// -- Sandbox badge --

export function SandboxBadge({ className = '' }: { className?: string }) {
  const config = useConfig()
  if (config && !config.sandbox) return null
  return (
    <span
      className={`chip ${className}`}
      style={{ ...chip, color: AMBER, borderColor: 'rgba(251,191,36,0.35)', background: 'rgba(251,191,36,0.06)' }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: AMBER }} />
      <span>Sandbox</span>
    </span>
  )
}

// re-export for convenience
export { formatUSD }
