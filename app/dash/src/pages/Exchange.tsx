import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getConfig, exchangeQuote, exchangeExecute, listTransactions, type Quote } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { Button, Icon, AssetAvatar, PageHeader, SectionHeader, EmptyState, Skeleton } from '@/components/ui'
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
    <View className="gap-6 md:gap-8" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)' }}>
      <PageHeader title="Exchange" subtitle="Convert between currencies and crypto at sandbox rates." />

      {/* Two columns only once both of them fit: the converter needs its width,
          and a conversion line squeezed beside it wraps its own amounts. */}
      <View
        className="gap-6 grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]"
        style={{ display: 'grid', alignItems: 'start' }}
      >
      <View className="min-w-0" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
      <View className="card p-5" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 }}>
        {/* From */}
        <View className="card-2 p-4" style={{ display: 'grid', gap: 8 }}>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
            <span className="label">You pay</span>
            {fromBal && <button onClick={() => edit(setAmount)(String(fromBal.available / 10 ** fromBal.decimals))} className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Max {formatMoney(fromBal.available, from, fromBal.decimals)}</button>}
          </View>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 12 }}>
            <input className="w-full min-w-0 bg-transparent text-2xl font-semibold tnum outline-none placeholder:text-[var(--color-fg-subtle)]" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => edit(setAmount)(e.target.value)} />
            <AssetPicker value={from} onChange={edit(setFrom)} assets={assets} exclude={to} />
          </View>
        </View>

        {/* Flip */}
        <View className="-my-1.5" style={{ display: 'grid', justifyItems: 'center' }}>
          <button onClick={flip} className="tile w-9 h-9 rounded-full grid place-items-center bg-[var(--color-surface-3)] border z-10" aria-label="Flip currencies">
            <Icon name="swap" className="w-4 h-4 rotate-90" />
          </button>
        </View>

        {/* To */}
        <View className="card-2 p-4" style={{ display: 'grid', gap: 8 }}>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
            <span className="label">You receive</span>
            {quoting && <span className="text-xs text-[var(--color-fg-subtle)]">Fetching rate…</span>}
          </View>
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 12 }}>
            {/* Blockified by the grid, so it truncates like the block it replaced. */}
            <span className="truncate text-2xl font-semibold tnum text-[var(--color-fg)]">
              {quote && fromMinor ? formatMoney(quote.toAmount, to, quote.toDecimals).replace(` ${to}`, '') : '0.00'}
            </span>
            <AssetPicker value={to} onChange={edit(setTo)} assets={assets} exclude={from} />
          </View>
        </View>

        {quote && (
          <View className="px-1 text-xs text-[var(--color-fg-muted)]" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
            <span>Rate</span>
            <span className="tnum">1 {from} ≈ {quote.rate.toFixed(quote.rate < 1 ? 4 : 2)} {to}</span>
          </View>
        )}

        {insufficient && fromMinor > 0 && <p className="text-sm text-[var(--color-negative)]">Insufficient {from} balance.</p>}
        {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}
        {done && (
          <View className="text-sm text-[var(--color-positive)]" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'center', gap: 8 }}>
            <Icon name="check" className="w-4 h-4" />
            <span>{done}</span>
          </View>
        )}

        <Button className="w-full" onClick={execute} loading={executing} disabled={!quote || !fromMinor || insufficient}>
          {from === to ? 'Choose different currencies' : `Convert ${from} → ${to}`}
        </Button>
      </View>

      <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)]">Sandbox rates include a 0.2% demo spread. Settles instantly.</p>
      </View>

      <View className="min-w-0" style={{ display: 'grid' }}><Conversions key={done ?? 'idle'} /></View>
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
        <View style={{ display: 'grid', gap: 8 }}>{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</View>
      ) : entries.length === 0 ? (
        <EmptyState icon="swap" title="No conversions yet" body="Trades you make here are listed with the rate you got." />
      ) : (
        <View className="card divide-y divide-[color:var(--color-border)] overflow-hidden" style={{ display: 'grid' }}>
          {entries.slice(0, 8).map((e) => <TxnRow key={e.key} txn={e.txn} into={e.into} />)}
        </View>
      )}
    </section>
  )
}

function AssetPicker({ value, onChange, assets, exclude }: { value: string; onChange: (v: string) => void; assets: string[]; exclude?: string }) {
  return (
    <View
      className="relative rounded-full bg-[var(--color-surface-3)] border pl-1.5 pr-2 py-1.5"
      style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'center', gap: 8 }}
    >
      <AssetAvatar code={value} className="w-6 h-6" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent text-sm font-semibold outline-none pr-1 cursor-pointer"
      >
        {assets.filter((a) => a !== exclude).map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
    </View>
  )
}
