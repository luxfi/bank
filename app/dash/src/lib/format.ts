// Amounts are stored in minor units. `decimals` (from the API) tells us the
// scale; fiat renders with Intl currency, crypto as a code-suffixed number.

const CRYPTO = new Set(['LUX', 'BTC', 'ETH', 'DAI'])

const fiatDecimals: Record<string, number> = { JPY: 0, KRW: 0, BHD: 3, KWD: 3, OMR: 3 }

export function isCrypto(currency: string): boolean {
  return CRYPTO.has(currency.toUpperCase())
}

export function decimalsOf(currency: string, decimals?: number): number {
  if (typeof decimals === 'number') return decimals
  const c = currency.toUpperCase()
  if (isCrypto(c)) return 6
  return fiatDecimals[c] ?? 2
}

// toMinor converts a major-unit string/number to integer minor units.
export function toMinor(amount: string | number, currency: string, decimals?: number): number {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  if (!isFinite(n)) return 0
  return Math.round(n * Math.pow(10, decimalsOf(currency, decimals)))
}

// major converts minor units to a major-unit number.
export function toMajor(minor: number, currency: string, decimals?: number): number {
  return minor / Math.pow(10, decimalsOf(currency, decimals))
}

// formatMoney renders a minor-unit amount for display.
export function formatMoney(minor: number, currency: string, decimals?: number): string {
  const c = currency.toUpperCase()
  const d = decimalsOf(c, decimals)
  const major = minor / Math.pow(10, d)
  if (isCrypto(c)) {
    const n = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(d, 6),
    }).format(major)
    return `${n} ${c}`
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: c,
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(major)
  } catch {
    return `${major.toFixed(d)} ${c}`
  }
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
}

// currencySymbol returns just the symbol for a fiat currency (best effort).
export function currencySymbol(currency: string): string {
  const c = currency.toUpperCase()
  if (isCrypto(c)) return c
  try {
    const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency: c }).formatToParts(0)
    return parts.find((p) => p.type === 'currency')?.value ?? c
  } catch {
    return c
  }
}

export function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatDateShort(iso: string): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(iso),
  )
}

export function relativeTime(iso: string): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return formatDateShort(iso)
}

export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

export function shortAddress(addr: string): string {
  if (!addr || addr.length < 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
