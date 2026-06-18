// Lux brand mark — the canonical downward triangle (▼) that stands in for the
// "L" in Lux. Geometry matches the luxfi mark (apex down). Black/white only;
// the triangle inherits currentColor so it themes with its container.

export function Triangle({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      <path d="M50 84 L14 26 L86 26 Z" />
    </svg>
  )
}

// Wordmark: the ▼ triangle followed by "ux", reading as "Lux". `financial`
// appends the product word. Used in the nav, login, and app shell.
export function Wordmark({
  className = '',
  mark = 'h-[1em] w-[1em]',
  financial = true,
}: {
  className?: string
  mark?: string
  financial?: boolean
}) {
  return (
    <span className={`inline-flex items-baseline font-semibold tracking-tight ${className}`}>
      <Triangle className={`${mark} translate-y-[0.12em]`} />
      <span>ux{financial ? <span className="font-normal opacity-80">&nbsp;Financial</span> : null}</span>
    </span>
  )
}
