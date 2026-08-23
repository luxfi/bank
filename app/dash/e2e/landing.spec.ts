import { test, expect } from '@playwright/test'
import { shot } from './demo'

const TIERS = [
  { name: 'Silver', price: '$29' },
  { name: 'Gold', price: '$99' },
  { name: 'Black', price: '$299' },
  { name: 'Sovereign', price: '$999' },
]

test('landing renders the membership ladder from live plans', async ({ page }) => {
  await page.goto('/')

  const membership = page.locator('#plans')
  await expect(membership.getByRole('heading', { name: 'Membership' })).toBeVisible()

  for (const tier of TIERS) {
    const card = membership.locator('.card').filter({ hasText: tier.name })
    await expect(card).toHaveCount(1)
    await expect(card.getByRole('heading', { name: tier.name })).toBeVisible()
    await expect(card.getByText(tier.price, { exact: true })).toBeVisible()
  }

  await shot(page, 'landing-plans')
})

// The hero preview is the account you get. Its headline is the sum of the
// balances under it — a total that contradicts its own parts (or the app it
// leads into) reads as two different companies.
test('the hero total is the sum of the balances it shows', async ({ page }) => {
  await page.goto('/')

  const dollars = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ''))
  const total = dollars(await page.getByText(/^\$[\d,]+\.\d{2}$/).first().innerText())
  const tiles = await page.locator('.card-2 p:last-child').allInnerTexts()
  const parts = tiles.filter((t) => /^\$[\d,]+\.\d{2}$/.test(t)).map(dollars)

  expect(parts.length).toBe(5)
  expect(parts.reduce((a, b) => a + b, 0)).toBeCloseTo(total, 2)

  await shot(page, 'landing-hero')
})

test('plans come from the bank API, not hardcoded markup', async ({ page }) => {
  const plans = page.waitForResponse(
    (r) => r.url().includes('/v1/bank/plans') && r.status() === 200,
  )
  await page.goto('/')
  const body = await (await plans).json()
  expect(body.map((p: { name: string }) => p.name)).toEqual(TIERS.map((t) => t.name))
})
