import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useBrand } from '@/hooks/brand'
import { REAL_DEMO_EMAIL } from '@/lib/brand'
import { AuthShell } from '@/pages/Signup'
import { Button, Field, Icon, font } from '@/components/ui'
import { View } from '@/gui'

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
      <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
        <Field label="Email">
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </Field>
        <Field label="Password">
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </Field>
        {error && <p style={{ ...font(14), color: 'var(--color-negative)' }}>{error}</p>}
        <Button type="submit" loading={busy}>Sign in</Button>
      </form>

      <View style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--color-fg-subtle)' }}>
        <span style={{ height: 1, background: 'var(--color-border)' }} /><span>or</span><span style={{ height: 1, background: 'var(--color-border)' }} />
      </View>

      <Button variant="secondary" onClick={() => login()}>
        <Icon name="shield" size={16} /> Sign in with SSO
      </Button>

      <p style={{ fontSize: 11.52, color: 'var(--color-fg-subtle)', textAlign: 'center' }}>
        Demo credential prefilled. New here?{' '}
        <a href="/signup" style={{ color: 'var(--color-fg)', fontWeight: 500 }}>Open an account</a>
      </p>
    </AuthShell>
  )
}
