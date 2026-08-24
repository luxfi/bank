import { useEffect, useState } from 'react'
import {
  listBeneficiaries, createBeneficiary, deleteBeneficiary, sendPayment,
  type Beneficiary,
} from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { Button, Icon, Field, Modal, EmptyState, StatusBadge, PageHeader, SectionHeader, AssetAvatar, CopyRow, Skeleton, font, truncate } from '@/components/ui'
import { Coordinates } from '@/components/Coordinates'
import { formatMoney, shortAddress } from '@/lib/format'
import { View } from '@/gui'

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
    <View className="page" style={{ display: 'grid' }}>
      <PageHeader title="Send &amp; receive" subtitle="Pay recipients worldwide over simulated SWIFT/SEPA rails." />

      {bens === null ? (
        <Skeleton style={{ height: 288, borderRadius: 'var(--radius-card)' }} />
      ) : bens.length > 0 && (
        <SendForm
          balances={balances}
          beneficiaries={bens}
          accountId={account?.id ?? ''}
          onSent={async (msg) => { setNotice(msg); await refresh() }}
        />
      )}

      {notice && (
        <View
          className="card-2 rise"
          style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'center', gap: 12, padding: 16, fontSize: 14 }}
        >
          <span
            style={{
              display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 9999,
              background: 'rgba(52,211,153,0.12)', color: 'var(--color-positive)',
            }}
          >
            <Icon name="check" size={16} />
          </span>
          <span>{notice}</span>
        </View>
      )}

      {/* Receive */}
      {account && (
        <section>
          <SectionHeader title="Receive" />
          {/* Two ways in, each named: the wire coordinates, then one deposit
              address per asset. Both are labelled the way every other list on
              the app is, so neither reads as a stray card. */}
          <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 20 }}>
            <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8 }}>
              <p className="label">Bank transfer · {account.currency}</p>
              <View className="card" style={{ display: 'grid', padding: 20 }}><Coordinates account={account} /></View>
            </View>
            {cryptoWallets.length > 0 && (
              <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 8 }}>
                <p className="label">Crypto · {cryptoWallets[0].network}</p>
                <View className="card" style={{ display: 'grid', overflow: 'hidden' }}>
                  {cryptoWallets.map((w, i) => (
                    <View key={w.currency} style={{ display: 'grid', borderTop: i ? '1px solid var(--color-border)' : undefined }}>
                      <CopyRow
                        label={`${w.currency} · ${w.network}`}
                        value={w.address}
                        display={shortAddress(w.address)}
                        style={{ paddingInline: 16, paddingBlock: 14 }}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </section>
      )}

      {/* Recipients */}
      <section>
        <SectionHeader
          title="Recipients"
          action={
            <button
              onClick={() => setAddOpen(true)}
              style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'center', gap: 4, ...font(12), color: 'var(--color-fg-muted)' }}
            >
              <Icon name="plus" size={14} /> Add
            </button>
          }
        />
        {bens === null ? (
          <View style={{ display: 'grid', gap: 8 }}>
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} style={{ height: 64, borderRadius: 12 }} />)}
          </View>
        ) : bens.length === 0 ? (
          <EmptyState icon="send" title="No recipients yet" body="Add a recipient to send them money." action={<Button onClick={() => setAddOpen(true)}>Add recipient</Button>} />
        ) : (
          <View className="card" style={{ display: 'grid', overflow: 'hidden' }}>
            {bens.map((b, i) => (
              <View
                key={b.id}
                className="row"
                style={{
                  display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto auto', alignItems: 'center', gap: 12,
                  paddingInline: 16, paddingBlock: 14,
                  borderTop: i ? '1px solid var(--color-border)' : undefined,
                }}
              >
                <AssetAvatar code={b.currency} />
                <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)' }}>
                  <p style={{ fontWeight: 500, ...truncate }}>{b.name}</p>
                  <p style={{ ...font(12), color: 'var(--color-fg-subtle)', ...truncate }}>
                    {b.bankDetails?.iban || b.bankDetails?.accountNumber || b.currency} · {b.country}
                  </p>
                </View>
                <StatusBadge status={b.verified ? 'active' : 'pending'} />
                <button
                  onClick={async () => { await deleteBeneficiary(b.id); await load() }}
                  className="btn btn-ghost" style={{ paddingInline: 8, color: 'var(--color-fg-subtle)' }} aria-label="Remove recipient"
                >✕</button>
              </View>
            ))}
          </View>
        )}
      </section>

      {addOpen && (
        <AddBeneficiary
          onClose={() => setAddOpen(false)}
          onCreated={async () => { setAddOpen(false); await load() }}
        />
      )}
    </View>
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
    <View className="card" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16, padding: 20 }}>
      <Field label="Recipient">
        <select className="input" value={benId} onChange={(e) => setBenId(e.target.value)}>
          <option value="">Select a recipient…</option>
          {beneficiaries.map((b) => <option key={b.id} value={b.id}>{b.name} · {b.currency}</option>)}
        </select>
      </Field>

      {/* The amount is denominated in the recipient's currency, so the field
          always names one — the recipient's once chosen, and until then it says
          where the currency comes from. */}
      <Field
        label="Amount"
        hint={
          bal ? `Available ${formatMoney(bal.available, currency, decimals)}`
          : currency ? `No ${currency} balance — convert first`
          : 'Choose a recipient to set the currency'
        }
      >
        <View style={{ display: 'grid', position: 'relative' }}>
          <input className="input tnum" style={{ paddingLeft: 56 }} inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={!ben} />
          <span
            className="tnum"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', ...font(14, 500), color: 'var(--color-fg-muted)' }}
          >
            {currency || '···'}
          </span>
        </View>
      </Field>

      <Field label="Reference (optional)">
        <input className="input" placeholder="Invoice #1024" value={reference} onChange={(e) => setReference(e.target.value)} />
      </Field>

      {insufficient && <p style={{ ...font(14), color: 'var(--color-negative)' }}>Insufficient {currency} balance.</p>}
      {error && <p style={{ ...font(14), color: 'var(--color-negative)' }}>{error}</p>}

      <Button onClick={submit} loading={sending} disabled={!canSend}>
        <Icon name="send" size={16} />
        {ben && minor > 0 ? `Send ${formatMoney(minor, currency, decimals)}` : 'Send'}
      </Button>
      <p style={{ textAlign: 'center', fontSize: 11.2, color: 'var(--color-fg-subtle)' }}>Simulated rail · settles instantly in sandbox</p>
    </View>
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
      <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
        <h3 style={font(18, 600)}>Add recipient</h3>
        <Field label="Name"><input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Acme Corporation" /></Field>
        <View className="form-grid" style={{ display: 'grid' }}>
          <Field label="Currency">
            <select className="input" value={f.currency} onChange={(e) => set('currency', e.target.value)}>
              {['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'SGD', 'AED', 'HKD'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Country"><input className="input" value={f.country} onChange={(e) => set('country', e.target.value.toUpperCase())} maxLength={2} /></Field>
        </View>
        <Field label="IBAN / account number"><input className="input tnum" value={f.iban} onChange={(e) => set('iban', e.target.value)} placeholder="DE89 3704 0044 0532 0130 00" /></Field>
        <Field label="BIC / SWIFT (optional)"><input className="input" value={f.bic} onChange={(e) => set('bic', e.target.value)} placeholder="COBADEFF" /></Field>
        {error && <p style={{ ...font(14), color: 'var(--color-negative)' }}>{error}</p>}
        <View style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} loading={saving} disabled={!f.name || !f.iban}>Add</Button>
        </View>
      </View>
    </Modal>
  )
}
