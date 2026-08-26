import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useBrand } from '@/hooks/brand'
import { AuthShell } from '@/pages/Signup'
import { Button, Icon, font } from '@/components/ui'

// Lux ID signs people in, and nothing else does.
//
// There used to be an email and password here, checked against a bcrypt hash
// bankd kept and answered with a token bankd minted. Base closed that door on
// purpose — IAM is the only auth source, superusers included — and the old path
// had become a login that returned a token and then authenticated nothing.
//
// The password was also a constant in this file, which meant every browser that
// loaded the page was handed it.
export function Login() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const brand = useBrand()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/app', { replace: true })
  }, [isLoading, isAuthenticated, navigate])

  return (
    <AuthShell title="Welcome back" subtitle="Sign in with your Lux ID.">
      <Button
        loading={busy}
        onClick={() => {
          setBusy(true)
          login()
        }}
      >
        <Icon name="shield" size={16} /> Sign in with Lux ID
      </Button>

      {brand.demoEmail && (
        <p style={{ ...font(11.52), color: 'var(--color-fg-subtle)', textAlign: 'center' }}>
          The demo signs in as {brand.demoEmail}.
        </p>
      )}

      <p style={{ ...font(11.52), color: 'var(--color-fg-subtle)', textAlign: 'center' }}>
        New here?{' '}
        <a href="/signup" style={{ color: 'var(--color-fg)', fontWeight: 500 }}>Open an account</a>
      </p>
    </AuthShell>
  )
}
