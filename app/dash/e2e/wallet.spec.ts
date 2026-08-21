import { test, expect } from '@playwright/test'
import { signIn, holding, holdingAmount } from './demo'

const RECIPIENT = '0x1234567890abcdef1234567890abcdef12345678'

test.beforeEach(async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await expect(page.getByRole('heading', { name: 'Crypto wallet' })).toBeVisible()
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
})

test('sending ETH returns a testnet transaction hash', async ({ page }) => {
  await page.getByRole('button', { name: 'Send', exact: true }).click()

  await page.getByRole('combobox').selectOption('ETH')
  await page.getByPlaceholder('Amount').fill('0.1')
  await page.getByPlaceholder('Destination address').fill(RECIPIENT)
  await page.getByRole('button', { name: 'Send ETH' }).click()

  await expect(page.getByText(/Sent · 0x[0-9a-f]{64}/)).toBeVisible()
})

test('an unusable destination address is refused', async ({ page }) => {
  await page.getByRole('button', { name: 'Send', exact: true }).click()

  await page.getByRole('combobox').selectOption('ETH')
  await page.getByPlaceholder('Amount').fill('0.1')
  await page.getByPlaceholder('Destination address').fill('0xnope')
  await page.getByRole('button', { name: 'Send ETH' }).click()

  await expect(page.getByText(/invalid destination address/i)).toBeVisible()
  await expect(page.getByText(/Sent · 0x/)).toHaveCount(0)
})
