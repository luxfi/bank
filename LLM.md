# AI Assistant Knowledge Base - Lux Financial (Bank)

**Last Updated**: 2026-01-29
**Project**: bank
**Organization**: luxfi

## Project Overview

Lux Financial is a technology services provider offering open-source enterprise crypto infrastructure for regulated financial institutions—banks, funds, and corporates. Clients hold their own licenses; Lux provides the technology. Core infrastructure is open source at github.com/luxfi. The platform enables instant cross-chain settlement with no bridges required—the "bridge killer" for institutional payments.

### Corporate History
- **October 2020**: Zach Kelling joins CDAX as CTO to lead technology development
- **2020-2023**: Lux Financial develops open banking infrastructure in partnership with CDAX for digital asset services in UK and Isle of Man
- **January 2024**: Lux Partners Limited established in Isle of Man (IOMFSA regulated)
- **September 2025**: Lux Industries Inc launched to serve USA market
- **January 2026**: Platform general availability announced

### Corporate Entities
- **CDAX**: Partner company (digital asset services in UK/IOM) - Lux Financial is NOT CDAX
- **Lux Partners Limited**: Isle of Man entity (IOMFSA regulated)
- **Lux Industries Inc**: USA entity (current operating company)

### Key Domains
- **lux.financial** - Marketing site (Cloudflare Pages)
- **app.lux.financial** - Client dashboard
- **api.lux.financial** - REST API (v0)
- **admin.lux.financial** - Admin dashboard
- **docs.lux.financial** - Documentation site (Nextra)

Note: `lux.finance` is the DeFi frontend (Alchemix UI), NOT the bank.

## Core Platform Features

### Teleport: Instant Cross-Chain Settlement
- **No Bridges Required**: Native multi-chain liquidity eliminates bridge exploits and risk
- **<10s Settlement**: Move assets across chains in seconds, not hours
- **15+ Blockchains**: Ethereum, Polygon, Arbitrum, Base, Solana, and more
- **Zero Slippage**: Direct settlement without third-party bridge contracts

### MPC + KMS + HSM Security Stack
- **MPC Custody**: Multi-party computation with threshold signing (2-of-3, 3-of-5)
- **KMS**: Enterprise key management with pluggable backends
- **HSM Integration**: AWS CloudHSM, Azure HSM, Thales hardware modules
- **Post-Quantum Ready**: CRYSTALS-Dilithium, ML-KEM, SLH-DSA cryptography

### Omni-Chain Treasury Management
- **Unified Wallet**: Single view across all chains and assets
- **Automated Rebalancing**: Optimize liquidity across chains
- **FX Optimization**: Best execution for currency conversions
- **Real-Time Aggregation**: Consolidated balance and P&L reporting

### Staking & Validators
- **20+ PoS Networks**: Stake across Ethereum, Solana, Cosmos, and more
- **Validator Infrastructure**: Run validators with institutional controls
- **Liquid Staking**: Maintain liquidity while earning yields
- **Automated Compounding**: Maximize returns with auto-restaking

### DAO Governance (lux.vote)
- **Lux DAO Stack**: Native governance platform at lux.vote with full on-chain execution
- **Multi-Sig Treasury**: MPC-secured treasury with 2-of-3, 3-of-5 threshold signing
- **Voting Mechanisms**: Token-weighted, quadratic, and conviction voting
- **Proposal Systems**: On-chain proposals with lifecycle management and timelocks
- **Role Management**: Granular permission control for treasurers, voters, admins
- **Payment Streams**: Stream management for vesting, payroll, and grants
- **Integrations**: Snapshot, Tally, Safe compatibility

### Multi-Asset Exchange
- **Multi-Asset Trading**: Stocks (10,000+ equities), crypto (200+ assets), forex (50+ pairs), commodities, options, futures
- **White-Label CEX**: Branded centralized exchange with institutional matching engine
- **DEX Aggregation**: 100+ DEX venues with smart order routing and MEV protection
- **Real-Time Market Data**: TradingView integration with advanced charting and analytics
- **Regulatory Compliance**: SEC, FINRA/SIPC regulated infrastructure
- **Matching Engine**: Sub-10ms execution with deep order books
- **Trading APIs**: REST, WebSocket, and FIX protocol support

### Digital Securities
- **Stablecoin Issuance**: Launch fiat-backed stablecoins with audited reserves
- **Security Tokens**: Compliant equity, debt, and fund tokenization
- **Tokenized Assets**: Real estate, commodities, and alternative investments
- **Multi-Chain**: Ethereum, Polygon, Arbitrum, Lux, and 50+ chains

