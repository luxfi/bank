import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { Wordmark } from '@/components/Brand'

// Sign-in hands off to native Hanzo IAM (lux.id) via OIDC+PKCE. No local
// password form — the IAM-hosted page owns every credential interaction.
export function Login() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate('/app', { replace: true })
  }, [isLoading, isAuthenticated, navigate])

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-5 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Link to="/" className="inline-flex text-lg">
          <Wordmark />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in securely with your Lux ID.</p>
        </div>
        <button
          onClick={() => login()}
          disabled={isLoading}
          className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isLoading ? 'Loading…' : 'Sign in with Lux ID'}
        </button>
        <p className="text-sm text-gray-500">
          New here?{' '}
          <Link to="/signup" className="font-medium text-gray-900 hover:underline dark:text-gray-100">
            Open an account
          </Link>
        </p>
      </div>
    </div>
  )
}
