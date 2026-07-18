import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Wordmark } from '@/components/Brand'
import { Button, Spinner } from '@/components/ui'

// OIDC redirect target. The IAM SDK exchanges the authorization code for tokens
// (PKCE), then we land the customer in the app. Onboarding (sandbox KYC +
// provisioning) is handled by the in-app gate, not here.
export function Callback() {
  const { handleCallback } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    handleCallback(window.location.href)
      .then(() => navigate('/app', { replace: true }))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Sign-in failed'))
  }, [handleCallback, navigate])

  return (
    <div className="app-ambience min-h-screen grid place-items-center px-5">
      <div className="relative z-10 w-full max-w-sm card p-8 text-center space-y-4">
        <Wordmark className="justify-center text-lg" />
        {error ? (
          <>
            <h1 className="text-lg font-semibold">Sign-in failed</h1>
            <p className="text-sm text-[var(--color-fg-muted)]">{error}</p>
            <Link to="/login"><Button className="w-full">Try again</Button></Link>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 text-sm text-[var(--color-fg-muted)] py-4">
            <Spinner /> Signing you in…
          </div>
        )}
      </div>
    </div>
  )
}
