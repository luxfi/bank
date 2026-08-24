import { useEffect, useState } from 'react'
import { listCards, issueCard, freezeCard, unfreezeCard, listTransactions, type CardView, type Txn } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { CardFace } from '@/components/CardFace'
import { TxnRow } from '@/components/TxnRow'
import { Button, Icon, EmptyState, Skeleton, StatusBadge, Modal, PageHeader, SectionHeader, Money, font } from '@/components/ui'
import { formatMoney } from '@/lib/format'
import { limitOf, spent } from '@/lib/limits'
import { View } from '@/gui'

const display = { fontWeight: 600, letterSpacing: '-0.025em' } as const
const muted = { color: 'var(--color-fg-muted)' } as const
const subtle = { color: 'var(--color-fg-subtle)' } as const
const stack = { display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)' } as const

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
    <View className="page" style={{ display: 'grid' }}>
      <PageHeader
        title="Cards"
        subtitle="Virtual cards for online spending."
        action={<Button onClick={newCard} loading={issuing}><Icon name="plus" size={16} /> New card</Button>}
      />

      {error && <p style={{ ...font(14), color: 'var(--color-negative)' }}>{error}</p>}

      {cards === null ? (
        <Skeleton style={{ height: 224, maxWidth: 384, borderRadius: 'var(--radius-card)' }} />
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
        <View className="aside" style={{ display: 'grid', alignItems: 'start' }}>
          <View style={{ ...stack, gap: 24 }}>
            {cards.map((c) => (
              <View key={c.id} style={{ ...stack, gap: 12 }}>
                <CardFace card={c} />
                <View
                  className="card-2"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', padding: 16, gap: 12 }}
                >
                  <View style={{ ...stack, minWidth: 0 }}>
                    <View style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'start', alignItems: 'center', gap: 8 }}>
                      <span style={font(14, 500)}>Virtual · {c.currency}</span>
                      <StatusBadge status={c.status} />
                    </View>
                    <p style={{ ...font(12), ...subtle, marginTop: 2 }}>•••• {c.last4}</p>
                  </View>
                  <Button variant="secondary" loading={busy === c.id} onClick={() => toggleFreeze(c)}>
                    <Icon name={c.status === 'frozen' ? 'unlock' : 'lock'} size={16} />
                    {c.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                  </Button>
                </View>
              </View>
            ))}
          </View>

          <View style={{ ...stack, gap: 24 }}>
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
                <View className="card list" style={{ ...stack, overflow: 'hidden' }}>
                  {payments.map((t) => <TxnRow key={t.id} txn={t} />)}
                </View>
              )}
            </section>
          </View>
        </View>
      )}

      {reveal && (
        <Modal onClose={() => setReveal(null)}>
          <View style={{ ...stack, gap: 16 }}>
            <View style={stack}>
              <h3 style={{ ...font(18), fontWeight: 600 }}>Your new card is ready</h3>
              <p style={{ ...font(14), ...muted, marginTop: 2 }}>Save the number and CVV now — they’re shown once.</p>
            </View>
            <CardFace card={reveal.card} cvv={reveal.cvv} pan={reveal.pan} />
            <Button style={{ width: '100%' }} onClick={() => setReveal(null)}>Done</Button>
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
      <View className="card" style={{ ...stack, padding: 20, gap: 16 }}>
        <View style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'end', gap: 12 }}>
          <View style={stack}>
            <p style={{ ...font(12), ...subtle }}>Spent this month</p>
            <p className="tnum" style={{ ...font(24), ...display, marginTop: 2 }}>
              <Money minor={used} currency={currency} />
            </p>
          </View>
          <p className="tnum" style={{ ...font(14), ...muted }}>
            of {formatMoney(monthly, currency)}
          </p>
        </View>
        {/* Any spend at all shows as something: a tenth of a percent still drew
            money down, and a bar that renders as empty says it did not. */}
        <View style={{ ...stack, height: 6, borderRadius: 9999, background: 'var(--color-surface-3)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 9999, background: 'var(--color-fg)', width: `${pct}%`, minWidth: used > 0 ? '0.375rem' : 0 }} />
        </View>
        <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12, paddingTop: 4 }}>
          <View className="card-2" style={{ ...stack, padding: 12 }}>
            <p style={{ ...font(12), ...subtle }}>Daily limit</p>
            <p className="tnum" style={{ ...font(14, 500), marginTop: 2 }}>{formatMoney(daily, currency)}</p>
          </View>
          <View className="card-2" style={{ ...stack, padding: 12 }}>
            <p style={{ ...font(12), ...subtle }}>Remaining</p>
            <p className="tnum" style={{ ...font(14, 500), marginTop: 2 }}>{formatMoney(Math.max(0, monthly - used), currency)}</p>
          </View>
        </View>
        <p style={{ fontSize: 11.2, ...subtle }}>
          <span style={{ textTransform: 'capitalize' }}>{entityType}</span> tier
        </p>
      </View>
    </section>
  )
}
