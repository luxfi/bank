import type { CardView } from '@/api/client'
import { useBrand } from '@/hooks/brand'
import { center, font, line, pill, stack, truncate } from '@/components/ui'
import { View } from '@/gui'

// Two ends of one row, pushed apart — the card's own recurring figure.
const ends = (align: 'start' | 'end') =>
  ({ display: 'grid', gridAutoFlow: 'column', justifyContent: 'space-between', alignItems: align } as const)

// The small capitals that label a field on the face.
const legend = { fontSize: 9.6, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' } as const

// The value under such a label.
const value = { ...font(14), color: 'rgba(255,255,255,0.9)' }

// A polished virtual-card face — a rich, dark card in both themes, tinted by the
// brand accent (via .card-face). At rest the number is masked; the one-time
// reveal that hands over the CVV shows it whole, because a card you cannot read
// is a card you cannot spend.
//
// The full PAN is returned by bankd once at issue time (it owns the number and
// keeps only the mask + last four); the reveal renders that value in the `pan`
// slot. Without it, the masked display stands.
export function CardFace({ card, cvv, pan }: { card: CardView; cvv?: string; pan?: string }) {
  const brand = useBrand()
  const frozen = card.status === 'frozen'
  return (
    <View
      className="card-face"
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto auto',
        alignContent: 'space-between',
        position: 'relative',
        aspectRatio: '1.586 / 1',
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: 20,
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: frozen ? 0.7 : undefined,
      }}
    >
      {/* sheen */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-25%',
          width: '70%',
          height: '140%',
          rotate: '12deg',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <View style={{ ...ends('start'), position: 'relative' }}>
        <View style={{ ...line(8), color: '#fff' }}>
          {brand.wordmark === 'triangle' && (
            <svg viewBox="0 0 100 100" width={20} height={20} fill="currentColor" aria-hidden="true">
              <path d="M50 78 L18 28 L82 28 Z" />
            </svg>
          )}
          <span style={{ ...font(14, 600), letterSpacing: '-0.025em', textTransform: brand.wordmark === 'plain' ? 'lowercase' : undefined }}>
            {brand.wordmark === 'plain' ? brand.wordmarkLabel : 'Lux'}
          </span>
        </View>
        <span style={{ fontSize: 11.2, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>{card.type}</span>
      </View>

      <View style={{ ...stack(), position: 'relative' }}>
        {/* EMV chip — the gold pad with its contact plate, so it reads as a
            chip and not as a rectangle of gold. */}
        <View
          style={{
            ...stack(),
            position: 'relative',
            width: 36,
            height: 24,
            borderRadius: 6,
            background: 'linear-gradient(to bottom right, oklch(0.945 0.129 101.54 / 0.8), oklch(0.795 0.184 86.047 / 0.6))',
            marginBottom: 12,
          }}
        >
          <svg viewBox="0 0 36 24" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} fill="none"
            stroke="rgba(0,0,0,0.35)" strokeWidth="1" aria-hidden="true">
            <rect x="10.5" y="4.5" width="15" height="15" rx="2.5" />
            <path d="M0 8.5h10.5M25.5 8.5H36M0 15.5h10.5M25.5 15.5H36M18 4.5v15" />
          </svg>
        </View>
        <p className="tnum pan" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', color: '#fff' }}>
          {pan ?? card.display}
        </p>
      </View>

      <View style={{ ...ends('end'), position: 'relative' }}>
        <View style={stack()}>
          <p style={legend}>Card holder</p>
          <p style={{ ...value, ...truncate, maxWidth: '10rem' }}>
            {card.holderName === 'Lux Demo' ? brand.demoName : card.holderName}
          </p>
        </View>
        <View style={{ ...stack(), textAlign: 'right' }}>
          <p style={legend}>Expires</p>
          <p className="tnum" style={value}>
            {String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}
          </p>
        </View>
        <View style={{ ...stack(), textAlign: 'right' }}>
          <p style={legend}>{cvv ? 'CVV' : 'Network'}</p>
          <p className="tnum" style={{ ...value, textTransform: 'uppercase' }}>{cvv ?? card.brand}</p>
        </View>
      </View>

      {frozen && (
        <div style={{ ...center, position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(1px)' }}>
          <span
            className="chip"
            style={{ ...pill('0.35rem'), color: 'oklch(0.901 0.058 230.902)', borderColor: 'oklch(0.828 0.111 230.318 / 0.4)', background: 'rgba(0,0,0,0.4)' }}
          >
            Frozen
          </span>
        </div>
      )}
    </View>
  )
}
