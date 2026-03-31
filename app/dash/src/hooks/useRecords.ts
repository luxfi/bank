import { useState, useEffect, useCallback } from 'react'
import { listRecords, type ListParams, type ListResult } from '@/api/client'

interface UseRecordsOptions extends ListParams {
  collection: string
  enabled?: boolean
}

interface UseRecordsResult<T> {
  data: ListResult<T> | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useRecords<T = Record<string, unknown>>(
  opts: UseRecordsOptions,
): UseRecordsResult<T> {
  const { collection, enabled = true, ...params } = opts
  const [data, setData] = useState<ListResult<T> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stable key for re-fetching when params change.
  const key = JSON.stringify({ collection, ...params })

  const fetch = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const result = await listRecords<T>(collection, params)
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}
