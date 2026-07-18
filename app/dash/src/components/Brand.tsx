import { useBrand } from '@/hooks/brand'

// Lux ▼ mark — the downward triangle. Inherits currentColor.
export function Triangle({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      <path d="M50 84 L14 26 L86 26 Z" />
    </svg>
  )
}

// Brand lockup — resolves at runtime from the active brand:
//   - lux: ▼ triangle + "Lux Financial"
//   - acm: plain bold lowercase "acm" (no mark), like acmglobaltech.com
export function Wordmark({ className = '', showLabel = true }: { className?: string; showLabel?: boolean }) {
  const brand = useBrand()

  if (brand.wordmark === 'plain') {
    return (
      <span className={`inline-flex items-center font-bold tracking-tight lowercase ${className}`}>
        {brand.wordmarkLabel}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <Triangle className="h-[1.1em] w-[1.1em]" />
      {showLabel && <span>{brand.wordmarkLabel}</span>}
    </span>
  )
}
