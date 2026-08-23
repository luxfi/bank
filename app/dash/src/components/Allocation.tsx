import { useState } from 'react'
import { stack } from '@/components/ui'
import { View } from '@/gui'

// The mix behind the headline figure: the total says how much, this says what
// of. One bar, one line per asset, heaviest first — weight is carried by the
// foreground colour's own opacity ramp, so it reads the same in either theme
// and never competes with the coloured marks in the list underneath.
//
// A single balance has no mix, so the block simply is not there.

const RAMP = [1, 0.68, 0.48, 0.34, 0.24, 0.17, 0.12]
const shade = (i: number) => RAMP[Math.min(i, RAMP.length - 1)]

export interface Slice {
  code: string
  valueUsd: number
}

export function Allocation({ items, className = '' }: { items: Slice[]; className?: string }) {
  const [hot, setHot] = useState<string | null>(null)

  const held = items.filter((i) => i.valueUsd > 0)
  const total = held.reduce((s, i) => s + i.valueUsd, 0)
  if (held.length < 2 || total <= 0) return null

  const sorted = [...held].sort((a, b) => b.valueUsd - a.valueUsd)
  const share = (v: number) => (v / total) * 100
  const label = (v: number) => (share(v) < 1 ? '<1%' : `${Math.round(share(v))}%`)
  // Four lines, whatever the ledger holds: everything when it fits, otherwise
  // the three that matter and one line for the tail. A legend that grows with
  // the account changes the height of the hero it sits in.
  const fits = sorted.length <= 4
  const lead = fits ? sorted : sorted.slice(0, 3)
  const rest = fits ? [] : sorted.slice(3)
  const restUsd = rest.reduce((s, i) => s + i.valueUsd, 0)

  return (
    <View className={className} style={stack(12)}>
      {/* Each holding is a track sized by what it is worth — the bar is the
          allocation, not a picture of it. */}
      <div
        className="h-1.5"
        role="img"
        aria-label={`Allocation: ${sorted.map((s) => `${s.code} ${label(s.valueUsd)}`).join(', ')}`}
        style={{
          display: 'grid',
          gridTemplateColumns: sorted.map((s) => `minmax(0, ${s.valueUsd}fr)`).join(' '),
          gap: 3,
        }}
      >
        {sorted.map((s, i) => (
          <span
            key={s.code}
            title={`${s.code} · ${label(s.valueUsd)}`}
            style={{
              background: 'var(--color-fg)',
              opacity: hot && hot !== s.code ? shade(i) * 0.3 : shade(i),
            }}
            className="min-w-[3px] rounded-full transition-opacity duration-150"
          />
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-5 sm:grid-cols-4 md:grid-cols-1">
        {lead.map((s, i) => (
          <li key={s.code}>
            <div
              onMouseEnter={() => setHot(s.code)}
              onMouseLeave={() => setHot(null)}
              className="row -mx-1.5 rounded-md px-1.5 py-[3px]"
              style={legendRow}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--color-fg)', opacity: shade(i) }}
              />
              <span className="text-xs font-medium">{s.code}</span>
              <span className="text-xs tnum text-[var(--color-fg-subtle)]">{label(s.valueUsd)}</span>
            </div>
          </li>
        ))}
        {rest.length > 0 && (
          <li>
            <View className="-mx-1.5 rounded-md px-1.5 py-[3px]" style={legendRow}>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--color-fg)', opacity: shade(lead.length) }}
              />
              <span className="text-xs font-medium text-[var(--color-fg-muted)]">
                {rest.length} more
              </span>
              <span className="text-xs tnum text-[var(--color-fg-subtle)]">{label(restUsd)}</span>
            </View>
          </li>
        )}
      </ul>
    </View>
  )
}

// mark · code · share — the share sits at the far edge of its own row.
const legendRow = { display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 8 } as const
