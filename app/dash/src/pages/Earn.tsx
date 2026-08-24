import { useCallback, useEffect, useState } from 'react'
import {
  getEarnVaults, earnMove,
  type VaultView, type Position, type EarnAction, type EarnSummary,
} from '@/api/client'
import { useOverview } from '@/hooks/overview'
import {
  AssetAvatar, Button, EmptyState, Icon, Modal, PageHeader, SectionHeader, Skeleton, formatUSD, font, truncate,
} from '@/components/ui'
import { formatHorizon, formatMoney, formatPercent, toMajor, toMinor } from '@/lib/format'
import { View } from '@/gui'

// -----------------------------------------------------------------------------
// Earn — Liquid Protocol vaults.
//
// The loan repays itself: yield-bearing collateral goes into a vault, the
// vault's synthetic token is borrowed against it up to the vault's LTV, and the
// collateral's yield pays the debt down. That takes years, and the screen says
// so rather than dressing it up as a monthly product.
// -----------------------------------------------------------------------------

export function Earn() {
  const { overview, refresh } = useOverview()
  const [vaults, setVaults] = useState<VaultView[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setVaults(await getEarnVaults())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Vaults unavailable')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // A movement changes the position and the balance that funded it, so both the
  // vault list and the account overview are re-read from the source.
  const settled = useCallback(async () => {
    await Promise.all([load(), refresh()])
  }, [load, refresh])

  if (error) return <EmptyState icon="earn" title="Earn unavailable" body={error} />
  if (!vaults) return <EarnSkeleton />

  const summary = overview?.earn
  const open = vaults.find((v) => v.id === openId) ?? null
  const held = vaults.filter((v) => staked(v.position))
  const rest = vaults.filter((v) => !staked(v.position))

  return (
    <View className="page" style={{ display: 'grid' }}>
      <PageHeader
        title="Earn"
        subtitle="Liquid Protocol — borrow against yield-bearing collateral and let the yield repay it."
      />

      {summary && summary.positions > 0 && <Summary summary={summary} />}

      {held.length > 0 && (
        <section>
          <SectionHeader title="Your positions" />
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 }}>
            {held.map((v) => <VaultCard key={v.id} vault={v} onOpen={() => setOpenId(v.id)} />)}
          </View>
        </section>
      )}

      <section>
        <SectionHeader title={held.length > 0 ? 'Other vaults' : 'Vaults'} />
        {rest.length === 0 ? (
          <EmptyState icon="earn" title="Every vault is open" body="You hold a position in all of them." />
        ) : (
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 }}>
            {rest.map((v) => <VaultCard key={v.id} vault={v} onOpen={() => setOpenId(v.id)} />)}
          </View>
        )}
      </section>

      <p style={{ textAlign: 'center', fontSize: 11.2, color: 'var(--color-fg-subtle)', maxWidth: 448, justifySelf: 'center', lineHeight: 1.625 }}>
        A self-repaying loan clears at the speed of the collateral's yield — years, not months. Rates shown
        are today's; they move, and so does the horizon.
      </p>

      {open && <VaultDetail vault={open} onClose={() => setOpenId(null)} onSettled={settled} />}
    </View>
  )
}

// A position with nothing in it is not a position.
function staked(p?: Position | null): p is Position {
  return !!p && (p.collateral > 0 || p.debt > 0)
}

// -- Summary hero ------------------------------------------------------------

function Summary({ summary }: { summary: EarnSummary }) {
  return (
    <section
      className="hero"
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
        background: 'linear-gradient(to bottom right, var(--color-surface-2), var(--color-surface))',
      }}
    >
      {/* Out of flow, so it stays a div: View carries its own position. */}
      <div className="accent-glow" style={{ position: 'absolute', top: -80, right: -48, width: 256, height: 256, borderRadius: 9999 }} />
      {/* One column on a phone, the figures beside the headline once there is
          room; both sit on the same baseline at the bottom of the hero. */}
      <View className="hero-split" style={{ display: 'grid', position: 'relative' }}>
        <View className="self-end" style={{ display: 'grid', minWidth: 0 }}>
          <p style={{ ...font(14), color: 'var(--color-fg-muted)' }}>Net position</p>
          <p className="h1 tnum" style={{ fontWeight: 600, letterSpacing: '-0.025em', marginTop: 4 }}>
            {formatUSD(summary.netUsd / 100)}
          </p>
          <p style={{ ...font(12), color: 'var(--color-fg-subtle)', marginTop: 8 }}>
            Across {summary.positions} vault{summary.positions === 1 ? '' : 's'} · collateral less debt
          </p>
        </View>
        <dl
          className="self-end"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', columnGap: 32, rowGap: 16 }}
        >
          <Figure label="Collateral" value={formatUSD(summary.collateralUsd / 100)} />
          <Figure label="Borrowed" value={formatUSD(summary.debt / 100)} />
          <Figure label="Net APY" value={formatPercent(summary.netApy)} tone="positive" />
          <Figure label="Yield / year" value={formatUSD(summary.yieldUsdYear / 100)} tone="positive" />
        </dl>
      </View>
    </section>
  )
}

