import { useEffect, type ReactNode } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Wordmark } from '@/components/Brand'
import { Button, SandboxBadge } from '@/components/ui'
import { View } from '@/gui'

// Shared shell for the auth screens — true-black, centered, brand + sandbox.
// Grid-native: the page is a two-row grid (header, then a centered body), and
// the body centers its card with place-items — no flexbox anywhere.
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <View className="app-ambience" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}>
      <header
        className="relative z-10 px-5 md:px-8"
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', height: 64 }}
      >
        <Link to="/"><Wordmark className="text-lg" /></Link>
        <span />
        <SandboxBadge />
      </header>
      <View className="relative z-10 px-5 pb-16" style={{ display: 'grid', placeItems: 'center' }}>
        <View style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 384 }}>
          <View style={{ display: 'grid', gap: 6, textAlign: 'center' }}>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-[var(--color-fg-muted)]">{subtitle}</p>
          </View>
          <View className="card p-6 rise" style={{ display: 'grid', gap: 16 }}>{children}</View>
          <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)] max-w-xs mx-auto">
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
      <Button className="w-full" onClick={() => signup()} loading={isLoading}>Continue with Lux ID</Button>
      <p className="text-sm text-[var(--color-fg-muted)] text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--color-fg)] font-medium hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  )
}
