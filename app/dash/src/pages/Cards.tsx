import { useEffect, useState } from 'react'
import { listCards, issueCard, freezeCard, unfreezeCard, listTransactions, type CardView, type Txn } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { CardFace } from '@/components/CardFace'
import { TxnRow } from '@/components/TxnRow'
import { Button, Icon, EmptyState, Skeleton, StatusBadge, Modal, PageHeader, SectionHeader, Money } from '@/components/ui'
import { formatMoney } from '@/lib/format'
import { limitOf, spent } from '@/lib/limits'
import { View } from '@/gui'

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
    <View className="gap-6 md:gap-8" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
      <PageHeader
        title="Cards"
        subtitle="Virtual cards for online spending."
        action={<Button onClick={newCard} loading={issuing}><Icon name="plus" className="w-4 h-4" /> New card</Button>}
      />

      {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}

      {cards === null ? (
        <Skeleton className="h-56 max-w-sm rounded-[var(--radius-card)]" />
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
        <View
          className="gap-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
          style={{ display: 'grid', alignItems: 'start' }}
        >
          <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 24 }}>
            {cards.map((c) => (
              <View key={c.id} style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 }}>
                <CardFace card={c} />
                <View
                  className="card-2 p-4 gap-3"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}
                >
                  <View className="min-w-0" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
                    <View style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'start', alignItems: 'center', gap: 8 }}>
                      <span className="text-sm font-medium">Virtual · {c.currency}</span>
                      <StatusBadge status={c.status} />
                    </View>
                    <p className="text-xs text-[var(--color-fg-subtle)] mt-0.5">•••• {c.last4}</p>
                  </View>
                  <Button variant="secondary" loading={busy === c.id} onClick={() => toggleFreeze(c)}>
                    <Icon name={c.status === 'frozen' ? 'unlock' : 'lock'} className="w-4 h-4" />
                    {c.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                  </Button>
                </View>
              </View>
            ))}
          </View>

          <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 24 }}>
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
                <View className="card divide-y divide-[color:var(--color-border)] overflow-hidden" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
                  {payments.map((t) => <TxnRow key={t.id} txn={t} />)}
                </View>
              )}
            </section>
          </View>
        </View>
      )}

      {reveal && (
        <Modal onClose={() => setReveal(null)}>
          <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
            <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
              <h3 className="text-lg font-semibold">Your new card is ready</h3>
              <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Save the number and CVV now — they’re shown once.</p>
            </View>
            <CardFace card={reveal.card} cvv={reveal.cvv} pan={reveal.pan} />
            <Button className="w-full" onClick={() => setReveal(null)}>Done</Button>
          </View>
        </Modal>
      )}
    </View>
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
      <View className="card p-5" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'end', gap: 12 }}>
          <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            <p className="text-xs text-[var(--color-fg-subtle)]">Spent this month</p>
            <p className="text-2xl font-semibold tracking-tight tnum mt-0.5">
              <Money minor={used} currency={currency} />
            </p>
          </View>
          <p className="text-sm text-[var(--color-fg-muted)] tnum">
            of {formatMoney(monthly, currency)}
          </p>
        </View>
        {/* Any spend at all shows as something: a tenth of a percent still drew
            money down, and a bar that renders as empty says it did not. */}
        <View className="h-1.5 rounded-full bg-[var(--color-surface-3)] overflow-hidden" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
          <div className="h-full rounded-full bg-[var(--color-fg)]" style={{ width: `${pct}%`, minWidth: used > 0 ? '0.375rem' : 0 }} />
        </View>
        <View className="grid-cols-2 gap-3 pt-1" style={{ display: 'grid', alignContent: 'start' }}>
          <View className="card-2 p-3" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            <p className="text-xs text-[var(--color-fg-subtle)]">Daily limit</p>
            <p className="text-sm font-medium tnum mt-0.5">{formatMoney(daily, currency)}</p>
          </View>
          <View className="card-2 p-3" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' }}>
            <p className="text-xs text-[var(--color-fg-subtle)]">Remaining</p>
            <p className="text-sm font-medium tnum mt-0.5">{formatMoney(Math.max(0, monthly - used), currency)}</p>
          </View>
        </View>
        <p className="text-[0.7rem] text-[var(--color-fg-subtle)]">
          <span className="capitalize">{entityType}</span> tier
        </p>
      </View>
    </section>
  )
}
