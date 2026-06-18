// Auth is native Hanzo IAM (lux.id) only — OIDC + PKCE via @hanzo/iam. This
// hook is a thin shim over the IAM React context so existing screens keep the
// { token, user, login, signup, logout } shape. There is no local password
// path; login and signup both hand off to the IAM-hosted flow.
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
    // Both routes redirect to IAM; the hosted page offers sign-in and sign-up.
    login: () => iam.login(),
    signup: () => iam.login({ additionalParams: { screen_hint: 'signup' } }),
    logout: iam.logout,
    handleCallback: iam.handleCallback,
  }
}
