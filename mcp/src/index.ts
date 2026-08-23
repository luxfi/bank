#!/usr/bin/env node
// @luxfi/bank-mcp — an MCP server that gives an agent typed tools over the Lux
// banking API. It is a thin adapter: every tool calls one @luxfi/bank method,
// so the wire contract, types, and auth are the SDK's, not re-implemented here.
//
// Config (env):
//   BANK_API_URL  — API origin (default https://api.sandbox.lux.financial)
//   BANK_TOKEN    — IAM bearer token for the acting principal
//
// The token authorizes every call as one principal — run one server per user.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import { Bank, BankError } from '@luxfi/bank'

const bank = new Bank({
  baseUrl: process.env.BANK_API_URL || 'https://api.sandbox.lux.financial',
  token: () => process.env.BANK_TOKEN,
})

const server = new McpServer({ name: 'luxfi-bank', version: '1.0.0' })

// tool wires one bank call to an MCP tool: the result is returned as JSON text,
// and a BankError becomes an isError result carrying the upstream status —
// never a thrown exception that would drop the connection.
function tool<A extends z.ZodRawShape>(
  name: string,
  description: string,
  inputSchema: A,
  run: (args: z.infer<z.ZodObject<A>>) => Promise<unknown>,
) {
  const cb = async (args: z.infer<z.ZodObject<A>>): Promise<CallToolResult> => {
    try {
      const result = await run(args)
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    } catch (e) {
      const msg = e instanceof BankError ? `bank error ${e.status}: ${e.message}` : String(e)
      return { isError: true, content: [{ type: 'text', text: msg }] }
    }
  }
  // The SDK's registerTool infers its callback type from an internal
  // ZodRawShapeCompat that our generic z.ZodRawShape does not structurally
  // satisfy; the cb above is correctly typed on both ends, so we bridge the
  // generic gap at this one library boundary.
  server.registerTool(name, { description, inputSchema }, cb as Parameters<typeof server.registerTool>[2])
}

const id = z.string().describe('a bank record id')
const minor = z.number().int().describe('amount in minor units (cents for fiat, 6dp for crypto)')

// -- Reads --
tool('bank_plans', 'List the membership plan ladder (Silver…Sovereign).', {}, () => bank.plans())
tool('bank_config', 'Public config: currencies, network, banking-partner disclosure.', {}, () => bank.config())
tool('bank_overview', 'The dashboard aggregate for the caller: account, balances, wallet, cards, recent activity.', {}, () => bank.overview())
tool('bank_accounts', "List the caller's accounts.", {}, () => bank.accounts())
tool('bank_transactions', "The caller's transaction stream.", {}, () => bank.transactions())
tool('bank_balances', 'Per-currency balances for an account.', { accountId: id }, (a) => bank.balances(a.accountId))
tool('bank_wallet', "The caller's crypto wallet and holdings.", {}, () => bank.wallet())
tool('bank_crypto_prices', 'Crypto reference prices.', {}, () => bank.cryptoPrices())
tool('bank_beneficiaries', "List the caller's payment beneficiaries.", {}, () => bank.beneficiaries())
tool('bank_cards', "List the caller's cards.", {}, () => bank.cards())

// -- Money movement --
tool(
  'bank_transfer',
  'Move funds between two accounts the caller owns (instant book transfer).',
  { fromAccountId: id, toAccountId: id, amount: minor, currency: z.string(), reference: z.string().optional() },
  (a) => bank.transfer(a.fromAccountId, a.toAccountId, a.amount, a.currency, a.reference),
)
tool(
  'bank_pay',
  'Send an outbound payment to a registered beneficiary; the rail is selected downstream.',
  { accountId: id, beneficiaryId: id, amount: minor, currency: z.string(), reference: z.string().optional() },
  (a) => bank.pay(a.accountId, a.beneficiaryId, a.amount, a.currency, a.reference),
)
tool(
  'bank_create_beneficiary',
  'Register a payment beneficiary.',
  {
    account: id,
    name: z.string(),
    currency: z.string(),
    country: z.string().optional(),
    accountNumber: z.string().optional(),
    routing: z.string().optional(),
    iban: z.string().optional(),
  },
  (a) => bank.createBeneficiary(a),
)

// -- Crypto --
tool(
  'bank_send_crypto',
  'Send crypto on-chain from the wallet to an external address (returns a txHash).',
  { asset: z.string(), amount: minor, toAddress: z.string() },
  (a) => bank.sendCrypto(a.asset, a.amount, a.toAddress),
)

// -- Exchange --
tool(
  'bank_exchange_quote',
  'Quote a conversion — fiat FX or crypto buy/sell/convert.',
  { fromCurrency: z.string(), toCurrency: z.string(), amount: minor },
  (a) => bank.exchangeQuote(a.fromCurrency, a.toCurrency, a.amount),
)
tool(
  'bank_exchange',
  'Execute a conversion and return the updated balances.',
  { fromCurrency: z.string(), toCurrency: z.string(), amount: minor },
  (a) => bank.exchange(a.fromCurrency, a.toCurrency, a.amount),
)

// -- Cards --
tool('bank_issue_card', 'Issue a virtual card on the account (returns the card and a one-time CVV).', { currency: z.string().optional() }, (a) => bank.issueCard(a.currency))
tool('bank_freeze_card', 'Freeze a card.', { cardId: id }, (a) => bank.freezeCard(a.cardId))
tool('bank_unfreeze_card', 'Unfreeze a card.', { cardId: id }, (a) => bank.unfreezeCard(a.cardId))

// -- Issuer card lifecycle (provider-neutral) --
tool('bank_card_account', 'Issuer card-account state: status, KYC, virtualAccount, cards. Branch on status/nextAction.', {}, () => bank.cardAccount())
tool('bank_create_virtual_card', 'Create the virtual-card account (start the issuer KYC/consent lifecycle).', {}, () => bank.createVirtualCard())
tool('bank_order_virtual_card', 'Order the virtual card once the issuer reports approved / order_card.', {}, () => bank.orderVirtualCard())

async function main() {
  await server.connect(new StdioServerTransport())
}

main().catch((e) => {
  console.error('luxfi-bank-mcp failed to start:', e)
  process.exit(1)
})
