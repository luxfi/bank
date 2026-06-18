import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { onboard } from '@/api/client'
import { Wordmark } from '@/components/Brand'

// OIDC redirect target. The IAM SDK exchanges the authorization code for tokens
// (PKCE), then we provision the customer (account + balance + crypto wallet)
// and land them in the app. Provisioning is idempotent and best-effort.
export function Callback() {
  const { handleCallback } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    handleCallback(window.location.href)
      .then(async () => {
        try {
          await onboard()
        } catch (err) {
          console.warn('onboard deferred (retryable from app):', err)
        }
        navigate('/app', { replace: true })
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Sign-in failed'))
  }, [handleCallback, navigate])

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Wordmark className="justify-center text-lg" />
        {error ? (
          <>
            <h1 className="text-lg font-semibold">Sign-in failed</h1>
            <p className="text-sm text-gray-500">{error}</p>
            <Link to="/login" className="inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-gray-100 dark:text-gray-900">
              Try again
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-500">Signing you in…</p>
        )}
      </div>
    </div>
  )
}
