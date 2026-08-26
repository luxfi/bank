import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getConfig, exchangeQuote, exchangeExecute, listTransactions, type Quote } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { Button, Icon, AssetAvatar, PageHeader, SectionHeader, EmptyState, Skeleton, font, truncate } from '@/components/ui'
import { TxnRow } from '@/components/TxnRow'
import { formatMoney, toMinor } from '@/lib/format'
import { pair, type Entry } from '@/lib/pair'
import { View } from '@/gui'

export function Exchange() {
  const { overview, refresh } = useOverview()
  const [params] = useSearchParams()
  const [assets, setAssets] = useState<string[]>([])
  const [from, setFrom] = useState(params.get('from') || 'USD')
  const [to, setTo] = useState(params.get('to') || 'EUR')
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoting, setQuoting] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const balances = overview?.balances ?? []
  const fromBal = balances.find((b) => b.currency === from)
  const fromMinor = toMinor(amount, from)
  const insufficient = fromBal ? fromMinor > fromBal.available : fromMinor > 0
  // A rate is a property of the pair, not of the amount. With the field still
  // empty we price one whole unit, so the page opens on today's rate instead of
  // on a blank waiting for input.
  const priced = fromMinor || toMinor(1, from)

  useEffect(() => {
    getConfig().then((c) => setAssets([...c.fiat, ...c.crypto])).catch(() => setAssets(['USD', 'EUR', 'GBP', 'LUX', 'BTC', 'ETH', 'DAI']))
  }, [])

  // Editing any leg of the trade retires the last confirmation — it described a
  // conversion that is no longer the one on screen.
  const edit = <T,>(set: (v: T) => void) => (v: T) => { set(v); setDone(null) }

  // Debounced quote.
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    setError(null)
    if (from === to) { setQuote(null); return }
    clearTimeout(timer.current)
    setQuoting(true)
    timer.current = setTimeout(async () => {
      try {
        setQuote(await exchangeQuote(from, to, priced))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Quote failed'); setQuote(null)
      } finally {
        setQuoting(false)
      }
    }, 350)
    return () => clearTimeout(timer.current)
  }, [from, to, priced])

  function flip() {
    setFrom(to); setTo(from); setAmount(''); setQuote(null); setDone(null)
  }

  async function execute() {
    if (!quote || !fromMinor || insufficient) return
    setExecuting(true); setError(null)
    try {
      const res = await exchangeExecute(from, to, fromMinor)
      setDone(`Converted ${formatMoney(res.fromAmount, from)} to ${formatMoney(res.toAmount, to)}.`)
      setAmount(''); setQuote(null)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed')
    } finally {
      setExecuting(false)
    }
  }

  return (
    <View className="page" style={{ display: 'grid' }}>
      <PageHeader title="Exchange" subtitle="Convert between currencies and crypto at sandbox rates." />

      <View className="trade-split" style={{ display: 'grid' }}>
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16, minWidth: 0 }}>
      <View className="card" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12, padding: 20 }}>
        {/* From */}
        <View className="card-2" style={{ display: 'grid', gap: 8, padding: 16 }}>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
            <span className="label">You pay</span>
            {fromBal && (
              <button
                onClick={() => edit(setAmount)(String(fromBal.available / 10 ** fromBal.decimals))}
                style={{ ...font(12), color: 'var(--color-fg-muted)' }}
              >
                Max {formatMoney(fromBal.available, from, fromBal.decimals)}
              </button>
            )}
          </View>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 12 }}>
            <input
              className="tnum bare"
              style={{ width: '100%', minWidth: 0, background: 'transparent', ...font(24, 600), outline: 'none' }}
              inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => edit(setAmount)(e.target.value)}
            />
            <AssetPicker value={from} onChange={edit(setFrom)} assets={assets} exclude={to} />
          </View>
        </View>

        {/* Flip */}
        <View style={{ display: 'grid', justifyItems: 'center', marginBlock: -6 }}>
          <button
            onClick={flip}
            className="tile"
            style={{
              display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9999,
              background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', zIndex: 10,
            }}
            aria-label="Flip currencies"
          >
            <span style={{ display: 'grid', transform: 'rotate(90deg)' }}><Icon name="swap" size={16} /></span>
          </button>
        </View>

        {/* To */}
        <View className="card-2" style={{ display: 'grid', gap: 8, padding: 16 }}>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
            <span className="label">You receive</span>
            {quoting && <span style={{ ...font(12), color: 'var(--color-fg-subtle)' }}>Fetching rate…</span>}
          </View>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 12 }}>
            {/* Blockified by the grid, so it truncates like the block it replaced. */}
            <span
              className="tnum"
              style={{
                ...truncate,
                ...font(24, 600), color: 'var(--color-fg)',
              }}
            >
              {quote && fromMinor ? formatMoney(quote.toAmount, to, quote.toDecimals).replace(` ${to}`, '') : '0.00'}
            </span>
            <AssetPicker value={to} onChange={edit(setTo)} assets={assets} exclude={from} />
          </View>
        </View>

        {quote && (
          <View
            style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center',
              paddingInline: 4, fontSize: 12, color: 'var(--color-fg-muted)',
            }}
          >
            <span>Rate</span>
            <span className="tnum">1 {from} ≈ {quote.rate.toFixed(quote.rate < 1 ? 4 : 2)} {to}</span>
          </View>
        )}

        {insufficient && fromMinor > 0 && <p style={{ ...font(14), color: 'var(--color-negative)' }}>Insufficient {from} balance.</p>}
        {error && <p style={{ ...font(14), color: 'var(--color-negative)' }}>{error}</p>}
        {done && (
          <View
            style={{
              display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'center', gap: 8,
              fontSize: 14, color: 'var(--color-positive)',
            }}
          >
            <Icon name="check" size={16} />
            <span>{done}</span>
          </View>
        )}

        <Button onClick={execute} loading={executing} disabled={!quote || !fromMinor || insufficient}>
          {from === to ? 'Choose different currencies' : `Convert ${from} → ${to}`}
        </Button>
      </View>

      <p style={{ textAlign: 'center', fontSize: 11.2, color: 'var(--color-fg-subtle)' }}>Sandbox rates include a 0.2% demo spread. Conversions settle immediately in the sandbox.</p>
      </View>

      <View style={{ display: 'grid', minWidth: 0 }}><Conversions key={done ?? 'idle'} /></View>
      </View>
    </View>
  )
}

