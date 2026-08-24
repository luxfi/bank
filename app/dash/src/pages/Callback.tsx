import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Wordmark } from '@/components/Brand'
import { Button, Spinner, font } from '@/components/ui'
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
    <View className="app-ambience" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', placeItems: 'center', minHeight: '100vh', paddingInline: 20 }}>
      <View
        className="card"
        style={{
          display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', gap: 16,
          position: 'relative', zIndex: 10, width: '100%', maxWidth: 384, padding: 32, textAlign: 'center',
        }}
      >
        <View style={{ display: 'grid', alignContent: 'start', gridTemplateColumns: 'minmax(0,1fr)', justifyItems: 'center', ...font(18) }}><Wordmark /></View>
        {error ? (
          <>
            <h1 style={font(18, 600)}>Sign-in failed</h1>
            <p style={{ ...font(14), color: 'var(--color-fg-muted)' }}>{error}</p>
            <Link to="/login" style={{ display: 'grid' }}><Button>Try again</Button></Link>
          </>
        ) : (
          <View
            style={{
              display: 'grid', gridAutoFlow: 'column', justifyContent: 'center', alignItems: 'center', gap: 12,
              fontSize: 14, color: 'var(--color-fg-muted)', paddingBlock: 16,
            }}
          >
            <Spinner />
            <span>Signing you in…</span>
          </View>
        )}
      </View>
    </View>
  )
}
