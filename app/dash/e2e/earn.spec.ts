import { test, expect, type Page, type Locator } from '@playwright/test'
import { signIn, shot } from './demo'

// Earn — the Liquid Protocol vaults inside the bank. The seeded demo opens on
// two positions (stLUX and wstETH); the movements below are asserted as deltas
// against whatever the ledger holds when the spec starts, so the suite stays
// true on a second run against the same mutable sandbox.

// A vault reads as one card, and the card is a button that opens it.
function vault(page: Page, name: string): Locator {
  return page.getByRole('button', { name: new RegExp(name) })
}

// figure pulls a labelled USD figure out of a card or panel ("Collateral" →
// 3125). The label and its number are adjacent lines in the rendered text.
// figure reads the number a position states under a label. Collateral and debt
// are shown in the vault's own token now rather than in dollars, so this takes
// either — what it is asserting is that the figure MOVED, and the unit it moved
// in is the screen's business.
async function figure(scope: Locator, label: string): Promise<number> {
  const text = await scope.innerText()
  const m = text.match(new RegExp(`${label}\\s*\\n?\\s*\\$?([\\d,]+(?:\\.\\d+)?)`))
  if (!m) throw new Error(`no "${label}" figure in:\n${text}`)
  return parseFloat(m[1].replace(/,/g, ''))
}

test('Earn is a destination in the shell and opens on the seeded positions', async ({ page }) => {
  await signIn(page)
  await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Earn' }).click()
  await expect(page).toHaveURL(/\/app\/earn$/)

  await expect(page.getByRole('heading', { name: 'Earn', exact: true })).toBeVisible()
  // The two seeded vaults are the caller's, and they sort above the rest.
  await expect(page.getByText('Your positions')).toBeVisible()
  await expect(vault(page, 'Staked LUX')).toBeVisible()
  await expect(vault(page, 'Wrapped stETH')).toBeVisible()

  // A position states what is at stake and how long the yield takes to clear
  // it — in years, which is the truth about a self-repaying loan.
  const stlux = vault(page, 'Staked LUX')
  await expect(stlux).toContainText(/Clears in/)
  await expect(stlux).toContainText(/~[\d.]+ years/)
  expect(await figure(stlux, 'Collateral')).toBeGreaterThan(0)

  // The summary above adds them up.
  await expect(page.getByText('Net position')).toBeVisible()
  await expect(page.getByText(/Across 2 vaults/)).toBeVisible()

  await shot(page, 'earn')
})

test('a deposit raises the collateral behind the loan', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/earn')

  const stlux = vault(page, 'Staked LUX')
  const before = await figure(stlux, 'Collateral')

  await stlux.click()
  await page.getByRole('button', { name: 'Deposit', exact: true }).first().click()
  await page.getByLabel('Amount in LUX').fill('50')
  await page.getByRole('button', { name: 'Deposit', exact: true }).last().click()

  await expect(page.getByText(/Deposit of .* settled/)).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()

  await expect
    .poll(() => figure(stlux, 'Collateral'))
    .toBeGreaterThan(before)
})

test('a borrow inside the limit raises the debt', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/earn')

  const stlux = vault(page, 'Staked LUX')
  const before = await figure(stlux, 'Borrowed')

  await stlux.click()
  // Borrow a slice of what the screen says is actually left, rather than a fixed
  // number: the figures are in the vault's own token and the position carries
  // debt from the specs before this one, so a constant is either trivially small
  // or over the limit depending on what ran first.
  const headroom = await figure(page.getByRole('dialog'), 'Left to borrow')
  expect(headroom, 'the position should have room to borrow into').toBeGreaterThan(1)
  await page.getByRole('button', { name: 'Borrow', exact: true }).first().click()
  await page.getByLabel(/^Amount in /).fill(String(Math.max(1, Math.floor(headroom / 4))))
  await page.getByRole('button', { name: 'Borrow', exact: true }).last().click()

  await expect(page.getByText(/Borrow of .* settled/)).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()

  await expect
    .poll(() => figure(stlux, 'Borrowed'))
    .toBeGreaterThan(before)
})

test('a borrow past the collateral limit is refused — by the screen and by the ledger', async ({ page }) => {
  await signIn(page)
  await page.goto('/app/earn')

  await vault(page, 'Staked LUX').click()
  const panel = page.getByRole('dialog')
  const headroom = await figure(panel, 'Left to borrow')

  // The screen refuses first: the amount is named as over the limit and the
  // action will not fire.
  await page.getByRole('button', { name: 'Borrow', exact: true }).first().click()
  await page.getByLabel(/^Amount in /).fill(String(Math.ceil(headroom) + 1000))
  await expect(panel.getByText(/more than the .* available for this move/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Borrow', exact: true }).last()).toBeDisabled()

  await shot(page, 'earn-over-limit')

  // And the ledger refuses too, so the limit is not merely a disabled button.
  // The bearer the app itself holds — IAM's access token, under the key the SDK
  // stores it at (IAM_TOKEN_KEY). There is no bank-minted token any more.
  const token = await page.evaluate(
    () => sessionStorage.getItem('hanzo_iam_access_token') ?? localStorage.getItem('hanzo_iam_access_token'),
  )
  expect(token, 'the app should hold an IAM access token after signing in').toBeTruthy()
  // Through the app's own origin (the dash proxies /v1 to bankd), so this holds
  // against a deployment as well as a local run.
  // Far past any limit the seeded collateral could support. The screen reads
  // its figures in the vault's own token now, so deriving the amount from what
  // is displayed would be arithmetic across two units — and the ledger's answer
  // does not depend on landing just over the line.
  const res = await page.request.post(new URL('/v1/bank/earn/borrow', page.url()).toString(), {
    headers: { Authorization: `Bearer ${token}` },
    data: { vault: 'stlux', amount: 1_000_000_000_000 },
  })
  expect(res.status()).toBe(422)
  expect((await res.json()).error).toMatch(/over the borrow limit/)
})

test('the dashboard carries the Earn position through to the page', async ({ page }) => {
  await signIn(page)
  const card = page.getByRole('link', { name: /Net position/ })
  await expect(card).toBeVisible()
  await expect(card).toContainText('Net APY')
  await card.click()
  await expect(page).toHaveURL(/\/app\/earn$/)
})
