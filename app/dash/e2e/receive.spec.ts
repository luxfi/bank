import { test, expect, type Page } from '@playwright/test'
import { signIn, shot } from './demo'

// Everything here runs against the bank the browser is actually talking to.
// Nothing is intercepted: an address the page shows is one bankd derived from
// the deploy mnemonic, and the coordinates beside it are the ones it would give
// a payer.
//
// That costs the exact-value assertions a stub could make, so what is asserted
// is what the screen has to get right whatever those values are: the address
// belongs to the asset that was picked and changes when the asset does, each is
// shaped for its own chain, and the two pages that show the account's
// coordinates show the same ones.

const receiveSection = (page: Page) =>
  page.locator('section').filter({ has: page.getByRole('heading', { name: 'Receive' }) })

// shown reads the address the receive panel is currently offering.
async function shown(page: Page): Promise<string> {
  const button = page.locator('button').filter({ hasText: /^(0x[0-9a-fA-F]{40}|(bc1|tb1)[0-9a-z]{20,})$/ }).first()
  await expect(button).toBeVisible()
  return (await button.innerText()).trim()
}

test('the receive panel hands over the address for the chosen asset', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await page.getByRole('button', { name: 'Receive', exact: true }).click()

  const seen = new Map<string, string>()
  for (const asset of ['LUX', 'BTC', 'ETH']) {
    await page.getByRole('button', { name: asset, exact: true }).click()
    await expect(page.getByText(`Send only ${asset} to this address.`)).toBeVisible()
    seen.set(asset, await shown(page))
  }

  // Bitcoin arrives on a bech32 address and the EVM assets on 0x ones. The
  // simulation models them as separate chains, so BTC differs from the rest;
  // against a real EVM every asset lands at the account's one address, which is
  // why the shapes are asserted and not the difference.
  expect(seen.get('BTC')).toMatch(/^(bc1|tb1)/)
  expect(seen.get('LUX')).toMatch(/^0x[0-9a-fA-F]{40}$/)
  expect(seen.get('ETH')).toMatch(/^0x[0-9a-fA-F]{40}$/)

  // Picking an asset shows that asset's address rather than the last one.
  await page.getByRole('button', { name: 'LUX', exact: true }).click()
  expect(await shown(page)).toBe(seen.get('LUX'))

  await shot(page, 'receive-per-asset')
})

test('a US account shows the coordinates a wire needs, and no IBAN line', async ({ page }) => {
  await signIn(page)
  await page.getByRole('link', { name: 'Send' }).first().click()

  const receive = receiveSection(page)
  // Every account opens in USD, so the rail is ABA: a routing number and an
  // account number, a SWIFT for anything arriving from abroad, and the bank
  // it all names.
  await expect(receive.getByText('Routing number (ABA)')).toBeVisible()
  const routing = await receive.locator('button, span, p').filter({ hasText: /^\d{9}$/ }).first().innerText()
  expect(routing).toMatch(/^\d{9}$/)
  await expect(receive.getByText(/^SFPB[A-Z0-9]{4,}$/)).toBeVisible()

  // The US issues no IBAN, so the screen never asks after one.
  await expect(receive.getByText('IBAN', { exact: true })).toHaveCount(0)

  await shot(page, 'receive-send-page')
})

test('the accounts page shows the same coordinates the send page does', async ({ page }) => {
  await signIn(page)

  await page.getByRole('link', { name: 'Send' }).first().click()
  const onSend = (await receiveSection(page).locator('button, span, p').filter({ hasText: /^\d{9}$/ }).first().innerText()).trim()

  await page.goto('/app/accounts')
  const card = page.locator('.card').first()
  await expect(card.getByText(onSend)).toBeVisible()

  await shot(page, 'receive-accounts-page')
})
