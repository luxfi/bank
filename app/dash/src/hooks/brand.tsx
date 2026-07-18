import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { resolveBrand, type Brand } from '@/lib/brand'

const BrandCtx = createContext<Brand | null>(null)

// Apply the resolved brand to <html> once at module load, before React paints,
// so there is no dark→light flash: set the theme attribute, title and favicon.
const brand = resolveBrand()
if (typeof document !== 'undefined') {
  document.documentElement.dataset.brand = brand.id
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
