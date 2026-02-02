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
    subtitle: "Enterprise Crypto Infrastructure for Banks",
    description: "Launch digital asset services in weeks, not years. JPMorgan, Goldman, and BNY Mellon are already offering crypto custody—don't get left behind. Our infrastructure powers compliant crypto banking for institutions managing $100B+ in assets.",
    icon: "🏦",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "$2B+", label: "Assets Secured" },
      { value: "15+", label: "Chains Supported" },
      { value: "99.99%", label: "Uptime SLA" },
      { value: "SOC 2", label: "Type II" },
    ],
    useCases: [
      { title: "Crypto Custody Services", description: "Like BNY Mellon's Digital Asset Custody—offer institutional-grade safekeeping with $250M insurance coverage and MPC technology." },
      { title: "Cross-Chain Treasury", description: "Move assets across Ethereum, Polygon, and 15+ chains in seconds via Teleport. No bridge risk, no delays, instant finality." },
      { title: "Staking-as-a-Service", description: "Generate 4-8% APY for clients across 20+ PoS networks. Like Coinbase Prime staking, but white-labeled for your brand." },
      { title: "Tokenized Securities", description: "Issue and trade security tokens like JP Morgan's JPM Coin. Full SEC compliance with cap table management." },
    ],
    features: [
      "MPC custody with Fireblocks-grade security",
      "Teleport instant cross-chain settlement",
      "CRYSTALS-Dilithium post-quantum signatures",
      "Staking across ETH, SOL, DOT, AVAX, LUX",
      "Treasury management with auto-rebalancing",
      "HSM integration (AWS CloudHSM, Thales)",
      "White-label client dashboards",
      "SAR/CTR automated reporting",
    ],
    integrations: ["FIS", "Fiserv", "Jack Henry", "Temenos", "SWIFT gpi", "Chainalysis", "Elliptic"],
  },
  "fintech": {
    title: "FinTech",
    subtitle: "Build the Next Revolut or Cash App",
    description: "Launch a crypto-enabled neobank in 60 days. Chime raised $750M, Revolut hit $45B valuation—the market is proven. Our API-first platform powers 50+ fintechs processing $10B+ annually.",
    icon: "💳",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "60 days", label: "Time to Launch" },
      { value: "40+", label: "Fiat Countries" },
      { value: "$10B+", label: "Annual Volume" },
      { value: "50+", label: "Live Fintechs" },
    ],
    useCases: [
      { title: "Crypto Neobank", description: "Build like Revolut—banking app with crypto trading, staking, and instant USDC remittances. One API, full product." },
      { title: "Embedded Wallets", description: "Like Cash App's Bitcoin feature—add non-custodial wallets to any app. Users control keys, you control UX." },
      { title: "Yield Accounts", description: "Offer 5-8% APY like BlockFi (but compliant). Staking yields on ETH, SOL, LUX with institutional custody." },
      { title: "Global Remittances", description: "Wise meets crypto—$5 flat fee to 40+ countries via stablecoin rails. Settlement in minutes, not days." },
    ],
    features: [
      "Revolut-style multi-currency accounts",
      "Embedded crypto trading (limit, market, recurring)",
      "Staking yields with auto-compounding",
      "USDC/USDT instant remittances",
      "Plaid & MX Money integration",
      "White-label iOS/Android apps",
      "Persona & Jumio KYC built-in",
      "Push notifications & in-app chat",
    ],
    integrations: ["Plaid", "MX Money", "Persona", "Jumio", "Sardine", "Unit", "Synapse", "Marqeta"],
  },
  "insurance": {
    title: "Insurance",
    subtitle: "Instant Claims, Global Premiums",
    description: "Lemonade pays claims in 3 seconds. AXA operates in 50 countries. Now you can too. Our platform powers $500M+ in premiums across 40+ insurers—from global carriers to MGAs.",
    icon: "🛡️",
    heroImage: "/images/security.jpg",
    stats: [
      { value: "3 sec", label: "Claims Payout" },
      { value: "200+", label: "Countries" },
      { value: "60%", label: "Cost Reduction" },
      { value: "$500M+", label: "Premiums Processed" },
    ],
    useCases: [
      { title: "Instant Claims", description: "Like Lemonade's AI claims—pay valid claims in seconds, not weeks. Direct ACH, card push, or stablecoin rails." },
      { title: "Global Premium Collection", description: "Collect premiums like AXA—local payment methods in 200+ countries. Alipay in China, Pix in Brazil, cards everywhere." },
      { title: "Treasury Optimization", description: "Float management like Berkshire—earn yield on reserves. Multi-currency accounts, FX hedging, and T-bill ladders." },
      { title: "Reinsurance Settlement", description: "Instant settlement with reinsurers via stablecoin rails. Lloyd's is already exploring blockchain settlement." },
    ],
    features: [
      "Instant ACH, card push, RTP payouts",
      "Local payment methods in 200+ countries",
      "Float management with yield optimization",
      "Real-time FX hedging",
      "Automated premium reconciliation",
      "State insurance compliance (all 50 states)",
      "White-label policyholder portals",
      "Guidewire & Duck Creek integration",
    ],
    integrations: ["Guidewire", "Duck Creek", "Majesco", "Sapiens", "Swiss Re", "Munich Re", "Verisk"],
  },
  "insurtech": {
    title: "InsurTech",
    subtitle: "Build the Next Lemonade or Root",
    description: "Lemonade IPO'd at $1.6B. Root hit $6B valuation. Parametric insurance is a $29B market by 2031. Our smart contract infrastructure powers the next wave of insurance innovation.",
    icon: "⚡",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "0 sec", label: "Parametric Payout" },
      { value: "90%", label: "Claims Automated" },
      { value: "$29B", label: "Market by 2031" },
      { value: "100%", label: "On-Chain Audit" },
    ],
    useCases: [
      { title: "Parametric Insurance", description: "Like Arbol's crop insurance—automatic payouts when rainfall drops below threshold. Chainlink oracles verify, smart contracts pay." },
      { title: "Flight Delay Insurance", description: "Like Etherisc's FlightDelay—instant USDC payout when FlightAware data confirms delay. No claims, no paperwork." },
      { title: "Microinsurance", description: "Like BIMA's $0.50/month mobile insurance for emerging markets. Embedded in apps, instant coverage, M-Pesa payouts." },
      { title: "DeFi Insurance", description: "Like Nexus Mutual—smart contract cover for DeFi protocols. Pooled risk, transparent reserves, community governance." },
    ],
    features: [
      "Chainlink & API3 oracle integration",
      "ERC-20 policy tokens",
      "Automated claims via smart contracts",
      "Instant USDC/USDT payouts",
      "Weather, flight, earthquake data feeds",
      "Embedded insurance APIs",
      "Community risk pools",
      "Transparent on-chain reserves",
    ],
    integrations: ["Chainlink", "API3", "FlightAware", "Tomorrow.io", "USGS", "Etherisc", "Nexus Mutual"],
  },
  "crypto": {
    title: "Crypto Funds & Corporates",
    subtitle: "Infrastructure for the Next a16z or Paradigm",
    description: "a16z manages $35B. Paradigm raised $2.5B. MicroStrategy holds $4B in BTC. Whether you're a crypto hedge fund, VC, or corporate treasury—our infrastructure is battle-tested for institutional scale.",
    icon: "🪙",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "$5B+", label: "AUM Supported" },
      { value: "20+", label: "Staking Networks" },
      { value: "15%+", label: "Avg Staking APY" },
      { value: "100+", label: "DeFi Protocols" },
    ],
    useCases: [
      { title: "Multi-Chain Treasury", description: "Like MicroStrategy's BTC treasury—manage positions across ETH, SOL, LUX, and 50+ assets. Real-time P&L, tax lot tracking, automated rebalancing." },
      { title: "Institutional Staking", description: "Like Coinbase Cloud validators—run ETH, SOL, LUX validators with 99.9% uptime. Slashing insurance, MEV optimization, and institutional SLAs." },
      { title: "DeFi Strategies", description: "Like Maple Finance's institutional lending—deploy to Aave, Compound, Lido with risk guardrails. One dashboard, all protocols." },
      { title: "Fund Administration", description: "Like Anchorage for funds—NAV calculation, investor reporting, K-1 generation. Full audit trail for LPs." },
    ],
    features: [
      "Teleport: instant cross-chain (no bridges)",
      "Portfolio aggregation across 50+ chains",
      "Validator operations with slashing insurance",
      "DeFi position management (Aave, Lido, etc.)",
      "MPC custody with $250M insurance",
      "Tax lot accounting (FIFO, LIFO, HIFO)",
      "LP reporting and K-1 generation",
      "Post-quantum signature migration path",
    ],
    integrations: ["Anchorage", "BitGo", "Fireblocks", "Chainalysis", "Lukka", "Coinbase Prime", "Galaxy"],
  },
  "saas": {
    title: "SaaS Platforms",
    subtitle: "Build Like Stripe Atlas or Shopify Payments",
    description: "Shopify Payments processes $100B+ annually. Stripe Atlas launched 500K+ companies. Embed financial services into your SaaS—subscriptions, payouts, embedded banking—and unlock new revenue streams.",
    icon: "☁️",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "180+", label: "Currencies" },
      { value: "200+", label: "Countries" },
      { value: "$0", label: "FX Markup" },
      { value: "30%+", label: "Revenue Uplift" },
    ],
    useCases: [
      { title: "Global Subscriptions", description: "Like Paddle or Chargebee—bill in local currency, handle tax compliance (VAT/GST), and reduce churn with smart retries." },
      { title: "Marketplace Payouts", description: "Like Stripe Connect—split payments, instant payouts to sellers. Power marketplaces like Airbnb or Uber." },
      { title: "Embedded Banking", description: "Like Mercury for SaaS—offer your users business accounts, cards, and bill pay. New revenue, deeper lock-in." },
      { title: "Usage-Based Billing", description: "Like Metronome—meter API calls, compute hours, or any usage. Real-time invoicing for consumption models." },
    ],
    features: [
      "Merchant of Record (handle tax globally)",
      "Multi-currency subscriptions",
      "Smart dunning & retry logic",
      "Marketplace split payments",
      "Embedded bank accounts & cards",
      "Usage-based metering APIs",
      "Revenue recognition automation",
      "Real-time analytics & webhooks",
    ],
    integrations: ["Stripe", "Paddle", "Chargebee", "Metronome", "QuickBooks", "Xero", "Segment", "Salesforce"],
  },
  "retail": {
    title: "Retail & E-commerce",
    subtitle: "Accept Crypto Like Tesla, Pay Like Amazon",
    description: "Tesla accepts Bitcoin. Amazon pays suppliers in 200+ countries. Starbucks offers rewards in crypto. Modernize your retail treasury and payments infrastructure.",
    icon: "🛒",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "2%", label: "Crypto Adoption" },
      { value: "4-8%", label: "Staking Yield" },
      { value: "T+0", label: "Settlement" },
      { value: "40+", label: "Fiat Countries" },
    ],
    useCases: [
      { title: "Crypto Checkout", description: "Like BitPay for Newegg—accept BTC, ETH, stablecoins at checkout. Instant conversion to fiat, no volatility risk." },
      { title: "Supplier Payments", description: "Like Amazon's global payments—pay suppliers in 200+ countries via local rails or stablecoins. 2-3% FX savings." },
      { title: "Treasury Yield", description: "Like Apple's $200B treasury—earn 4-8% on idle cash via staking or DeFi yields. Better than money market funds." },
      { title: "Loyalty & Rewards", description: "Like Starbucks Odyssey—NFT rewards, token-gated perks, and crypto loyalty programs." },
    ],
    features: [
      "Crypto checkout (BTC, ETH, USDC)",
      "Instant fiat conversion",
      "Global supplier payments (200+ countries)",
      "Treasury staking (4-8% APY)",
      "NFT loyalty programs",
      "MPC custody for corporate wallets",
      "ERP integration (SAP, Oracle)",
      "Real-time FX hedging",
    ],
    integrations: ["Shopify", "Magento", "SAP", "Oracle", "BitPay", "Coinbase Commerce", "Starbucks Odyssey"],
  },
  "manufacturing": {
    title: "Manufacturing",
    subtitle: "Supply Chain Payments Like Apple or Toyota",
    description: "Apple pays suppliers in 40+ countries. Toyota's supply chain spans 200+ vendors. Optimize your global supplier payments with instant settlements, FX hedging, and trade finance.",
    icon: "🏭",
    heroImage: "/images/ship.jpg",
    stats: [
      { value: "2-3%", label: "FX Savings" },
      { value: "200+", label: "Countries" },
      { value: "T+0", label: "Settlement" },
      { value: "$10B+", label: "Annual Volume" },
    ],
    useCases: [
      { title: "Supplier Payments", description: "Like Apple's supply chain payments—pay Foxconn in CNY, Samsung in KRW, TSMC in TWD. Local rails, real-time settlement." },
      { title: "Trade Finance", description: "Like Flexport—letters of credit, supply chain financing, and inventory loans. Digitize your trade docs." },
      { title: "FX Treasury", description: "Like Toyota's treasury—centralize 50+ currency accounts, hedge exposure with forwards, and optimize working capital." },
      { title: "Stablecoin Rails", description: "Pay suppliers in USDC for instant settlement. No SWIFT delays, no correspondent banks, T+0 finality." },
    ],
    features: [
      "Multi-currency accounts (50+ currencies)",
      "Real-time FX hedging & forwards",
      "Batch payments to 200+ countries",
      "Virtual IBANs per supplier",
      "Trade finance (LC, SCF, invoice)",
      "Stablecoin rails for instant settlement",
      "SAP & Oracle ERP integration",
      "OFAC & sanctions screening",
    ],
    integrations: ["SAP", "Oracle", "NetSuite", "Flexport", "Tradeshift", "C2FO", "PrimeRevenue"],
  },
  "gaming": {
    title: "Gaming & Gambling",
    subtitle: "Build Like Axie Infinity or DraftKings",
    description: "Axie Infinity hit $4B in NFT sales. DraftKings processes $1B+ monthly. The intersection of gaming and crypto is massive—our infrastructure powers in-game economies, instant payouts, and player wallets.",
    icon: "🎮",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "<1 sec", label: "Deposits" },
      { value: "200+", label: "Countries" },
      { value: "$1B+", label: "Monthly Volume" },
      { value: "MPC", label: "Player Wallets" },
    ],
    useCases: [
      { title: "Instant Deposits", description: "Like DraftKings—deposits appear in seconds via crypto rails. Support BTC, ETH, USDC, and 50+ tokens." },
      { title: "Player Wallets", description: "Like Axie's Ronin—embedded wallets for in-game assets. MPC custody, no seed phrases, gasless transactions." },
      { title: "NFT Marketplace", description: "Like Immutable X—zero gas fees, instant trades, carbon-neutral NFTs. Built-in royalty enforcement." },
      { title: "Token Economies", description: "Like Gala Games—launch in-game tokens, manage inflation, and enable player-owned economies." },
    ],
    features: [
      "Instant crypto deposits (no confirmations)",
      "MPC player wallets (no seed phrases)",
      "Gasless transactions (meta-transactions)",
      "NFT minting & marketplace",
      "In-game token issuance",
      "Anti-fraud & velocity checks",
      "Age verification integration",
      "Multi-jurisdiction compliance",
    ],
    integrations: ["Unity", "Unreal Engine", "Immutable X", "OpenSea", "Polygon", "Arbitrum", "GamStop"],
  },
  "professional-services": {
    title: "Professional Services",
    subtitle: "Global Billing Like Big 4 Firms",
    description: "Deloitte bills in 150+ countries. Kirkland & Ellis topped $6B in revenue. Law firms, consultancies, and agencies need global billing—we make it seamless.",
    icon: "💼",
    heroImage: "/images/working_team.jpg",
    stats: [
      { value: "180+", label: "Currencies" },
      { value: "60%", label: "Faster Collections" },
      { value: "100%", label: "Auto-Reconciled" },
      { value: "$1B+", label: "Billed Annually" },
    ],
    useCases: [
      { title: "Multi-Currency Invoicing", description: "Like Baker McKenzie—invoice in 180+ currencies with real-time FX rates. Clients pay in local currency, you receive USD/EUR." },
      { title: "Trust & Escrow", description: "Like law firm IOLTA accounts—segregated client funds, automated three-way reconciliation, full audit trail." },
      { title: "Matter Billing", description: "Like Clio's billing—track time, expenses, and disbursements. Auto-generate invoices, handle retainers." },
      { title: "Expense Management", description: "Like Brex for law firms—corporate cards with matter codes, receipt capture, and policy controls." },
    ],
    features: [
      "Multi-currency invoicing (180+ currencies)",
      "Trust/IOLTA account management",
      "Automated three-way reconciliation",
      "Corporate cards with matter codes",
      "Client payment portals",
      "Retainer & evergreen management",
      "State bar compliance (all 50 states)",
      "Clio & Thomson Reuters integration",
    ],
    integrations: ["Clio", "Thomson Reuters", "Aderant", "NetDocuments", "QuickBooks", "Xero", "Bill.com"],
  },
  "real-estate": {
    title: "Real Estate",
    subtitle: "Tokenize Like RealT or Cadre",
    description: "RealT tokenized $100M+ in properties. Cadre manages $4B in assets. Real estate tokenization enables fractional ownership, global investors, and 24/7 liquidity.",
    icon: "🏢",
    heroImage: "/images/tower_full.jpg",
    stats: [
      { value: "$16T", label: "Market Size" },
      { value: "24/7", label: "Liquidity" },
      { value: "$50", label: "Min Investment" },
      { value: "SEC", label: "Compliant" },
    ],
    useCases: [
      { title: "Property Tokenization", description: "Like RealT—fractionalize properties into security tokens. $50 minimum investment, SEC Reg D/Reg A+ compliant." },
      { title: "Global Distributions", description: "Like Cadre—pay dividends to 10,000+ investors worldwide via stablecoin rails. Instant, no wire fees." },
      { title: "Secondary Trading", description: "Like tZERO—enable 24/7 trading of property tokens on regulated ATS platforms. Real liquidity." },
      { title: "Fund Administration", description: "Like Juniper Square—cap table management, K-1 distribution, and investor portals for real estate funds." },
    ],
    features: [
      "SEC Reg D / Reg A+ token issuance",
      "Fractional ownership ($50 minimum)",
      "Automated dividend distribution",
      "Cap table management",
      "Accredited investor verification",
      "Secondary market integration (tZERO)",
      "K-1 and tax document generation",
      "Global investor onboarding",
    ],
    integrations: ["tZERO", "Securitize", "Juniper Square", "AppFolio", "Yardi", "Dealpath", "Carta"],
  },
  "ngo": {
    title: "NGOs, DAOs & Non-Profits",
    subtitle: "Transparent Treasury Like Gitcoin or UNICEF",
    description: "Gitcoin distributed $50M in grants. UNICEF's CryptoFund accepts ETH. DAOs hold $10B+ in treasuries. Transparent, programmable money is transforming philanthropy.",
    icon: "🤝",
    heroImage: "/images/working_team2.jpg",
    stats: [
      { value: "$10B+", label: "DAO Treasuries" },
      { value: "200+", label: "Countries" },
      { value: "100%", label: "Transparent" },
      { value: "T+0", label: "Grant Execution" },
    ],
    useCases: [
      { title: "DAO Treasury", description: "Like Uniswap's $3B treasury—multi-sig with timelocks, spending limits, and on-chain execution. Governed by token holders." },
      { title: "Quadratic Funding", description: "Like Gitcoin Grants—democratic allocation where small donations get matching. Reduce plutocracy, amplify community voice." },
      { title: "Grant Streaming", description: "Like Sablier—stream grants to recipients over time. Milestone-based releases, instant clawback if targets missed." },
      { title: "Global Donations", description: "Like UNICEF CryptoFund—accept BTC, ETH from donors worldwide. Instant conversion, transparent allocation." },
    ],
    features: [
      "Multi-sig treasury (Safe compatible)",
      "Quadratic voting & funding",
      "Grant streaming (Sablier-style)",
      "Token-weighted governance",
      "On-chain proposal execution",
      "Global donation acceptance",
      "Transparent fund tracking",
      "501(c)(3) compliant receipts",
    ],
    integrations: ["Safe (Gnosis)", "Snapshot", "Tally", "Gitcoin", "The Giving Block", "Every.org", "Endaoment"],
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
            <Link href="https://cal.com/luxfi" target="_blank">
              <SecondaryButton>Talk to Sales</SecondaryButton>
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
          <Link href="https://cal.com/luxfi" target="_blank">
            <SecondaryButton>Talk to Sales</SecondaryButton>
          </Link>
        </CTAButtons>
      </CTASection>
    </PageContainer>
  );
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const NotFound = styled.div`
  padding: 10rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
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
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  @media ${DeviceSize.sm} { font-size: 2.8rem; }
`;

const HeroDescription = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
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
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const Section = styled.section`
  padding: 4rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
`;

const UseCasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  @media ${DeviceSize.sm} { grid-template-columns: 1fr; }
`;

const UseCaseCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  transition: border-color 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const UseCaseTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const UseCaseDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
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
  color: ${({ theme }) => theme.colors.secondary};
  svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.primary}; }
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
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 6rem 0;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  @media ${DeviceSize.sm} { flex-direction: column; }
`;
