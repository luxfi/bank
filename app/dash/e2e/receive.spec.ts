import { test, expect, type Page } from '@playwright/test'
import { signIn, shot } from './demo'

// A deposit address belongs to an asset: BTC arrives on a bech32 address, the
// EVM assets each on their own 0x one. bankd sends that set as `wallets`; the
// dash must show the address for the asset the customer picked, and must still
// read straight when only the single account address comes back.
//
// The wallets set is fixed here rather than read from the ledger so the spec
// asserts exact addresses — the live loop through this UI is wallet.spec.ts.
const WALLETS = [
  { id: 'w1', currency: 'LUX', address: '0xa40ced8739fe77bfb87633b4209fdd342c0a37e1', network: 'lux-testnet', status: 'active' },
  { id: 'w2', currency: 'BTC', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', network: 'lux-testnet', status: 'active' },
  { id: 'w3', currency: 'ETH', address: '0x52908400098527886E0F7030069857D2E4169EE7', network: 'lux-testnet', status: 'active' },
]
const IBAN = 'US64SVBKUS6S3300958879'

async function serveWallets(page: Page, wallets: typeof WALLETS | null, iban: string) {
  const patch = async (url: string, fields: Record<string, unknown>) =>
    page.route(url, async (route) => {
      const res = await route.fetch()
      const body = await res.json()
      await route.fulfill({ response: res, json: { ...body, ...fields } })
    })
  const set = wallets ? { wallets } : {}
  await patch('**/v1/bank/wallet', set)
  await page.route('**/v1/bank/overview', async (route) => {
    const res = await route.fetch()
    const body = await res.json()
    await route.fulfill({ response: res, json: { ...body, ...set, account: { ...body.account, iban } } })
  })
}

test('the receive panel hands over the address for the chosen asset', async ({ page }) => {
  await serveWallets(page, WALLETS, IBAN)
  await signIn(page)
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await page.getByRole('button', { name: 'Receive', exact: true }).click()

  await expect(page.getByRole('button', { name: WALLETS[0].address })).toBeVisible()
  await expect(page.getByText('Send only LUX to this address.')).toBeVisible()

  await page.getByRole('button', { name: 'BTC', exact: true }).click()
  await expect(page.getByRole('button', { name: WALLETS[1].address })).toBeVisible()
  await expect(page.getByText('Send only BTC to this address.')).toBeVisible()

  await shot(page, 'receive-per-asset')
})

test('receive lists the IBAN and every crypto address to pay into', async ({ page }) => {
  await serveWallets(page, WALLETS, IBAN)
  await signIn(page)
  await page.getByRole('link', { name: 'Send' }).first().click()

  const receive = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Receive' }) })
  await expect(receive.getByText(IBAN)).toBeVisible()
  for (const w of WALLETS) await expect(receive.getByText(`${w.currency} · ${w.network}`)).toBeVisible()

  await shot(page, 'receive-send-page')
})

test('without an IBAN or a per-asset set, both pages still read straight', async ({ page }) => {
  await serveWallets(page, null, '')
  await signIn(page)

  await page.getByRole('link', { name: 'Send' }).first().click()
  await expect(page.getByText('No IBAN on this account yet')).toBeVisible()

  // One address, named as the account's rather than any single asset's.
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await page.getByRole('button', { name: 'Receive', exact: true }).click()
  await expect(page.getByText(/every asset on this network arrives here/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'BTC', exact: true })).toHaveCount(0)
})
