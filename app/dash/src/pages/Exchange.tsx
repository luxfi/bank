import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getConfig, exchangeQuote, exchangeExecute, type Quote } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { Button, Icon, AssetAvatar } from '@/components/ui'
import { formatMoney, toMinor } from '@/lib/format'

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

  useEffect(() => {
    getConfig().then((c) => setAssets([...c.fiat, ...c.crypto])).catch(() => setAssets(['USD', 'EUR', 'GBP', 'LUX', 'BTC', 'ETH', 'DAI']))
  }, [])

  // Debounced quote.
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    setError(null); setDone(null)
    if (!fromMinor || from === to) { setQuote(null); return }
    clearTimeout(timer.current)
    setQuoting(true)
    timer.current = setTimeout(async () => {
      try {
        setQuote(await exchangeQuote(from, to, fromMinor))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Quote failed'); setQuote(null)
      } finally {
        setQuoting(false)
      }
    }, 350)
    return () => clearTimeout(timer.current)
  }, [from, to, fromMinor])

  function flip() {
    setFrom(to); setTo(from); setAmount(''); setQuote(null)
  }

  async function execute() {
    if (!quote || insufficient) return
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
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Exchange</h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Convert between currencies and crypto at sandbox rates.</p>
      </div>

      <div className="card p-5 space-y-3">
        {/* From */}
        <div className="card-2 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="label">You pay</span>
            {fromBal && <button onClick={() => setAmount(String(fromBal.available / 10 ** fromBal.decimals))} className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Max {formatMoney(fromBal.available, from, fromBal.decimals)}</button>}
          </div>
          <div className="flex items-center gap-3">
            <input className="flex-1 bg-transparent text-2xl font-semibold tnum outline-none placeholder:text-[var(--color-fg-subtle)]" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <AssetPicker value={from} onChange={setFrom} assets={assets} exclude={to} />
          </div>
        </div>

        {/* Flip */}
        <div className="flex justify-center -my-1.5">
          <button onClick={flip} className="w-9 h-9 rounded-full grid place-items-center bg-[var(--color-surface-3)] border hover:border-[color:var(--color-border-strong)] transition-colors z-10" aria-label="Flip currencies">
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
            <div className="flex-1 text-2xl font-semibold tnum text-[var(--color-fg)]">
              {quote ? formatMoney(quote.toAmount, to, quote.toDecimals).replace(` ${to}`, '') : '0.00'}
            </div>
            <AssetPicker value={to} onChange={setTo} assets={assets} exclude={from} />
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

        <Button className="w-full" onClick={execute} loading={executing} disabled={!quote || insufficient}>
          {from === to ? 'Choose different currencies' : `Convert ${from} → ${to}`}
        </Button>
      </div>

      <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)]">Sandbox rates include a 0.2% demo spread. Settles instantly.</p>
    </div>
  )
}

function AssetPicker({ value, onChange, assets, exclude }: { value: string; onChange: (v: string) => void; assets: string[]; exclude?: string }) {
  return (
    <div className="relative flex items-center gap-2 rounded-full bg-[var(--color-surface-3)] border pl-1.5 pr-2 py-1.5">
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
