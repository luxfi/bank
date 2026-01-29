# Lux Bank

## Infrastructure for Financial Institutions

Lux Bank is infrastructure for financial institutions — not consumers. We don't offer consumer wallets, debit cards, or retail banking services. Instead, we power [Lux.Financial](https://lux.financial) and provide a complete banking infrastructure stack that lets financial services companies build compliant, secure, and scalable fiat/stablecoin operations without dealing with compliance, custody, or banking rails themselves.

While most stablecoin infrastructure focuses on consumer payment flows, Lux Bank focuses on the B2B layer — enabling businesses to hold, move, and convert stablecoins with full regulatory coverage and enterprise-grade security.

## What You Get with Lux Bank

### Stablecoin Rails Built for Scale
Move USDC, USDT, and other stablecoins globally with settlement in minutes, not days.

### Compliance Handled
Full KYC/KYB, AML monitoring, and regulatory reporting built in — so you don't have to build or maintain your own compliance stack.

### Enterprise Security
Bank-grade custody, MPC wallets, and 24/7 monitoring to protect client funds.

### Fast Integration
Go live in 2–4 weeks with dedicated onboarding support.

### White-Label Ready
Custom branding and domain options available for platforms who want their own client-facing experience.

### Multi-Currency Support
Operate across USD, EUR, GBP, and 30+ other currencies through a single integration.

## Key Features

### Regulatory Compliance
- **Multi-Jurisdiction Support**: Configurable for UK FCA, Isle of Man, Gibraltar, and other regulatory frameworks
- **Built-in Compliance**: KYC/KYB verification, AML monitoring, sanctions screening, and regulatory reporting
- **Transparency**: Open-source approach promotes transparency and trust

### Integrations

Lux Bank seamlessly integrates with various financial and technology services:

- **Currency Cloud**: Multi-currency transactions and conversions
- **Stripe**: Payment processing
- **OpenPayd**: Banking rails and payment infrastructure
- **Auth0**: Authentication and authorization
- **SendGrid**: Email delivery
- **Sentry**: Error tracking and monitoring

### Technical Architecture

- **Full Stack Solution**: From front-end interfaces to back-end infrastructure
- **API-Driven**: Robust APIs for seamless integration and interoperability
- **MPC Operations**: Multi-party computation for enhanced security and decentralized key management
- **Modular Design**: Easily extend and customize to meet specific business needs

## Development

### Prerequisites

- Node.js 18+
- pnpm 9+

### Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

### Project Structure

```
├── app/
│   ├── api/         # Backend API services
│   ├── dash/        # Client dashboard application
│   └── site/        # Marketing website
├── pkg/
│   └── brand/       # Centralized branding and jurisdiction configuration
└── ...
```

## Architecture

- Next.js 14
- TypeScript
- Radix UI Primitives
- Tailwind CSS
- PostgreSQL
- Redis

## Built with Hanzo

Built on the Hanzo React SDK (@hanzo/ui, @hanzo/auth, @hanzo/commerce) — a potent React framework using Next 14, Tailwind, and Radix.

## License

See [LICENSE](LICENSE) for details.
