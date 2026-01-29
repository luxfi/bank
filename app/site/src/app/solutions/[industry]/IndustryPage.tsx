"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { CustomButton, SecondaryButton } from "@/components/Button";
import { DeviceSize } from "@/styles/theme/default";

// Industry data with full details
const industryData: Record<string, IndustryContent> = {
  "financial-institutions": {
    title: "Financial Institutions",
    subtitle: "Digital Asset Infrastructure for Banks & Credit Unions",
    description: "Modernize your institution with complete digital asset capabilities. Multi-chain custody, stablecoin payments, tokenization, and compliance—all enterprise-grade.",
    icon: "🏦",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "50+", label: "Chains Supported" },
      { value: "$10B+", label: "Assets Secured" },
      { value: "99.99%", label: "Uptime SLA" },
      { value: "SOC 2", label: "Certified" },
    ],
    useCases: [
      { title: "Digital Asset Custody", description: "HSM-backed and MPC custody for institutional digital asset management." },
      { title: "Stablecoin Payments", description: "Send and receive USDC, USDT, and other stablecoins with instant settlement." },
      { title: "Tokenization", description: "Issue security tokens, tokenized deposits, and digital securities." },
      { title: "Cross-Border Payments", description: "Real-time international payments via stablecoin rails." },
    ],
    features: [
      "Multi-chain custody (50+ networks)",
      "HSM & MPC key management",
      "Post-quantum security ready",
      "Regulatory reporting & audit trails",
      "White-label client portals",
      "Core banking integrations",
      "Real-time settlement",
      "Multi-currency treasury",
    ],
    integrations: ["Core banking systems", "SWIFT/SEPA", "Regulatory reporting", "AML/KYC providers"],
  },
  "fintech": {
    title: "FinTech",
    subtitle: "Launch Banking Products Without Building From Scratch",
    description: "White-label banking infrastructure for neobanks, payment apps, and embedded finance. Accounts, cards, wallets, and payment rails—all via API.",
    icon: "💳",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "200+", label: "Countries" },
      { value: "180+", label: "Currencies" },
      { value: "<3s", label: "Settlement" },
      { value: "24/7", label: "Support" },
    ],
    useCases: [
      { title: "Neobank Launch", description: "Launch a full-featured banking app with accounts, cards, and payments." },
      { title: "Mobile Wallets", description: "Multi-currency mobile wallets with crypto and fiat support." },
      { title: "Embedded Finance", description: "Add financial services to your platform with embedded APIs." },
      { title: "Payment Apps", description: "Build P2P, B2B, or cross-border payment applications." },
    ],
    features: [
      "White-label account provisioning",
      "Virtual & physical cards",
      "Multi-currency wallets",
      "ACH, wire, SEPA payments",
      "Crypto on/off ramps",
      "KYC/KYB built-in",
      "Mobile SDK",
      "Real-time notifications",
    ],
    integrations: ["Plaid", "Stripe", "Card networks", "Banking partners"],
  },
  "insurance": {
    title: "Insurance",
    subtitle: "Global Premium Collection & Claims Disbursement",
    description: "Streamline insurance operations with multi-currency accounts, instant claims payouts, and global premium collection across 200+ countries.",
    icon: "🛡️",
    heroImage: "/images/security.jpg",
    stats: [
      { value: "200+", label: "Countries" },
      { value: "T+0", label: "Claims Settlement" },
      { value: "50+", label: "Payment Rails" },
      { value: "100%", label: "Audit Trail" },
    ],
    useCases: [
      { title: "Global Premium Collection", description: "Accept premiums in any currency, any country, any payment method." },
      { title: "Instant Claims Payouts", description: "Pay claims instantly via bank transfer, cards, or stablecoins." },
      { title: "Multi-Currency Treasury", description: "Manage FX risk with multi-currency accounts and hedging." },
      { title: "Reinsurance Settlements", description: "Streamline reinsurer payments with automated reconciliation." },
    ],
    features: [
      "Multi-currency accounts",
      "Instant payout capabilities",
      "Global payment acceptance",
      "Automated reconciliation",
      "FX management",
      "Regulatory compliance",
      "White-label portals",
      "API integration",
    ],
    integrations: ["Policy admin systems", "Claims platforms", "Reinsurance networks", "Compliance tools"],
  },
  "insurtech": {
    title: "InsurTech",
    subtitle: "Smart Contract Insurance & Automated Claims",
    description: "Build next-generation insurance products with parametric triggers, smart contract claims, and blockchain-based transparency.",
    icon: "⚡",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "Instant", label: "Parametric Payouts" },
      { value: "100%", label: "Transparent" },
      { value: "0", label: "Manual Claims" },
      { value: "Multi-chain", label: "Deployment" },
    ],
    useCases: [
      { title: "Parametric Insurance", description: "Weather, flight delay, or event-triggered automatic payouts." },
      { title: "Smart Contract Claims", description: "Automated claims verification and instant settlement." },
      { title: "Microinsurance", description: "Low-cost insurance products with embedded payments." },
      { title: "Peer-to-Peer Insurance", description: "Build community-based insurance pools on-chain." },
    ],
    features: [
      "Parametric triggers",
      "Smart contract automation",
      "Oracle integrations",
      "Instant USDC payouts",
      "Multi-chain support",
      "Transparent claims",
      "Mobile-first design",
      "API-driven underwriting",
    ],
    integrations: ["Chainlink oracles", "Weather APIs", "Flight data", "IoT sensors"],
  },
  "crypto": {
    title: "Crypto & Web3",
    subtitle: "Complete Exchange & DeFi Infrastructure",
    description: "Launch centralized exchanges, DEX aggregators, DeFi protocols, or NFT marketplaces. Full infrastructure from custody to compliance.",
    icon: "🪙",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "100+", label: "DEX Venues" },
      { value: "<10ms", label: "Execution" },
      { value: "50+", label: "Chains" },
      { value: "$0", label: "MEV Loss" },
    ],
    useCases: [
      { title: "Centralized Exchange", description: "White-label CEX with institutional liquidity and matching engine." },
      { title: "DEX Aggregation", description: "Smart order routing across 100+ DEX venues with MEV protection." },
      { title: "DeFi Protocols", description: "Build AMMs, lending protocols, and yield vaults." },
      { title: "NFT Marketplace", description: "Launch NFT trading with multi-chain support and fiat on-ramps." },
    ],
    features: [
      "CEX matching engine",
      "DEX aggregation",
      "AMM infrastructure",
      "Lending protocols",
      "Yield optimization",
      "MPC custody",
      "Fiat on/off ramps",
      "Compliance tools",
    ],
    integrations: ["0x", "1inch", "Uniswap", "Chainlink"],
  },
  "saas": {
    title: "SaaS Platforms",
    subtitle: "Global Billing & Marketplace Payouts",
    description: "Monetize globally with multi-currency subscription billing, marketplace payouts, and embedded payments for your platform users.",
    icon: "☁️",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "180+", label: "Currencies" },
      { value: "200+", label: "Countries" },
      { value: "T+1", label: "Payouts" },
      { value: "0%", label: "FX Markup" },
    ],
    useCases: [
      { title: "Global Subscriptions", description: "Bill customers in their local currency with automatic FX." },
      { title: "Marketplace Payouts", description: "Pay sellers, creators, and partners worldwide." },
      { title: "Embedded Payments", description: "Enable payments within your platform for users." },
      { title: "Revenue Share", description: "Automated splits and partner revenue distribution." },
    ],
    features: [
      "Multi-currency billing",
      "Subscription management",
      "Marketplace split payments",
      "Embedded finance APIs",
      "Usage-based billing",
      "Automated tax handling",
      "Real-time reporting",
      "Webhook notifications",
    ],
    integrations: ["Stripe", "Recurly", "Chargebee", "Accounting systems"],
  },
  "retail": {
    title: "Retail & E-commerce",
    subtitle: "Omnichannel Crypto & Fiat Payments",
    description: "Accept payments in crypto and fiat, online and in-store. Instant settlement, treasury management, and global supplier payments.",
    icon: "🛒",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "50+", label: "Payment Methods" },
      { value: "T+0", label: "Settlement" },
      { value: "200+", label: "Countries" },
      { value: "0%", label: "Chargebacks" },
    ],
    useCases: [
      { title: "Crypto Checkout", description: "Accept Bitcoin, USDC, and 50+ cryptocurrencies." },
      { title: "Global Supplier Payments", description: "Pay international suppliers with optimal FX rates." },
      { title: "Treasury Management", description: "Multi-currency accounts with yield on stablecoin holdings." },
      { title: "Loyalty & Rewards", description: "Issue branded tokens and NFTs for customer loyalty." },
    ],
    features: [
      "Crypto & fiat checkout",
      "POS integration",
      "Instant settlement",
      "No chargebacks on crypto",
      "Multi-currency treasury",
      "Supplier payments",
      "Loyalty token issuance",
      "Real-time reporting",
    ],
    integrations: ["Shopify", "WooCommerce", "POS systems", "ERP systems"],
  },
  "manufacturing": {
    title: "Manufacturing",
    subtitle: "Global Supplier Payments & Trade Finance",
    description: "Optimize supply chain payments with multi-currency accounts, FX hedging, and trade finance. Pay suppliers anywhere, instantly.",
    icon: "🏭",
    heroImage: "/images/ship.jpg",
    stats: [
      { value: "200+", label: "Countries" },
      { value: "50+", label: "Rails" },
      { value: "T+0", label: "Settlement" },
      { value: "2%", label: "FX Savings" },
    ],
    useCases: [
      { title: "Supplier Payments", description: "Pay global suppliers in their preferred currency." },
      { title: "FX Optimization", description: "Lock in rates and hedge currency exposure." },
      { title: "Trade Finance", description: "Letters of credit and supply chain financing." },
      { title: "Treasury Centralization", description: "Consolidate global cash with virtual accounts." },
    ],
    features: [
      "Multi-currency accounts",
      "FX forwards & hedging",
      "Batch payments",
      "Virtual IBANs",
      "Automated reconciliation",
      "ERP integration",
      "Compliance screening",
      "Audit trails",
    ],
    integrations: ["SAP", "Oracle", "NetSuite", "Trade finance platforms"],
  },
  "gaming": {
    title: "Gaming & Gambling",
    subtitle: "Fast Deposits, Withdrawals & In-Game Economies",
    description: "Instant deposits and withdrawals globally. Multi-currency wallets, in-game token economies, and NFT integration.",
    icon: "🎮",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "<30s", label: "Deposits" },
      { value: "Instant", label: "Withdrawals" },
      { value: "200+", label: "Countries" },
      { value: "50+", label: "Cryptos" },
    ],
    useCases: [
      { title: "Instant Deposits", description: "Crypto and fiat deposits in under 30 seconds." },
      { title: "Fast Withdrawals", description: "Same-day payouts in player's preferred method." },
      { title: "In-Game Currencies", description: "Issue and manage game tokens and virtual items." },
      { title: "NFT Marketplace", description: "Trade in-game items and collectibles as NFTs." },
    ],
    features: [
      "Instant crypto deposits",
      "Fast fiat withdrawals",
      "Multi-currency wallets",
      "Token issuance",
      "NFT minting & trading",
      "Age verification",
      "Geo-blocking",
      "Responsible gaming tools",
    ],
    integrations: ["Game engines", "NFT marketplaces", "Payment gateways", "KYC providers"],
  },
  "professional-services": {
    title: "Professional Services",
    subtitle: "Global Invoicing & Multi-Currency Receivables",
    description: "Bill clients in 180+ currencies, manage global receivables, and automate reconciliation. Perfect for law firms, consultancies, and agencies.",
    icon: "💼",
    heroImage: "/images/working_team.jpg",
    stats: [
      { value: "180+", label: "Currencies" },
      { value: "T+1", label: "Settlement" },
      { value: "100%", label: "Reconciled" },
      { value: "50%", label: "Time Saved" },
    ],
    useCases: [
      { title: "Global Invoicing", description: "Send invoices in client's currency with automatic FX." },
      { title: "Multi-Currency Receivables", description: "Collect payments from anywhere, any currency." },
      { title: "Automated Reconciliation", description: "Match payments to invoices automatically." },
      { title: "Expense Management", description: "Corporate cards and expense tracking for teams." },
    ],
    features: [
      "Multi-currency invoicing",
      "Automatic payment matching",
      "Client payment portals",
      "Corporate cards",
      "Expense management",
      "Time & billing integration",
      "Trust accounting",
      "Audit trails",
    ],
    integrations: ["QuickBooks", "Xero", "Clio", "Practice management"],
  },
  "real-estate": {
    title: "Real Estate",
    subtitle: "Property Tokenization & Cross-Border Transactions",
    description: "Tokenize properties for fractional ownership, manage cross-border transactions, and streamline investor communications.",
    icon: "🏢",
    heroImage: "/images/tower_full.jpg",
    stats: [
      { value: "$1B+", label: "Tokenized" },
      { value: "200+", label: "Countries" },
      { value: "24/7", label: "Trading" },
      { value: "100%", label: "Compliant" },
    ],
    useCases: [
      { title: "Property Tokenization", description: "Issue security tokens representing real estate ownership." },
      { title: "Fractional Ownership", description: "Enable small investors to own property fractions." },
      { title: "Cross-Border Transactions", description: "Simplify international property purchases." },
      { title: "Investor Management", description: "Automated distributions and cap table management." },
    ],
    features: [
      "Security token issuance",
      "Fractional ownership",
      "Investor portals",
      "Automated distributions",
      "Cap table management",
      "KYC/AML compliance",
      "Secondary trading",
      "Multi-currency support",
    ],
    integrations: ["Title companies", "Escrow services", "Legal platforms", "Investor CRMs"],
  },
  "ngo": {
    title: "NGOs & Non-Profits",
    subtitle: "Global Donations & Transparent Fund Management",
    description: "Accept donations in crypto and fiat from 200+ countries. Transparent fund tracking, grant disbursement, and compliance reporting.",
    icon: "🤝",
    heroImage: "/images/working_team2.jpg",
    stats: [
      { value: "200+", label: "Countries" },
      { value: "0%", label: "Crypto Fees" },
      { value: "100%", label: "Transparent" },
      { value: "T+0", label: "Grants" },
    ],
    useCases: [
      { title: "Global Donations", description: "Accept donations in any currency, any payment method." },
      { title: "Crypto Donations", description: "Receive Bitcoin, Ethereum, and stablecoins tax-efficiently." },
      { title: "Grant Disbursement", description: "Send grants instantly to recipients worldwide." },
      { title: "Fund Transparency", description: "On-chain tracking for complete donor visibility." },
    ],
    features: [
      "Multi-currency donations",
      "Crypto acceptance",
      "Instant grant payouts",
      "On-chain transparency",
      "Donor portals",
      "Tax receipts",
      "Compliance reporting",
      "DAF integration",
    ],
    integrations: ["CRMs", "Donor platforms", "Accounting", "Blockchain explorers"],
  },
};

