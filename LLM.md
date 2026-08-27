# bank

Hanzo Base-powered banking backend for Lux Financial (`lux.financial`).
Replaced the NestJS/MikroORM v1 (archived at `~/archive/lux-retired-2026-04/bank-v1/`).

## Architecture

Single Go binary (`bankd`) built on `github.com/hanzoai/base`. Base provides:
- Auth (users collection, JWT, OAuth, OTP)
- Auto-generated CRUD REST + Realtime API for every collection
- Admin dashboard UI
- Migration system
- File storage

We add domain-specific collections and hooks on top.

## Collections

| Collection     | Purpose                                        |
|----------------|------------------------------------------------|
| accounts       | Customer accounts (individual / business)      |
| beneficiaries  | Bank transfer recipients linked to accounts    |
| transactions   | Payments, conversions, deposits, withdrawals   |
| fees           | Fee records linked to transactions             |
| sessions       | Login audit trail                              |
| users          | Built-in Base auth collection                  |

## Hooks

- **CurrencyCloud webhooks** (`/v1/bank/webhooks/currencycloud/payment`,
  `/v1/bank/webhooks/currencycloud/conversion`) -- receive payment/conversion
  status updates and sync to transaction records.
- **IFX settlement** (`/v1/bank/webhooks/ifx/settlement`) -- forex settlement
  notifications.
- **Compliance** -- record-level hooks that block transactions on non-KYC
  accounts, prevent beneficiary verification on inactive accounts, and log
  high-risk + status change events.

## Phase 2 (2026-03-31)

Added payment execution, compliance gates, fee calculation, account management,
custom HTTP routes, and scheduled jobs.

### New Collections

| Collection | Purpose |
|------------|---------|
| balances | Multi-currency balance tracking per account (available + held) |
| audit_log | Immutable audit trail for compliance events |

### Hooks

| File | What it does |
|------|-------------|
| hooks/payments.go | Balance validation, status transition enforcement, fund hold/release/credit, forex routing, payment callback webhook |
| hooks/compliance.go | KYC gate, AML screening (> $10k), sanctions check on beneficiary create, PEP screening on account create |
| hooks/fees.go | Tiered fees by entity type (individual/business), volume discounts, conversion spread, flat wire fees |
| hooks/accounts.go | Daily/monthly limit enforcement, account freeze/unfreeze audit trail, balance init on account create |
| hooks/cron.go | Hourly stale transaction expiry (pending > 24h -> failed), daily limit window roll log |
| hooks/currencycloud.go | (Phase 1) CurrencyCloud + IFX webhook handlers |

### Routes (routes.go)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /v1/bank/transfers | JWT | Internal transfer between own accounts |
| POST | /v1/bank/payments/outbound | JWT | Payment to external beneficiary |
| GET | /v1/bank/accounts/{id}/balances | JWT | Multi-currency balance query |
| GET | /v1/bank/accounts/{id}/wallets | JWT | Wallet list per account |
| GET | /v1/bank/accounts/{id}/transactions | JWT | Transaction history |
| POST | /v1/bank/exchange/quote | JWT | Price a conversion — fiat FX and crypto alike |
| POST | /v1/bank/exchange/execute | JWT | Execute the conversion |
| POST | /v1/bank/webhooks/payments/callback | HMAC | Payment status callback from forex service |
| GET | /v1/bank/health | None | Health check |
| GET | /v1/bank/account/summary | JWT | Account summary |
| POST | /v1/bank/cards/account | JWT | Open issuer card account (cardholder profile) |
| GET | /v1/bank/cards/account | JWT | Issuer account state (status, KYC, virtualAccount, cards) |
| GET | /v1/bank/cards/kyc | JWT | Issuer KYC status |
| POST | /v1/bank/cards/virtual | JWT | Create virtual-card account |
| GET | /v1/bank/cards/virtual/kyc-url | JWT | Hosted issuer KYC URL (never log/persist) |
| GET | /v1/bank/cards/virtual/consent-url | JWT | Consent-agreement URL (never log/persist) |
| POST | /v1/bank/cards/virtual/order | JWT | Order the virtual card once approved |

### Issuer abstraction (issuer.go)

`Issuer` is the banking counterparty for card accounts + provider-scoped
KYC/consent + card ordering. Implementations: `sfprivate` (SF Private Bank —
Account Management + Virtual Cards API), `simIssuer` (sandbox, deterministic).
Selection: sandbox mode -> sim; live -> `BANK_ISSUER` (default `sfprivate`;
`banxe` lands when its partner API reference is issued). Env: `SFPRIVATE_URL`,
`SFPRIVATE_API_KEY` (KMS: providers/lux/sfprivate-api-key). Issuer KYC never
substitutes for platform KYC and vice versa.

### Sandbox seed + card PAN (provision.go)

`ProvisionCustomer` is idempotent and self-healing: `ensureWallets` creates one
wallet per `SupportedCrypto` asset and backfills any an existing account lacks,
so upgrading the code fills in per-asset addresses for accounts opened by an
earlier build. `fundSandbox` seeds a believable book (named-merchant card spend,
wires, payroll, FX, a crypto receive) and `seedBeneficiaries` seeds a few
verified recipients so Send opens populated. The Visa test BIN lives in exactly
one place (`cardBIN`); `maskedPAN`/`sandboxPAN` derive the stored mask and the
one-time full number from it, and `POST /cards` returns `pan` once (never
stored — only the mask + last4 persist).

### Earn — Liquid Protocol vaults (liquid.go, collections/vaults.go)

