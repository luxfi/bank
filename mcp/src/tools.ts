// The bank tool set as data: one entry per tool, each a pure mapping from
// (bank, args) to a result. Kept separate from the MCP wiring so every tool is
// unit-testable against a Bank without a transport, and the server registers
// them uniformly from one list.

import { z } from 'zod'
import type { Bank } from '@luxfi/bank'

// The stored shape is uniform (args typed as the parsed object) so a
// heterogeneous list of tools with different schemas is one array. Authoring
// keeps per-tool arg typing via the generic `t` helper below.
export interface BankTool {
  name: string
  description: string
  inputSchema: z.ZodRawShape
  run: (bank: Bank, args: Record<string, unknown>) => Promise<unknown>
}

function t<A extends z.ZodRawShape>(
  name: string,
  description: string,
  inputSchema: A,
  run: (bank: Bank, args: z.infer<z.ZodObject<A>>) => Promise<unknown>,
): BankTool {
  return { name, description, inputSchema, run: run as BankTool['run'] }
}

const id = z.string().describe('a bank record id')
const minor = z.number().int().describe('amount in minor units (cents for fiat, 6dp for crypto)')
const cur = z.string().describe('ISO 4217 code or crypto ticker')

export const tools: BankTool[] = [
  // Reads
  t('bank_plans', 'List the membership plan ladder (Silver…Sovereign).', {}, (b) => b.plans()),
  t('bank_config', 'Public config: currencies, network, banking-partner disclosure.', {}, (b) => b.config()),
  t('bank_overview', 'The dashboard aggregate: account, balances, wallet, cards, recent activity.', {}, (b) => b.overview()),
  t('bank_accounts', "List the caller's accounts.", {}, (b) => b.accounts()),
  t('bank_transactions', "The caller's transaction stream.", {}, (b) => b.transactions()),
  t('bank_balances', 'Per-currency balances for an account.', { accountId: id }, (b, a) => b.balances(a.accountId)),
  t('bank_wallet', "The caller's crypto wallet and holdings.", {}, (b) => b.wallet()),
  t('bank_crypto_prices', 'Crypto reference prices.', {}, (b) => b.cryptoPrices()),
  t('bank_beneficiaries', "List the caller's payment beneficiaries.", {}, (b) => b.beneficiaries()),
  t('bank_cards', "List the caller's cards.", {}, (b) => b.cards()),

  // Money movement
  t(
    'bank_transfer',
    'Move funds between two accounts the caller owns (instant book transfer).',
    { fromAccountId: id, toAccountId: id, amount: minor, currency: cur, reference: z.string().optional() },
    (b, a) => b.transfer(a.fromAccountId, a.toAccountId, a.amount, a.currency, a.reference),
  ),
  t(
    'bank_pay',
    'Send an outbound payment to a registered beneficiary; the rail is selected downstream.',
    { accountId: id, beneficiaryId: id, amount: minor, currency: cur, reference: z.string().optional() },
    (b, a) => b.pay(a.accountId, a.beneficiaryId, a.amount, a.currency, a.reference),
  ),
  t(
    'bank_create_beneficiary',
    'Register a payment beneficiary.',
    {
      account: id,
      name: z.string(),
      currency: cur,
      country: z.string().optional(),
      accountNumber: z.string().optional(),
      routing: z.string().optional(),
      iban: z.string().optional(),
    },
    (b, a) => b.createBeneficiary(a),
  ),

  // Crypto
  t(
    'bank_send_crypto',
    'Send crypto on-chain from the wallet to an external address (returns a txHash).',
    { asset: cur, amount: minor, toAddress: z.string() },
    (b, a) => b.sendCrypto(a.asset, a.amount, a.toAddress),
  ),

  // Exchange
  t(
    'bank_exchange_quote',
    'Quote a conversion — fiat FX or crypto buy/sell/convert.',
    { fromCurrency: cur, toCurrency: cur, amount: minor },
    (b, a) => b.exchangeQuote(a.fromCurrency, a.toCurrency, a.amount),
  ),
  t(
    'bank_exchange',
    'Execute a conversion and return the updated balances.',
    { fromCurrency: cur, toCurrency: cur, amount: minor },
    (b, a) => b.exchange(a.fromCurrency, a.toCurrency, a.amount),
  ),

  // Cards
  t('bank_issue_card', 'Issue a virtual card (returns the card and a one-time CVV).', { currency: cur.optional() }, (b, a) => b.issueCard(a.currency)),
  t('bank_freeze_card', 'Freeze a card.', { cardId: id }, (b, a) => b.freezeCard(a.cardId)),
  t('bank_unfreeze_card', 'Unfreeze a card.', { cardId: id }, (b, a) => b.unfreezeCard(a.cardId)),

  // Issuer card lifecycle (provider-neutral)
  t('bank_card_account', 'Issuer card-account state: status, KYC, virtualAccount, cards. Branch on status/nextAction.', {}, (b) => b.cardAccount()),
  t('bank_create_virtual_card', 'Create the virtual-card account (start the issuer KYC/consent lifecycle).', {}, (b) => b.createVirtualCard()),
  t('bank_order_virtual_card', 'Order the virtual card once the issuer reports approved / order_card.', {}, (b) => b.orderVirtualCard()),

  // Earn — Liquid Protocol vaults (deposit yield-bearing collateral, borrow the
  // synthetic against it, the yield repays it). deposit/withdraw amounts are in
  // the vault's underlying minor units; borrow/repay are in USD cents.
  t('bank_vaults', 'List the Liquid Protocol vault catalog (collateral, synthetic, APY, max LTV, TVL).', {}, (b) => b.vaults()),
  t('bank_earn_vaults', "The vault catalog with the caller's position folded into each entry (collateral, debt, LTV, self-repay horizon).", {}, (b) => b.earnVaults()),
  t('bank_earn_deposit', 'Deposit collateral into a vault (amount in the underlying asset minor units).', { vault: z.string(), amount: minor }, (b, a) => b.earnDeposit(a.vault, a.amount)),
  t('bank_earn_borrow', 'Borrow the vault synthetic against collateral, up to the max LTV (amount in USD cents).', { vault: z.string(), amount: minor }, (b, a) => b.earnBorrow(a.vault, a.amount)),
  t('bank_earn_repay', 'Repay vault debt (amount in USD cents).', { vault: z.string(), amount: minor }, (b, a) => b.earnRepay(a.vault, a.amount)),
  t('bank_earn_withdraw', 'Withdraw collateral from a vault while it stays sufficiently collateralized (amount in underlying minor units).', { vault: z.string(), amount: minor }, (b, a) => b.earnWithdraw(a.vault, a.amount)),
]
