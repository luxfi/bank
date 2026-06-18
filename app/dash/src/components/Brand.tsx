// Lux brand mark — the canonical downward triangle (▼). The triangle alone IS
// the mark; we do NOT spell "Lux" by gluing "ux" onto it. Black/white only;
// the triangle inherits currentColor so it themes with its container.

export function Triangle({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      <path d="M50 84 L14 26 L86 26 Z" />
    </svg>
  )
}

// Brand lockup: the ▼ mark followed by the plain product name. `label={null}`
// renders the mark alone (e.g. a compact nav). No "ux" glyph trickery.
export function Wordmark({
  className = '',
  mark = 'h-[1.1em] w-[1.1em]',
  label = 'Lux Financial' as string | null,
}: {
  className?: string
  mark?: string
  label?: string | null
}) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <Triangle className={mark} />
      {label ? <span>{label}</span> : null}
    </span>
  )
}