### Global Payments
- **200+ Countries**: Send payments to every country
- **180+ Currencies**: All major fiat and crypto currencies
- **50+ Payment Rails**: SWIFT, SEPA, ACH, SPEI, PIX, UPI, and local networks
- **Real-Time Settlement**: Instant cross-border payments

### Multi-Asset Wallets
- **Custodial Wallets**: Fully managed wallet infrastructure
- **MPC Self-Custody**: Threshold signing with your own key shares
- **50+ Chains**: Ethereum, Polygon, Solana, and all major networks
- **HSM-Backed**: Hardware security module integration

### Enterprise Security Stack
- **Lux KMS**: HSM-backed key management (AWS CloudHSM, Azure, Thales)
- **Lux MPC**: Multi-party computation for threshold signing (2-of-3, 3-of-5)
- **Lux IAM**: Enterprise identity management (SAML, OIDC, OAuth 2.0)
- **Post-Quantum Security**: CRYSTALS-Dilithium, Kyber, SPHINCS+ via Lux Node

### Mobile Banking
- **White-Label Mobile App**: iOS and Android native apps
- **Multi-Asset Support**: Fiat, crypto, stablecoins, digital securities
- **Security**: Biometric auth (Face ID, Touch ID), MPC signing
- **Features**: QR payments, instant transfers, real-time alerts, 200+ countries

### AI-Powered Operations
- **MCP Server**: Model Context Protocol for AI-powered operations
- **ZAP Protocol**: Browser-extension to MCP communication
- **Natural Language Banking**: Query accounts, create payments, generate reports

### Demo Customer: Triangle Bank
- **Logo**: Uses △ Unicode symbol with shadcn-inspired styling
- **Configuration**: `/pkg/brand/src/customers/triangle-bank.ts`
- **Assets**: `/app/site/public/images/customers/triangle-bank/`

## Essential Commands

### Development
```bash
# Site development
cd app/site && pnpm dev

# Docs development
cd app/docs && pnpm dev

# Build all packages
pnpm install
pnpm build

# Static export for Cloudflare
cd app/site && pnpm export

# Deploy to Cloudflare Pages
cd app/site && pnpm deploy:cf
```

### Production Deployment
```bash
# From universe repo
docker compose --profile bank up -d
```

## Architecture

### Apps (`/app/`)
- **site** - Marketing site (Next.js 14, styled-components)
  - **Home page** features dynamic multi-platform showcase:
    - Dashboard mockup (app.lux.financial) with live stats, sidebar nav, asset table
    - Terminal mockup (lux-cli) with animated cursor and CLI commands
    - Mobile device mockup with balance, send/receive actions, asset list
  - `/products/` - Product pages:
    - `/mobile` - White-label mobile app (iOS/Android) with phone mockups
    - `/exchange` - CEX & DEX platform
    - `/defi` - DeFi infrastructure (AMM, lending, yield)
    - `/issuance` - Digital securities (stablecoins, security tokens)
    - `/cross-border` - Global payments (200+ countries)
    - `/wallets` - Multi-asset wallets (50+ chains)
    - `/infrastructure` - KMS, MPC, IAM, post-quantum
  - `/online-platform/` - Solutions by industry
  - `/about/`, `/contact/`, `/news/` - Core pages
- **dash** - Client portal (Next.js)
  - TriangleBankLogo component at `/src/components/TriangleBankLogo/`
- **admin** - Admin dashboard (Next.js)
- **api** - REST API (NestJS)
- **docs** - Documentation (Nextra 3)
  - `/pages/api-reference/` - API reference documentation
  - `/pages/guides/` - Feature guides:
    - `exchange.mdx` - CEX & DEX trading
    - `defi.mdx` - DeFi infrastructure
    - `wallets.mdx` - Wallet management
    - `cross-border.mdx` - Global payments
    - `issuance.mdx` - Digital securities
    - `stablecoins.mdx` - Stablecoin support
    - `payments.mdx` - Payment APIs
    - `mcp-server.mdx` - AI operations
    - `infrastructure.mdx` - Security stack
  - `/public/llms.txt` - LLM integration index
- **finance** - DeFi frontend (separate from bank)

### Packages (`/pkg/`)
- **brand** - Brand configuration, jurisdictions, colors
  - `/src/customers/` - Customer configurations (Triangle Bank)
- **ui** - Shared UI components
- **models** - TypeScript types and interfaces
- **email** - Email templates
- **currency-cloud** - Currency Cloud API integration
- **ifx** - IFX integration

## API Reference

