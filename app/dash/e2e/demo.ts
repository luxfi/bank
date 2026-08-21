import { expect, type Page } from '@playwright/test'

// The seeded sandbox identity. The Login form prefills it, so signing in is
// just submitting the form the customer is shown.
export const DEMO_EMAIL = 'z@lux.financial'

// signIn submits the prefilled demo credential and waits for the authenticated
// shell (nav rail) to render.
export async function signIn(page: Page) {
  await page.goto('/login')
  await expect(page.getByLabel('Email')).toHaveValue(DEMO_EMAIL)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByRole('link', { name: 'Wallet' }).first()).toBeVisible()
}

// holding locates a row in the wallet's Holdings list. Each row links to the
// exchange pair for that asset, which is the stable handle on it.
export function holding(page: Page, asset: string) {
  return page.locator(`a[href="/app/exchange?from=${asset}&to=USD"]`)
}

// holdingAmount reads the major-unit balance shown for an asset, or null when
// the asset is not held at all.
export async function holdingAmount(page: Page, asset: string): Promise<number | null> {
  const row = holding(page, asset)
  if ((await row.count()) === 0) return null
  const text = await row.innerText()
  const match = text.match(new RegExp(`([\\d,]+(?:\\.\\d+)?)\\s+${asset}`))
  return match ? parseFloat(match[1].replace(/,/g, '')) : null
}
