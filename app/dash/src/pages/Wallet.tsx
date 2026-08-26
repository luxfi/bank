import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getWallet, sendCrypto, depositCrypto, type WalletBundle, type Wallet as WalletT, type Balance } from '@/api/client'
import { useConfig } from '@/lib/config'
import {
  Icon, AssetAvatar, ActionTile, AssetRow, PageHeader, SectionHeader, Skeleton, EmptyState, formatUSD, font,
} from '@/components/ui'
import { Allocation } from '@/components/Allocation'
import { Custody } from '@/components/Custody'
import { shortAddress } from '@/lib/format'
import { View } from '@/gui'

const CRYPTO_DECIMALS = 6

// The panel a hero is cut from.
const panel = {
  borderRadius: 'var(--radius-card)',
  border: '1px solid var(--color-border)',
  background: 'linear-gradient(to bottom right, var(--color-surface-2), var(--color-surface))',
  overflow: 'hidden',
} as const

const display = { fontWeight: 600, letterSpacing: '-0.025em' } as const
const muted = { color: 'var(--color-fg-muted)' } as const
const subtle = { color: 'var(--color-fg-subtle)' } as const
const mono = { fontFamily: 'var(--font-mono)' } as const
const body = { display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', padding: 20 } as const

export function Wallet() {
  const [data, setData] = useState<WalletBundle | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState<'send' | 'receive' | null>(null)

  useEffect(() => {
    getWallet().then(setData).catch((e) => setError(e instanceof Error ? e.message : 'No wallet'))
  }, [])

  if (error) return <EmptyState icon="wallet" title="Wallet unavailable" body={error} />
  if (!data) return <Skeleton style={{ height: 256, borderRadius: 'var(--radius-card)' }} />

  const totalUsd = data.holdings.reduce((s, h) => s + h.valueUsd, 0)
  const addr = data.wallet.address
  const setHoldings = (balances: Balance[]) =>
    setData((d) => (d ? { ...d, holdings: balances.filter((b) => b.kind === 'crypto') } : d))

  return (
    <View className="page" style={{ display: 'grid' }}>
      {/* The shell header already flies the sandbox flag; a second one here
          just says it twice. */}
      <PageHeader title="Crypto wallet" subtitle={data.network} />

      {/* Wallet hero. The mix on the right is what the figure on the left is
          made of — the same block the dashboard total carries. */}
      <View
        className="hero"
        style={{ ...panel, display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', position: 'relative' }}
      >
        <div className="accent-glow" style={{ position: 'absolute', top: -64, right: -40, width: 224, height: 224, borderRadius: 9999 }} />
        <View className="hero-split" style={{ display: 'grid', position: 'relative' }}>
          <View className="self-end" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'start', minWidth: 0 }}>
            <p style={{ ...font(14), ...muted }}>Crypto value</p>
            <p className="h1 tnum" style={{ ...display, marginTop: 4 }}>{formatUSD(totalUsd)}</p>
            <button
              onClick={() => { navigator.clipboard?.writeText(addr); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
              className="tile"
              style={{
                display: 'inline-grid', gridAutoFlow: 'column', alignItems: 'center',
                marginTop: 16, gap: 8, borderRadius: 9999,
                background: 'var(--color-surface-3)', border: '1px solid var(--color-border)',
                paddingInline: 12, paddingBlock: 6, ...font(12), ...mono,
              }}
            >
              <Icon name="wallet" size={14} />
              {shortAddress(addr)}
              <Icon name={copied ? 'check' : 'copy'} size={14} />
            </button>
          </View>
          <Allocation
            items={data.holdings.map((h) => ({ code: h.currency, valueUsd: h.valueUsd }))}
            className="mix self-end"
          />
        </View>
      </View>

      {/* Actions */}
      <View className="tiles" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        <ActionTile to="/app/exchange?from=USD&to=LUX" label="Buy" icon="arrowDown" />
        <ActionTile to="/app/exchange?from=LUX&to=USD" label="Sell" icon="arrowUp" />
        <ActionTile to="/app/exchange?from=LUX&to=DAI" label="Convert" icon="swap" />
        <ActionTile label="Send" icon="send" active={open === 'send'} onClick={() => setOpen(open === 'send' ? null : 'send')} />
        <ActionTile label="Receive" icon="arrowDown" active={open === 'receive'} onClick={() => setOpen(open === 'receive' ? null : 'receive')} />
      </View>

      {/* Sits under the actions rather than at the foot of the page: the send
          and receive panels open directly below it, so whoever is about to move
          crypto reads who signs for it first. */}
      <Custody subject="this wallet" also="Sends are broadcast by us from the account’s address." />

      {open === 'send' && <SendPanel holdings={data.holdings} onDone={setHoldings} />}
      {open === 'receive' && (
        <ReceivePanel wallets={data.wallets ?? [data.wallet]} network={data.network} onDeposit={setHoldings} />
      )}

      {/* Holdings */}
      <section>
        <SectionHeader title="Holdings" />
        {data.holdings.length === 0 ? (
          // Naming four assets and pre-selecting LUX made the empty state a
          // recommendation to acquire the house token. It points at the two ways
          // in instead, and lets the exchange open on its own defaults.
          <EmptyState icon="coins" title="No crypto yet" body="Convert from a cash balance, or receive to your deposit address."
            action={<Link to="/app/exchange" className="btn btn-primary">Open exchange</Link>} />
        ) : (
          <View className="card list" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', overflow: 'hidden' }}>
            {data.holdings.map((h) => (
              <AssetRow
                key={h.currency}
                code={h.currency}
                // The network the backend reports, never a constant. A hardcoded
                // "Testnet" here labelled mainnet holdings as play money, which
                // is the one direction a custody label must never be wrong in.
                note={data.network}
                minor={h.available}
                decimals={h.decimals}
                valueUsd={h.valueUsd}
              />
            ))}
          </View>
        )}
      </section>
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
    <View className="card" style={{ ...body, gap: 12 }}>
      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: '7rem minmax(0,1fr)', gap: 8 }}>
        <select value={asset} onChange={(e) => setAsset(e.target.value)} className="input">
          {(holdings.length ? holdings.map((h) => h.currency) : ['LUX', 'BTC', 'ETH', 'DAI']).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="decimal" className="input" />
      </View>
      <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder={asset === 'BTC' ? 'Destination address' : 'Destination address (0x…)'} className="input" style={{ ...mono, ...font(14) }} />
      <button onClick={submit} disabled={busy || !sendable} className="btn btn-primary" style={{ width: '100%' }}>
        {busy ? 'Sending…' : `Send ${asset}`}
      </button>
      {result && <p style={{ ...font(12), ...subtle, ...mono, wordBreak: 'break-all' }}>Sent · {result}</p>}
      {error && <p style={{ ...font(12), color: 'var(--color-negative)' }}>{error}</p>}
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
    <View className="card" style={{ ...body, gap: 16 }}>
      {/* An address belongs to an asset, so the asset is picked first and the
          whole block below — mark, address, warning — answers to it. */}
      {wallets.length > 1 && (
        <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: `repeat(${wallets.length}, max-content)`, gap: 6 }}>
          {wallets.map((w) => (
            <button
              key={w.currency}
              onClick={() => setAsset(w.currency)}
              className="chip tile"
              style={{
                paddingInline: 12, paddingBlock: 4,
                ...(w.currency === asset
                  ? { background: 'var(--color-fg)', color: 'var(--color-bg)', borderColor: 'transparent' }
                  : muted),
              }}
            >
              {w.currency}
            </button>
          ))}
        </View>
      )}

      <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
        <p className="label">Your {network} deposit address</p>
        <View style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'start', marginTop: 8, gap: 12 }}>
          <span style={{ display: 'grid', marginTop: 2 }}><AssetAvatar code={asset} /></span>
          {/* The whole field copies, and now says so. The icon is decoration
              for the eye — the button's accessible name stays the address. */}
          <button
            onClick={() => { navigator.clipboard?.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="row"
            style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'start',
              minWidth: 0, gap: 12, textAlign: 'left', borderRadius: 12,
              background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
              paddingInline: 14, paddingBlock: 10,
            }}
          >
            <span style={{ ...mono, ...font(14), wordBreak: 'break-all', minWidth: 0, lineHeight: 1.625 }}>{address}</span>
            <span className={copied ? undefined : 'link'} style={{ display: 'grid', marginTop: 2, ...(copied ? { color: 'var(--color-positive)' } : null) }}>
              <Icon name={copied ? 'check' : 'copy'} size={16} />
            </span>
          </button>
        </View>
        <p style={{ marginTop: 8, fontSize: 11.2, ...subtle }}>
          {wallets.length > 1
            ? `Send only ${asset} to this address.`
            : 'One account wallet address — every asset on this network arrives here.'}
        </p>
      </View>

      {config?.sandbox && (
        <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', paddingTop: 4, borderTop: '1px solid var(--color-border)' }}>
          <p className="label" style={{ marginTop: 16 }}>Testnet faucet</p>
          {/* Four small buttons, each its own width: three abreast on a phone,
              one row from sm up. */}
          <View
            className="pills"
            style={{ display: 'grid', alignContent: 'start', justifyContent: 'start', marginTop: 8, gap: 8 }}
          >
            {[['LUX', 100], ['BTC', 0.1], ['ETH', 1], ['DAI', 1000]].map(([a, n]) => (
              <button key={a as string} onClick={() => faucet(a as string, n as number)} disabled={busy} className="btn btn-secondary" style={font(12)}>
                +{n} {a}
              </button>
            ))}
          </View>
        </View>
      )}
      {error && <p style={{ ...font(12), color: 'var(--color-negative)' }}>{error}</p>}
    </View>
  )
}