interface IndustryContent {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  useCases: { title: string; description: string }[];
  features: string[];
  integrations: string[];
}

export default function IndustryPage() {
  const params = useParams();
  const industry = params.industry as string;
  const data = industryData[industry];

  if (!data) {
    return <NotFound>Industry not found</NotFound>;
  }

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroIcon>{data.icon}</HeroIcon>
          <HeroBadge>{data.title}</HeroBadge>
          <HeroTitle>{data.subtitle}</HeroTitle>
          <HeroDescription>{data.description}</HeroDescription>
          <HeroButtons>
            <Link href="https://app.lux.financial/registration" target="_blank">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="/contact">
              <SecondaryButton>Contact Sales</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatsGrid>
          {data.stats.map((stat, i) => (
            <StatCard key={i}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      <Section>
        <SectionTitle>Use Cases</SectionTitle>
        <UseCasesGrid>
          {data.useCases.map((useCase, i) => (
            <UseCaseCard key={i}>
              <UseCaseTitle>{useCase.title}</UseCaseTitle>
              <UseCaseDescription>{useCase.description}</UseCaseDescription>
            </UseCaseCard>
          ))}
        </UseCasesGrid>
      </Section>

      <Section>
        <SectionTitle>Features</SectionTitle>
        <FeaturesGrid>
          {data.features.map((feature, i) => (
            <FeatureItem key={i}>
              <CheckIcon />
              {feature}
            </FeatureItem>
          ))}
        </FeaturesGrid>
      </Section>

      <Section>
        <SectionTitle>Integrations</SectionTitle>
        <IntegrationsGrid>
          {data.integrations.map((integration, i) => (
            <IntegrationBadge key={i}>{integration}</IntegrationBadge>
          ))}
        </IntegrationsGrid>
      </Section>

      <CTASection>
        <CTATitle>Ready to get started?</CTATitle>
        <CTADescription>
          Talk to our team about how Lux can power your {data.title.toLowerCase()} infrastructure.
        </CTADescription>
        <CTAButtons>
          <Link href="https://app.lux.financial/registration" target="_blank">
            <CustomButton>Start Free</CustomButton>
          </Link>
          <Link href="/contact">
            <SecondaryButton>Contact Sales</SecondaryButton>
          </Link>
        </CTAButtons>
      </CTASection>
    </PageContainer>
  );
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const NotFound = styled.div`
  padding: 10rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 1.8rem;
`;

const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;
  @media ${DeviceSize.sm} { padding: 0 1rem; padding-top: 56px; }
`;

const HeroSection = styled.section`
  padding: 6rem 0 4rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: #D4AF37;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  @media ${DeviceSize.sm} { font-size: 2.8rem; }
`;

const HeroDescription = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2rem;
  @media ${DeviceSize.sm} { font-size: 1.6rem; }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  @media ${DeviceSize.sm} { flex-direction: column; }
`;

const StatsSection = styled.section`
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  @media ${DeviceSize.sm} { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #D4AF37;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.45);
`;

const Section = styled.section`
  padding: 4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 2rem;
`;

const UseCasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  @media ${DeviceSize.sm} { grid-template-columns: 1fr; }
`;

const UseCaseCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
`;

const UseCaseTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const UseCaseDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media ${DeviceSize.sm} { grid-template-columns: 1fr; }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.65);
  svg { flex-shrink: 0; }
`;

const IntegrationsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const IntegrationBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 6rem 0;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  @media ${DeviceSize.sm} { flex-direction: column; }
`;
