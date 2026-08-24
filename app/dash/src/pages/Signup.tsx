import { useEffect, type ReactNode } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Wordmark } from '@/components/Brand'
import { Button, SandboxBadge, font } from '@/components/ui'
import { View } from '@/gui'

// Shared shell for the auth screens — true-black, centered, brand + sandbox.
// Grid-native: the page is a two-row grid (header, then a centered body), and
// the body centers its card with place-items — no flexbox anywhere.
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <View className="app-ambience" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}>
      <header
        className="topbar"
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center' }}
      >
        <Link to="/"><Wordmark size={18} /></Link>
        <span />
        <SandboxBadge />
      </header>
      <View style={{ display: 'grid', placeItems: 'center', position: 'relative', zIndex: 10, paddingInline: 20, paddingBottom: 64 }}>
        <View style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 384 }}>
          <View style={{ display: 'grid', gap: 6, textAlign: 'center' }}>
            <h1 style={{ ...font(24, 600), letterSpacing: '-0.025em' }}>{title}</h1>
            <p style={{ ...font(14), color: 'var(--color-fg-muted)' }}>{subtitle}</p>
          </View>
          <View className="card rise" style={{ display: 'grid', gap: 16, padding: 24 }}>{children}</View>
          <p style={{ textAlign: 'center', fontSize: 11.2, color: 'var(--color-fg-subtle)', maxWidth: 320, justifySelf: 'center' }}>
            Demo — sandbox environment, not for real deposits. Banking services via our licensed BaaS partner.
          </p>
        </View>
      </View>
    </View>
  )
}

// Sign-up hands off to native Hanzo IAM (lux.id). On return, the app’s
// onboarding gate collects sandbox KYC and provisions the account.
export function Signup() {
  const { isAuthenticated, isLoading, signup } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/app', { replace: true })
  }, [isLoading, isAuthenticated, navigate])

  return (
    <AuthShell title="Open your account" subtitle="Multi-currency banking and a built-in crypto wallet.">
      <Button onClick={() => signup()} loading={isLoading}>Continue with Lux ID</Button>
      <p style={{ ...font(14), color: 'var(--color-fg-muted)', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-fg)', fontWeight: 500 }}>Sign in</Link>
      </p>
    </AuthShell>
  )
}
