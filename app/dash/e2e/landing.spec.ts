import { test, expect } from '@playwright/test'

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
})

test('plans come from the bank API, not hardcoded markup', async ({ page }) => {
  const plans = page.waitForResponse(
    (r) => r.url().includes('/v1/bank/plans') && r.status() === 200,
  )
  await page.goto('/')
  const body = await (await plans).json()
  expect(body.map((p: { name: string }) => p.name)).toEqual(TIERS.map((t) => t.name))
})
