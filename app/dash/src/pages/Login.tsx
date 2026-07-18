import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AuthShell } from '@/pages/Signup'
import { Button, Field, Icon } from '@/components/ui'

// Hero demo credential (public sandbox). Prefilled so the demo is one click.
const DEMO_EMAIL = 'z@lux.financial'
const DEMO_PASSWORD = 'IloveLux2026!!!'

export function Login() {
  const { isAuthenticated, isLoading, login, demoLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
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
    try {
      await demoLogin(email.trim(), password)
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
        <Icon name="shield" className="w-4 h-4" /> Sign in with Lux ID
      </Button>

      <p className="text-[0.72rem] text-[var(--color-fg-subtle)] text-center">
        Demo credential prefilled. New here?{' '}
        <a href="/signup" className="text-[var(--color-fg)] font-medium hover:underline">Open an account</a>
      </p>
    </AuthShell>
  )
}
