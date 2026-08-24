import { useBrand } from '@/hooks/brand'
import { pill } from '@/components/ui'

// Lux ▼ mark — the downward triangle. Inherits currentColor. `size` is any CSS
// length, so the mark can be given a px box or told to follow the text it sits
// beside; a caller's width class still overrides it.
export function Triangle({ size = 24, className }: { size?: number | string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
      <path d="M50 84 L14 26 L86 26 Z" />
    </svg>
  )
}

// Brand lockup — resolves at runtime from the active brand:
//   - lux: ▼ triangle + "Lux Financial"
//   - acm: plain bold lowercase "acm" (no mark), like acmglobaltech.com
// `size` is the wordmark's own type size, so a caller sets the lockup directly
// rather than sizing an ancestor and hoping it inherits.
export function Wordmark({ className = '', showLabel = true, size }: { className?: string; showLabel?: boolean; size?: number }) {
  const brand = useBrand()

  if (brand.wordmark === 'plain') {
    // Intrinsic large size + heavy weight so the acm wordmark reads as the brand
    // (callers pass no text-size → it must not inherit a tiny ~14px).
    return (
      <span
        className={className}
        style={{ ...pill(0, 'start'), fontSize: size ?? 20, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.025em', textTransform: 'lowercase' }}
      >
        {brand.wordmarkLabel}
      </span>
    )
  }

  return (
    <span className={className} style={{ ...pill(8, 'start'), fontWeight: 600, letterSpacing: '-0.025em', ...(size ? { fontSize: size } : null) }}>
      <Triangle size="1.1em" />
      {showLabel && <span>{brand.wordmarkLabel}</span>}
    </span>
  )
}
