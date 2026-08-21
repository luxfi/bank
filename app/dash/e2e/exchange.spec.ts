import { test, expect } from '@playwright/test'
import { signIn, holding, holdingAmount, shot } from './demo'

test('the wallet Buy tile converts USD into LUX', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await expect(page.getByRole('heading', { name: 'Crypto wallet' })).toBeVisible()

  const before = (await holdingAmount(page, 'LUX')) ?? 0

  // Buy / Sell / Convert are links into the exchange, preloaded with the pair.
  await page.getByRole('link', { name: 'Buy', exact: true }).click()
  await expect(page).toHaveURL(/\/app\/exchange\?from=USD&to=LUX/)
  await expect(page.getByRole('heading', { name: 'Exchange' })).toBeVisible()

  await page.getByPlaceholder('0.00').fill('10')

  // The quote is debounced and priced by bankd; wait for the rate to land.
  const convert = page.getByRole('button', { name: 'Convert USD → LUX' })
  await expect(page.getByText(/1 USD ≈ [\d.]+ LUX/)).toBeVisible()
  await expect(convert).toBeEnabled()
  await convert.click()

  await expect(page.getByText(/Converted .* to .*LUX\./)).toBeVisible()

  await shot(page, 'exchange')

  // The conversion settled against the same ledger the wallet reads.
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await expect(holding(page, 'LUX')).toBeVisible()
  await expect
    .poll(() => holdingAmount(page, 'LUX'), { message: 'the LUX holding should grow by the conversion' })
    .toBeGreaterThan(before)
})
