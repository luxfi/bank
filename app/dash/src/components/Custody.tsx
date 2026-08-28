import { useBrand } from '@/hooks/brand'
import { Icon, font } from '@/components/ui'
import { View } from '@/gui'

// Who holds the signing key.
//
// bankd derives every account's key from its own seed and keeps it: the account
// claims a derivation index, evmChain.key turns that index into a private key,
// and the bank signs each send and each vault movement with it. The customer
// never holds a key and cannot move these assets without us.
//
// That is a material fact about what a customer owns, so it belongs beside the
// button that moves the money — not in a footer, and not in an agreement they
// clicked through once. The wording is mechanical on purpose: it says who signs,
// which is checkable, and claims nothing about how the key is protected.
//
// It states the posture of a BANK_CUSTODY=bank deployment, which is every
// deployment today. A bank running BANK_CUSTODY=holder holds no key, and this
// sentence becomes false for it — so before that ships, this component reads
// `custody` from GET /v1/bank/health rather than asserting one. A custody claim
// that cannot follow the deployment is a custody claim that will outlive it.
export function Custody({ subject, also }: { subject: string; also?: string }) {
  const { legalName } = useBrand()
  return (
    <View
      className="card-2"
      style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'start', gap: 10, padding: 14 }}
    >
      <span style={{ display: 'grid', marginTop: 2, color: 'var(--color-fg-subtle)' }}>
        <Icon name="lock" size={14} />
      </span>
      <p style={{ ...font(12), color: 'var(--color-fg-muted)', lineHeight: 1.625 }}>
        {legalName} holds the key to {subject} and signs on your instruction. You do not hold a key,
        and cannot move these assets without us.{also ? ` ${also}` : ''}
      </p>
    </View>
  )
}
