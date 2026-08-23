import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getWallet, sendCrypto, depositCrypto, type WalletBundle, type Wallet as WalletT, type Balance } from '@/api/client'
import { useConfig } from '@/lib/config'
import {
  Icon, AssetAvatar, ActionTile, AssetRow, PageHeader, SectionHeader, Skeleton, EmptyState, formatUSD,
} from '@/components/ui'
import { Allocation } from '@/components/Allocation'
import { shortAddress } from '@/lib/format'

const CRYPTO_DECIMALS = 6

export function Wallet() {
  const [data, setData] = useState<WalletBundle | null>(null)
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
    <div className="space-y-6 md:space-y-8">
      {/* The shell header already flies the sandbox flag; a second one here
          just says it twice. */}
      <PageHeader title="Crypto wallet" subtitle={data.network} />

      {/* Wallet hero. The mix on the right is what the figure on the left is
          made of — the same block the dashboard total carries. */}
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] p-6 md:p-8">
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full accent-glow" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="min-w-0">
            <p className="text-sm text-[var(--color-fg-muted)]">Crypto value</p>
            <p className="text-3xl md:text-4xl font-semibold tracking-tight tnum mt-1">{formatUSD(totalUsd)}</p>
            <button
              onClick={() => { navigator.clipboard?.writeText(addr); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
              className="tile mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-3)] border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-mono"
            >
              <Icon name="wallet" className="w-3.5 h-3.5" />
              {shortAddress(addr)}
              <Icon name={copied ? 'check' : 'copy'} className="w-3.5 h-3.5" />
            </button>
          </div>
          <Allocation
            items={data.holdings.map((h) => ({ code: h.currency, valueUsd: h.valueUsd }))}
            className="w-full md:w-52 lg:w-60 md:shrink-0"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        <ActionTile to="/app/exchange?from=USD&to=LUX" label="Buy" icon="arrowDown" />
        <ActionTile to="/app/exchange?from=LUX&to=USD" label="Sell" icon="arrowUp" />
        <ActionTile to="/app/exchange?from=LUX&to=DAI" label="Convert" icon="swap" />
        <ActionTile label="Send" icon="send" active={panel === 'send'} onClick={() => setPanel(panel === 'send' ? null : 'send')} />
        <ActionTile label="Receive" icon="arrowDown" active={panel === 'receive'} onClick={() => setPanel(panel === 'receive' ? null : 'receive')} />
      </div>

      {panel === 'send' && <SendPanel holdings={data.holdings} onDone={setHoldings} />}
      {panel === 'receive' && (
        <ReceivePanel wallets={data.wallets ?? [data.wallet]} network={data.network} onDeposit={setHoldings} />
      )}

      {/* Holdings */}
      <section>
        <SectionHeader title="Holdings" />
        {data.holdings.length === 0 ? (
          <EmptyState icon="coins" title="No crypto yet" body="Buy LUX, BTC, ETH or DAI to fund your wallet."
            action={<Link to="/app/exchange?from=USD&to=LUX" className="btn btn-primary">Buy crypto</Link>} />
        ) : (
          <div className="card divide-y divide-[color:var(--color-border)] overflow-hidden">
            {data.holdings.map((h) => (
              <AssetRow
                key={h.currency}
                code={h.currency}
                note="Testnet"
                minor={h.available}
                decimals={h.decimals}
                valueUsd={h.valueUsd}
              />
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

function SendPanel({ holdings, onDone }: { holdings: Balance[]; onDone: (b: Balance[]) => void }) {
  const [asset, setAsset] = useState(holdings[0]?.currency ?? 'LUX')
  const [amount, setAmount] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // An amount you cannot send is not a click waiting to be refused: the button
  // holds until the field carries a positive number.
  const minor = Math.round(parseFloat(amount) * 10 ** CRYPTO_DECIMALS)
  const sendable = Number.isFinite(minor) && minor > 0

  const submit = async () => {
    setError(null); setResult(null)
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
    <div className="card p-5 space-y-3">
      <div className="flex gap-2">
        <select value={asset} onChange={(e) => setAsset(e.target.value)} className="input w-28">
          {(holdings.length ? holdings.map((h) => h.currency) : ['LUX', 'BTC', 'ETH', 'DAI']).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" className="input flex-1" />
      </div>
      <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder={asset === 'BTC' ? 'Destination address' : 'Destination address (0x…)'} className="input w-full font-mono text-sm" />
      <button onClick={submit} disabled={busy || !sendable} className="btn btn-primary w-full justify-center">
        {busy ? 'Sending…' : `Send ${asset}`}
      </button>
      {result && <p className="text-xs text-[var(--color-fg-subtle)] font-mono break-all">Sent · {result}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function ReceivePanel({
  wallets, network, onDeposit,
}: { wallets: WalletT[]; network: string; onDeposit: (b: Balance[]) => void }) {
  const config = useConfig()
  const [asset, setAsset] = useState(wallets[0].currency)
  const address = (wallets.find((w) => w.currency === asset) ?? wallets[0]).address
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
    <div className="card p-5 space-y-4">
      {/* An address belongs to an asset, so the asset is picked first and the
          whole block below — mark, address, warning — answers to it. */}
      {wallets.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {wallets.map((w) => (
            <button
              key={w.currency}
              onClick={() => setAsset(w.currency)}
              className={`chip tile px-3 py-1 ${
                w.currency === asset
                  ? 'bg-[var(--color-fg)] text-[var(--color-bg)] border-transparent'
                  : 'text-[var(--color-fg-muted)]'
              }`}
            >
              {w.currency}
            </button>
          ))}
        </div>
      )}

      <div>
        <p className="label">Your {network} deposit address</p>
        <div className="mt-2 flex items-start gap-3">
          <AssetAvatar code={asset} className="w-9 h-9 shrink-0 mt-0.5" />
          {/* The whole field copies, and now says so. The icon is decoration
              for the eye — the button's accessible name stays the address. */}
          <button
            onClick={() => { navigator.clipboard?.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="row min-w-0 flex-1 flex items-start gap-3 text-left rounded-xl bg-[var(--color-surface-2)] border border-[color:var(--color-border)] px-3.5 py-2.5 group"
          >
            <span className="font-mono text-sm break-all flex-1 min-w-0 leading-relaxed">{address}</span>
            <span className={`shrink-0 mt-0.5 ${copied ? 'text-[var(--color-positive)]' : 'text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)]'}`}>
              <Icon name={copied ? 'check' : 'copy'} className="w-4 h-4" />
            </span>
          </button>
        </div>
        <p className="mt-2 text-[0.7rem] text-[var(--color-fg-subtle)]">
          {wallets.length > 1
            ? `Send only ${asset} to this address.`
            : 'One account wallet address — every asset on this network arrives here.'}
        </p>
      </div>

      {config?.sandbox && (
        <div className="pt-1 border-t border-[color:var(--color-border)]">
          <p className="label mt-4">Testnet faucet</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[['LUX', 100], ['BTC', 0.1], ['ETH', 1], ['DAI', 1000]].map(([a, n]) => (
              <button key={a as string} onClick={() => faucet(a as string, n as number)} disabled={busy} className="btn btn-secondary justify-center text-xs">
                +{n} {a}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-[var(--color-negative)]">{error}</p>}
    </div>
  )
}
