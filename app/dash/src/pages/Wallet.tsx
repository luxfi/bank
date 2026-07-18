import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getWallet, type Wallet as WalletT, type Balance } from '@/api/client'
import { Money, Icon, AssetAvatar, SectionHeader, Skeleton, EmptyState, SandboxBadge, formatUSD } from '@/components/ui'
import { shortAddress } from '@/lib/format'

export function Wallet() {
  const [data, setData] = useState<{ wallet: WalletT; holdings: Balance[]; network: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getWallet().then(setData).catch((e) => setError(e instanceof Error ? e.message : 'No wallet'))
  }, [])

  if (error) return <EmptyState icon="wallet" title="Wallet unavailable" body={error} />
  if (!data) return <Skeleton className="h-64 rounded-[var(--radius-card)]" />

  const totalUsd = data.holdings.reduce((s, h) => s + h.valueUsd, 0)
  const addr = data.wallet.address

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

      {/* Trade actions */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <TradeAction to="/app/exchange?from=USD&to=LUX" label="Buy" icon="arrowDown" />
        <TradeAction to="/app/exchange?from=LUX&to=USD" label="Sell" icon="arrowUp" />
        <TradeAction to="/app/exchange?from=LUX&to=DAI" label="Convert" icon="swap" />
      </div>

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