function Figure({ label, value, tone }: { label: string; value: string; tone?: 'positive' }) {
  return (
    <View style={{ display: 'grid', gap: 2 }}>
      <dt style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>{label}</dt>
      <dd className="tnum" style={{ fontWeight: 500, color: tone === 'positive' ? 'var(--color-positive)' : undefined }}>
        {value}
      </dd>
    </View>
  )
}

// -- Vault card --------------------------------------------------------------

function VaultCard({ vault, onOpen }: { vault: VaultView; onOpen: () => void }) {
  const p = staked(vault.position) ? vault.position : null
  return (
    <button
      type="button"
      onClick={onOpen}
      className="card tile"
      style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16, width: '100%', textAlign: 'left', padding: 20 }}
    >
      <View style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto auto', alignItems: 'start', gap: 12 }}>
        <AssetAvatar code={vault.underlying} />
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)' }}>
          <p style={{ fontWeight: 500, ...truncate }}>{vault.name}</p>
          <p style={{ ...font(12), color: 'var(--color-fg-subtle)', ...truncate }}>
            {vault.collateral} → {vault.synthetic}
          </p>
        </View>
        <View style={{ display: 'grid', textAlign: 'right' }}>
          <p className="tnum" style={{ fontWeight: 500, color: 'var(--color-positive)' }}>{formatPercent(vault.apy)}</p>
          <p style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>APY</p>
        </View>
        <span style={{ display: 'grid', marginTop: 4, color: 'var(--color-fg-subtle)' }}>
          <Icon name="chevron" size={16} />
        </span>
      </View>

      <p style={{ ...font(14), color: 'var(--color-fg-muted)' }}>{vault.description}</p>

      {p ? (
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12, paddingTop: 4 }}>
          {/* Three figures across when the row can hold them, two when it cannot —
              measured from the track, so no breakpoint has to know about it. */}
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', columnGap: 24, rowGap: 12 }}>
            <Figure label="Collateral" value={formatUSD(p.collateralUsd / 100)} />
            <Figure label="Borrowed" value={formatUSD(p.debt / 100)} />
            <Figure label="Yield / year" value={formatUSD(p.yieldUsdYear / 100)} tone="positive" />
          </dl>
          <Health ltv={p.ltv} maxLtv={vault.maxLtv} />
          <p style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>
            {p.debt > 0
              ? `Self-repays in ${formatHorizon(p.selfRepayDays)} at today's yield`
              : 'No debt — the yield accrues to you'}
          </p>
        </View>
      ) : (
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', columnGap: 24, paddingTop: 4 }}>
          <Figure label="Max LTV" value={formatPercent(vault.maxLtv * 100, 0)} />
          <Figure label="TVL" value={compactUSD(vault.tvlUsd)} />
        </dl>
      )}
    </button>
  )
}

// -- Health bar --------------------------------------------------------------
//
// How much of the vault's borrowing room is spent. The sandbox models no
// liquidation, so the bar reports a fraction and stops short of inventing a
// margin call.

