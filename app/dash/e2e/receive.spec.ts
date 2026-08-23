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

// The coordinates a wire needs differ by market: a US account is reached by
// routing + account number, an IBAN market by its IBAN. bankd sends whichever
// applies as `account.receiving`, and the dash shows that one — never an empty
// "IBAN" line on an account that will never have one.
const US = {
  bankName: 'SF Private Bank',
  accountHolder: 'Lux Demo',
  routingNumber: '074346824',
  accountNumber: '9639586203',
  accountType: 'Checking',
  swift: 'SFPBUS6S',
  bankAddress: '1 Sansome Street, San Francisco, CA 94104, US',
}
const SEPA = {
  bankName: 'SF Neobanq KB',
  accountHolder: 'Lux Demo',
  iban: 'SE4550000000058398257466',
  swift: 'NBKBSESS',
  bankAddress: 'Birger Jarlsgatan 2, 114 34 Stockholm, SE',
}

type Account = { receiving?: typeof US | typeof SEPA; iban?: string }

async function serve(page: Page, wallets: typeof WALLETS | null, account: Account) {
  // `null` asks for the older bankd shape — one account address and no
  // per-asset set. Spreading `{}` left the seeded set in place instead, so the
  // key is spelled out and dropped on the way through JSON.
  const set = { wallets: wallets ?? undefined }
  await page.route('**/v1/bank/wallet', async (route) => {
    const res = await route.fetch()
    await route.fulfill({ response: res, json: { ...(await res.json()), ...set } })
  })
  await page.route('**/v1/bank/overview', async (route) => {
    const res = await route.fetch()
    const body = await res.json()
    await route.fulfill({
      response: res,
      json: { ...body, ...set, account: { ...body.account, receiving: undefined, iban: '', ...account } },
    })
  })
}

const receiveSection = (page: Page) =>
  page.locator('section').filter({ has: page.getByRole('heading', { name: 'Receive' }) })

test('the receive panel hands over the address for the chosen asset', async ({ page }) => {
  await serve(page, WALLETS, { receiving: US })
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

test('a US account shows the coordinates a wire needs, and no IBAN line', async ({ page }) => {
  await serve(page, WALLETS, { receiving: US })
  await signIn(page)
  await page.getByRole('link', { name: 'Send' }).first().click()

  const receive = receiveSection(page)
  await expect(receive.getByText(US.bankName)).toBeVisible()
  await expect(receive.getByText(US.routingNumber)).toBeVisible()
  await expect(receive.getByText(US.accountNumber)).toBeVisible()
  await expect(receive.getByText(US.swift)).toBeVisible()
  await expect(receive.getByText(US.bankAddress)).toBeVisible()
  // The US issues no IBAN, so the screen never asks after one.
  await expect(receive.getByText('IBAN', { exact: true })).toHaveCount(0)

  for (const w of WALLETS) await expect(receive.getByText(`${w.currency} · ${w.network}`)).toBeVisible()

  await shot(page, 'receive-send-page')
})

test('an IBAN market shows its IBAN and BIC instead of a routing number', async ({ page }) => {
  await serve(page, WALLETS, { receiving: SEPA })
  await signIn(page)
  await page.goto('/app/accounts')

  const card = page.locator('.card').first()
  await expect(card.getByText(SEPA.iban)).toBeVisible()
  await expect(card.getByText(SEPA.swift)).toBeVisible()
  await expect(card.getByText('Routing number (ABA)')).toHaveCount(0)

  await shot(page, 'receive-iban-market')
})

test('without coordinates or a per-asset set, both pages still read straight', async ({ page }) => {
  await serve(page, null, {})
  await signIn(page)

  await page.getByRole('link', { name: 'Send' }).first().click()
  await expect(page.getByText('No IBAN on this account yet')).toBeVisible()

  // One address, named as the account's rather than any single asset's.
  await page.getByRole('link', { name: 'Wallet' }).first().click()
  await page.getByRole('button', { name: 'Receive', exact: true }).click()
  await expect(page.getByText(/every asset on this network arrives here/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'BTC', exact: true })).toHaveCount(0)
})
