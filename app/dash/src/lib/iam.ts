// Native Hanzo IAM (lux.id) — the ONLY auth source for the bank. OIDC + PKCE
// via @hanzo/iam, same-origin: bankd's platform plugin mounts /v1/iam/* as a
// transparent proxy to lux.id, so discovery, authorize, token, and jwks all
// resolve under this origin (no CORS, no hand-rolled OAuth).
//
// The IAM app is `lux-bank` (<org>-<app> = lux + bank; `bankd` is just the
// daemon binary). Its redirect URI must be registered at lux.id as
// `${origin}/callback`.
import type { IAMConfig } from '@hanzo/iam/browser'

const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lux.financial'

export const IAM_CONFIG: IAMConfig = {
  serverUrl: `${origin}/v1/iam`,
  clientId: 'lux-bank',
  redirectUri: `${origin}/callback`,
  scope: 'openid profile email',
  // Discovery advertises lux.id token/userinfo (cross-origin → browser CORS).
  // Route those same-origin through bankd's /v1/iam proxy so no cross-origin
  // request leaves the browser; the authorize redirect still goes to lux.id.
  proxyBaseUrl: origin,
}

// The SDK stores the access token under this key (sessionStorage by default);
// the API client reads it to authorize requests to bankd.
export const IAM_TOKEN_KEY = 'hanzo_iam_access_token'
