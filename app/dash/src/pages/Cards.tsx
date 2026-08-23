import { useEffect, useState } from 'react'
import { listCards, issueCard, freezeCard, unfreezeCard, listTransactions, type CardView, type Txn } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { CardFace } from '@/components/CardFace'
import { TxnRow } from '@/components/TxnRow'
import { Button, Icon, EmptyState, Skeleton, StatusBadge, Modal, SectionHeader, Money } from '@/components/ui'
import { formatMoney } from '@/lib/format'
import { limitOf, spent } from '@/lib/limits'

export function Cards() {
  const { overview, refresh } = useOverview()
  const [cards, setCards] = useState<CardView[] | null>(null)
  const [txns, setTxns] = useState<Txn[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [issuing, setIssuing] = useState(false)
  const [reveal, setReveal] = useState<{ card: CardView; cvv: string; pan: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setCards(await listCards())
    } catch {
      setCards([])
    }
  }
  useEffect(() => {
    void load()
    listTransactions().then(setTxns).catch(() => setTxns([]))
  }, [])

  async function toggleFreeze(c: CardView) {
    setBusy(c.id); setError(null)
    try {
      const updated = c.status === 'frozen' ? await unfreezeCard(c.id) : await freezeCard(c.id)
      setCards((prev) => (prev ?? []).map((x) => (x.id === c.id ? updated : x)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change the card')
    } finally {
      setBusy(null)
    }
  }

  async function newCard() {
    setIssuing(true); setError(null)
    try {
      const res = await issueCard()
      setReveal(res)
      await load()
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not issue a card')
    } finally {
      setIssuing(false)
    }
  }

  const payments = txns.filter((t) => t.type === 'card').slice(0, 8)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cards</h1>
          <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Virtual cards for online spending.</p>
        </div>
        <Button onClick={newCard} loading={issuing}><Icon name="plus" className="w-4 h-4" /> New card</Button>
      </div>

      {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}

      {cards === null ? (
        <Skeleton className="h-56 max-w-sm rounded-2xl" />
      ) : cards.length === 0 ? (
        <EmptyState
          icon="card"
          title="No cards yet"
          body="Issue a virtual card to start spending online — instantly, in the sandbox."
          action={<Button onClick={newCard} loading={issuing}>Issue a card</Button>}
        />
      ) : (
        // The cards keep their own column at desktop width; what a card is for —
        // what it may spend and what it has spent — sits beside them instead of
        // leaving two thirds of the screen blank.
        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] items-start">
          <div className="space-y-6">
            {cards.map((c) => (
              <div key={c.id} className="space-y-3">
                <CardFace card={c} />
                <div className="card-2 p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Virtual · {c.currency}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-[var(--color-fg-subtle)] mt-0.5">•••• {c.last4}</p>
                  </div>
                  <Button variant="secondary" loading={busy === c.id} onClick={() => toggleFreeze(c)}>
                    <Icon name={c.status === 'frozen' ? 'unlock' : 'lock'} className="w-4 h-4" />
                    {c.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <Limits
              currency={cards[0].currency}
              entityType={overview?.account?.entityType ?? 'individual'}
              txns={txns}
            />
            <section>
              <SectionHeader title="Card transactions" />
              {payments.length === 0 ? (
                <EmptyState icon="card" title="No card spending yet" body="Payments made on this card land here." />
              ) : (
                <div className="card divide-y divide-[color:var(--color-border)]">
                  {payments.map((t) => <TxnRow key={t.id} txn={t} />)}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {reveal && (
        <Modal onClose={() => setReveal(null)}>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Your new card is ready</h3>
              <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Save the number and CVV now — they’re shown once.</p>
            </div>
            <CardFace card={reveal.card} cvv={reveal.cvv} pan={reveal.pan} />
            <Button className="w-full" onClick={() => setReveal(null)}>Done</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// What the card may spend this month, and what is left of it. The ceiling comes
// from the account's tier; the spend is read off the ledger, so the bar moves
// the moment a payment settles.
function Limits({ currency, entityType, txns }: { currency: string; entityType: string; txns: Txn[] }) {
  const { daily, monthly } = limitOf(entityType)
  const used = spent(txns, currency)
  const pct = Math.min(100, Math.round((used / monthly) * 100))
  return (
    <section>
      <SectionHeader title="Spend limits" />
      <div className="card p-5 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--color-fg-subtle)]">Spent this month</p>
            <p className="text-2xl font-semibold tracking-tight tnum mt-0.5">
              <Money minor={used} currency={currency} />
            </p>
          </div>
          <p className="text-sm text-[var(--color-fg-muted)] tnum">
            of {formatMoney(monthly, currency)}
          </p>
        </div>
        {/* Any spend at all shows as something: a tenth of a percent still drew
            money down, and a bar that renders as empty says it did not. */}
        <div className="h-1.5 rounded-full bg-[var(--color-surface-3)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--color-fg)]" style={{ width: `${pct}%`, minWidth: used > 0 ? '0.375rem' : 0 }} />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="card-2 p-3">
            <p className="text-xs text-[var(--color-fg-subtle)]">Daily limit</p>
            <p className="text-sm font-medium tnum mt-0.5">{formatMoney(daily, currency)}</p>
          </div>
          <div className="card-2 p-3">
            <p className="text-xs text-[var(--color-fg-subtle)]">Remaining</p>
            <p className="text-sm font-medium tnum mt-0.5">{formatMoney(Math.max(0, monthly - used), currency)}</p>
          </div>
        </div>
        <p className="text-[0.7rem] text-[var(--color-fg-subtle)]">
          <span className="capitalize">{entityType}</span> tier
        </p>
      </div>
    </section>
  )
}