function Health({ ltv, maxLtv }: { ltv: number; maxLtv: number }) {
  const used = maxLtv > 0 ? Math.min(ltv / maxLtv, 1) : 0
  const warn = used >= 0.75
  const color = warn ? '#fbbf24' : 'var(--color-positive)'
  return (
    <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 6 }}>
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'baseline', gap: 12, fontSize: 12 }}>
        <span style={{ color: 'var(--color-fg-subtle)' }}>
          LTV <span className="tnum" style={{ color: 'var(--color-fg-muted)' }}>{formatPercent(ltv * 100, 1)}</span> of{' '}
          <span className="tnum">{formatPercent(maxLtv * 100, 0)}</span>
        </span>
        <span className="tnum" style={{ fontWeight: 500, color }}>{warn ? 'Near the limit' : 'Safe'}</span>
      </View>
      <div
        style={{ height: 6, borderRadius: 9999, background: 'var(--color-surface-3)', overflow: 'hidden' }}
        role="meter"
        aria-label="Loan to value"
        aria-valuenow={Math.round(ltv * 100)}
        aria-valuemin={0}
        aria-valuemax={Math.round(maxLtv * 100)}
      >
        <div style={{ height: '100%', borderRadius: 9999, width: `${used * 100}%`, background: color }} />
      </div>
    </View>
  )
}

// -- Vault detail ------------------------------------------------------------

const ACTIONS: { id: EarnAction; label: string; note: (v: VaultView) => string }[] = [
  { id: 'deposit', label: 'Deposit', note: (v) => `Add ${v.underlying} collateral. It earns ${formatPercent(v.apy)} and backs what you borrow.` },
  { id: 'borrow', label: 'Borrow', note: (v) => `Draw ${v.synthetic} against your collateral, credited as USD. The yield pays it back.` },
  { id: 'repay', label: 'Repay', note: (v) => `Clear ${v.synthetic} debt early from your USD balance.` },
  { id: 'withdraw', label: 'Withdraw', note: (v) => `Take ${v.underlying} back out. What stays must still cover the debt.` },
]

function VaultDetail({
  vault, onClose, onSettled,
}: { vault: VaultView; onClose: () => void; onSettled: () => Promise<void> }) {
  const { overview } = useOverview()
  const [action, setAction] = useState<EarnAction>(staked(vault.position) ? 'borrow' : 'deposit')
  const [amount, setAmount] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const p = staked(vault.position) ? vault.position : null
  const unit = action === 'deposit' || action === 'withdraw' ? vault.underlying : 'USD'
  const balance = (c: string) => overview?.balances?.find((b) => b.currency === c)?.available ?? 0
  const max = ceilingFor(action, vault, p, balance)
  const minor = amount.trim() ? toMinor(amount, unit) : 0
  const over = minor > max
  const ready = minor > 0 && !over

  const submit = async () => {
    setError(null); setDone(null); setBusy(true)
    try {
      await earnMove(action, vault.id, minor)
      await onSettled()
      setDone(`${ACTIONS.find((a) => a.id === action)!.label} of ${formatMoney(minor, unit)} settled`)
      setAmount('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That did not go through')
    } finally {
      setBusy(false)
    }
  }

  const note = ACTIONS.find((a) => a.id === action)!.note(vault)

  return (
    <Modal onClose={onClose}>
      <View style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', alignItems: 'start', gap: 12 }}>
        <AssetAvatar code={vault.underlying} size={40} />
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)' }}>
          <h2 style={{ fontWeight: 600, ...truncate }}>{vault.name}</h2>
          <p style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>
            {vault.collateral} → {vault.synthetic} · {formatPercent(vault.apy)} APY · max LTV{' '}
            {formatPercent(vault.maxLtv * 100, 0)}
          </p>
        </View>
        <button onClick={onClose} className="btn btn-ghost" style={{ paddingInline: 8 }} aria-label="Close">
          <Icon name="close" size={16} />
        </button>
      </View>

      {p ? (
        <View
          className="card-2"
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12, marginTop: 16, padding: 16 }}
        >
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', columnGap: 24, rowGap: 12 }}>
            <Figure label="Collateral" value={formatMoney(p.collateral, vault.underlying)} />
            <Figure label="Value" value={formatUSD(p.collateralUsd / 100)} />
            <Figure label="Borrowed" value={formatUSD(p.debt / 100)} />
            <Figure label="Left to borrow" value={formatUSD(p.borrowable / 100)} tone="positive" />
          </dl>
          <Health ltv={p.ltv} maxLtv={vault.maxLtv} />
          {p.debt > 0 && (
            <p style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>
              At {formatUSD(p.yieldUsdYear / 100)} of yield a year this debt clears in{' '}
              {formatHorizon(p.selfRepayDays)}.
            </p>
          )}
        </View>
      ) : (
        <p style={{ marginTop: 16, ...font(14), color: 'var(--color-fg-muted)' }}>{vault.description}</p>
      )}

      {/* Four verbs, one field. */}
      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 6, marginTop: 20 }}>
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => { setAction(a.id); setAmount(''); setError(null); setDone(null) }}
            aria-pressed={action === a.id}
            className="card-2 tile"
            style={{
              paddingBlock: 8, ...font(12, 500),
              ...(action === a.id
                ? { background: 'var(--color-fg)', color: 'var(--color-bg)', borderColor: 'transparent' }
                : { color: 'var(--color-fg-muted)' }),
            }}
          >
            {a.label}
          </button>
        ))}
      </View>

      <p style={{ marginTop: 12, ...font(12), color: 'var(--color-fg-muted)', lineHeight: 1.625 }}>{note}</p>

      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8, marginTop: 12 }}>
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 8 }}>
          <input
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(null); setDone(null) }}
            placeholder="Amount"
            inputMode="decimal"
            aria-label={`Amount in ${unit}`}
            className="input"
          />
          <span
            style={{
              display: 'grid', placeItems: 'center', paddingInline: 12, borderRadius: 12,
              background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
              ...font(14), color: 'var(--color-fg-muted)',
            }}
          >
            {unit}
          </span>
        </View>
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 12, fontSize: 12 }}>
          <span style={{ color: 'var(--color-fg-subtle)' }}>
            {ceilingLabel(action)} <span className="tnum">{formatMoney(max, unit)}</span>
          </span>
          <button
            type="button"
            disabled={max <= 0}
            onClick={() => setAmount(String(toMajor(max, unit)))}
            style={{ color: 'var(--color-fg-muted)', opacity: max <= 0 ? 0.4 : undefined }}
          >
            Max
          </button>
        </View>
      </View>

      {over && (
        <p style={{ marginTop: 8, ...font(12), color: '#fbbf24' }}>
          That is more than the {formatMoney(max, unit)} available for this move.
        </p>
      )}
      {error && <p style={{ marginTop: 8, ...font(12), color: 'var(--color-negative)' }}>{error}</p>}
      {done && <p style={{ marginTop: 8, ...font(12), color: 'var(--color-positive)' }}>{done}</p>}

      <Button onClick={submit} loading={busy} disabled={!ready} style={{ marginTop: 16 }}>
        {ACTIONS.find((a) => a.id === action)!.label}
      </Button>
    </Modal>
  )
}

