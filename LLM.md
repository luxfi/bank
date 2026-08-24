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
| POST | /v1/bank/fx/quote | JWT | FX rate quote (proxied to forex service) |
| POST | /v1/bank/fx/execute | JWT | Execute FX conversion |
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

### Chain backend (chain.go)

`ChainBackend` is the on-chain half of the wallet — the same seam shape as
`Issuer` and `FXProvider`. Three methods: `Network()` (lux-testnet /
lux-mainnet), `Address(seed, asset)` (deterministic deposit address — bech32
for BTC, 0x for EVM assets, distinct per asset), `Send(asset, to, amount)`
(broadcast, returns tx hash). `chain()` selects it. `simChain` is the sandbox:
deterministic display addresses (real bech32 checksum so a BTC receive address
passes the bank's own `validAddress`), random testnet tx hashes, no broadcast.
No real backend yet — live mode has none, so `handleCryptoSend` refuses
on-chain sends outside sandbox and never reaches `chain()`. A real backend
(chain RPC + signer + broadcast) drops in behind this interface. The bank
ledger hold/settle stays on the bank side; the backend owns only the chain.

Each account provisions one wallet per `SupportedCrypto` asset, each with its
own `Address(...)`. `GET /v1/bank/wallet` and the overview expose a per-asset
`wallets` array (plus the single `wallet` = wallets[0] for compat).

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
| POST /v1/bank/fx/quote | Conversions |
| POST /v1/bank/fx/execute | Conversions |

### Build

```bash
pnpm build        # Output: dist/ (~80 KB gzip)
```

Vite dev server proxies `/v1` to `VITE_BANK_API_URL` (default localhost:8070).
