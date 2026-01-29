# Lux Bank

**Complete Digital Asset Infrastructure for Financial Institutions**

Lux Bank provides everything needed to launch exchanges, DeFi protocols, stablecoin issuance, global payments, and multi-asset custody. We power banks, fintechs, and enterprises with institutional-grade infrastructure.

## Platform Overview

| Feature | Description |
|---------|-------------|
| **CEX & DEX** | White-label exchange with institutional liquidity + 100+ DEX venues |
| **DeFi Infrastructure** | AMM, liquidity pools, lending protocols, yield vaults |
| **Digital Securities** | Stablecoin issuance, security tokens, tokenized assets |
| **Global Payments** | 200+ countries, 180+ currencies, 50+ payment rails |
| **Multi-Asset Wallets** | Custodial + MPC self-custody, 50+ chains |
| **Mobile Banking** | White-label iOS/Android apps |
| **Enterprise Security** | KMS, MPC, IAM, HSM, post-quantum cryptography |

## Key Domains

- **lux.financial** - Marketing site
- **app.lux.financial** - Client dashboard
- **api.lux.financial** - REST API
- **admin.lux.financial** - Admin dashboard
- **docs.lux.financial** - Documentation 

> Note: `lux.finance` is the DeFi frontend (Alchemix UI), NOT the bank.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run marketing site
cd app/site && pnpm dev

# Run docs site
cd app/docs && pnpm dev

# Build all
pnpm build

# Deploy to Cloudflare Pages
cd app/site && pnpm export && pnpm deploy:cf
```

## Project Structure

```
├── app/
│   ├── site/        # Marketing website (Next.js 14, styled-components)
│   │   └── src/app/
│   │       ├── (home)/           # Landing page with multi-platform showcase
│   │       ├── products/         # Product pages
│   │       │   ├── mobile/       # White-label mobile app
│   │       │   ├── exchange/     # CEX & DEX platform
│   │       │   ├── defi/         # DeFi infrastructure
│   │       │   ├── issuance/     # Digital securities
│   │       │   ├── cross-border/ # Global payments
│   │       │   ├── wallets/      # Multi-asset wallets
│   │       │   └── infrastructure/ # Security stack
│   │       ├── solutions/        # Industry-specific solutions
│   │       ├── about/
│   │       ├── contact/
│   │       └── news/
│   ├── dash/        # Client portal (Next.js)
│   ├── admin/       # Admin dashboard (Next.js)
│   ├── api/         # REST API (NestJS)
│   ├── docs/        # Documentation (Nextra 3)
│   └── finance/     # DeFi frontend (separate)
├── pkg/
│   ├── brand/       # Brand config, jurisdictions, colors
│   ├── ui/          # Shared UI components
│   ├── models/      # TypeScript types
│   ├── email/       # Email templates
│   ├── currency-cloud/  # Currency Cloud integration
│   └── ifx/         # IFX integration
└── ...
```

## Core Features

### Trading & Exchange
- White-label CEX with institutional liquidity
- DEX aggregation across 100+ venues
- Sub-10ms matching engine
- REST, WebSocket, and FIX APIs

### DeFi Infrastructure
- Custom AMM & liquidity pools
- Lending protocols with isolated risk
- Auto-compounding yield vaults
- Liquid staking for 20+ PoS networks

### Digital Securities
- Fiat-backed stablecoin issuance
- Compliant security token infrastructure
- Real estate, commodities tokenization
- Multi-chain: Ethereum, Polygon, Arbitrum, Lux, 50+ chains

### Global Payments
- 200+ countries coverage
- 180+ fiat and crypto currencies
- SWIFT, SEPA, ACH, SPEI, PIX, UPI rails
- Real-time cross-border settlement

### Enterprise Security Stack
- **Lux KMS**: HSM-backed key management
- **Lux MPC**: Multi-party computation (2-of-3, 3-of-5)
- **Lux IAM**: Enterprise identity (SAML, OIDC, OAuth 2.0)
- **Post-Quantum**: CRYSTALS-Dilithium, Kyber, SPHINCS+

### AI-Powered Operations
- **MCP Server**: Model Context Protocol for AI ops
- **ZAP Protocol**: Browser-extension communication
- Natural language banking queries

## API Reference

### Base URLs
- Production: `https://api.lux.financial/v0`
- Sandbox: `https://api-sandbox.lux.financial/v0`

### Core Endpoints
| Endpoint | Description |
|----------|-------------|
| `/customers` | KYC-verified customer profiles |
| `/accounts` | Multi-currency fiat accounts |
| `/wallets` | Custodial and MPC wallets |
| `/transfers` | Internal fund movements |
| `/payments` | Cross-border payments |
| `/external-accounts` | Bank accounts & crypto addresses |
| `/webhooks` | Event notifications |

### Authentication
```bash
curl https://api.lux.financial/v0/customers \
  -H "Api-Key: sk_live_your_api_key"
```

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, React 18, styled-components, Ant Design |
| **Backend** | NestJS, PostgreSQL, Redis |
| **Deployment** | Docker, Cloudflare Pages, Traefik |
| **Logo** | @luxfi/logo (npm package) |
| **Brand** | @luxbank/brand (workspace) |
| **Docs** | Nextra 3 |

## Brand & Theme

### Colors (Dark Theme)
```typescript
colors = {
  background: "#000000",
  foreground: "#FFFFFF",
  primary: "#FFFFFF",
  secondary: "#D4AF37", // Gold accent
  accent: "#D4AF37",
  gray: "#111111",
  card: "#0A0A0A",
  border: "#333333",
}
```

## Integrations

- **Currency Cloud** - Multi-currency transactions
- **Stripe** - Payment processing
- **OpenPayd** - Banking rails
- **Auth0** - Authentication
- **SendGrid** - Email delivery
- **Sentry** - Error tracking
- **Chainalysis** - Blockchain compliance
- **Jumio/Onfido** - KYC verification

## Compliance

- Multi-jurisdiction support (UK FCA, Isle of Man, Gibraltar)
- Built-in KYC/KYB verification
- AML monitoring & sanctions screening
- Regulatory reporting
- SOC 2 Type II compliant infrastructure

### US Operations
- **Sponsor Bank**: Metropolitan Commercial Bank (MCB), NYC
- **Charter**: NY State Chartered, FDIC insured
- **Regulators**: NYDFS, FDIC, FinCEN

## Demo: Triangle Bank

A demo neobank built on Lux Financial infrastructure:
- Uses `△` Unicode symbol for logo
- shadcn-inspired clean styling
- Config: `/pkg/brand/src/customers/triangle-bank.ts`

## Deployment

### Cloudflare Pages
```bash
cd app/site
pnpm export
wrangler pages deploy out --project-name=lux-financial
```

### Docker (Production)
```bash
# From universe repo
docker compose --profile bank up -d
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

See [LICENSE](LICENSE) for details.

---

**Built with [Hanzo](https://hanzo.ai)** - Powered by @hanzo/ui, @hanzo/auth, @hanzo/commerce
