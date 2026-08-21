import { test, expect } from '@playwright/test'
import { signIn, holding, holdingAmount, shot } from './demo'

// An EIP-55 checksummed address — the send path verifies the checksum, so this
// is the shape a customer's wallet actually hands over.
const CHECKSUMMED = '0x52908400098527886E0F7030069857D2E4169EE7'

test('faucet, hold, send: the whole crypto loop in one pass', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await expect(page.getByRole('heading', { name: 'Crypto wallet' })).toBeVisible()

  // Receive: draw 1 ETH from the testnet faucet.
  const before = (await holdingAmount(page, 'ETH')) ?? 0
  await page.getByRole('button', { name: 'Receive', exact: true }).click()
  await page.getByRole('button', { name: '+1 ETH' }).click()

  await expect(holding(page, 'ETH')).toBeVisible()
  await expect
    .poll(() => holdingAmount(page, 'ETH'), { message: 'faucet should credit the ETH holding' })
    .toBeGreaterThan(before)
  const funded = (await holdingAmount(page, 'ETH')) as number

  // Send: 0.1 ETH out to a checksummed destination.
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await page.getByRole('combobox').selectOption('ETH')
  await page.getByPlaceholder('Amount').fill('0.1')
  await page.getByPlaceholder('Destination address').fill(CHECKSUMMED)
  await page.getByRole('button', { name: 'Send ETH' }).click()

  await expect(page.getByText(/Sent · 0x[0-9a-f]{64}/)).toBeVisible()
  await expect
    .poll(() => holdingAmount(page, 'ETH'), { message: 'the send should debit the ETH holding' })
    .toBeLessThan(funded)

  await shot(page, 'crypto-loop')
})
