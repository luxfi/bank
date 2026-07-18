import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useBrand } from '@/hooks/brand'
import { REAL_DEMO_EMAIL } from '@/lib/brand'
import { AuthShell } from '@/pages/Signup'
import { Button, Field, Icon } from '@/components/ui'

// Public sandbox demo password (all brands authenticate against the one seeded
// bankd credential; the brand's demoEmail is display-only).
const DEMO_PASSWORD = 'IloveLux2026!!!'

export function Login() {
  const { isAuthenticated, isLoading, login, demoLogin } = useAuth()
  const brand = useBrand()
  const navigate = useNavigate()
  const [email, setEmail] = useState(brand.demoEmail)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/app', { replace: true })
  }, [isLoading, isAuthenticated, navigate])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    // The brand's prefilled demo email maps to the real seeded credential.
    const apiEmail = email.trim() === brand.demoEmail ? REAL_DEMO_EMAIL : email.trim()
    try {
      await demoLogin(apiEmail, password)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your sandbox account.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </Field>
        <Field label="Password">
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </Field>
        {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}
        <Button type="submit" className="w-full" loading={busy}>Sign in</Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
        <span className="flex-1 h-px bg-[var(--color-border)]" /> or <span className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      <Button variant="secondary" className="w-full" onClick={() => login()}>
        <Icon name="shield" className="w-4 h-4" /> Sign in with SSO
      </Button>

      <p className="text-[0.72rem] text-[var(--color-fg-subtle)] text-center">
        Demo credential prefilled. New here?{' '}
        <a href="/signup" className="text-[var(--color-fg)] font-medium hover:underline">Open an account</a>
      </p>
    </AuthShell>
  )
}
