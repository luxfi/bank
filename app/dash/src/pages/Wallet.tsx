import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getWallet, sendCrypto, depositCrypto, type WalletBundle, type Wallet as WalletT, type Balance } from '@/api/client'
import { useConfig } from '@/lib/config'
import {
  Icon, AssetAvatar, ActionTile, AssetRow, PageHeader, SectionHeader, Skeleton, EmptyState, formatUSD,
} from '@/components/ui'
import { Allocation } from '@/components/Allocation'
import { shortAddress } from '@/lib/format'
import { View } from '@/gui'

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
    <View className="gap-6 md:gap-8" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
      {/* The shell header already flies the sandbox flag; a second one here
          just says it twice. */}
      <PageHeader title="Crypto wallet" subtitle={data.network} />

      {/* Wallet hero. The mix on the right is what the figure on the left is
          made of — the same block the dashboard total carries. */}
      <View
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] p-6 md:p-8"
        style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}
      >
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full accent-glow" />
        <View
          className="relative gap-7 grid-cols-[minmax(0,1fr)] md:gap-12 md:grid-cols-[minmax(0,1fr)_auto]"
          style={{ display: 'grid', alignItems: 'end' }}
        >
          <View className="min-w-0" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'start' }}>
            <p className="text-sm text-[var(--color-fg-muted)]">Crypto value</p>
            <p className="text-3xl md:text-4xl font-semibold tracking-tight tnum mt-1">{formatUSD(totalUsd)}</p>
            <button
              onClick={() => { navigator.clipboard?.writeText(addr); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
              className="tile mt-4 gap-2 rounded-full bg-[var(--color-surface-3)] border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-mono"
              style={{ display: 'inline-grid', gridAutoFlow: 'column', alignItems: 'center' }}
            >
              <Icon name="wallet" className="w-3.5 h-3.5" />
              {shortAddress(addr)}
              <Icon name={copied ? 'check' : 'copy'} className="w-3.5 h-3.5" />
            </button>
          </View>
          <Allocation
            items={data.holdings.map((h) => ({ code: h.currency, valueUsd: h.valueUsd }))}
            className="w-full md:w-52 lg:w-60"
          />
        </View>
      </View>

      {/* Actions */}
      <View className="grid-cols-5 gap-2 md:gap-3" style={{ display: 'grid', alignContent: 'start' }}>
        <ActionTile to="/app/exchange?from=USD&to=LUX" label="Buy" icon="arrowDown" />
        <ActionTile to="/app/exchange?from=LUX&to=USD" label="Sell" icon="arrowUp" />
        <ActionTile to="/app/exchange?from=LUX&to=DAI" label="Convert" icon="swap" />
        <ActionTile label="Send" icon="send" active={panel === 'send'} onClick={() => setPanel(panel === 'send' ? null : 'send')} />
        <ActionTile label="Receive" icon="arrowDown" active={panel === 'receive'} onClick={() => setPanel(panel === 'receive' ? null : 'receive')} />
      </View>

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
          <View className="card divide-y divide-[color:var(--color-border)] overflow-hidden" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
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
          </View>
        )}
      </section>

      <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)]">
        Testnet assets only. In production this wallet is secured by threshold MPC — no single key.
      </p>
    </View>
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
    <View className="card p-5" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 }}>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: '7rem minmax(0,1fr)', gap: 8 }}>
        <select value={asset} onChange={(e) => setAsset(e.target.value)} className="input">
          {(holdings.length ? holdings.map((h) => h.currency) : ['LUX', 'BTC', 'ETH', 'DAI']).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" className="input" />
      </View>
      <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder={asset === 'BTC' ? 'Destination address' : 'Destination address (0x…)'} className="input w-full font-mono text-sm" />
      <button onClick={submit} disabled={busy || !sendable} className="btn btn-primary w-full">
        {busy ? 'Sending…' : `Send ${asset}`}
      </button>
      {result && <p className="text-xs text-[var(--color-fg-subtle)] font-mono break-all">Sent · {result}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </View>
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
    <View className="card p-5" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
      {/* An address belongs to an asset, so the asset is picked first and the
          whole block below — mark, address, warning — answers to it. */}
      {wallets.length > 1 && (
        <View
          className="gap-1.5"
          style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: `repeat(${wallets.length}, max-content)` }}
        >
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
        </View>
      )}

      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
        <p className="label">Your {network} deposit address</p>
        <View className="mt-2 gap-3" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'start' }}>
          <AssetAvatar code={asset} className="w-9 h-9 mt-0.5" />
          {/* The whole field copies, and now says so. The icon is decoration
              for the eye — the button's accessible name stays the address. */}
          <button
            onClick={() => { navigator.clipboard?.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="row min-w-0 gap-3 text-left rounded-xl bg-[var(--color-surface-2)] border border-[color:var(--color-border)] px-3.5 py-2.5 group"
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'start' }}
          >
            <span className="font-mono text-sm break-all min-w-0 leading-relaxed">{address}</span>
            <span className={`mt-0.5 ${copied ? 'text-[var(--color-positive)]' : 'text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)]'}`}>
              <Icon name={copied ? 'check' : 'copy'} className="w-4 h-4" />
            </span>
          </button>
        </View>
        <p className="mt-2 text-[0.7rem] text-[var(--color-fg-subtle)]">
          {wallets.length > 1
            ? `Send only ${asset} to this address.`
            : 'One account wallet address — every asset on this network arrives here.'}
        </p>
      </View>

      {config?.sandbox && (
        <View className="pt-1 border-t border-[color:var(--color-border)]" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
          <p className="label mt-4">Testnet faucet</p>
          {/* Four small buttons, each its own width: three abreast on a phone,
              one row from sm up. */}
          <View
            className="mt-2 gap-2 grid-cols-[repeat(3,max-content)] sm:grid-cols-[repeat(4,max-content)]"
            style={{ display: 'grid', alignContent: 'start', justifyContent: 'start' }}
          >
            {[['LUX', 100], ['BTC', 0.1], ['ETH', 1], ['DAI', 1000]].map(([a, n]) => (
              <button key={a as string} onClick={() => faucet(a as string, n as number)} disabled={busy} className="btn btn-secondary text-xs">
                +{n} {a}
              </button>
            ))}
          </View>
        </View>
      )}
      {error && <p className="text-xs text-[var(--color-negative)]">{error}</p>}
    </View>
  )
}
