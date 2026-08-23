import { useEffect, useState } from 'react'
import { listCards, issueCard, freezeCard, unfreezeCard, type CardView } from '@/api/client'
import { useOverview } from '@/hooks/overview'
import { CardFace } from '@/components/CardFace'
import { Button, Icon, EmptyState, Skeleton, StatusBadge, Modal } from '@/components/ui'

export function Cards() {
  const { refresh } = useOverview()
  const [cards, setCards] = useState<CardView[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [issuing, setIssuing] = useState(false)
  const [reveal, setReveal] = useState<{ card: CardView; cvv: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setCards(await listCards())
    } catch {
      setCards([])
    }
  }
  useEffect(() => { void load() }, [])

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
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((c) => (
            <div key={c.id} className="space-y-3">
              <CardFace card={c} />
              <div className="card-2 p-4 flex items-center justify-between">
                <div>
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
      )}

      {reveal && (
        <Modal onClose={() => setReveal(null)}>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Your new card is ready</h3>
              <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">Save the CVV now — it’s shown only once.</p>
            </div>
            <CardFace card={reveal.card} cvv={reveal.cvv} />
            <Button className="w-full" onClick={() => setReveal(null)}>Done</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
