# bank-v2

Hanzo Base-powered banking backend, replacing the NestJS/MikroORM bank at
`~/work/lux/bank/`.

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

- **CurrencyCloud webhooks** (`/webhooks/currencycloud/payment`,
  `/webhooks/currencycloud/conversion`) -- receive payment/conversion status
  updates and sync to transaction records.
- **IFX settlement** (`/webhooks/ifx/settlement`) -- forex settlement
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
| POST | /v1/transfers | JWT | Internal transfer between own accounts |
| POST | /v1/payments/outbound | JWT | Payment to external beneficiary |
| GET | /v1/accounts/{id}/balances | JWT | Multi-currency balance query |
| POST | /v1/fx/quote | JWT | FX rate quote (proxied to forex service) |
| POST | /v1/fx/execute | JWT | Execute FX conversion |
| POST | /webhooks/payments/callback | Superuser | Payment status callback from forex service |
| GET | /health | None | Health check |
| GET | /api/v1/account/summary | JWT | Legacy account summary |

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
All webhook routes (`/webhooks/*`) now use HMAC-SHA256 signature validation
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
- Auth via Base `POST /api/collections/users/auth-with-password`

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
| POST /api/collections/users/auth-with-password | Login |
| GET /api/collections/accounts/records | Dashboard, Accounts |
| GET /api/collections/transactions/records | Dashboard, Transactions |
| GET /api/collections/beneficiaries/records | Beneficiaries, Payments |
| GET /api/collections/documents/records | Documents |
| POST /api/collections/documents/records | Documents (upload) |
| GET /v1/accounts/{id}/balances | Dashboard, Accounts |
| POST /v1/payments/outbound | Payments |
| POST /v1/fx/quote | Conversions |
| POST /v1/fx/execute | Conversions |

### Build

```bash
pnpm build        # Output: dist/ (~80 KB gzip)
```

Vite dev server proxies `/api` and `/v1` to `VITE_BANK_API_URL` (default localhost:8070).
