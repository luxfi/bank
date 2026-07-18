import { useEffect, type ReactNode } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Wordmark } from '@/components/Brand'
import { Button, SandboxBadge } from '@/components/ui'

// Shared shell for the auth screens — true-black, centered, brand + sandbox.
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="app-ambience min-h-screen flex flex-col">
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 h-16">
        <Link to="/"><Wordmark className="text-lg" /></Link>
        <SandboxBadge />
      </header>
      <div className="relative z-10 flex-1 grid place-items-center px-5 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-[var(--color-fg-muted)] mt-1.5">{subtitle}</p>
          </div>
          <div className="card p-6 space-y-4 rise">{children}</div>
          <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)] mt-6 max-w-xs mx-auto">
            Demo — sandbox environment, not for real deposits. Banking services via our licensed BaaS partner.
          </p>
        </div>
      </div>
    </div>
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
