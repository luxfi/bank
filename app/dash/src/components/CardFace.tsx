import type { CardView } from '@/api/client'

// A polished virtual-card face. Sandbox only — the number shown is masked and
// the PAN is never real.
export function CardFace({ card, cvv }: { card: CardView; cvv?: string }) {
  const frozen = card.status === 'frozen'
  return (
    <div
      className={`relative aspect-[1.586/1] w-full rounded-2xl overflow-hidden border border-white/10 p-5 flex flex-col justify-between transition-all ${
        frozen ? 'opacity-70' : ''
      }`}
      style={{
        background:
          'radial-gradient(120% 120% at 0% 0%, #2a2350 0%, #12121a 45%, #0a0a0f 100%)',
      }}
    >
      {/* sheen */}
      <div className="absolute -top-1/2 -right-1/4 w-[70%] h-[140%] rotate-12 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-5 h-5 text-white" fill="currentColor" aria-hidden="true">
            <path d="M50 78 L18 28 L82 28 Z" />
          </svg>
          <span className="text-sm font-semibold tracking-tight text-white">Lux</span>
        </div>
        <span className="text-[0.7rem] uppercase tracking-widest text-white/60">{card.type}</span>
      </div>

      <div className="relative">
        {/* chip */}
        <div className="w-9 h-6 rounded-md bg-gradient-to-br from-yellow-200/80 to-yellow-500/60 mb-3" />
        <p className="font-mono text-lg md:text-xl tracking-[0.15em] text-white tnum">{card.display}</p>
      </div>

      <div className="flex items-end justify-between relative">
        <div>
          <p className="text-[0.6rem] uppercase tracking-widest text-white/50">Card holder</p>
          <p className="text-sm text-white/90 truncate max-w-[10rem]">{card.holderName}</p>
        </div>
        <div className="text-right">
          <p className="text-[0.6rem] uppercase tracking-widest text-white/50">Expires</p>
          <p className="text-sm text-white/90 tnum">
            {String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.6rem] uppercase tracking-widest text-white/50">{cvv ? 'CVV' : 'Network'}</p>
          <p className="text-sm text-white/90 uppercase tnum">{cvv ?? card.brand}</p>
        </div>
      </div>

      {frozen && (
        <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-[1px]">
          <span className="chip text-sky-200 border-sky-300/40 bg-black/40">Frozen</span>
        </div>
      )}
    </div>
  )
}
