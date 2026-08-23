import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Bank, BankError } from '@luxfi/bank'
import { tools } from '../src/tools.ts'

// A Bank backed by a fake fetch that records the call and returns a canned body.
function mockBank(status = 200, body: unknown = {}) {
  const calls: { url: string; method: string; body: unknown }[] = []
  const fetchFn = (async (url: string, init: RequestInit = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body ? JSON.parse(String(init.body)) : undefined })
    return { ok: status < 400, status, json: async () => body } as Response
  }) as unknown as typeof fetch
  return { bank: new Bank({ baseUrl: 'https://api.x', token: 'tok', fetch: fetchFn }), calls }
}

function find(name: string) {
  const tool = tools.find((t) => t.name === name)
  assert.ok(tool, `tool ${name} exists`)
  return tool!
}

test('the full tool set is present and well-formed', () => {
  assert.equal(tools.length, 22)
  const names = new Set(tools.map((t) => t.name))
  assert.equal(names.size, tools.length, 'names are unique')
  for (const tool of tools) {
    assert.match(tool.name, /^bank_[a-z_]+$/, `${tool.name} is snake_cased`)
    assert.ok(tool.description.length > 10, `${tool.name} has a description`)
    assert.equal(typeof tool.run, 'function')
  }
})

test('read tools call the right endpoint', async () => {
  for (const [name, path] of [
    ['bank_plans', '/v1/bank/plans'],
    ['bank_wallet', '/v1/bank/wallet'],
    ['bank_overview', '/v1/bank/overview'],
    ['bank_cards', '/v1/bank/cards'],
  ] as const) {
    const { bank, calls } = mockBank()
    await find(name).run(bank, {} as never)
    assert.equal(calls[0].url, `https://api.x${path}`, name)
    assert.equal(calls[0].method, 'GET', name)
  }
})

test('bank_transfer maps args to the transfer body', async () => {
  const { bank, calls } = mockBank()
  await find('bank_transfer').run(bank, {
    fromAccountId: 'a', toAccountId: 'b', amount: 5000, currency: 'USD', reference: 'r',
  } as never)
  assert.equal(calls[0].url, 'https://api.x/v1/bank/transfers')
  assert.equal(calls[0].method, 'POST')
  assert.deepEqual(calls[0].body, { fromAccountId: 'a', toAccountId: 'b', amount: 5000, currency: 'USD', reference: 'r' })
})

test('bank_send_crypto posts asset/amount/toAddress', async () => {
  const { bank, calls } = mockBank(200, { txHash: '0xabc' })
  const out = await find('bank_send_crypto').run(bank, { asset: 'ETH', amount: 400000, toAddress: '0xdead' } as never)
  assert.deepEqual(calls[0].body, { asset: 'ETH', amount: 400000, toAddress: '0xdead' })
  assert.equal((out as { txHash: string }).txHash, '0xabc')
})

test('bank_issue_card returns {card, cvv}', async () => {
  const { bank } = mockBank(200, { card: { id: 'c1' }, cvv: '999' })
  const out = (await find('bank_issue_card').run(bank, { currency: 'USD' } as never)) as { cvv: string }
  assert.equal(out.cvv, '999')
})

test('a BankError propagates (the server turns it into an isError result)', async () => {
  const { bank } = mockBank(422, { error: 'insufficient balance' })
  await assert.rejects(
    () => find('bank_send_crypto').run(bank, { asset: 'ETH', amount: 1, toAddress: '0x' } as never),
    (e: unknown) => e instanceof BankError && e.status === 422,
  )
})