// Every conversion this account has made, read back as one line each — what
// left and what landed. Remounts on a completed trade so the newest one is
// there without a second fetch path.
function Conversions() {
  const [entries, setEntries] = useState<Entry[] | null>(null)
  useEffect(() => {
    listTransactions()
      .then((t) => setEntries(pair(t).filter((e) => e.txn.type === 'conversion')))
      .catch(() => setEntries([]))
  }, [])
  return (
    <section>
      <SectionHeader title="Recent conversions" />
      {entries === null ? (
        <View style={{ display: 'grid', gap: 8 }}>
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} style={{ height: 64, borderRadius: 12 }} />)}
        </View>
      ) : entries.length === 0 ? (
        <EmptyState icon="swap" title="No conversions yet" body="Trades you make here are listed with the rate you got." />
      ) : (
        <View className="card" style={{ display: 'grid', overflow: 'hidden' }}>
          {entries.slice(0, 8).map((e, i) => (
            <View key={e.key} style={{ display: 'grid', borderTop: i ? '1px solid var(--color-border)' : undefined }}>
              <TxnRow txn={e.txn} into={e.into} />
            </View>
          ))}
        </View>
      )}
    </section>
  )
}

function AssetPicker({ value, onChange, assets, exclude }: { value: string; onChange: (v: string) => void; assets: string[]; exclude?: string }) {
  return (
    <View
      style={{
        display: 'grid', gridAutoFlow: 'column', alignItems: 'center', gap: 8,
        position: 'relative', borderRadius: 9999, background: 'var(--color-surface-3)',
        border: '1px solid var(--color-border)', paddingLeft: 6, paddingRight: 8, paddingBlock: 6,
      }}
    >
      <AssetAvatar code={value} size={24} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ appearance: 'none', background: 'transparent', ...font(14, 600), outline: 'none', paddingRight: 4, cursor: 'pointer' }}
      >
        {assets.filter((a) => a !== exclude).map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
    </View>
  )
}
