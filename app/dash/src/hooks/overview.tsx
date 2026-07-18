import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { getOverview, type Overview } from '@/api/client'

interface OverviewCtx {
  overview: Overview | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const Ctx = createContext<OverviewCtx | null>(null)

export function OverviewProvider({ children }: { children: ReactNode }) {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      setOverview(await getOverview())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return <Ctx.Provider value={{ overview, loading, error, refresh }}>{children}</Ctx.Provider>
}

export function useOverview(): OverviewCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useOverview must be used within OverviewProvider')
  return ctx
}
