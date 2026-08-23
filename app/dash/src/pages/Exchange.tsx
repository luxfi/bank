import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getConfig, exchangeQuote, exchangeExecute, listTransactions, type Quote } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { Button, Icon, AssetAvatar, PageHeader, SectionHeader, EmptyState, Skeleton } from '@/components/ui'
import { TxnRow } from '@/components/TxnRow'
import { formatMoney, toMinor } from '@/lib/format'
import { pair, type Entry } from '@/lib/pair'

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
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Exchange" subtitle="Convert between currencies and crypto at sandbox rates." />

      {/* Two columns only once both of them fit: the converter needs its width,
          and a conversion line squeezed beside it wraps its own amounts. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] items-start">
      <div className="min-w-0 space-y-4">
      <div className="card p-5 space-y-3">
        {/* From */}
        <div className="card-2 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="label">You pay</span>
            {fromBal && <button onClick={() => edit(setAmount)(String(fromBal.available / 10 ** fromBal.decimals))} className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Max {formatMoney(fromBal.available, from, fromBal.decimals)}</button>}
          </div>
          <div className="flex items-center gap-3">
            <input className="flex-1 min-w-0 bg-transparent text-2xl font-semibold tnum outline-none placeholder:text-[var(--color-fg-subtle)]" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => edit(setAmount)(e.target.value)} />
            <AssetPicker value={from} onChange={edit(setFrom)} assets={assets} exclude={to} />
          </div>
        </div>

        {/* Flip */}
        <div className="flex justify-center -my-1.5">
          <button onClick={flip} className="tile w-9 h-9 rounded-full grid place-items-center bg-[var(--color-surface-3)] border z-10" aria-label="Flip currencies">
            <Icon name="swap" className="w-4 h-4 rotate-90" />
          </button>
        </div>

        {/* To */}
        <div className="card-2 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="label">You receive</span>
            {quoting && <span className="text-xs text-[var(--color-fg-subtle)]">Fetching rate…</span>}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0 truncate text-2xl font-semibold tnum text-[var(--color-fg)]">
              {quote && fromMinor ? formatMoney(quote.toAmount, to, quote.toDecimals).replace(` ${to}`, '') : '0.00'}
            </div>
            <AssetPicker value={to} onChange={edit(setTo)} assets={assets} exclude={from} />
          </div>
        </div>

        {quote && (
          <div className="flex items-center justify-between px-1 text-xs text-[var(--color-fg-muted)]">
            <span>Rate</span>
            <span className="tnum">1 {from} ≈ {quote.rate.toFixed(quote.rate < 1 ? 4 : 2)} {to}</span>
          </div>
        )}

        {insufficient && fromMinor > 0 && <p className="text-sm text-[var(--color-negative)]">Insufficient {from} balance.</p>}
        {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}
        {done && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-positive)]"><Icon name="check" className="w-4 h-4" />{done}</div>
        )}

        <Button className="w-full" onClick={execute} loading={executing} disabled={!quote || !fromMinor || insufficient}>
          {from === to ? 'Choose different currencies' : `Convert ${from} → ${to}`}
        </Button>
      </div>

      <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)]">Sandbox rates include a 0.2% demo spread. Settles instantly.</p>
      </div>

      <div className="min-w-0"><Conversions key={done ?? 'idle'} /></div>
      </div>
    </div>
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
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : entries.length === 0 ? (
        <EmptyState icon="swap" title="No conversions yet" body="Trades you make here are listed with the rate you got." />
      ) : (
        <div className="card divide-y divide-[color:var(--color-border)] overflow-hidden">
          {entries.slice(0, 8).map((e) => <TxnRow key={e.key} txn={e.txn} into={e.into} />)}
        </div>
      )}
    </section>
  )
}

function AssetPicker({ value, onChange, assets, exclude }: { value: string; onChange: (v: string) => void; assets: string[]; exclude?: string }) {
  return (
    <div className="relative shrink-0 flex items-center gap-2 rounded-full bg-[var(--color-surface-3)] border pl-1.5 pr-2 py-1.5">
      <AssetAvatar code={value} className="w-6 h-6" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent text-sm font-semibold outline-none pr-1 cursor-pointer"
      >
        {assets.filter((a) => a !== exclude).map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  )
}