### Base URL
- Production: `https://api.lux.financial/v0`
- Sandbox: `https://api-sandbox.lux.financial/v0`

### Core Endpoints
| Resource | Description |
|----------|-------------|
| `/customers` | KYC-verified customer profiles |
| `/accounts` | Multi-currency fiat accounts |
| `/wallets` | Custodial and MPC wallet infrastructure |
| `/transfers` | Internal fund movements |
| `/payments` | Cross-border payments (150+ countries) |
| `/external-accounts` | Bank accounts and crypto addresses |
| `/rewards/rates` | Stablecoin yield rates |
| `/webhooks` | Event notifications |

### Authentication
```bash
curl https://api.lux.financial/v0/customers \
  -H "Api-Key: sk_live_your_api_key"
```

## Key Technologies

- **Frontend**: Next.js 14, React 18, styled-components, Ant Design
- **Backend**: NestJS, PostgreSQL, Redis
- **Deployment**: Docker, Cloudflare Pages, Traefik
- **Logo**: @luxfi/logo (npm package at ~/work/lux/logo)
- **Brand**: @luxbank/brand (workspace package)
- **Docs**: Nextra 3

## Brand & Theme

### Colors (Dark Theme)
```typescript
colors = {
  background: "#000000",
  foreground: "#FFFFFF",
  primary: "#FFFFFF",
  secondary: "#FFFFFF", // White accent
  accent: "#FFFFFF",
  gray: "#111111",
  card: "#0A0A0A",
  border: "#333333",
}
```

### Triangle Bank Demo
- Uses △ Unicode symbol for logo
- shadcn-inspired clean styling
- Colors: White on dark (#fafafa on #09090b)

### Jurisdiction Configuration
US operations use sponsor bank model:
- **Sponsor Bank**: Metropolitan Commercial Bank (MCB), NYC
- **Charter**: NY State Chartered, FDIC insured
- **Regulators**: NYDFS, FDIC, FinCEN

## News/Blog Content

Static posts in `/app/site/src/app/news/page.tsx` covering 2020-2026:
1. Zach Kelling Joins CDAX as CTO - October 2020
2. Lux Financial and CDAX Launch Open Banking Infrastructure - March 2021
3. Lux KMS: Enterprise Secret Management Goes Open Source - November 2022
4. Lux Partners Limited Established in Isle of Man - January 2024
5. Native USDC and USDT Support Across 15 Chains - September 2024
6. Lux MPC: Self-Custody Infrastructure for Institutions - March 2025
7. Global Fiat Rails: PIX, SPEI, and UPI Now Live - August 2025
8. Lux Industries Inc Launches to Serve US Market - September 2025
9. Lux KMS: HSM Provider Support Now Available - December 2025
10. Platform Launch: Instant Cross-Chain Settlement (Featured) - January 2026

## Development Workflow

1. **Local Development**
   ```bash
   pnpm install
   cd app/site && pnpm dev
   ```

2. **Building**
   ```bash
   pnpm build
   ```

3. **Deployment**
   - Static export: `pnpm export`
   - Cloudflare Pages: `wrangler pages deploy out --project-name=lux-financial`

## Cloudflare Pages Setup

Project: `lux-financial`
- Production URL: https://lux-financial.pages.dev
- Custom domains: lux.financial, www.lux.financial (pending DNS)

### DNS Records Needed
```
CNAME @ -> lux-financial.pages.dev (proxied)
CNAME www -> lux-financial.pages.dev (proxied)
```

## Context for All AI Assistants

This file (`LLM.md`) is symlinked as:
- `.AGENTS.md`
- `CLAUDE.md`
- `QWEN.md`
- `GEMINI.md`

All files reference the same knowledge base. Updates here propagate to all AI systems.

## Rules for AI Assistants

1. **ALWAYS** update LLM.md with significant discoveries
2. **NEVER** commit symlinked files (.AGENTS.md, CLAUDE.md, etc.) - they're in .gitignore
3. **NEVER** create random summary files - update THIS file
4. **NEVER** confuse lux.finance (DeFi) with lux.financial (bank)
5. **NEVER** say Lux Financial is "formerly CDAX" - Lux Financial PARTNERS with CDAX
6. **ALWAYS** use @luxfi/logo from npm, not workspace package
7. **ALWAYS** use dark theme (black background, gold accents)
8. **ALWAYS** position platform as "bridge killer" - instant cross-chain, no bridges
9. **Triangle Bank** uses △ Unicode symbol (not SVG/custom font)

---

**Note**: This file serves as the single source of truth for all AI assistants working on this project.
