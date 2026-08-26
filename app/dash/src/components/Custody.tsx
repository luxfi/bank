import { useBrand } from '@/hooks/brand'
import { Icon, font } from '@/components/ui'
import { View } from '@/gui'

// Who holds the signing key.
//
// bankd derives every account's key from its own seed and keeps it: chainSeed
// assigns the account a derivation index, evmChain.key turns that index into a
// private key, and the bank signs each send and each vault movement with it. The
// customer never holds a key and cannot move these assets without us.
//
// That is a material fact about what a customer owns, so it belongs beside the
// button that moves the money — not in a footer, and not in an agreement they
// clicked through once. The wording is mechanical on purpose: it says who signs,
// which is checkable, and claims nothing about how the key is protected.
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
