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

## Custody — the bank holds every key

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
