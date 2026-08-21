import { test, expect } from '@playwright/test'
import { signIn, shot } from './demo'

test('the dashboard opens on balances and activity', async ({ page }) => {
  await signIn(page)

  await expect(page.getByText(/Welcome back/)).toBeVisible()

  const balances = page.getByRole('heading', { name: 'Balances' })
  await expect(balances).toBeVisible()
  const usd = page.locator('section').filter({ has: balances }).getByText('USD', { exact: true })
  await expect(usd).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Recent activity' })).toBeVisible()

  for (const action of ['Send', 'Exchange', 'Crypto', 'Cards']) {
    await expect(page.getByRole('link', { name: action, exact: true }).first()).toBeVisible()
  }

  await shot(page, 'dashboard')
})
