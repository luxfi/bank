import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AuthShell } from '@/pages/Signup'
import { Button, Icon } from '@/components/ui'

// Sign-in is Lux ID's: the button starts the PKCE flow and lux.id asks for the
// credential. This page never sees one.
export function Login() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/app', { replace: true })
  }, [isLoading, isAuthenticated, navigate])

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your sandbox account.">
      <Button className="w-full" onClick={() => login()} loading={isLoading}>
        <Icon name="shield" className="w-4 h-4" /> Sign in with Lux ID
      </Button>

      <p className="text-[0.72rem] text-[var(--color-fg-subtle)] text-center">
        New here?{' '}
        <a href="/signup" className="text-[var(--color-fg)] font-medium hover:underline">Open an account</a>
      </p>
    </AuthShell>
  )
}
