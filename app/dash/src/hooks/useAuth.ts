// Lux ID (lux.id) is the only way in: OIDC + PKCE via @hanzo/iam. This hook is
// the one shape screens read — { isAuthenticated, login, signup, logout }.
import { createElement, type ReactNode } from 'react'
import { IamProvider, useIam } from '@hanzo/iam/react'
import { IAM_CONFIG } from '@/lib/iam'

export function AuthProvider({ children }: { children: ReactNode }) {
  return createElement(IamProvider, { config: IAM_CONFIG, children })
}

export function useAuth() {
  const iam = useIam()
  return {
    token: iam.accessToken,
    user: iam.user as Record<string, unknown> | null,
    isAuthenticated: iam.isAuthenticated,
    isLoading: iam.isLoading,
    login: () => iam.login(),
    signup: () => iam.login({ additionalParams: { screen_hint: 'signup' } }),
    logout: () => iam.logout(),
    handleCallback: iam.handleCallback,
  }
}