The Liquid Protocol self-repaying-loan layer, folded into the bank. A vault is a
curated market (catalog in `collections.Vaults`, like Plans): deposit a
yield-bearing collateral asset, borrow the vault's synthetic x-token against it
up to `MaxLTV`, and the collateral yield (APY) repays the debt. Money moves
through the same transaction ledger as everything else (a settled `earn`-type
transaction, so it validates debits against live balances and shows in Activity,
carrying no wire fee and no forex routing); the `positions` collection (one per
account per vault: collateral in underlying minor units, debt in USD cents) is
the vault-specific state. `earnAction` is the one handler behind all four verbs
(deposit/borrow/repay/withdraw) — it enforces the LTV ceiling on borrow and the
collateralization floor on withdraw. Sandbox settles instantly; a real on-chain
Liquid backend drops in behind these routes unchanged.

Routes: public `GET /v1/bank/vaults` (catalog, like /plans); authed
`GET /v1/bank/earn/vaults` (catalog + the caller's positions folded in),
`POST /v1/bank/earn/{deposit,borrow,repay,withdraw}`. The overview carries an
`earn` summary (collateralUsd, debt, netUsd, yieldUsdYear, positions, netApy).

### Chain backend (chain.go, evmchain.go, evmmarket.go)

`ChainBackend` is the on-chain half of the wallet — the same seam shape as
`Issuer` and `FXProvider`. `Network()`, `Assets()` (asset → token contract, empty
for the chain's own coin), `Address(seed, asset)`, `Valid(asset, addr)`,
`Balance(seed, asset)`, `Send(seed, asset, to, amount)`, `Market(asset)`.

`chain()` picks one of three:

- **`evmChain`** (evmchain.go) — a real EVM, selected when `BANK_CHAIN_RPC` is
  set. Keys are derived from the deploy mnemonic at `m/9000'/<networkId>'/<envId>'/<index>`;
  `Send` signs a DynamicFeeTx, broadcasts, and waits for the receipt before
  returning a hash. Balances are read from the chain.
- **`simChain`** — the sandbox. Deterministic display addresses (real bech32
  checksum so a BTC address passes `validAddress`), random hashes, no broadcast.
  Still the default: the demo has to run with nothing configured.
- **`offChain`** — configured but unreachable. Every operation fails. This case
  must never fall through to `simChain`, which would answer a send with a
  receipt for a transfer that never happened.

**One address, many assets.** On a real EVM an account has a single address that
receives the native coin and every token; per-asset addresses were a sandbox
artifact of pretending each asset had its own chain. The wallet rows stay
per-asset (the row carries network + status), but on `evmChain` they all hold the
same address, and `Assets()` is what distinguishes native from token.

**`accounts.chainIndex`** is the account's derivation index, assigned once and
stored. Index 0 is the bank's treasury, which funds customers' gas; accounts
start at 1. Hashing an account id into an index instead would collide inside
2^31 well before a million accounts, and a collision means two customers share
an address.

Addresses are verified on load: `symbol()` is read from each recorded contract
before it is trusted, because deployment-order addresses are not unique across
chains (the same address holds LETH on Lux 96369 and ZETH on Zoo 200200).

#### Per-chain configuration

| Env | Purpose |
|-----|---------|
| `BANK_CHAIN_RPC` | EVM endpoint. Its presence selects the real backend. |
| `BANK_CHAIN_MNEMONIC` | BIP-39 deploy mnemonic. Dev only — production reads `providers/<org>/deploy-mnemonic` from KMS. Never logged. |
| `BANK_CHAIN_NETWORK` | Display name (`lux-local`, `lux-mainnet`, …). |
| `BANK_CHAIN_NETWORK_ID` / `BANK_CHAIN_ENV_ID` | Lux primary network and env for the derivation path. |
| `BANK_CHAIN_DEPLOY` | Directory of `<chainId>.json` address books (default `chain/deploy`). |

The chain id comes from the RPC, and the address book is looked up by it, so Lux,
Zoo and Hanzo are separate deployment files rather than separate code paths.

#### Earn on chain (evmmarket.go)

`Market` is one collateral asset's lending market: `Deposit`, `Borrow`, `Repay`,
`Withdraw`, `Position`. When `chain().Market(vault.Underlying)` returns one,
`earnAction` hands the movement to it and records what the chain did; otherwise
Earn stays on the ledger. The borrow ceiling is enforced by the contract —
`Undercollateralized` becomes the same 422 the ledger path returns.

Positions carry `tokenId`, the position NFT. It settles what the numbers beside
it mean: an on-chain position is **like-kind** (debt is the collateral's own
synthetic), so its LTV is debt/collateral with no price in it, while a ledger
position still counts debt in USD cents.

### On-chain deployment (chain/)

A foundry project that wires two canonical repos together: tokens from
`luxfi/standard`, the self-repaying-loan protocol from `luxfi/liquid`, reached
through `chain/lib/{standard,liquid}` symlinks. Those point at checkouts, so what
gets pinned is the source and not a tag: `chain/pins` holds a hash over the
content of every `.sol` file in each step's import closure, and `deploy.sh`
recomputes it and stops before broadcasting anything if upstream has moved.
Changing a line in `pins` changes the deployed contracts — drive the markets
against the new upstream before writing it down.

Two contracts are defined here, both because this deployment's shape has no
expression upstream:

- `script/protocol/Index.sol` — the price feed of a like-kind market. The engine
  binds an adapter only if it reports the market's own pair, and
  `SecurityTokenAdapter` gives one address to both halves of that pair while
  `EulerUSDCAdapter` reads its price out of an ERC-4626 vault, which bridged ETH
  and wrapped LUX are not. `Index` reports collateral priced in its own
  synthetic, opening at parity and rising as yield accrues. It cannot fall: both
  sides of a like-kind position are the same asset, so an external price move
  takes them together and leaves the ratio alone. Nothing the oracle does can
  make a position liquidatable.
- `script/protocol/Regent.sol` — a market's admin for the one transaction that
  builds it. The position NFT and the fee vault both need the market's own
  address, so they are set after it exists, by its admin; and the engine and the
  transmuter both hand authority on by nomination, which the nominee has to
  accept. A deploy key that nominates a multisig stays admin until the multisig
  signs. The `Regent` does the wiring inside its constructor and declares no
  other function, so the authority it holds is real and unreachable, and the
  deploy key never has it.

The two repos disagree on solc — standard pins `^0.8.31`, liquid pins `0.8.28` —
so the deploy is three steps, each compiling under the pragma of the repo it
deploys from, handing addresses on through JSON. No contract is ever re-declared
to bridge the gap.

| Step | solc | Deploys |
|------|------|---------|
| `script/tokens` | 0.8.31 | WLUX, BridgedETH, BridgedBTC; LLUX/LETH/LBTC synthetics |
| `script/protocol` | 0.8.28 | One `Liquid` market per collateral, + `Index`, `Regent`, transmuter, position NFT, fee vault |
| `script/grants` | 0.8.31 | Mint rights on each synthetic, then the synthetics' handover |

```bash
cd chain && RPC=http://127.0.0.1:8645 PRIVATE_KEY=0x… OWNER=0x… ORACLE=0x… ./deploy.sh
```

Output is `chain/deploy/<chainId>.json`, keyed by chain so Lux, Zoo and Hanzo
each get their own and the bank resolves by the id its RPC reports. That is the
one address book per chain, and it carries the source digests it was built from.

**The deploy key signs and owns nothing.** `OWNER` — a multisig — ends up holding
the protocol. `ORACLE` ends up holding one thing, each market's yield index, and
can only raise it. Every step re-reads the chain before it exits and fails the run
if any of this is untrue:

| Contract | owner | oracle | deploy key |
|----------|-------|--------|------------|
| `Liquid` | nominated admin, protocol fees | — | nothing, and not a guardian |
| `LiquidTransmuter` | nominated admin, fees | — | nothing |
| `LiquidTokenVault` | owner, authorized | — | not authorized |
| `Index` | — | may raise the index | nothing |
| `LiquidToken` (synthetic) | ADMIN, SENTINEL, flash fees | — | no role, not whitelisted |
| `LRC20B` (bridged) | owner, DEFAULT_ADMIN, MINTER | — | no role |

Between the deploy and the owner's `acceptAdmin`, each market's admin is its
`Regent` — an address that holds the role and cannot use it.

Nothing mints synthetic outside a market. A fee-vault float would be synthetic
that `totalSyntheticsIssued` never counted, and the transmuter decrements that
figure as holders redeem, so a supply the engine does not know about is one its
own arithmetic underflows on. The liquidation bonus is a courtesy the engine
skips when the vault is empty, not a precondition; the owner funds the vault from
real synthetic through its `deposit`.

**Two asset tiers, not interchangeable.** Collateral is the bridged tier —
`BridgedETH` (symbol `ETH`), `BridgedBTC` (symbol `BTC`, **8 decimals**), and WLUX
wrapping the native coin. Debt is the liquid tier, one synthetic per collateral.
The bridged tier can only be minted by `OWNER`, so a chain that means its
collateral to be real runs with `BRIDGE_FLOAT=0` and waits for the bridge.

**Every market is like-kind**: `yieldToken` is the collateral and both `debtToken`
and `underlyingToken` are that same asset's synthetic, priced at parity by
`Index` and rising only with yield. That is what makes 90% a safe ceiling — a
price move changes both sides at once and cannot move the ratio. `Liquid` does
**not** enforce this; it takes three unrelated addresses and trusts the adapter,
so a dollar-denominated debt against volatile collateral is constructible. The
invariant lives in the deploy script, not the protocol.

Settings that differ from the protocol repo's own scripts, each deliberately:

- `minimumCollateralization = 1e36/9e17` — 90% exactly. Their `1.1111e18` is
  90.0009%.
- `globalMinimumCollateralization` **below** `minimumCollateralization`. Above it
  (their 1.15e18) a fully drawn protocol sits permanently in the bad-debt branch
  and every liquidation takes it.
- `maxPriceDeviation = 1` BPS per block. Zero pins the price where it was
  initialized and no yield ever reaches a borrower; one is the tightest rate the
  parameter can express and still four orders of magnitude looser than a real
  index needs — a 20% year against `blocksPerYear` is 0.00013 BPS a block.
- Transmuter fees in **basis points** (50/200). Theirs are written as 1e18 fixed
  point against a `BPS` divisor, inflating them 1e14× and leaving redemptions
  unclaimable.
- Yul optimizer **on**. Liquid's own `yul = false` yields 30,893 bytes, past
  EIP-170; with Yul it lands at 21,550 and can reach a real chain.
- Init calldata rides in the `ERC1967Proxy` constructor — `initialize` is
  unpermissioned, so a separate second transaction is a window to claim admin.

### Membership plans (collections/plans.go)

One published ladder — Silver $29 / Gold $99 / Black $299 / Sovereign $999
(minor units in code), served by public `GET /v1/bank/plans` and rendered by
the dash Landing and lux.credit (static mirror in lux-apps/credit
src/content/plans.ts — update together). Accounts carry an optional `plan`
select; when set it overrides entity-type limits in hooks/accounts.go.
Surfaces: lux.finance = B2C (bank-dash), app.lux.financial = platform,
sandbox.lux.financial = demo, lux.credit = card marketing/signup funnel.

### External Services (env vars)

| Env Var | Purpose |
|---------|---------|
| FOREX_SERVICE_URL | Outbound payment routing + FX quotes/execution |
| COMPLIANCE_SERVICE_URL | AML screening, sanctions, PEP checks |

### Fee Schedule

| Entity Type | Rate (bp) | Wire Fee (flat) | Conversion Spread |
|-------------|-----------|-----------------|-------------------|
| individual | 50bp (0.50%) | $25 | 25bp (0.25%) |
| business | 30bp (0.30%) | $25 | 25bp (0.25%) |

Volume discounts: >$100k/mo = -5bp, >$500k/mo = -10bp, >$1M/mo = -15bp.

### Account Limits

| Entity Type | Daily | Monthly |
|-------------|-------|---------|
| individual | $50,000 | $500,000 |
| business | $500,000 | $5,000,000 |

### Status Transition Rules

```
pending -> processing -> completed
pending -> failed
pending -> cancelled
processing -> failed
processing -> cancelled
```

All other transitions are rejected.

### Balance Lifecycle (debit)

1. OnCreate (pre): validate available >= amount AND hold funds (atomic via RunInTransaction)
2. On completion: held -= amount (funds already left)
3. On failure/cancel: available += amount, held -= amount (reverse hold)
4. Floor check: updateBalance rejects writes that would make available < 0

### Balance Lifecycle (credit)

1. On completion: available += amount (creates balance record if new currency)

## Auth — Lux ID, and nothing else

Base v1.5.72 removed the `_superusers` local-token fallback, deliberately: one
process serves many orgs' Bases, and a second independently-keyed door to
schema, settings, backups and logs is one more than can be reasoned about.

The sandbox login was that door. It kept a bcrypt hash in its own collection and
minted a `_superusers` token, and until that release Base honoured such a token
as a fallback. After it, the route answered 200 with a token and the very next
request answered 401 — a login that succeeds and authenticates nothing. It was
also the custom auth this estate does not build.

Gone: `login.go`, the credentials collection, the token minting, the demo
password that was a constant in a file every browser downloads, and the merged
hook shape that let one path stand in for the other. The SPA already had the
PKCE flow, in `pages/Login.tsx`, `pages/Callback.tsx` and `lib/iam.ts`.

**`z@lux.financial` must exist in Lux IAM under org `lux`, app `lux-bank`.** The
demo cannot sign in until it does. That is an IAM seeding task following the same
convention every other surface uses, not a code one.

The test suite cannot see this class of break: `newBankApp` never registers the
org plugin, so every authed route passes in tests while the real binary refuses.
A change to the auth path has to be exercised against a running bankd.

## Money is typed

`Cents` and `Minor` are distinct types (money.go). Cents is US dollars in
hundredths; Minor is one asset's smallest unit at the ledger's resolution, which
is not the token's resolution on chain. The only crossing is `usd()`, which needs
a price — which is why it should be the only one.

They were both `int64` with the unit in a comment, and comments do not typecheck:
a debt in cents was subtracted from a balance in an asset's own units and a +$340
vault position rendered as −$5,600. `money[T]` reads a whole amount off a record
and rounds once, rather than at the thirty call sites that each had to remember.

## A collection whose name equals its own id cannot be updated

Base's `checkUniqueName` looks up a collection whose id equals the new name and
does not exclude the one being saved, so every collection built as
`NewBaseCollection(name, name)` — which is all of them — was creatable once and
never updatable. A schema addition failed a running bank at startup. Fixed
upstream in base v1.5.72; the workaround it replaced was `SaveNoValidate` on the
upgrade path, where nothing changes a name.

## Custody — where it is going

Lux holds nothing. Every layer has a holder, and none of them is us.

| Layer | Who holds it | How |
|-------|--------------|-----|
| Fiat | SF Private Bank | the BaaS relationship already in the footer |
| Custodial crypto | a crypto-native custodian (Alpaca or equivalent) | custody as a service |
| On-chain signatures | the customer | Safe, native — `standard/contracts/safe`, incl. `pq/PQSigner.sol` |
| Threshold signing | the customer | their own MPC nodes, launched and run from lux.cloud / zoo.cloud |
| Bridge wallets on other chains | M-Chain validators | t-of-n threshold on the primary network |
| Bridge operations | B-Chain | native VM on the primary network |

Two things this settles that a diagram does not.

**Threshold is not custody-free by itself.** An operator holding every share of a
t-of-n key is a custodian with extra steps, and the definition the interface
relief uses says so — self-custodial means the provider has neither custody of
**nor access to** the key. Shares we can combine without the customer are access.
What makes the MPC layer honest here is that the customer runs the nodes; we do
not hold a share to combine.

**Non-custodial is about the HOLDER authority, not all of them.** `Authority.sol`
in `luxfi/standard` separates HOLDER from REGISTER, and REGISTER is what a
transfer agent needs: correction, freeze, reissue, court order, lost-key
recovery, estates. A register authority never holds a key — it corrects the
record. Giving that up is not what non-custodial means, and giving it up would
delete the transfer-agency product rather than strengthen it.

### What that means for this codebase

`chainSeed` (provision.go:122) hands an account's derivation index to
`evmChain.key`, which walks the deploy mnemonic and returns a private key the
bank holds. That is the custody, and it is reached from exactly two places:
`crypto.go:186` (send) and `liquid.go:315` (earn). Those are the seams to move.

The shape to copy is `Issuer` (issuer.go): a provider-neutral interface, a
sandbox implementation, and one env-selected constructor. A `Custodian` follows
it — but `seed` does not survive the move. A custodian is asked for a customer's
address and asked to sign for that customer; it is never handed a derivation
index, because the index only means something to whoever holds the mnemonic.

The split that falls out: money the bank holds for a customer sits with the
custodian, and anything that signs on chain — a vault deposit, a swap — is the
customer's own Safe. The bank keeps the ledger and the interface. It stops
keeping keys.

`evmChain` does not disappear. The treasury is the bank's own money and stays the
bank's own key, and reading chain state needs no custody at all.

## Custody — what it is today

`chainSeed` assigns an account its stored `chainIndex`; `evmChain.key` turns that
into a private key; `derive` walks `m/9000'/<networkId>'/<envId>'/<branch>'/<index>'`
from `BANK_CHAIN_MNEMONIC`. Branch 0 is the customer, branch 1 the treasury,
which funds customers' gas. Only `handleCryptoSend` and `earnOnChain` reach a
key, and both hand `chainSeed` to a backend that signs. There is no connect-wallet
path.

So this is a custodial bank, and the landing page's claim of a "non-custodial
wallet" and "non-custodial vaults" was false — those being the terms the April
2026 interface relief is defined around. `components/Custody.tsx` states the one
mechanical fact, who signs, and sits where the customer commits.

Custody is a layer, not a platform property. The investor layer is who holds the
signing key — here, the bank. The underlying asset layer is where the asset
actually sits, and the wallet's `ETH` and `BTC` are **bridged** tokens
(`BridgedETH`/`BridgedBTC` per `chain/deploy/96369.json`), so a holder has a
claim on bridge backing rather than the asset. No screen says that yet, and who
backs the bridge is not established anywhere. See COMPLIANCE.md.

## The dash is also a library

`app/dash` builds twice: the app, and `@luxfi/bank-dash` (`vite.lib.config.ts`,
`src/index.ts`, `src/Finance.tsx`). lux.finance renders it whole; the Lux Cloud
console renders the same screens beside a validator's nodes and keys.

`bankd` validates a bearer at IAM's `userinfo` and checks no audience, so a
console session already authorizes the bank — no second sign-in, no exchange.

Four things a host needs that the app got for free, all now carried by `Finance`:
the layout runtime's theme (`GuiRoot`), the brand tokens, the account
(`OverviewProvider`), and the gate that waits for it (`Ready`, shared with
`Layout`). The library defines `process.env` at build time because the runtime
reads it unguarded thirty times, ships no typeface (they were 205 of 219 kB), and
does not rename its host's tab — `label()` is called by the app, not at import.

## On-chain money paths — what an adversarial pass found

An adversarial review of the EVM integration produced two findings that moved
real money on a live chain, and both are now guarded by tests that fail if the
shape ever comes back (`red_attack_test.go`).

**The ledger reserves, then the chain moves.** A send used to broadcast first
and check the balance afterwards, so a customer holding one micro-LUX could ask
for any amount, watch it settle on chain, and then be told "insufficient
balance" for money already gone. Worse, gas funding counted the transfer's own
`value` as part of the shortfall and covered *twice* it out of the treasury — so
the bank financed the theft, and held no record of any of it. The order is now
`newTx` (which holds the funds and runs the limit checks) → broadcast →
`settle`, with `release` returning the hold if the chain refuses. `fund` covers
gas and only gas: what a customer can send is what a customer holds.

`release` is `settle`'s counterpart in sandbox.go — exactly one of the two must
run for every pending debit. `newTx` returns a freshly reloaded record, because
the instance it used to return carried its pre-create snapshot as `Original()`
and amending it looked to the status guard like a move out of nothing.

**Every step of a bank key's path is hardened.** BIP-32's CKDpriv for an
unhardened index is `k_i = IL + k_par (mod n)` with `IL` computed from the
parent's *public* key and chain code — so one leaked customer key plus an xpub
(not secret material by design; it is what a watch-only service holds) solved
for the parent and from there every sibling. The treasury sat at index 0 among
those siblings. Hardening feeds `ser256(k_par)` into the HMAC instead, leaving
nothing to subtract, and the treasury moved off the customer branch entirely:

    m/9000'/<networkId>'/<envId>'/<branch>'/<index>'
    branch 0 = customer, branch 1 = treasury

The treasury is not account zero — it shares no number space with the accounts
it funds, so no arithmetic on an account index arrives at it.

**One key, one nonce sequence.** Every customer short of gas routes through the
treasury key, and two concurrent top-ups read the same pending nonce — the
second is rejected as a replacement. Treasury spending is serialized (`spend`),
and re-reads the balance under the lock, since the top-up a caller queued behind
may already have covered it. Customers' own sends are unaffected: separate keys.

**Units are per token, not per market.** `toMinor` returns an error rather than
wrapping `Int64`, `scale` divides for tokens with fewer decimals than the ledger
(`big.Int.Exp` with a negative exponent silently returns 1), and each Earn verb
scales by the token that denominates *its* amount — deposit and withdraw move
the collateral, mint and burn move the synthetic, and 8dp bridged BTC against an
18dp synthetic differ by 1e10.

**A configured chain that is unreachable refuses; it never falls back to the
simulation.** The dial backoff is keyed by endpoint, so a failure at one address
no longer suppresses a good dial at another.

## Where money went quiet — a second pass

Five defects, each of which failed by doing nothing rather than by erroring, so
none of them appeared in a status code or a failing test. All are guarded now,
and every guard was checked by breaking the code it watches.

**An unreachable chain used to book an Earn movement on the ledger.** A market
lookup comes back empty two ways: this chain carries no market for this asset,
which is a property of the deployment and means Earn was always going to be a
ledger loan; and this chain cannot be reached, which is an outage. Both answered
nil, and the caller reads nil as the first — so during an outage deposit and
borrow returned **200** and the movement went onto the bank's own books. A borrow
credited against collateral no chain was holding, sized from a position the chain
overwrites the moment it returns, with real money paid out in between. Bank
custody is only chosen when a chain is configured, so having nothing to ask can
only mean an outage; `deriving.Market` refuses now, as `Send` already did.

**A credit whose balance row could not be written was committed anyway.**
`createBalance` runs inside the settlement's transaction and discarded its error,
and the caller returned nil regardless. The ledger recorded money arriving, no
balance carried it, and nothing said so. Related, and the reason it never fired
in practice: a required number field refuses its zero value, so `held` and
`available` must not be `Required` — a balance opens at zero.

**No payment has ever been charged a fee.** A fee row's type is a closed
vocabulary the collection enforces (`FeeTypes`, now written down once). The
schedule built its own name — the rail's, plus `_fee` — and seven of the eight
rails spell something the collection rejects, so every payment fee was refused on
save with only a log line. The name was `swift_fee` because no caller passes a
rail and the schedule defaulted to one; that default also priced the charge, so a
$100.00 payment came to $35.50 for a network it never used. A rail's flat cost
joins the service fee when a caller knows the rail, rather than renaming it: what
a charge IS and which network carried it are two facts.

**Sanctions and AML screening passed everything when unconfigured.** Both are
declared fail-closed and the policy held for every failure except the likeliest —
`COMPLIANCE_SERVICE_URL` simply not being set, which made `screen` return nil.
The sandbox has no screener and wants none, so the distinction is one the
deployment already makes: `BANK_SANDBOX` defaults to on, and turning it off says
this is real. `bankd` asks before it mounts anything and refuses to start
otherwise. A log line about missing sanctions screening is a log line nobody
reads.

**A notification quoted the stored number.** Amounts are minor units everywhere,
so a $250.00 transfer told the customer it was 25000, and a whole bitcoin told
them 1000000. `collections.Format` renders one, in integer arithmetic, beside the
function that already knows how many decimal places a currency has.

**The revert selectors are checked against the contract that emits them.** A
reverted call arrives as four bytes, and which four decides whether a customer is
told the LTV ceiling refused their borrow or handed an opaque RPC error. All
eight were correct, including the two a plausible guess gets wrong —
`BurnLimitExceeded` carries `(amount, available)`, and the error is really named
`UnauthorizedAccountAccessError`. The test recomputes each from the signature it
claims to be, so the table cannot drift from `luxfi/liquid`.

### Two writes that are one act

Four money paths wrote a movement and the thing it changes as separate saves,
with a return between them. Each is the same defect and each cost somebody a
different way; all four are one transaction now. Nesting is safe as long as
everything inside uses the callback's app, so the balance hooks join the
caller's transaction rather than opening their own.

- **A transfer** saved the debit, then the credit. KYC is checked on every
  transaction rather than only outbound ones, so sending to your own account
  while it is still in review left the debit standing and holding the sender's
  money against a movement they had already been told failed.
- **A conversion** settled the sold leg before the bought leg existed. Anything
  refusing the credit left the money spent and nothing bought, recorded as a
  completed transaction the stale sweep will never revisit.
- **An Earn movement** settled, then saved the position. A position that failed
  to write meant a deposit debited without crediting the collateral, a borrow
  paid out without recording the debt, a repayment taken without reducing it.
- **A new wallet's status** was set after `e.Next()`, which IS the write, so the
  default lived on the instance in hand and the row kept the empty string. Every
  reader after the creator, the customer's own wallet list included, saw a wallet
  with no status.

**The on-chain paths are deliberately not this.** A broadcast cannot sit inside
a database transaction, and rolling one back does not un-send it. They reserve,
move, then settle, releasing the hold if the chain refuses — which leaves one
window, the process restarting between the broadcast and the settle, and that is
what the sweep below is careful about.

### A timeout is not a verdict

Failing a debit returns the funds it held, so the stale sweep meeting a send
that had reached the chain refunded a customer who already holds the coins. A
send that never reached the chain releases its own hold on the way out, so what
is still pending has been broadcast or cannot be told apart from one that was.
Neither is the ledger's to decide by clock. Those rows stay pending and are
logged for reconciling; the sweep goes on timing out the movements the ledger
performed itself.

### A membership raises, never lowers

The tier replaced the entity-type limits instead of raising them, so the entry
tier cut an individual from $50,000 a day to $10,000 — paying made you worse off
than never subscribing. Nothing sets a plan today (the ladder is served to the
landing page and no route puts an account on one), so nobody has been caught by
it. The baseline is what an account has before it buys anything.

Worth knowing for pricing: with the baseline at $50k/$500k for an individual,
silver and gold buy no additional headroom. That is a catalogue question, not a
code one.

### What the tests cannot reach

Every chain test skips without `BANK_CHAIN_RPC`, including the eight adversarial
`TestRed*` ones — so treasury drain, nonce sharing and unverified market
addresses are guarded by tests that never run in CI. Coverage is **83% of the
code that does not need a chain**, and 25% of the code that does; the whole-repo
figure is ~71% and cannot rise much further without a deployed protocol in CI.
That is the single highest-value gap left.

`BANK_CHAIN_DEPLOY` points at the address book, so a bare chain can be reached
without `chain/deploy.sh`: with anvil on 8645 and a `{"chainId":31337,
"tokens":{},"markets":{}}` file, derivation and a real value transfer both pass
against a live EVM. Everything past that needs the protocol.

### What running the adversarial suite found

Every chain test skipped for want of a chain, so the fifteen `TestRed*` ones had
never executed. Against a deployed protocol, four failed and one was a real bug.

**A customer could never empty their wallet.** The treasury pays gas, and the
check for whether it needed to asked only whether the sender could cover the
FEE. An account holding exactly what it wanted to send passed that check, was
funded nothing, and then could not send — the chain wants the value and the fee.
What the sender must end up holding is both, so that is what is asked for; the
value stays theirs to hold, the top-up is bounded by the fee, and a larger
shortfall is left to the chain to refuse. It reproduces only where the sender has
no prior balance, which is why it survived: a second run funds the account enough
to hide it.

The other three failures were stale rather than findings, and all are guards now.
**A red-team test that demonstrates an exploit has to be inverted when the fix
lands** — otherwise it fails forever and gets read as noise, or deleted. The
drain test asserted value reached the sink; it asserts the refusal arrives with
the chain untouched. The LUX vault test asserted a customer's coin could not be
deposited; the market wraps on the way in. The receipt test asserted one response
carried two network names; both read the backend.

Two things about writing tests against a chain that outlives them. An account
index is derived from the mnemonic, so every test whose account is index 1 shares
one address, one position and each other's leftovers — take an index of your own.
And a position left open is read by the next run as its own, so unwind what you
find as well as what you leave, re-reading between the repay and the withdraw
because repaying moves the collateral.

### Running the chain suite locally

The whole protocol deploys onto a local anvil in about a minute, and the suite
then runs against it — every skip disappears, the adversarial ones included.

    anvil --port 8645 --chain-id 31337 --silent &
    cd chain && RPC=http://127.0.0.1:8645 \
      PRIVATE_KEY=<anvil account 0> \
      OWNER=<anvil account 1> ORACLE=<anvil account 2> ./deploy.sh
    BANK_CHAIN_RPC=http://127.0.0.1:8645 \
      BANK_CHAIN_DEPLOY=chain/deploy \
      BANK_CHAIN_MNEMONIC="test test test test test test test test test test test junk" \
      go test -run 'TestChain|TestRed|TestMarket' ./ -timeout 900s

**Select the chain tests; do not run the whole suite this way.** Most of the
suite is written against the simulation, and configuring a chain moves the same
routes onto it — an Earn verb goes to the market instead of the ledger, a send
needs a chain balance the seeded account has never had, and the wallet names
the configured network rather than the sandbox one. Those tests fail for
disagreeing with the environment, not for finding anything.

Two things that stop it, both deliberate. `OWNER` may not be the deploy key —
the deployer signs and owns nothing when it returns. And `pins` is a hash over
the import closure of each step, so upstream moving is a refusal rather than a
surprise: `deploy.sh` prints the digest it found, and the market checks
(deposit, borrow, repay, withdraw against the new upstream) are what earn the
right to write it down.

To run against upstream you have not pinned yet, copy `chain/` somewhere else
and repin there — never edit `pins` to make a deploy go through.

It is also far slower with a chain configured — every app that comes up dials
it — so give `go test` a `-timeout` that allows for it, or the panic names
whichever test happened to be running and tells you nothing.

## Security Hardening (2026-03-31)

### API Rules (F01)
All collections have explicit API rules set. `nil` = superuser only.
- `balances`, `audit_log`, `fees`: all rules nil (superuser only)
- `accounts`: list/view = `owner = @request.auth.id`
- `beneficiaries`: list/view = `account.owner = @request.auth.id`
- `transactions`: list/view = `account.owner = @request.auth.id`
- `sessions`: list/view = `user = @request.auth.id`
- All create/update/delete = nil (superuser only; mutations via custom routes/hooks)

### Webhook HMAC Auth (F02)
All webhook routes (`/v1/bank/webhooks/*`) now use HMAC-SHA256 signature validation
instead of RequireSuperuserAuth. Secret from `WEBHOOK_HMAC_SECRET` env var (KMS).
Validates `X-Signature` header = hex(HMAC-SHA256(secret, body)).

### Audit Immutability (F04)
`audit_log` collection blocks all update and delete operations via hooks
(RegisterAuditHooks in hooks/audit.go, registered in main.go).

### Balance Atomicity (F03)
Balance check + hold is wrapped in `app.RunInTransaction()` in the pre-create
hook. Prevents race conditions between concurrent debit requests.

### Transfer Ownership (F08)
`handleTransfer()` now verifies the destination account is owned by the caller
(both source and destination must belong to `e.Auth.Id`).

### Float Rounding (F05)
All `int64(record.GetFloat(...))` casts now use `math.Round()` to prevent
truncation errors on floating-point amounts.

### Filter Queries (F09)
- getDailySpent: `@todayStart` is a Base built-in macro, no param needed
- getMonthlySpent: computed `time.Now().AddDate(0,0,-30)` as param value
- getMonthlyVolume (fees.go): same fix as getMonthlySpent

### Env Vars

| Env Var | Purpose |
|---------|---------|
| WEBHOOK_HMAC_SECRET | HMAC key for webhook signature validation (from KMS) |

## Running

```bash
go run ./cmd/bankd     # dev mode, port 8070
go run ./cmd/bankd serve --http 0.0.0.0:8070
```

## Docker

```bash
docker compose up      # builds and runs on port 8070
```

## Port

8070 (matches the existing bank service port mapping in k8s).

## Deploy

Built by platform.hanzo.ai from the root `hanzo.yml` on a push to git.hanzo.ai,
delivered by cd.hanzo.ai onto `do-sfo3-lux-k8s/lux-bank`: `bankd` + `bank-dash`
(app.lux.financial) and `bankd-sandbox` + `bank-dash-sandbox`
(sandbox.lux.financial) advance off the two images `ghcr.io/luxfi/bank` and
`ghcr.io/luxfi/bank-dash`. The cluster is linux/amd64 (DOKS has no arm64), so
images build on the amd64 CI runners, never locally on an arm64 box.

Both images are verified to build AND run: `docker build .` (bankd) and
`docker build app/dash` (bank-dash) complete, and the two containers wired
together serve the app end to end (dashd proxies `/v1` to bankd via
`BANK_UPSTREAM`). Both `hanzo.yml` gates pass: bankd `CGO_ENABLED=0 go test`,
dash `pnpm install --frozen-lockfile` + `tsc --noEmit` + `pnpm build`.

Build invariants (each was a real breaker, now fixed — keep them):
- bankd links Base with `CGO_ENABLED=0` (pure-Go SQLite with math functions);
  `CGO_ENABLED=1` makes bankd exit at startup.
- `app/dash/Dockerfile` copies `.npmrc` before `pnpm install` (the @hanzo/gui
  umbrella needs `node-linker=hoisted` at install).
- `app/dash` depends on the published `@luxfi/bank`, not `file:` — the Docker
  context is `app/dash`, so a sibling `file:` path can't resolve.

### Self-hosting

Any host with Docker runs the whole stack from the published images:

```bash
docker login ghcr.io          # the images are private
docker compose pull && docker compose up -d
```

`compose.yml` keeps bankd off the host network — the dash is the only published
port (`PORT`, default 3000) and proxies `/v1` to bankd over the compose network.
bankd's SQLite lives in the `bank-data` volume; deleting that volume reseeds a
pristine demo on the next start. `TAG` selects the image tag (default `main`),
`BANK_SANDBOX` the mode.

The e2e suite doubles as the deployment smoke test:

```bash
cd app/dash && DASH_URL=http://<host>:3000 pnpm test:e2e
```

To roll a new build the control plane must have `DEPLOY_ENGINE_ENABLED=true` and
the amd64 CI wired; then `hanzo deploy applications sync lux-bank-{bankd,dash}`
(or cd auto-reconciles). Sandbox seed self-heals a standing demo account on boot
(refreshDemoAccount), so a redeploy brings the live demo up to the full surface.

## Migrating from v1

The old NestJS bank uses these modules that map to our collections:
- AuthModule, UsersModule -> Base built-in auth (users collection)
- BeneficiariesModule -> beneficiaries collection
- CurrencyCloudModule -> CurrencyCloud webhook hooks
- BankModule -> accounts + transactions + fees
- WebhooksModule -> hooks/currencycloud.go
- AdminModule -> Base admin UI (built-in)

## Client Dashboard (2026-03-31)

`app/dash/` -- React 19 + Vite + Tailwind CSS 4 SPA consuming the Base API.

### Stack
- React 19, TypeScript 5.9, Vite 6, Tailwind CSS 4
- React Router 7 for navigation
- Fetch API only (no state management library)
- Auth via Base `POST /v1/base/collections/users/auth-with-password`

### Structure

```
app/dash/
├── src/
│   ├── api/client.ts          # Base API client (auth, CRUD, custom routes, file upload)
│   ├── hooks/useAuth.ts       # Auth context (login/logout/session)
│   ├── hooks/useRecords.ts    # Generic collection list hook
│   ├── pages/Login.tsx        # Email+password login
│   ├── pages/Dashboard.tsx    # Balances + recent transactions
│   ├── pages/Accounts.tsx     # Account list with balance drill-down
│   ├── pages/Transactions.tsx # Paginated + filtered transaction table
│   ├── pages/Beneficiaries.tsx # Beneficiary list
│   ├── pages/Payments.tsx     # Outbound payment form
│   ├── pages/Conversions.tsx  # FX quote + execute flow
│   ├── pages/Documents.tsx    # KYC document upload (drag & drop)
│   ├── components/Layout.tsx  # Sidebar + header shell
│   ├── components/BalanceCard.tsx
│   ├── components/TransactionRow.tsx
│   ├── components/StatusBadge.tsx
│   └── lib/format.ts         # Currency/date formatting
```

### Running

```bash
cd app/dash
pnpm install
pnpm dev          # http://localhost:3000
VITE_BANK_API_URL=http://localhost:8070 pnpm dev
```

### API Surface Used

| Endpoint | Page |
|----------|------|
| POST /v1/base/collections/users/auth-with-password | Login |
| GET /v1/base/collections/accounts/records | Dashboard, Accounts |
| GET /v1/base/collections/transactions/records | Dashboard, Transactions |
| GET /v1/base/collections/beneficiaries/records | Beneficiaries, Payments |
| GET /v1/base/collections/documents/records | Documents |
| POST /v1/base/collections/documents/records | Documents (upload) |
| GET /v1/bank/accounts/{id}/balances | Dashboard, Accounts |
| POST /v1/bank/payments/outbound | Payments |
| POST /v1/bank/exchange/quote | Conversions |
| POST /v1/bank/exchange/execute | Conversions |

### Build

```bash
pnpm build        # Output: dist/ (~80 KB gzip)
```

Vite dev server proxies `/v1` to `VITE_BANK_API_URL` (default localhost:8070).
