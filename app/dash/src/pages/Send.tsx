import { useEffect, useState } from 'react'
import {
  listBeneficiaries, createBeneficiary, deleteBeneficiary, sendPayment,
  type Beneficiary,
} from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { Button, Icon, Field, Modal, EmptyState, StatusBadge, SectionHeader, AssetAvatar, CopyRow, Skeleton } from '@/components/ui'
import { formatMoney, shortAddress } from '@/lib/format'

export function Send() {
  const { overview, refresh } = useOverview()
  const [bens, setBens] = useState<Beneficiary[] | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const balances = overview?.balances?.filter((b) => b.kind === 'fiat') ?? []
  const account = overview?.account
  // One deposit address per crypto asset; an older bankd sends only the first.
  const cryptoWallets = overview?.wallets ?? (overview?.wallet ? [overview.wallet] : [])

  async function load() {
    try { setBens(await listBeneficiaries()) } catch { setBens([]) }
  }
  useEffect(() => { void load() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Send &amp; receive</h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Pay recipients worldwide over simulated SWIFT/SEPA rails.</p>
      </div>

      {bens === null ? (
        <Skeleton className="h-72 rounded-[var(--radius-card)]" />
      ) : bens.length > 0 && (
        <SendForm
          balances={balances}
          beneficiaries={bens}
          accountId={account?.id ?? ''}
          onSent={async (msg) => { setNotice(msg); await refresh() }}
        />
      )}

      {notice && (
        <div className="card-2 p-4 flex items-center gap-3 text-sm rise">
          <span className="w-8 h-8 rounded-full grid place-items-center bg-[color:rgba(52,211,153,0.12)] text-[var(--color-positive)]"><Icon name="check" className="w-4 h-4" /></span>
          {notice}
        </div>
      )}

      {/* Receive */}
      {account && (
        <section>
          <SectionHeader title="Receive" />
          <div className="card divide-y divide-[color:var(--color-border)]">
            <CopyRow
              label="Account (IBAN)"
              value={account.iban}
              empty="No IBAN on this account yet"
              className="px-4 py-3.5"
            />
            {cryptoWallets.map((w) => (
              <CopyRow
                key={w.currency}
                label={`${w.currency} · ${w.network}`}
                value={w.address}
                display={shortAddress(w.address)}
                className="px-4 py-3.5"
              />
            ))}
          </div>
        </section>
      )}

      {/* Recipients */}
      <section>
        <SectionHeader
          title="Recipients"
          action={<button onClick={() => setAddOpen(true)} className="text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] flex items-center gap-1"><Icon name="plus" className="w-3.5 h-3.5" /> Add</button>}
        />
        {bens === null ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : bens.length === 0 ? (
          <EmptyState icon="send" title="No recipients yet" body="Add a recipient to send them money." action={<Button onClick={() => setAddOpen(true)}>Add recipient</Button>} />
        ) : (
          <div className="card divide-y divide-[color:var(--color-border)]">
            {bens.map((b) => (
              <div key={b.id} className="flex items-center gap-3 px-4 py-3.5">
                <AssetAvatar code={b.currency} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{b.name}</p>
                  <p className="text-xs text-[var(--color-fg-subtle)] truncate">{b.bankDetails?.iban || b.bankDetails?.accountNumber || b.currency} · {b.country}</p>
                </div>
                <StatusBadge status={b.verified ? 'active' : 'pending'} />
                <button
                  onClick={async () => { await deleteBeneficiary(b.id); await load() }}
                  className="btn btn-ghost px-2 text-[var(--color-fg-subtle)]" aria-label="Remove recipient"
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {addOpen && (
        <AddBeneficiary
          onClose={() => setAddOpen(false)}
          onCreated={async () => { setAddOpen(false); await load() }}
        />
      )}
    </div>
  )
}

function SendForm({
  balances, beneficiaries, accountId, onSent,
}: {
  balances: { currency: string; available: number; decimals: number }[]
  beneficiaries: Beneficiary[]
  accountId: string
  onSent: (msg: string) => void
}) {
  const [benId, setBenId] = useState('')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ben = beneficiaries.find((b) => b.id === benId)
  const currency = ben?.currency ?? ''
  const bal = balances.find((b) => b.currency === currency)
  const decimals = bal?.decimals ?? 2
  const minor = Math.round(parseFloat(amount || '0') * 10 ** decimals)
  const insufficient = bal ? minor > bal.available : false
  const canSend = ben && minor > 0 && !insufficient && accountId

  async function submit() {
    if (!ben) return
    setSending(true); setError(null)
    try {
      await sendPayment({ accountId, beneficiaryId: ben.id, amount: minor, currency, reference: reference || `To ${ben.name}` })
      onSent(`Sent ${formatMoney(minor, currency, decimals)} to ${ben.name}.`)
      setAmount(''); setReference('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="card p-5 space-y-4">
      <Field label="Recipient">
        <select className="input" value={benId} onChange={(e) => setBenId(e.target.value)}>
          <option value="">Select a recipient…</option>
          {beneficiaries.map((b) => <option key={b.id} value={b.id}>{b.name} · {b.currency}</option>)}
        </select>
      </Field>

      <Field label="Amount" hint={bal ? `Available ${formatMoney(bal.available, currency, decimals)}` : currency ? `No ${currency} balance — convert first` : undefined}>
        <div className="relative">
          <input className="input pr-16 tnum" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={!ben} />
          {currency && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-fg-muted)]">{currency}</span>}
        </div>
      </Field>

      <Field label="Reference (optional)">
        <input className="input" placeholder="Invoice #1024" value={reference} onChange={(e) => setReference(e.target.value)} />
      </Field>

      {insufficient && <p className="text-sm text-[var(--color-negative)]">Insufficient {currency} balance.</p>}
      {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}

      <Button className="w-full" onClick={submit} loading={sending} disabled={!canSend}>
        <Icon name="send" className="w-4 h-4" />
        {ben && minor > 0 ? `Send ${formatMoney(minor, currency, decimals)}` : 'Send'}
      </Button>
      <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)]">Simulated rail · settles instantly in sandbox</p>
    </div>
  )
}

function AddBeneficiary({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { overview } = useOverview()
  const fiats = overview?.balances?.filter((b) => b.kind === 'fiat').map((b) => b.currency) ?? ['USD', 'EUR', 'GBP']
  const [f, setF] = useState({ name: '', currency: fiats[0] ?? 'USD', country: 'US', iban: '', bic: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }))

  async function submit() {
    setSaving(true); setError(null)
    try {
      await createBeneficiary({ name: f.name, currency: f.currency, country: f.country, iban: f.iban, bic: f.bic, paymentType: 'regular' })
      onCreated()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add recipient')
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add recipient</h3>
        <Field label="Name"><input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Acme Corporation" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Currency">
            <select className="input" value={f.currency} onChange={(e) => set('currency', e.target.value)}>
              {['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'SGD', 'AED', 'HKD'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Country"><input className="input" value={f.country} onChange={(e) => set('country', e.target.value.toUpperCase())} maxLength={2} /></Field>
        </div>
        <Field label="IBAN / account number"><input className="input tnum" value={f.iban} onChange={(e) => set('iban', e.target.value)} placeholder="DE89 3704 0044 0532 0130 00" /></Field>
        <Field label="BIC / SWIFT (optional)"><input className="input" value={f.bic} onChange={(e) => set('bic', e.target.value)} placeholder="COBADEFF" /></Field>
        {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={submit} loading={saving} disabled={!f.name || !f.iban} className="flex-1">Add</Button>
        </div>
      </div>
    </Modal>
  )
}
