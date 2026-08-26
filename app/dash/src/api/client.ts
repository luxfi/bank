import { IAM_TOKEN_KEY } from '@/lib/iam'

// Domain types: ONE scheme. The @luxfi/bank SDK mirrors bankd's Go view
// structs, so every shape has a single definition, imported here and shared by
// the SDK and the dash. Historical dash names are kept as aliases (AccountView
// = Account, CardView = Card, Txn = Transaction) so pages need no change.
import type {
  Balance,
  Wallet,
  Config,
  Plan,
  CryptoPrice,
  CryptoMove,
  Overview,
  Beneficiary,
  Vault,
  VaultView,
  Position,
  EarnSummary,
  Account as AccountView,
  Card as CardView,
  Transaction as Txn,
} from '@luxfi/bank'
export type {
  Balance,
  Wallet,
  Config,
  Plan,
  CryptoPrice,
  CryptoMove,
  Overview,
  Beneficiary,
  Vault,
  VaultView,
  Position,
  EarnSummary,
  AccountView,
  CardView,
  Txn,
}

// Where bankd is, how a session is proved, and what to do when it refuses.
// lux.finance takes all three defaults. The Lux Cloud console mounts the same
// screens inside its own shell and overrides what differs — its API origin, and
// its own sign-in rather than ours. One client, one set of screens, two hosts.
let baseUrl = import.meta.env.VITE_BANK_API_URL || ''
let readToken: () => string | null = sessionToken
let refuse: () => void = bounceToLogin

export function configure(opts: {
  url?: string
  token?: () => string | null
  unauthorized?: () => void
}): void {
  if (opts.url !== undefined) baseUrl = opts.url
  if (opts.token) readToken = opts.token
  if (opts.unauthorized) refuse = opts.unauthorized
}

export function getToken(): string | null {
  return readToken()
}

function sessionToken(): string | null {
  try {
    return sessionStorage.getItem(IAM_TOKEN_KEY)
  } catch {
    return null
  }
}

// Only bounce from inside the authed app: a host that mounts these screens
// elsewhere has its own sign-in and its own idea of where to send someone.
function bounceToLogin(): void {
  if (window.location.pathname.startsWith('/app')) window.location.href = '/login'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${baseUrl}${path}`, { ...init, headers })

  if (res.status === 401 || res.status === 403) {
    refuse()
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || 'Unauthorized')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const getConfig = () => request<Config>('/v1/bank/config')

// -- Membership plans --

export const getPlans = () => request<Plan[]>('/v1/bank/plans')

// -- Onboarding + dashboard --

export interface KYC {
  name?: string
  dob?: string
  addressLine?: string
  city?: string
  postalCode?: string
  country?: string
  entityType?: string
}
export const onboard = (kyc: KYC = {}) =>
  request<Overview>('/v1/bank/onboard', { method: 'POST', body: JSON.stringify(kyc) })

export const getOverview = () => request<Overview>('/v1/bank/overview')

export const listTransactions = () => request<Txn[]>('/v1/bank/transactions')

// -- Money movement --

export const createTransfer = (data: {
  fromAccountId: string
  toAccountId: string
  amount: number
  currency: string
  reference: string
}) =>
  request<{ debitId: string; creditId: string; status: string }>('/v1/bank/transfers', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const sendPayment = (data: {
  accountId: string
  beneficiaryId: string
  amount: number
  currency: string
  reference: string
}) =>
  request<{ transactionId: string; status: string }>('/v1/bank/payments/outbound', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// -- Beneficiaries --

export const listBeneficiaries = () => request<Beneficiary[]>('/v1/bank/beneficiaries')
export const createBeneficiary = (data: {
  name: string
  bankAccountHolder?: string
  currency: string
  country?: string
  iban?: string
  bic?: string
  accountNumber?: string
  sortCode?: string
  paymentType?: string
}) => request<{ id: string }>('/v1/bank/beneficiaries', { method: 'POST', body: JSON.stringify(data) })
export const deleteBeneficiary = (id: string) =>
  request<{ deleted: string }>(`/v1/bank/beneficiaries/${id}`, { method: 'DELETE' })

// -- Cards --

export const listCards = () => request<CardView[]>('/v1/bank/cards')
export const issueCard = (currency?: string) =>
  request<{ card: CardView; cvv: string; pan: string }>('/v1/bank/cards', {
    method: 'POST',
    body: JSON.stringify({ currency }),
  })
export const freezeCard = (id: string) =>
  request<CardView>(`/v1/bank/cards/${id}/freeze`, { method: 'POST' })
export const unfreezeCard = (id: string) =>
  request<CardView>(`/v1/bank/cards/${id}/unfreeze`, { method: 'POST' })

// -- Exchange (fiat FX + crypto buy/sell/convert) --

export interface Quote {
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  toAmount: number
  fromDecimals: number
  toDecimals: number
  rate: number
  expiresAt: string
}
export const exchangeQuote = (fromCurrency: string, toCurrency: string, amount: number) =>
  request<Quote>('/v1/bank/exchange/quote', {
    method: 'POST',
    body: JSON.stringify({ fromCurrency, toCurrency, amount }),
  })
export const exchangeExecute = (fromCurrency: string, toCurrency: string, amount: number) =>
  request<{
    fromCurrency: string
    toCurrency: string
    fromAmount: number
    toAmount: number
    rate: number
    balances: Balance[]
  }>('/v1/bank/exchange/execute', {
    method: 'POST',
    body: JSON.stringify({ fromCurrency, toCurrency, amount }),
  })

// -- Wallet / crypto --

// A deposit address is per asset — BTC lands on a bech32 address, the EVM
// assets (LUX, ETH, DAI) each on their own 0x one. `wallets` carries one per
// supported asset; `wallet` is the first of them, and is all an older bankd
// sends, so callers fall back to it.
export interface WalletBundle {
  wallet: Wallet
  wallets?: Wallet[]
  holdings: Balance[]
  network: string
  sandbox: boolean
}

export const getWallet = () => request<WalletBundle>('/v1/bank/wallet')
export const getCryptoPrices = () =>
  request<{ prices: CryptoPrice[]; sandbox: boolean }>('/v1/bank/crypto/prices')

export const sendCrypto = (asset: string, amount: number, toAddress: string) =>
  request<CryptoMove>('/v1/bank/crypto/send', {
    method: 'POST',
    body: JSON.stringify({ asset, amount, toAddress }),
  })
// Sandbox-only testnet faucet.
export const depositCrypto = (asset: string, amount: number) =>
  request<CryptoMove>('/v1/bank/crypto/deposit', {
    method: 'POST',
    body: JSON.stringify({ asset, amount }),
  })

// -- Earn (Liquid Protocol vaults) --
//
// `listVaults` is the public catalog; `getEarnVaults` is the same catalog with
// the caller's position folded into each entry, so one call drives the screen.
// The four movements share a shape: deposit/withdraw carry the vault's
// underlying minor units, borrow/repay carry USD cents.

export const listVaults = () => request<Vault[]>('/v1/bank/vaults')
export const getEarnVaults = () => request<VaultView[]>('/v1/bank/earn/vaults')

export interface EarnMove {
  vault: string
  position: Position
  balances: Balance[]
}

export type EarnAction = 'deposit' | 'borrow' | 'repay' | 'withdraw'

export const earnMove = (action: EarnAction, vault: string, amount: number) =>
  request<EarnMove>(`/v1/bank/earn/${action}`, {
    method: 'POST',
    body: JSON.stringify({ vault, amount }),
  })
