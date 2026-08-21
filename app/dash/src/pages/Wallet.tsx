import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getWallet, sendCrypto, depositCrypto, type Wallet as WalletT, type Balance } from '@/api/client'
import { useConfig } from '@/lib/config'
import { Money, Icon, AssetAvatar, SectionHeader, Skeleton, EmptyState, SandboxBadge, formatUSD } from '@/components/ui'
import { shortAddress } from '@/lib/format'

const CRYPTO_DECIMALS = 6

export function Wallet() {
  const [data, setData] = useState<{ wallet: WalletT; holdings: Balance[]; network: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [panel, setPanel] = useState<'send' | 'receive' | null>(null)

  useEffect(() => {
    getWallet().then(setData).catch((e) => setError(e instanceof Error ? e.message : 'No wallet'))
  }, [])

  if (error) return <EmptyState icon="wallet" title="Wallet unavailable" body={error} />
  if (!data) return <Skeleton className="h-64 rounded-[var(--radius-card)]" />

  const totalUsd = data.holdings.reduce((s, h) => s + h.valueUsd, 0)
  const addr = data.wallet.address
  const setHoldings = (balances: Balance[]) =>
    setData((d) => (d ? { ...d, holdings: balances.filter((b) => b.kind === 'crypto') } : d))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Crypto wallet</h1>
          <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Non-custodial · {data.network}</p>
        </div>
        <SandboxBadge />
      </div>

      {/* Wallet hero */}
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] p-6">
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full accent-glow" />
        <p className="text-sm text-[var(--color-fg-muted)] relative">Crypto value</p>
        <p className="text-3xl md:text-4xl font-semibold tracking-tight tnum mt-1 relative">{formatUSD(totalUsd)}</p>
        <button
          onClick={() => { navigator.clipboard?.writeText(addr); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
          className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-3)] border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-mono hover:brightness-95 transition"
        >
          <Icon name="wallet" className="w-3.5 h-3.5" />
          {shortAddress(addr)}
          <Icon name={copied ? 'check' : 'copy'} className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        <TradeAction to="/app/exchange?from=USD&to=LUX" label="Buy" icon="arrowDown" />
        <TradeAction to="/app/exchange?from=LUX&to=USD" label="Sell" icon="arrowUp" />
        <TradeAction to="/app/exchange?from=LUX&to=DAI" label="Convert" icon="swap" />
        <PanelAction label="Send" icon="send" active={panel === 'send'} onClick={() => setPanel(panel === 'send' ? null : 'send')} />
        <PanelAction label="Receive" icon="arrowDown" active={panel === 'receive'} onClick={() => setPanel(panel === 'receive' ? null : 'receive')} />
      </div>

      {panel === 'send' && <SendPanel holdings={data.holdings} onDone={setHoldings} />}
      {panel === 'receive' && <ReceivePanel address={addr} network={data.network} onDeposit={setHoldings} />}

      {/* Holdings */}
      <section>
        <SectionHeader title="Holdings" />
        {data.holdings.length === 0 ? (
          <EmptyState icon="coins" title="No crypto yet" body="Buy LUX, BTC, ETH or DAI to fund your wallet."
            action={<Link to="/app/exchange?from=USD&to=LUX" className="btn btn-primary">Buy crypto</Link>} />
        ) : (
          <div className="card divide-y divide-[color:var(--color-border)]">
            {data.holdings.map((h) => (
              <Link key={h.currency} to={`/app/exchange?from=${h.currency}&to=USD`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--color-surface-2)]/50 transition-colors">
                <AssetAvatar code={h.currency} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{h.currency}</p>
                  <p className="text-xs text-[var(--color-fg-subtle)]">Testnet</p>
                </div>
                <div className="text-right">
                  <Money minor={h.available} currency={h.currency} decimals={h.decimals} className="font-medium" />
                  <p className="text-xs text-[var(--color-fg-subtle)] tnum">{formatUSD(h.valueUsd)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)]">
        Testnet assets only. In production this wallet is secured by threshold MPC — no single key.
      </p>
    </div>
  )
}

function TradeAction({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <Link to={to} className="card-2 flex flex-col items-center gap-2 py-4 hover:bg-[var(--color-surface-3)] transition-colors">
      <span className="w-10 h-10 rounded-full grid place-items-center bg-[var(--color-surface-3)] border"><Icon name={icon} className="w-[18px] h-[18px]" /></span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}

function PanelAction({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`card-2 flex flex-col items-center gap-2 py-4 transition-colors ${active ? 'bg-[var(--color-surface-3)]' : 'hover:bg-[var(--color-surface-3)]'}`}>
      <span className="w-10 h-10 rounded-full grid place-items-center bg-[var(--color-surface-3)] border"><Icon name={icon} className="w-[18px] h-[18px]" /></span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function SendPanel({ holdings, onDone }: { holdings: Balance[]; onDone: (b: Balance[]) => void }) {
  const [asset, setAsset] = useState(holdings[0]?.currency ?? 'LUX')
  const [amount, setAmount] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null); setResult(null)
    const minor = Math.round(parseFloat(amount) * 10 ** CRYPTO_DECIMALS)
    if (!Number.isFinite(minor) || minor <= 0) { setError('Enter an amount'); return }
    setBusy(true)
    try {
      const r = await sendCrypto(asset, minor, toAddress.trim())
      onDone(r.balances)
      setResult(r.txHash)
      setAmount(''); setToAddress('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="flex gap-2">
        <select value={asset} onChange={(e) => setAsset(e.target.value)} className="input w-28">
          {(holdings.length ? holdings.map((h) => h.currency) : ['LUX', 'BTC', 'ETH', 'DAI']).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" className="input flex-1" />
      </div>
      <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder={asset === 'BTC' ? 'Destination address' : 'Destination address (0x…)'} className="input w-full font-mono text-sm" />
      <button onClick={submit} disabled={busy} className="btn btn-primary w-full justify-center">
        {busy ? 'Sending…' : `Send ${asset}`}
      </button>
      {result && <p className="text-xs text-[var(--color-fg-subtle)] font-mono break-all">Sent · {result}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function ReceivePanel({ address, network, onDeposit }: { address: string; network: string; onDeposit: (b: Balance[]) => void }) {
  const config = useConfig()
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const faucet = async (asset: string, whole: number) => {
    setError(null); setBusy(true)
    try {
      const r = await depositCrypto(asset, whole * 10 ** CRYPTO_DECIMALS)
      onDeposit(r.balances)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deposit failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card p-4 space-y-3">
      <p className="text-xs text-[var(--color-fg-muted)]">Your {network} deposit address</p>
      <button
        onClick={() => { navigator.clipboard?.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
        className="w-full text-left font-mono text-sm break-all rounded-lg bg-[var(--color-surface-2)] border border-[color:var(--color-border)] px-3 py-2 hover:brightness-95 transition"
      >
        {address} {copied ? '✓' : ''}
      </button>
      {config?.sandbox && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--color-fg-muted)]">Testnet faucet</p>
          <div className="grid grid-cols-4 gap-2">
            {[['LUX', 100], ['BTC', 0.1], ['ETH', 1], ['DAI', 1000]].map(([a, n]) => (
              <button key={a as string} onClick={() => faucet(a as string, n as number)} disabled={busy} className="btn btn-secondary justify-center text-xs">
                +{n} {a}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
