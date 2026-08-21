import { defineConfig, devices } from '@playwright/test'

const DASH = 'http://localhost:3000'
const BANKD = 'http://127.0.0.1:8070'

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
  webServer: [
    {
      command: 'go run ./cmd/bankd',
      cwd: '../..',
      env: { CGO_ENABLED: '0', GOWORK: 'off' },
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
  ],
})
