import { IAM_TOKEN_KEY } from '@/lib/iam'

const BASE_URL = import.meta.env.VITE_BANK_API_URL || ''

// The IAM SDK owns the access token (sessionStorage). The client only reads it.
export function getToken(): string | null {
  try {
    return sessionStorage.getItem(IAM_TOKEN_KEY)
  } catch {
    return null
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  if (res.status === 401 || res.status === 403) {
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || body.error || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// -- Auth --
//
// Sign-in / sign-up are owned entirely by the IAM SDK (@hanzo/iam, OIDC+PKCE
// against lux.id) — see lib/iam.ts. There are no password endpoints here; the
// SDK stores the JWT, which getToken() reads and bankd validates via JWKS.

// onboard provisions the signed-in customer: a multi-currency account, its
// opening balance, and a non-custodial MPC crypto wallet. Idempotent.
export async function onboard(): Promise<{ account: Record<string, unknown>; wallet: Record<string, unknown> }> {
  return request('/v1/bank/onboard', { method: 'POST', body: JSON.stringify({}) })
}


// -- Collection CRUD --

export interface ListResult<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

export interface ListParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: string
  expand?: string
}

function buildQuery(params?: ListParams): string {
  if (!params) return ''
  const parts: string[] = []
  if (params.page) parts.push(`page=${params.page}`)
  if (params.perPage) parts.push(`perPage=${params.perPage}`)
  if (params.sort) parts.push(`sort=${encodeURIComponent(params.sort)}`)
  if (params.filter) parts.push(`filter=${encodeURIComponent(params.filter)}`)
  if (params.expand) parts.push(`expand=${encodeURIComponent(params.expand)}`)
  return parts.length ? `?${parts.join('&')}` : ''
}

export async function listRecords<T = Record<string, unknown>>(
  collection: string,
  params?: ListParams,
): Promise<ListResult<T>> {
  return request(`/v1/collections/${collection}/records${buildQuery(params)}`)
}

export async function getRecord<T = Record<string, unknown>>(
  collection: string,
  id: string,
  expand?: string,
): Promise<T> {
  const q = expand ? `?expand=${encodeURIComponent(expand)}` : ''
  return request(`/v1/collections/${collection}/records/${id}${q}`)
}

export async function createRecord<T = Record<string, unknown>>(
  collection: string,
  data: Record<string, unknown>,
): Promise<T> {
  return request(`/v1/collections/${collection}/records`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateRecord<T = Record<string, unknown>>(
  collection: string,
  id: string,
  data: Record<string, unknown>,
): Promise<T> {
  return request(`/v1/collections/${collection}/records/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteRecord(collection: string, id: string): Promise<void> {
  return request(`/v1/collections/${collection}/records/${id}`, {
    method: 'DELETE',
  })
}

// -- Custom routes --

export async function getBalances(accountId: string) {
  return request<{ currency: string; available: number; held: number }[]>(
    `/v1/bank/accounts/${accountId}/balances`,
  )
}

export async function sendPayment(data: {
  accountId: string
  beneficiaryId: string
  amount: number
  currency: string
  reference: string
}) {
  return request<{ transactionId: string; status: string }>(
    '/v1/bank/payments/outbound',
    { method: 'POST', body: JSON.stringify(data) },
  )
}

export async function createTransfer(data: {
  fromAccountId: string
  toAccountId: string
  amount: number
  currency: string
  reference: string
}) {
  return request<{ debitId: string; creditId: string; status: string }>(
    '/v1/bank/transfers',
    { method: 'POST', body: JSON.stringify(data) },
  )
}

export async function getFXQuote(data: {
  sellCurrency: string
  buyCurrency: string
  amount: number
}) {
  return request<{
    sellCurrency: string
    buyCurrency: string
    sellAmount: number
    buyAmount: number
    rate: number
    quoteId: string
    expiresAt: string
  }>('/v1/bank/fx/quote', { method: 'POST', body: JSON.stringify(data) })
}

export async function executeFX(data: { accountId: string; quoteId: string }) {
  return request<Record<string, unknown>>('/v1/bank/fx/execute', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// -- File upload (for documents) --

export async function uploadFile(
  collection: string,
  id: string,
  field: string,
  file: File,
): Promise<Record<string, unknown>> {
  const form = new FormData()
  form.append(field, file)

  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(
    `${BASE_URL}/v1/collections/${collection}/records/${id}`,
    { method: 'PATCH', headers, body: form },
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Upload failed: ${res.status}`)
  }
  return res.json()
}
