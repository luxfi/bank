// Runtime white-label brand system. One object per brand drives theme (light or
// dark), accent, wordmark, legal, title and the demo identity. Resolved from
// ?brand=<id> (persisted to localStorage); default = lux.

export type BrandId = 'lux' | 'acm'

export interface Brand {
  id: BrandId
  productName: string // browser title / marketing name
  legalName: string // footer legal entity
  domain: string
  theme: 'dark' | 'light'
  wordmark: 'triangle' | 'plain' // how the mark renders
  wordmarkLabel: string
  favicon: string // emoji
  demoEmail: string // DISPLAY email for the seeded demo identity
  demoName: string
}

export const BRANDS: Record<BrandId, Brand> = {
  lux: {
    id: 'lux',
    productName: 'Lux Financial',
    legalName: 'Lux Financial',
    domain: 'lux.finance',
    theme: 'dark',
    wordmark: 'triangle',
    wordmarkLabel: 'Lux Financial',
    favicon: '🔻',
    demoEmail: 'z@lux.financial',
    demoName: 'Lux Demo',
  },
  acm: {
    id: 'acm',
    productName: 'ACM Global Tech',
    legalName: 'ACM Global Inc',
    domain: 'acmglobaltech.com',
    theme: 'light',
    wordmark: 'plain',
    wordmarkLabel: 'acm',
    favicon: '🔷',
    demoEmail: 'z@acmglobaltech.com',
    demoName: 'ACM Demo',
  },
}

// The real bankd sandbox credential — the seeded superuser. Every brand's demo
// login authenticates against this; the brand's demoEmail is display-only.
export const REAL_DEMO_EMAIL = 'z@lux.financial'

const STORAGE_KEY = 'bank_brand'

function isBrandId(v: string | null): v is BrandId {
  return v === 'lux' || v === 'acm'
}

// resolveBrand reads ?brand=<id> (persisting it), then localStorage, then lux.
export function resolveBrand(): Brand {
  let id: BrandId = 'lux'
  try {
    const q = new URLSearchParams(window.location.search).get('brand')
    if (isBrandId(q)) {
      id = q
      localStorage.setItem(STORAGE_KEY, q)
    } else {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (isBrandId(stored)) id = stored
    }
  } catch {
    /* SSR / storage disabled */
  }
  return BRANDS[id]
}
