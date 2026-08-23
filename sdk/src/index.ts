// @luxfi/bank — typed client for the Lux banking API (/v1/bank).
// One surface: accounts, transfers, payments, beneficiaries, cards (with the
// provider-neutral issuer lifecycle), crypto, exchange, and membership plans.
// Sandbox and production serve the identical contract (LP-3040).

export interface BankConfig {
  /** API origin, e.g. "https://api.lux.financial" or "https://api.sandbox.lux.financial". */
  baseUrl: string
  /** IAM bearer token, or a getter so rotation is picked up per request. */
  token?: string | (() => string | null | undefined)
  fetch?: typeof fetch
}

export class BankError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message)
    this.name = 'BankError'
  }
}

// -- Shapes (minor-unit integers throughout; `decimals` tells you how to render) --

export interface Config {
  sandbox: boolean
  demoLogin?: boolean
  demoEmail?: string
  fiat: string[]
  crypto: string[]
  network: string
  disclaimer: string
  partner?: { name: string; terms: string; privacy: string }
}

export interface Plan {
  id: string
  name: string
  monthly: number
  card: 'virtual' | 'plastic' | 'metal'
  iban: boolean
  freeACH: number
  freeWires: number
  achFee: number
  wireFee: number
  fxPct: number
  depositPct: number
  dailyLimit: number
  monthlyLimit: number
  holders: number
  invite?: boolean
  perks: string[]
}

export interface Balance {
  currency: string
  available: number
  held: number
  decimals: number
  kind: 'fiat' | 'crypto'
  valueUsd: number
}

export interface Account {
  id: string
  entityName: string
  entityType: 'individual' | 'business'
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

export interface Card {
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

export interface Transaction {
  id: string
  type: string
  direction: 'credit' | 'debit'
  amount: number
  currency: string
  decimals: number
  status: string
  reference: string
  txHash?: string
  network?: string
  created: string
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

export interface CryptoPrice {
  asset: string
  usd: number
  decimals: number
}

export interface CryptoMove {
  txHash: string
  network: string
  asset: string
  amount: number
  toAddress?: string
  balances: Balance[]
}

export interface ExchangeQuote {
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  toAmount: number
  fromDecimals: number
  toDecimals: number
  rate: number
  expiresAt: string
}

export interface ExchangeResult {
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  toAmount: number
  rate: number
  balances: Balance[]
}


/** The issuer's normalized card-lifecycle state; branch on this pair only. */
export interface IssuerState {
  status: 'not_started' | 'pending' | 'approved' | 'rejected' | 'error' | string
  nextAction: 'register' | 'complete_kyc' | 'accept_agreement' | 'retry_kyc' | 'order_card' | 'none' | string
}

export interface CardholderProfile {
  firstName: string
  middleName?: string
  lastName: string
  cardHolderFirstName: string
  cardHolderLastName: string
  gender: 0 | 1 | 2
  dateOfBirth: string
  placeOfBirth: string
  occupation: number
  phoneNumber: string
  phoneNumberCountryCode: string
  address: {
    addressLine1: string
    addressLine2?: string
    subdivision: string
    city: string
    postalCode: string
    country: string
  }
}

// Mirrors bankd's buildOverview — the single dashboard payload.
export interface Overview {
  sandbox: boolean
  onboarded: boolean
  account?: Account
  balances?: Balance[]
  wallet?: Wallet | null
  cards?: Card[]
  recentTransactions?: Transaction[]
}

// enc encodes a path segment so an id can never traverse or inject into the URL.
const enc = encodeURIComponent

// -- Client --

export class Bank {
  private baseUrl: string
  private token?: BankConfig['token']
  private fetchFn: typeof fetch

  constructor(config: BankConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '')
    this.token = config.token
    this.fetchFn = config.fetch ?? fetch
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = typeof this.token === 'function' ? this.token() : this.token
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const data: any = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new BankError(data.message || data.error || `Request failed: ${res.status}`, res.status, data)
    }
    return data as T
  }

  // Public
  health() {
    return this.request<{ status: string; sandbox: boolean }>('GET', '/v1/bank/health')
  }
  config() {
    return this.request<Config>('GET', '/v1/bank/config')
  }
  plans() {
    return this.request<Plan[]>('GET', '/v1/bank/plans')
  }

  // Onboarding + dashboard
  onboard(profile: Record<string, unknown>) {
    return this.request<{ account: Account }>('POST', '/v1/bank/onboard', profile)
  }
  overview() {
    return this.request<Overview>('GET', '/v1/bank/overview')
  }
  transactions() {
    return this.request<Transaction[]>('GET', '/v1/bank/transactions')
  }
  accounts() {
    return this.request<Account[]>('GET', '/v1/bank/account/summary')
  }

