// Amounts are stored in minor units (cents). Convert to major units for display.

const currencyDecimals: Record<string, number> = {
  BHD: 3,
  KWD: 3,
  OMR: 3,
  JPY: 0,
  KRW: 0,
}

function decimals(currency: string): number {
  return currencyDecimals[currency.toUpperCase()] ?? 2
}

export function formatAmount(minorUnits: number, currency: string): string {
  const d = decimals(currency)
  const major = minorUnits / Math.pow(10, d)
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(major)
}

export function formatDate(iso: string): string {
  if (!iso) return '-'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatDateShort(iso: string): string {
  if (!iso) return '-'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso))
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
