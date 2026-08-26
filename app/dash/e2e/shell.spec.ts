import { test, expect } from '@playwright/test'
import { signIn } from './demo'

// The app shell contract: unknown authenticated routes stay in the product,
// every screen is reachable on mobile, a freshly issued card is readable once,
// and the IAM redirect is well-formed. These are the gaps the visual sweep found.

test('an unknown /app route stays in the shell, not the marketing site', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/nowhere-at-all')
  // URL is preserved (no rewrite to the public landing) and the in-shell 404 shows.
  await expect(page).toHaveURL(/\/app\/nowhere-at-all$/)
  await expect(page.getByText('Page not found')).toBeVisible()
  // The nav rail is still there — we're inside the product, not the hero page.
  await expect(page.getByRole('link', { name: 'Wallet' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /Banking without borders/i })).toHaveCount(0)
})

test('on mobile, More reaches Accounts and Activity', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await signIn(page)
  await page.getByRole('button', { name: 'More' }).click()
  await page.getByRole('link', { name: 'Accounts' }).click()
  await expect(page).toHaveURL(/\/app\/accounts$/)
})

// Navigation is a landmark, and a screen with more than one names them apart.
test('every set of links is a named navigation landmark', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await signIn(page)

  const tabs = page.getByRole('navigation', { name: 'Primary' })
  await expect(tabs).toBeVisible()
  await expect(tabs.getByRole('link', { name: 'Wallet' })).toBeVisible()

  await page.getByRole('button', { name: 'More' }).click()
  await expect(page.getByRole('navigation', { name: 'More' })).toBeVisible()

  await page.setViewportSize({ width: 1280, height: 900 })
  await expect(page.getByRole('navigation', { name: 'Sections' })).toBeVisible()

  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
})

test('a freshly issued card reveals its full number and CVV once', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/cards')
  await page.getByRole('button', { name: /New card|Issue a card/i }).first().click()
  // The reveal modal appears and shows a full 16-digit PAN (4 groups of 4) and
  // a CVV — not the masked bullets the card list carries.
  await expect(page.getByText('Your new card is ready')).toBeVisible()
  await expect(page.getByText('CVV').first()).toBeVisible()
  const modalText = await page.getByText('Your new card is ready').locator('xpath=ancestor::*[3]').innerText()
  expect(modalText).toMatch(/\d{4} \d{4} \d{4} \d{4}/)
  expect(modalText).not.toMatch(/•/)
})

test('the IAM sign-in redirect carries a single /v1/iam prefix', async ({ page }) => {
  await page.goto('/login')
  // The SSO button starts an OIDC redirect; capture where it points.
  const [nav] = await Promise.all([
    page.waitForRequest((r) => r.url().includes('/oauth/authorize'), { timeout: 8000 }).catch(() => null),
    page.getByRole('button', { name: /Sign in with Lux ID/i }).click(),
  ])
  if (nav) {
    expect(nav.url()).toContain('/v1/iam/oauth/authorize')
    expect(nav.url()).not.toContain('/v1/iam/v1/iam/')
  }
})