  // Money movement
  transfer(fromAccountId: string, toAccountId: string, amount: number, currency: string, reference?: string) {
    return this.request<{ debitId: string; creditId: string; status: string }>('POST', '/v1/bank/transfers', {
      fromAccountId,
      toAccountId,
      amount,
      currency,
      reference,
    })
  }
  pay(accountId: string, beneficiaryId: string, amount: number, currency: string, reference?: string) {
    return this.request<{ transactionId: string; status: string }>('POST', '/v1/bank/payments/outbound', {
      accountId,
      beneficiaryId,
      amount,
      currency,
      reference,
    })
  }

  // Per-account reads
  balances(accountId: string) {
    return this.request<Balance[]>('GET', `/v1/bank/accounts/${enc(accountId)}/balances`)
  }
  wallets(accountId: string) {
    return this.request<Wallet[]>('GET', `/v1/bank/accounts/${enc(accountId)}/wallets`)
  }
  accountTransactions(accountId: string) {
    return this.request<Transaction[]>('GET', `/v1/bank/accounts/${enc(accountId)}/transactions`)
  }

  // Beneficiaries
  beneficiaries() {
    return this.request<Beneficiary[]>('GET', '/v1/bank/beneficiaries')
  }
  createBeneficiary(beneficiary: Record<string, unknown>) {
    return this.request<Beneficiary>('POST', '/v1/bank/beneficiaries', beneficiary)
  }
  deleteBeneficiary(id: string) {
    return this.request<void>('DELETE', `/v1/bank/beneficiaries/${enc(id)}`)
  }

  // Cards — ledger
  cards() {
    return this.request<Card[]>('GET', '/v1/bank/cards')
  }
  // Returns the new card plus its CVV, shown once and never stored server-side.
  issueCard(currency?: string) {
    return this.request<{ card: Card; cvv: string }>('POST', '/v1/bank/cards', { currency })
  }
  freezeCard(id: string) {
    return this.request<Card>('POST', `/v1/bank/cards/${enc(id)}/freeze`)
  }
  unfreezeCard(id: string) {
    return this.request<Card>('POST', `/v1/bank/cards/${enc(id)}/unfreeze`)
  }

  // Cards — issuer lifecycle (provider-neutral; branch on status/nextAction)
  createCardAccount(profile: CardholderProfile) {
    return this.request<{ status: string; message?: string }>('POST', '/v1/bank/cards/account', profile)
  }
  cardAccount() {
    return this.request<{ status: string; data: Record<string, unknown> }>('GET', '/v1/bank/cards/account')
  }
  cardKYC() {
    return this.request<{ status: string; data: Record<string, unknown> }>('GET', '/v1/bank/cards/kyc')
  }
  createVirtualCard() {
    return this.request<{ status: string; data?: IssuerState }>('POST', '/v1/bank/cards/virtual')
  }
  /** Sensitive: hand the URL straight to the user's browser; never log or persist it. */
  cardKYCURL() {
    return this.request<{ url: string }>('GET', '/v1/bank/cards/virtual/kyc-url')
  }
  /** Sensitive: hand the URL straight to the user's browser; never log or persist it. */
  cardConsentURL() {
    return this.request<{ url: string }>('GET', '/v1/bank/cards/virtual/consent-url')
  }
  orderVirtualCard() {
    return this.request<{ status: string; message?: string }>('POST', '/v1/bank/cards/virtual/order')
  }

  // Crypto
  wallet() {
    return this.request<{ wallet: Wallet; holdings: Balance[]; network: string; sandbox: boolean }>(
      'GET',
      '/v1/bank/wallet',
    )
  }
  cryptoPrices() {
    return this.request<{ prices: CryptoPrice[]; sandbox: boolean }>('GET', '/v1/bank/crypto/prices')
  }
  sendCrypto(asset: string, amount: number, toAddress: string) {
    return this.request<CryptoMove>('POST', '/v1/bank/crypto/send', { asset, amount, toAddress })
  }
  /** Sandbox-only testnet faucet. */
  depositCrypto(asset: string, amount: number) {
    return this.request<CryptoMove>('POST', '/v1/bank/crypto/deposit', { asset, amount })
  }

  // Exchange (fiat FX + crypto buy/sell/convert)
  exchangeQuote(fromCurrency: string, toCurrency: string, amount: number) {
    return this.request<ExchangeQuote>('POST', '/v1/bank/exchange/quote', { fromCurrency, toCurrency, amount })
  }
  exchange(fromCurrency: string, toCurrency: string, amount: number) {
    return this.request<ExchangeResult>('POST', '/v1/bank/exchange/execute', { fromCurrency, toCurrency, amount })
  }


  // Sandbox demo login (sandbox deployments only)
  sandboxLogin(email: string, password: string) {
    return this.request<{ token: string; user: { id: string; email: string } }>('POST', '/v1/bank/login', {
      email,
      password,
    })
  }
}
