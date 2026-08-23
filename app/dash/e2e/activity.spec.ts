import { test, expect } from '@playwright/test'
import { signIn, shot } from './demo'

// A conversion is one movement the ledger writes as two legs. Activity must
// read it back as one line — what left and what landed — not as a debit sitting
// next to an unexplained credit in another currency.
test('a conversion reads as one movement, both legs on the line', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: 'Activity' }).first().click()
  await expect(page.getByRole('heading', { name: 'Activity' })).toBeVisible()

  const rows = page.locator('.card > div').filter({ hasText: 'Converted USD → EUR' })
  await expect(rows.first()).toBeVisible()
  const n = await rows.count()
  // Every line carrying that reference shows the whole trade. An unpaired leg
  // would show one amount and fail here.
  for (let i = 0; i < n; i++) {
    expect(await rows.nth(i).innerText()).toMatch(/−\$[\d,]+\.\d{2}\s*→\s*\+€[\d,]+\.\d{2}/)
  }

  await shot(page, 'activity-conversion')
})

test('filtering to money out shows the leg that left, on its own', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/activity')
  await page.getByRole('button', { name: 'Out', exact: true }).click()

  const row = page.locator('.card > div').filter({ hasText: 'Converted USD → EUR' }).first()
  await expect(row).toBeVisible()
  const text = await row.innerText()
  expect(text).toContain('−$')
  expect(text).not.toContain('+€')
})
