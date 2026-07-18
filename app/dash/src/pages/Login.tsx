import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AuthShell } from '@/pages/Signup'
import { Button } from '@/components/ui'

// Sign-in hands off to native Hanzo IAM (lux.id) via OIDC+PKCE. No local
// password form — the IAM-hosted page owns every credential interaction.
export function Login() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/app', { replace: true })
  }, [isLoading, isAuthenticated, navigate])

  return (
    <AuthShell title="Welcome back" subtitle="Sign in securely with your Lux ID.">
      <Button className="w-full" onClick={() => login()} loading={isLoading}>Sign in with Lux ID</Button>
      <p className="text-sm text-[var(--color-fg-muted)] text-center">
        New here?{' '}
        <Link to="/signup" className="text-[var(--color-fg)] font-medium hover:underline">Open an account</Link>
      </p>
    </AuthShell>
  )
}
