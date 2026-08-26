import { test, expect } from '@playwright/test'
import { signIn, holding, holdingAmount, shot } from './demo'

const RECIPIENT = '0x1234567890abcdef1234567890abcdef12345678'

test.beforeEach(async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await expect(page.getByRole('heading', { name: 'Crypto wallet' })).toBeVisible()
})

test('the wallet names its network and address', async ({ page }) => {
  // The network is named on every holding row, so this asserts it is named at
  // all rather than pinning a count that moves with the number of assets held.
  await expect(page.getByText('lux-testnet', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /0x[0-9a-fA-F]{4}….{4}/ })).toBeVisible()
  // The sandbox flag lives in the shell header, and only there — one badge per
  // screen, so it reads as a state and not as decoration.
  await expect(page.getByRole('banner').getByText('Sandbox', { exact: true })).toBeVisible()
  await expect(page.getByText('Sandbox', { exact: true })).toHaveCount(1)

  await shot(page, 'wallet-overview')
})

test('the receive panel shows the deposit address and the faucet', async ({ page }) => {
  await page.getByRole('button', { name: 'Receive', exact: true }).click()

  await expect(page.getByText('Your lux-testnet deposit address')).toBeVisible()
  await expect(page.getByRole('button', { name: /^0x[0-9a-fA-F]{40}/ })).toBeVisible()
  await expect(page.getByText('Testnet faucet')).toBeVisible()
  for (const drop of ['+100 LUX', '+0.1 BTC', '+1 ETH', '+1000 DAI']) {
    await expect(page.getByRole('button', { name: drop })).toBeVisible()
  }

  await shot(page, 'receive-panel')
})

test('the full deposit address copies from the receive panel', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('button', { name: 'Receive', exact: true }).click()

  const field = page.getByRole('button', { name: /^0x[0-9a-fA-F]{40}$/ })
  // The affordance is on the field itself, not only on the truncated chip above.
  await expect(field.locator('svg')).toBeVisible()
  await field.click()

  // The Clipboard API only exists in a secure context, so a plain-http
  // deployment can't be read back. Assert the copy there, and everywhere else
  // assert what still holds: the field carries the whole address to copy.
  if (await page.evaluate(() => window.isSecureContext && !!navigator.clipboard)) {
    const clipboard = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboard).toMatch(/^0x[0-9a-fA-F]{40}$/)
    expect(clipboard).toBe((await field.innerText()).trim())
  } else {
    expect((await field.innerText()).trim()).toMatch(/^0x[0-9a-fA-F]{40}$/)
  }

  await shot(page, 'receive-copy')
})

test('the testnet faucet credits ETH to the wallet', async ({ page }) => {
  const before = (await holdingAmount(page, 'ETH')) ?? 0

  await page.getByRole('button', { name: 'Receive', exact: true }).click()
  await expect(page.getByText('Testnet faucet')).toBeVisible()
  await page.getByRole('button', { name: '+1 ETH' }).click()

  await expect(holding(page, 'ETH')).toBeVisible()
  await expect
    .poll(() => holdingAmount(page, 'ETH'), { message: 'ETH holding should grow by the faucet drop' })
    .toBeGreaterThan(before)

  await shot(page, 'faucet-eth')
})

test('sending ETH returns a testnet transaction hash', async ({ page }) => {
  await page.getByRole('button', { name: 'Send', exact: true }).click()

  await page.getByRole('combobox').selectOption('ETH')
  // Nothing to send yet, so there is nothing to click.
  await expect(page.getByRole('button', { name: 'Send ETH' })).toBeDisabled()

  await page.getByPlaceholder('Amount').fill('0.1')
  await page.getByPlaceholder('Destination address').fill(RECIPIENT)
  await page.getByRole('button', { name: 'Send ETH' }).click()

  await expect(page.getByText(/Sent · 0x[0-9a-f]{64}/)).toBeVisible()

  await shot(page, 'send-eth')
})

test('an unusable destination address is refused', async ({ page }) => {
  await page.getByRole('button', { name: 'Send', exact: true }).click()

  await page.getByRole('combobox').selectOption('ETH')
  await page.getByPlaceholder('Amount').fill('0.1')
  await page.getByPlaceholder('Destination address').fill('0xnope')
  await page.getByRole('button', { name: 'Send ETH' }).click()

  await expect(page.getByText(/invalid destination address/i)).toBeVisible()
  await expect(page.getByText(/Sent · 0x/)).toHaveCount(0)

  await shot(page, 'invalid-address')
})
