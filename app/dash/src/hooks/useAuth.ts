// One auth: Lux ID (lux.id) over OIDC and PKCE, through @hanzo/iam.
//
// There was a second path — a sandbox password login that minted a bankd
// superuser token — and merging the two behind one shape is what let it look
// harmless. It is gone. Base accepts what IAM says and nothing else, so a token
// minted anywhere but IAM authenticates nothing, however convincing the login
// that returned it.
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
