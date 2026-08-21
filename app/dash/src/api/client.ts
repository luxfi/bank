import { IAM_TOKEN_KEY } from '@/lib/iam'

const BASE_URL = import.meta.env.VITE_BANK_API_URL || ''

// The sandbox demo login stores a bankd superuser token under its own key so it
// never collides with the IAM SDK's token. Either authorizes bankd; the demo
// token takes precedence when present.
export const DEMO_TOKEN_KEY = 'bank_demo_token'

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(DEMO_TOKEN_KEY) || sessionStorage.getItem(IAM_TOKEN_KEY)
  } catch {
    return null
  }
}

// -- Sandbox password login (demo only) --

export const sandboxLogin = (email: string, password: string) =>
  request<{ token: string; user: { id: string; email: string } }>('/v1/bank/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  if (res.status === 401 || res.status === 403) {
    // Only bounce to login from inside the authed app.
    if (window.location.pathname.startsWith('/app')) window.location.href = '/login'
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

// -- Domain types (mirror bankd JSON) --

export interface Balance {
  currency: string
  available: number
  held: number
  decimals: number
  kind: 'fiat' | 'crypto'
  valueUsd: number
}
export interface AccountView {
  id: string
  entityName: string
  entityType: string
  country: string
  currency: string
  status: string
  kycStatus: string
  iban: string
}
export interface Wallet {
  id: string
  currency: string
  address: string
  network: string
  status: string
}
export interface CardView {
  id: string
  holderName: string
  brand: string
  type: string
  last4: string
  display: string
  expMonth: number
  expYear: number
  currency: string
  status: string
  design: string
}
export interface Txn {
  id: string
  type: string
  direction: 'credit' | 'debit'
  amount: number
  currency: string
  decimals: number
  status: string
  reference: string
  created: string
}
export interface Overview {
  sandbox: boolean
  onboarded: boolean
  account?: AccountView
  balances?: Balance[]
  wallet?: Wallet | null
  cards?: CardView[]
  recentTransactions?: Txn[]
}
export interface Beneficiary {
  id: string
  name: string
  bankAccountHolder: string
  currency: string
  country: string
  paymentType: string
  bankDetails: { iban?: string; bic?: string; accountNumber?: string; sortCode?: string }
  verified: boolean
}

// -- Public config --

export interface Config {
  sandbox: boolean
  fiat: string[]
  crypto: string[]
  network: string
  disclaimer: string
  partner?: { name: string; terms: string; privacy: string }
}
export const getConfig = () => request<Config>('/v1/bank/config')

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
  request<{ card: CardView; cvv: string }>('/v1/bank/cards', {
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

export interface CryptoPrice { asset: string; usd: number; decimals: number }
export const getWallet = () =>
  request<{ wallet: Wallet; holdings: Balance[]; network: string; sandbox: boolean }>('/v1/bank/wallet')
export const getCryptoPrices = () =>
  request<{ prices: CryptoPrice[]; sandbox: boolean }>('/v1/bank/crypto/prices')
