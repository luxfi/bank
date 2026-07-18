// Auth has two paths that share bankd:
//   - IAM (lux.id) OIDC+PKCE via @hanzo/iam — the path for real customers.
//   - Sandbox password login — mints a bankd superuser token (demo hero login).
// This hook merges both behind one { isAuthenticated, login, signup, demoLogin,
// logout } shape so screens don't care which is active.
import { createElement, createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { IamProvider, useIam } from '@hanzo/iam/react'
import { IAM_CONFIG } from '@/lib/iam'
import { sandboxLogin, DEMO_TOKEN_KEY } from '@/api/client'

const DEMO_EMAIL_KEY = 'bank_demo_email'

interface DemoState {
  token: string | null
  email: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const DemoCtx = createContext<DemoState | null>(null)

function DemoProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try { return sessionStorage.getItem(DEMO_TOKEN_KEY) } catch { return null }
  })
  const [email, setEmail] = useState<string | null>(() => {
    try { return sessionStorage.getItem(DEMO_EMAIL_KEY) } catch { return null }
  })

  const login = useCallback(async (e: string, password: string) => {
    const res = await sandboxLogin(e, password)
    sessionStorage.setItem(DEMO_TOKEN_KEY, res.token)
    sessionStorage.setItem(DEMO_EMAIL_KEY, res.user.email)
    setToken(res.token)
    setEmail(res.user.email)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(DEMO_TOKEN_KEY)
    sessionStorage.removeItem(DEMO_EMAIL_KEY)
    setToken(null)
    setEmail(null)
  }, [])

  return createElement(DemoCtx.Provider, { value: { token, email, login, logout } }, children)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return createElement(IamProvider, {
    config: IAM_CONFIG,
    children: createElement(DemoProvider, { children }),
  })
}

export function useAuth() {
  const iam = useIam()
  const demo = useContext(DemoCtx)!
  const demoActive = !!demo.token

  return {
    token: demoActive ? demo.token : iam.accessToken,
    user: demoActive
      ? ({ email: demo.email, name: 'Lux Demo' } as Record<string, unknown>)
      : (iam.user as Record<string, unknown> | null),
    isAuthenticated: demoActive || iam.isAuthenticated,
    isLoading: demoActive ? false : iam.isLoading,
    // IAM hosted flows (real customers).
    login: () => iam.login(),
    signup: () => iam.login({ additionalParams: { screen_hint: 'signup' } }),
    // Sandbox password login (demo hero).
    demoLogin: demo.login,
    logout: () => {
      demo.logout()
      if (iam.isAuthenticated) iam.logout()
    },
    handleCallback: iam.handleCallback,
  }
}
