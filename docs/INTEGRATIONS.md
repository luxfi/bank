# Integrations

`bankd` is a regulated multi-currency banking core. It owns accounts,
balances, ledger postings, compliance gates, and the orchestration of
outbound payments across multiple rails. It does **not** speak to
external counterparties directly: every off-platform interaction (rail
execution, FX, sanctions screening, KYC document verification) is
mediated by a sibling service over a normalized, HMAC-authenticated
internal wire format.

This document describes the *kinds* of integration `bankd` supports —
the contract surface — not specific vendors or commercial partners.

## 1. Core banking model

The ledger is double-entry, immutable, and denominated in minor units
(integers). The primary entities:

- **Entity** — a legal person or natural person on the platform. An
  entity carries a KYC tier, jurisdiction, and risk score.
- **Account** — owned by an entity, scoped to a product line
  (operating, custody, escrow, fee).
- **Balance** — per `(account, currency)` pair. Splits into
  `available` and `held`. The `available` floor is enforced at the
  ledger boundary — debits that would breach zero are refused before
  posting (`hooks/payments.go`).
- **Transfer** — a state machine over the ledger. Lifecycle:
  `pending → screening → quoted → executing → settled | failed | reversed`.
- **Fee** — per-rail flat and ad-valorem components. Defined in
  `hooks/fees.go` and `hooks/rails.go::RailFee`.

Multi-currency wallets are a view over the underlying balance rows:
one account holds N balances, one per currency the entity has been
provisioned for. There is no "wallet table" — wallet is a UI concept
projected from `(account, balance[*])`.

## 2. Payment-rail routing

The rail for an outbound transfer is computed deterministically from
the transfer's `(currency, senderCountry, recipientCountry)` triple by
`hooks/rails.go::DetectRail`. The selected rail determines which
upstream service handles execution, what fee schedule applies, and
which compliance checks are mandatory.

Supported rails:

| Rail          | Currency | Domain                         |
|:--------------|:--------:|:-------------------------------|
| `internal`    | any      | same-platform transfer (ledger-only) |
| `sepa`        | EUR      | SEPA Credit Transfer, EU/EEA   |
| `sepa_inst`   | EUR      | SEPA Instant Credit Transfer   |
| `fps`         | GBP      | UK Faster Payments             |
| `ach`         | USD      | US domestic ACH                |
| `wire`        | USD      | US-originated international wire |
| `swift`       | any      | cross-border SWIFT MT/MX       |
| `interac`     | CAD      | Canadian Interac e-Transfer    |

Add a rail by extending the `PaymentRail` enum and `DetectRail` table
together. The fee schedule is per-rail and lives next to the rail
definition.

Rail execution itself is delegated to the regulated banking partner
through the partner's webhook-driven adapter; `bankd` never opens an
outbound socket to a rail operator directly.

## 3. FX integration — bankd ↔ `forexd`

Cross-currency transfers route through `forexd`, the platform's FX
service. `forexd` is the only component that holds liquidity-venue
credentials, manages quote TTLs, and books fills with the FX service.
`bankd` never authenticates to an FX venue directly.

The interaction is request/callback over the internal wire:

```
bankd  ──── POST forexd /v1/forex/quotes ─────►  forexd
        ◄── { quoteId, rate, expiresAt } ──
bankd  ──── POST forexd /v1/forex/execute ────►  forexd
        ◄── 202 Accepted (async) ──
                                                  forexd  ── venue fill ──►  FX service
                                                  forexd  ── normalize ──
bankd  ◄── POST /v1/bank/webhooks/payments/callback (HMAC-signed) ── forexd
```

The webhook is the single ingress for execution outcomes — both
FX fills and rail settlement events arrive on the same endpoint,
distinguished only by the `provider` and `eventType` fields. See §4.

## 4. Provider webhook callback

`POST /v1/bank/webhooks/payments/callback`

A single, generic endpoint that any upstream service (the FX service,
the regulated banking partner's rail adapter, an internal settlement
service) may post normalized payment-state events to. Bound at
`hooks/payments.go` with `RequireHMACAuth()` — the request body is
authenticated by an HMAC-SHA256 signature in the `X-Signature` header
computed with the per-provider shared secret resolved by the HMAC
middleware (`hooks/hmac.go`). Requests with a missing, malformed, or
invalid signature are rejected with `401` before the handler runs.

The handler accepts the normalized payload:

```json
{
  "transactionId": "txn_…",
  "externalId":    "<upstream reference>",
  "provider":      "<service identifier>",
  "eventType":     "fx.executed | payment.settled | payment.failed | …",
  "status":        "settled | failed | reversed | quoted",
  "reason":        "<optional failure reason>"
}
```

`transactionId` resolves the local transfer; `status` drives the state
transition; `reason` is recorded on the audit trail. Unknown
`eventType` values are logged and dropped — no half-known event is
ever allowed to mutate the ledger.

Implementation rules for any upstream that posts here:

1. Sign every request with the provider's HMAC secret. Plaintext
   posts are rejected.
2. Map your native event taxonomy onto the four canonical
   `status` values before posting. The webhook handler does not
   contain provider-specific logic — that lives at the source.
3. Posts are idempotent on `(provider, externalId)`. Duplicate
   deliveries are a no-op.

## 5. Compliance hooks

Compliance is enforced at two layers, both implemented in
`hooks/compliance.go`:

- **Entity-creation**: on entity insert, the KYC tier is computed
  from the document set the entity has uploaded (`hooks/documents.go`)
  and the jurisdiction. Below-tier entities cannot open accounts.
- **Transaction-creation**: every transfer passes three gates before
  it is allowed to enter the `pending` state:

  | Gate       | Trigger                              |
  |:-----------|:-------------------------------------|
  | KYC        | always — refuses if tier insufficient for the rail |
  | AML        | amount > per-rail threshold — escalates to manual review |
  | Sanctions  | recipient screened against the licensed institution's sanctions list (OFAC, EU, UN, UK HMT); hit → block |
  | PEP        | recipient PEP-status check; hit → escalate, do not auto-block |

Sanctions and PEP lookups are themselves delegated calls — `bankd`
does not host its own list. The screening service replies on the same
HMAC-signed callback contract as §4 when results are asynchronous.

## 6. Audit & event sourcing

Every state-mutating event — balance posting, compliance decision,
webhook ingest, fee assessment — is appended to the immutable audit
log (`hooks/audit.go`). The audit log is the system of record for
regulator inquiries; the operational tables are projections of it.

## 7. What `bankd` deliberately does **not** do

- Hold rail-operator or FX-venue credentials.
- Choose an FX counterparty (that is `forexd`'s decision).
- Maintain a sanctions list locally.
- Expose any HTTP route that is not under `/v1/bank/*`.
- Speak gRPC. Internal services use ZAP; HTTP is via ZIP.
