# AI Assistant Knowledge Base - Lux Financial (Bank)

**Last Updated**: 2026-01-29
**Project**: bank
**Organization**: luxfi

## Project Overview

Lux Financial (formerly CDAX) is a complete digital asset infrastructure platform for financial institutions. The platform provides everything needed to launch exchanges, DeFi protocols, stablecoin issuance, global payments, and multi-asset custody.

### Key Domains
- **lux.financial** - Marketing site (Cloudflare Pages)
- **app.lux.financial** - Client dashboard
- **api.lux.financial** - REST API (v0)
- **admin.lux.financial** - Admin dashboard
- **docs.lux.financial** - Documentation site (Nextra)

Note: `lux.finance` is the DeFi frontend (Alchemix UI), NOT the bank.

## Core Platform Features

### Trading & Exchange
- **CEX Platform**: White-label centralized exchange with institutional liquidity
- **DEX Aggregation**: 100+ DEX venues with smart order routing and MEV protection
- **Matching Engine**: Sub-10ms execution with deep order books
- **Trading APIs**: REST, WebSocket, and FIX protocol support

### DeFi Infrastructure
- **AMM & Liquidity Pools**: Custom bonding curves, concentrated liquidity
- **Lending Protocols**: Money markets with isolated risk pools
- **Yield Vaults**: Auto-compounding yield optimization
- **Staking**: Liquid staking for 20+ PoS networks

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
  secondary: "#D4AF37", // Gold accent
  accent: "#D4AF37",
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

Static fallback posts in `/app/site/src/api/ghost.ts` covering 2020-2026:
1. CDAX Founded (COVID PPE procurement) - April 2020
2. Series A Funding - June 2021
3. Government Blockchain Selection - March 2022
4. UK/IOM Launch - September 2023
5. MPC Custody Launch - June 2024
6. Native Stablecoin Support - November 2024
7. IOMFSA License - March 2025
8. MCP/ZAP Launch - June 2025
9. US Trust Company Expansion - September 2025
10. CDAX → Lux Rebrand - January 2026

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
5. **ALWAYS** use @luxfi/logo from npm, not workspace package
6. **ALWAYS** use dark theme (black background, gold accents)
7. **Triangle Bank** uses △ Unicode symbol (not SVG/custom font)

---

**Note**: This file serves as the single source of truth for all AI assistants working on this project.
