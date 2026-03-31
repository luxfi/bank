import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { createElement } from 'react'
import * as api from '@/api/client'

interface AuthState {
  token: string | null
  user: Record<string, unknown> | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const TOKEN_KEY = 'bank_token'
const USER_KEY = 'bank_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY)
    if (saved) api.setToken(saved)
    return saved
  })
  const [user, setUser] = useState<Record<string, unknown> | null>(() => {
    const saved = sessionStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token)
    } else {
      sessionStorage.removeItem(TOKEN_KEY)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      sessionStorage.removeItem(USER_KEY)
    }
  }, [user])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password)
    setToken(res.token)
    setUser(res.record)
  }, [])

  const logout = useCallback(() => {
    api.logout()
    setToken(null)
    setUser(null)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  }, [])

  return createElement(
    AuthContext.Provider,
    { value: { token, user, login, logout } },
    children,
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
