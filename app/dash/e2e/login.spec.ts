import { test, expect } from '@playwright/test'
import { signIn, DEMO_EMAIL, shot } from './demo'

test('the prefilled demo credential signs into the app', async ({ page }) => {
  await page.goto('/login')
  await shot(page, 'login')

  await signIn(page)

  await expect(page.getByText(/Welcome back/)).toBeVisible()
  await expect(page.getByText(DEMO_EMAIL).first()).toBeVisible()

  await shot(page, 'login-signed-in')
})

test('the app rejects anonymous visitors', async ({ page }) => {
  await page.goto('/app/wallet')
  await expect(page).toHaveURL(/\/login$/)

  await shot(page, 'login-guard')
})
