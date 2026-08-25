import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { resolveBrand, type Brand } from '@/lib/brand'

const BrandCtx = createContext<Brand | null>(null)

// The brand attribute goes on <html> at module load, before React paints, so
// there is no dark→light flash. Colour is all it decides, and any host wants it
// — the screens are unreadable without the tokens it selects.
const brand = resolveBrand()
if (typeof document !== 'undefined') {
  document.documentElement.dataset.brand = brand.id
}

// label names the browser tab. It is NOT done at load: a page belongs to
// whoever owns it, and an embedded product that renames its host's tab and
// replaces its icon is taking something that was never offered. lux.finance
// calls this; the Lux Cloud console does not, and keeps its own name.
export function label(): void {
  if (typeof document === 'undefined') return
  document.title = brand.productName
  const link =
    (document.querySelector('link[rel="icon"]') as HTMLLinkElement | null) ??
    (() => {
      const l = document.createElement('link')
      l.rel = 'icon'
      document.head.appendChild(l)
      return l
    })()
  link.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${brand.favicon}</text></svg>`
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => brand, [])
  return <BrandCtx.Provider value={value}>{children}</BrandCtx.Provider>
}

export function useBrand(): Brand {
  const b = useContext(BrandCtx)
  return b ?? brand
}
