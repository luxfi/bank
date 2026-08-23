import { test, expect, type Page } from '@playwright/test'
import { signIn, shot } from './demo'

const box = async (page: Page, heading: string) => {
  const section = page.locator('section').filter({ has: page.getByRole('heading', { name: heading }) })
  return (await section.boundingBox())!
}

test('at desktop width the card sits beside its limits and its spending', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await signIn(page)
  await page.goto('/app/cards')

  await expect(page.getByRole('heading', { name: 'Spend limits' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Card transactions' })).toBeVisible()
  await expect(page.getByText('Spent this month')).toBeVisible()
  await expect(page.getByText(/^of \$[\d,]+\.\d{2}$/)).toBeVisible()
  await expect(page.getByText('Daily limit')).toBeVisible()

  // Payments made on the account show up as the card's spending.
  const spend = page.locator('.card > div').filter({ hasText: 'Card — Apple Store' })
  await expect(spend.first()).toBeVisible()

  // The right-hand column starts to the right of the card face, on the same
  // band of the page — that is the dead space being used, not a taller stack.
  const face = (await page.locator('.card-face').first().boundingBox())!
  const limits = await box(page, 'Spend limits')
  expect(limits.x).toBeGreaterThan(face.x + face.width)
  expect(limits.y).toBeLessThan(face.y + face.height)

  await shot(page, 'cards-desktop')
})

test('on mobile the card and its panels stack in one column', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await signIn(page)
  await page.goto('/app/cards')

  const face = (await page.locator('.card-face').first().boundingBox())!
  const limits = await box(page, 'Spend limits')
  expect(limits.y).toBeGreaterThan(face.y + face.height)
  expect(limits.x).toBeLessThan(face.x + 8)

  await shot(page, 'cards-mobile')
})
