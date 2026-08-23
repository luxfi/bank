import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Wordmark } from '@/components/Brand'
import { Button, Spinner } from '@/components/ui'
import { View } from '@/gui'

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
    <View className="app-ambience px-5" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', placeItems: 'center', minHeight: '100vh' }}>
      <View className="relative z-10 w-full max-w-sm card p-8 text-center" style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16 }}>
        <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center' }}><Wordmark className="text-lg" /></View>
        {error ? (
          <>
            <h1 className="text-lg font-semibold">Sign-in failed</h1>
            <p className="text-sm text-[var(--color-fg-muted)]">{error}</p>
            <Link to="/login"><Button className="w-full">Try again</Button></Link>
          </>
        ) : (
          <View
            className="text-sm text-[var(--color-fg-muted)] py-4"
            style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}
          >
            <Spinner />
            <span>Signing you in…</span>
          </View>
        )}
      </View>
    </View>
  )
}