// ceilingFor is the most this movement can carry, in the unit the field takes.
// The API enforces every one of these too; stating them up front means the
// screen refuses before the ledger has to.
function ceilingFor(
  action: EarnAction, vault: VaultView, p: Position | null, balance: (c: string) => number,
): number {
  switch (action) {
    case 'deposit':
      return balance(vault.underlying)
    case 'borrow':
      return p?.borrowable ?? 0
    case 'repay':
      return Math.min(p?.debt ?? 0, balance('USD'))
    case 'withdraw':
      return withdrawable(vault, p)
  }
}

// Collateral is only free once what stays behind still covers the debt at the
// vault's LTV.
function withdrawable(vault: VaultView, p: Position | null): number {
  if (!p || p.collateral <= 0) return 0
  if (p.debt <= 0) return p.collateral
  if (p.collateralUsd <= 0 || vault.maxLtv <= 0) return 0
  const needed = (p.debt * p.collateral) / (vault.maxLtv * p.collateralUsd)
  return Math.max(0, Math.floor(p.collateral - needed))
}

function ceilingLabel(action: EarnAction): string {
  return action === 'deposit' ? 'Available' : action === 'borrow' ? 'Headroom' : action === 'repay' ? 'Outstanding' : 'Free to withdraw'
}

// compactUSD renders pool-scale figures (cents in, "$48.2M" out).
function compactUSD(cents: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1,
  }).format(cents / 100)
}

function EarnSkeleton() {
  return (
    <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 32 }}>
      <Skeleton style={{ height: 160, borderRadius: 'var(--radius-card)' }} />
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 }}>
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} style={{ height: 176, borderRadius: 'var(--radius-card)' }} />)}
      </View>
    </View>
  )
}
