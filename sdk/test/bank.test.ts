import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Bank, BankError } from '../src/index.ts'

// A fake fetch that records the last call and returns a canned JSON body.
function stub(status = 200, body: unknown = {}) {
  const calls: { url: string; method: string; body: unknown; auth?: string }[] = []
  const fetchFn = (async (url: string, init: RequestInit = {}) => {
    calls.push({
      url: String(url),
      method: init.method ?? 'GET',
      body: init.body ? JSON.parse(String(init.body)) : undefined,
      auth: (init.headers as Record<string, string>)?.['Authorization'],
    })
    return {
      ok: status < 400,
      status,
      json: async () => body,
    } as Response
  }) as unknown as typeof fetch
  return { fetchFn, calls }
}

function bank(status = 200, body: unknown = {}) {
  const s = stub(status, body)
  return { api: new Bank({ baseUrl: 'https://api.x/', token: 'tok', fetch: s.fetchFn }), calls: s.calls }
}

test('baseUrl trailing slash is trimmed and token is sent', async () => {
  const { api, calls } = bank(200, { status: 'ok', sandbox: true })
  await api.health()
  assert.equal(calls[0].url, 'https://api.x/v1/bank/health')
  assert.equal(calls[0].auth, 'Bearer tok')
})

test('token getter is evaluated per request', async () => {
  let t = 'a'
  const s = stub(200, {})
  const api = new Bank({ baseUrl: 'https://api.x', token: () => t, fetch: s.fetchFn })
  await api.plans()
  t = 'b'
  await api.plans()
  assert.equal(s.calls[0].auth, 'Bearer a')
  assert.equal(s.calls[1].auth, 'Bearer b')
})

test('method → path/verb/body contract', async () => {
  const cases: [string, () => Promise<unknown>, string, string, unknown?][] = [
    ['config', (a) => a.config(), 'GET', '/v1/bank/config'],
    ['plans', (a) => a.plans(), 'GET', '/v1/bank/plans'],
    ['overview', (a) => a.overview(), 'GET', '/v1/bank/overview'],
    ['transactions', (a) => a.transactions(), 'GET', '/v1/bank/transactions'],
    ['accounts', (a) => a.accounts(), 'GET', '/v1/bank/account/summary'],
    ['balances', (a) => a.balances('acc 1'), 'GET', '/v1/bank/accounts/acc%201/balances'],
    ['deleteBeneficiary', (a) => a.deleteBeneficiary('b/1'), 'DELETE', '/v1/bank/beneficiaries/b%2F1'],
    ['freezeCard', (a) => a.freezeCard('c1'), 'POST', '/v1/bank/cards/c1/freeze'],
    ['cardKYCURL', (a) => a.cardKYCURL(), 'GET', '/v1/bank/cards/virtual/kyc-url'],
    ['sendCrypto', (a) => a.sendCrypto('ETH', 400000, '0xabc'), 'POST', '/v1/bank/crypto/send'],
  ]
  for (const [, run, method, path] of cases) {
    const { api, calls } = bank()
    await run(api as any)
    assert.equal(calls[0].method, method, `${path} method`)
    assert.equal(calls[0].url, `https://api.x${path}`, `${path} url`)
  }
})

test('path params are encoded so an id cannot traverse', async () => {
  const { api, calls } = bank()
  await api.balances('../admin')
  assert.ok(!calls[0].url.includes('../'), 'dot segments must be encoded')
  assert.equal(calls[0].url, 'https://api.x/v1/bank/accounts/..%2Fadmin/balances')
})

test('transfer/pay positional args map to the body', async () => {
  const { api, calls } = bank()
  await api.transfer('from', 'to', 100, 'USD', 'ref')
  assert.deepEqual(calls[0].body, { fromAccountId: 'from', toAccountId: 'to', amount: 100, currency: 'USD', reference: 'ref' })
  const p = bank()
  await p.api.pay('a', 'b', 50, 'EUR')
  // reference omitted (undefined values are dropped by JSON.stringify).
  assert.deepEqual(p.calls[0].body, { accountId: 'a', beneficiaryId: 'b', amount: 50, currency: 'EUR' })
})

test('issueCard sends {currency} and expects {card, cvv}', async () => {
  const { api, calls } = bank(200, { card: { id: 'c1' }, cvv: '123' })
  const r = await api.issueCard('USD')
  assert.deepEqual(calls[0].body, { currency: 'USD' })
  assert.equal(r.cvv, '123')
  assert.equal(r.card.id, 'c1')
})

test('errors throw BankError with status and body', async () => {
  const { api } = bank(422, { error: 'insufficient balance' })
  await assert.rejects(
    () => api.sendCrypto('ETH', 1, '0x'),
    (e: unknown) => {
      assert.ok(e instanceof BankError)
      assert.equal((e as BankError).status, 422)
      assert.equal((e as BankError).message, 'insufficient balance')
      return true
    },
  )
})
