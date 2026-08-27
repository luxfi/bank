import { defineConfig, devices } from '@playwright/test'

// Point DASH_URL at a running deployment to smoke-test it with this same suite
// (`DASH_URL=http://host:3000 pnpm test:e2e`); the local servers are then left
// alone, since the target is already serving. Unset, the suite boots its own.
const DASH = process.env.DASH_URL || 'http://localhost:3000'
const BANKD = process.env.BANKD_URL || 'http://127.0.0.1:8070'
const remote = Boolean(process.env.DASH_URL)
// Where the suite signs in. Point IAM_URL at a real Hanzo IAM — https://lux.id
// for this brand — and the local provider is not started at all: bankd proxies
// /v1/iam/* to whatever this names, so one variable moves the whole sign-in.
//
// Two things have to be true at lux.id before that works, and neither is ours
// to set from here:
//
//   * the `lux-bank` application must carry this origin's callback among its
//     redirect URIs. It does not today — authorize answers
//     "invalid redirect_uri" for http://localhost:3000/callback.
//   * the runner needs an identity to sign in as, supplied through the
//     environment and never written down here.
//
// Until both hold, e2e/iam-stub.mjs stands in: a real OIDC provider, RS256 over
// its own JWKS, running locally. It is the identity leg only — every other
// service the suite touches is the real one.
const IAM = process.env.IAM_URL || 'http://127.0.0.1:8071'
const localIAM = !process.env.IAM_URL

export default defineConfig({
  testDir: './e2e',
  // The sandbox ledger is one shared mutable account: balances move as the
  // specs faucet and send. Serial execution keeps those deltas readable.
  workers: 1,
  fullyParallel: false,
  // No retries: a demo loop that needs a second attempt is a broken demo loop.
  retries: 0,
  reporter: [['list']],
  expect: { timeout: 10_000 },
  use: {
    baseURL: DASH,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: remote ? undefined : ([
    ...(localIAM
      ? [
          {
            command: 'node e2e/iam-stub.mjs',
            url: `${IAM}/.well-known/openid-configuration`,
            reuseExistingServer: true,
            timeout: 30_000,
            stdout: 'ignore' as const,
            stderr: 'pipe' as const,
          },
        ]
      : []),
    {
      command: 'go run ./cmd/bankd',
      cwd: '../..',
      // Point bankd at the stub identity provider. The app never addresses IAM
      // directly — bankd proxies /v1/iam/* and verifies every bearer against the
      // JWKS it finds there — so this one variable puts the whole sign-in on the
      // stub, and the browser runs exactly the redirect it runs in production.
      env: { CGO_ENABLED: '0', GOWORK: 'off', IAM_ENDPOINT: IAM },
      url: `${BANKD}/v1/bank/health`,
      reuseExistingServer: true,
      timeout: 180_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'pnpm dev',
      url: DASH,
      reuseExistingServer: true,
      timeout: 60_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ]),
})
