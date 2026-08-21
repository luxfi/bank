// Public bankd config (/v1/bank/config), fetched once and cached for the
// session. Drives sandbox indicators and the banking-partner disclosure.
import { useEffect, useState } from 'react'
import { getConfig, type Config } from '@/api/client'

let cached: Config | null = null
let inflight: Promise<Config> | null = null

export function useConfig(): Config | null {
  const [config, setConfig] = useState<Config | null>(cached)
  useEffect(() => {
    if (cached) return
    inflight ??= getConfig()
    inflight
      .then((c) => {
        cached = c
        setConfig(c)
      })
      .catch(() => {
        inflight = null
      })
  }, [])
  return config
}
