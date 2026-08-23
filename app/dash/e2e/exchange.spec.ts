import { test, expect } from '@playwright/test'
import { signIn, holding, holdingAmount, shot } from './demo'

test('the pair is priced before anything is typed', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/exchange')

  // A rate belongs to the pair, not to the amount: the page opens on it.
  await expect(page.getByText(/1 USD ≈ [\d.]+ EUR/)).toBeVisible()
  // Priced, but nothing to convert yet.
  await expect(page.getByRole('button', { name: 'Convert USD → EUR' })).toBeDisabled()

  // Changing a leg reprices without an amount either.
  await page.getByRole('combobox').last().selectOption('GBP')
  await expect(page.getByText(/1 USD ≈ [\d.]+ GBP/)).toBeVisible()

  await shot(page, 'exchange-rate-on-arrival')
})

test('past conversions are listed beside the converter', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/exchange')

  await expect(page.getByRole('heading', { name: 'Recent conversions' })).toBeVisible()
  const row = page.locator('.card > div').filter({ hasText: 'Converted USD → EUR' }).first()
  await expect(row).toBeVisible()
  expect(await row.innerText()).toMatch(/−\$[\d,]+\.\d{2}\s*→\s*\+€[\d,]+\.\d{2}/)
})

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
