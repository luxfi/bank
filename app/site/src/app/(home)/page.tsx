"use client";
import Link from "next/link";

import { CustomButton, SecondaryButton } from "@/components/Button";

import {
  PageContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  BadgeRow,
  Badge,
  HeroMock,
  MockFrame,
  MockScreen,
  MockHeader,
  MockDot,
  MockMetric,
  MockLabel,
  MockValue,
  FeatureSection,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  DeveloperSection,
  DeveloperContent,
  DeveloperTitle,
  DeveloperText,
  CodeBlock,
  CodeHeader,
  CodeTab,
  CodeContent,
  SecuritySection,
  SecurityGrid,
  SecurityItem,
  SecurityIcon,
  SecurityText,
  InfraSection,
  InfraGrid,
  InfraCard,
  InfraIcon,
  InfraTitle,
  InfraDescription,
  DemoSection,
  DemoContainer,
  DemoSidebar,
  DemoLogo,
  TriangleLogo,
  DemoLogoText,
  DemoNav,
  DemoNavItem,
  DemoContent,
  DemoHeader,
  DemoTitle,
  DemoCards,
  DemoCard,
  DemoCardLabel,
  DemoCardValue,
  DemoTable,
  DemoTableHeader,
  DemoTableRow,
  StatusBadge,
  CryptoIcon,
  CTASection,
  CTATitle,
  CTASubtitle,
} from "./styles";

// Icons as inline SVGs
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const CpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const ServerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const AtomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ReportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// Triangle Bank uses the clean △ Unicode symbol
const TriangleSymbol = () => (
  <span style={{ fontSize: '1.5em', fontWeight: 300, lineHeight: 1 }}>△</span>
);

const features = [
  {
    icon: WalletIcon,
    title: "All Assets, All Chains",
    description: "Stablecoins, crypto, digital securities, and tokenized assets. Multi-chain support across Ethereum, Polygon, Arbitrum, and 50+ networks.",
  },
  {
    icon: GlobeIcon,
    title: "200+ Countries & Currencies",
    description: "Fiat and crypto payments worldwide. Real-time settlement via blockchain rails with local currency conversion.",
  },
  {
    icon: CurrencyIcon,
    title: "Integrated CEX & DEX",
    description: "White-label exchange platform with CEX liquidity and DEX access. Launch your own trading venue in weeks.",
  },
  {
    icon: ShieldIcon,
    title: "DeFi Infrastructure",
    description: "Deploy AMMs, liquidity pools, and yield products. Full DeFi stack with institutional-grade security and compliance.",
  },
  {
    icon: CodeIcon,
    title: "Developer-first APIs",
    description: "RESTful APIs with webhooks, SDKs, and comprehensive docs. MCP server for AI-powered bank operations.",
  },
  {
    icon: ZapIcon,
    title: "Digital Securities",
    description: "Issue, trade, and settle tokenized securities. Compliant infrastructure for STOs and regulated digital assets.",
  },
];

const infraItems = [
  {
    icon: KeyIcon,
    title: "Lux KMS",
    description: "Enterprise key management with HSM integration",
  },
  {
    icon: CpuIcon,
    title: "Lux MPC",
    description: "Multi-party computation for self-hosted custody",
  },
  {
    icon: UsersIcon,
    title: "Lux IAM",
    description: "Enterprise IdP with SSO and role-based access",
  },
  {
    icon: AtomIcon,
    title: "Post-Quantum",
    description: "Future-proof cryptography via Lux Node",
  },
  {
    icon: ServerIcon,
    title: "Node Infrastructure",
    description: "Full blockchain backend with bootnodes",
  },
  {
    icon: BotIcon,
    title: "MCP Server",
    description: "AI-powered operations and customer support",
  },
  {
    icon: LockIcon,
    title: "HSM Support",
    description: "Hardware security module integration",
  },
  {
    icon: ZapIcon,
    title: "ZAP Protocol",
    description: "Browser-extension MCP communication",
  },
];

const securityItems = [
  "Post-quantum cryptographic security via Lux Node infrastructure",
  "Self-hosted custody with Lux MPC and KMS integration",
  "Hardware Security Module (HSM) support for key operations",
  "SOC 2 Type II compliant infrastructure",
  "Role-based access control with enterprise IAM",
  "Real-time transaction monitoring and AI compliance",
  "Multi-factor authentication for all accounts",
  "End-to-end encryption for all data at rest and in transit",
];

const codeSnippet = `// Create a stablecoin-enabled account
const account = await lux.accounts.create({
  type: 'business',
  currencies: ['USD', 'USDC', 'USDT'],
  chains: ['polygon', 'ethereum'],
  custody: 'mpc', // Use Lux MPC
  metadata: { customerId: 'cust_123' }
});

// Send stablecoins globally
const payment = await lux.payments.create({
  from: account.id,
  to: 'wallet_or_iban',
  amount: 10000,
  currency: 'USDC',
  chain: 'polygon', // Instant settlement
  destinationCountry: 'NG' // Nigeria
});`;

const demoPayments = [
  { id: '1234455', date: 'Sep 20, 2025', originator: 'Zoogle', country: 'Nigeria', currency: 'USDC', sent: '3,000.00', received: '₦4,380,000.00', status: 'completed' as const },
  { id: '6535518', date: 'Sep 20, 2025', originator: 'Lunexa', country: 'Mexico', currency: 'USDC', sent: '45,000.00', received: 'MX$11,54,000.00', status: 'completed' as const },
  { id: '6515366', date: 'Sep 20, 2025', originator: 'Veridra', country: 'Mexico', currency: 'USDT', sent: '100,000.00', received: 'MX$1,846,000.00', status: 'completed' as const },
  { id: '5586812', date: 'Sep 20, 2025', originator: 'Nuvanti', country: 'India', currency: 'USDT', sent: '5,124.00', received: '₹889,118.92', status: 'completed' as const },
  { id: '6535318', date: 'Sep 20, 2025', originator: 'Klyra', country: 'Nigeria', currency: 'USDT', sent: '5,100.00', received: '₦7,461,369.00', status: 'completed' as const },
];

export default function Home() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            The complete financial infrastructure for the digital economy
          </HeroTitle>
          <HeroSubtitle>
            Fiat, crypto, stablecoins, digital securities. CEX, DEX, AMM.
            200+ countries. All in one platform with post-quantum security.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="https://app.lux.financial/registration" target="_blank">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="/contact">
              <SecondaryButton>Contact Sales</SecondaryButton>
            </Link>
          </HeroButtons>
          <BadgeRow>
            <Badge>CEX + DEX</Badge>
            <Badge>AMM + DeFi</Badge>
            <Badge>Digital Securities</Badge>
            <Badge>200+ Countries</Badge>
          </BadgeRow>
        </HeroContent>

        <HeroMock>
          <MockFrame>
            <MockScreen>
              <MockHeader>
                <MockDot />
                <MockDot />
                <MockDot />
              </MockHeader>
              <MockMetric>
                <MockLabel>Total Balance (Multi-chain)</MockLabel>
                <MockValue>$2,847,293.00</MockValue>
              </MockMetric>
              <MockMetric>
                <MockLabel>USDC on Polygon</MockLabel>
                <MockValue>$1,428,500.00</MockValue>
              </MockMetric>
              <MockMetric>
                <MockLabel>USDT on Ethereum</MockLabel>
                <MockValue>$876,293.00</MockValue>
              </MockMetric>
            </MockScreen>
          </MockFrame>
        </HeroMock>
      </HeroSection>

      {/* Feature Grid */}
      <FeatureSection>
        <SectionHeader>
          <SectionTitle>Everything you need to build</SectionTitle>
          <SectionSubtitle>
            Banking, trading, DeFi, and digital assets—unified infrastructure for fintechs, neobanks, and financial institutions worldwide.
          </SectionSubtitle>
        </SectionHeader>

        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>
                <feature.icon />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeatureSection>

      {/* Infrastructure Section */}
      <InfraSection>
        <SectionHeader>
          <SectionTitle>Enterprise-grade infrastructure</SectionTitle>
          <SectionSubtitle>
            Built on Lux&apos;s vertically integrated stack: KMS, MPC, IAM, HSM, and post-quantum security.
          </SectionSubtitle>
        </SectionHeader>

        <InfraGrid>
          {infraItems.map((item, index) => (
            <InfraCard key={index}>
              <InfraIcon>
                <item.icon />
              </InfraIcon>
              <InfraTitle>{item.title}</InfraTitle>
              <InfraDescription>{item.description}</InfraDescription>
            </InfraCard>
          ))}
        </InfraGrid>
      </InfraSection>

      {/* Demo Showcase - Triangle Bank */}
      <DemoSection>
        <SectionHeader>
          <SectionTitle>See it in action</SectionTitle>
          <SectionSubtitle>
            Triangle Bank—a demo neobank built on Lux Financial showing real-time stablecoin payments.
          </SectionSubtitle>
        </SectionHeader>

        <DemoContainer>
          <DemoSidebar>
            <DemoLogo>
              <TriangleLogo>
                <TriangleSymbol />
              </TriangleLogo>
              <DemoLogoText>Triangle Bank</DemoLogoText>
            </DemoLogo>
            <DemoNav>
              <DemoNavItem>
                <GlobeIcon />
                Payments
              </DemoNavItem>
              <DemoNavItem $active>
                <ReportIcon />
                Reports
              </DemoNavItem>
              <DemoNavItem>
                <WalletIcon />
                Wallets
              </DemoNavItem>
              <DemoNavItem>
                <UsersIcon />
                Settings
              </DemoNavItem>
            </DemoNav>
          </DemoSidebar>

          <DemoContent>
            <DemoHeader>
              <DemoTitle>Reports</DemoTitle>
            </DemoHeader>

            <DemoCards>
              <DemoCard>
                <DemoCardLabel>Available Balance</DemoCardLabel>
                <DemoCardValue>$1,750,000.00</DemoCardValue>
              </DemoCard>
              <DemoCard style={{ border: '1px solid rgba(255, 255, 255, 0.25)', background: 'rgba(255, 255, 255, 0.05)' }}>
                <DemoCardLabel style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Available USDC</DemoCardLabel>
                <DemoCardValue>
                  <CryptoIcon $type="usdc">$</CryptoIcon>
                  1,500,000.00
                </DemoCardValue>
              </DemoCard>
              <DemoCard>
                <DemoCardLabel>Available USDT</DemoCardLabel>
                <DemoCardValue>
                  <CryptoIcon $type="usdt">₮</CryptoIcon>
                  250,000
                </DemoCardValue>
              </DemoCard>
            </DemoCards>

            <DemoTable>
              <DemoTableHeader>
                <span>Payment ID</span>
                <span>Date/Time</span>
                <span>Originator</span>
                <span>Country</span>
                <span>Sent Amount</span>
                <span>Received Amount</span>
                <span>Status</span>
              </DemoTableHeader>
              {demoPayments.map((payment) => (
                <DemoTableRow key={payment.id}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', opacity: 0.7 }}>{payment.id}</span>
                  <span style={{ opacity: 0.6 }}>{payment.date}</span>
                  <span>{payment.originator}</span>
                  <span>{payment.country}</span>
                  <span>
                    <CryptoIcon $type={payment.currency.toLowerCase() as 'usdc' | 'usdt'}>
                      {payment.currency === 'USDC' ? '$' : '₮'}
                    </CryptoIcon>
                    {payment.sent} {payment.currency}
                  </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{payment.received}</span>
                  <StatusBadge $status={payment.status}>
                    <CheckIcon /> Sent
                  </StatusBadge>
                </DemoTableRow>
              ))}
            </DemoTable>
          </DemoContent>
        </DemoContainer>
      </DemoSection>

      {/* Developer Section */}
      <DeveloperSection>
        <DeveloperContent>
          <DeveloperTitle>Integrate in days, not quarters</DeveloperTitle>
          <DeveloperText>
            Our APIs are designed for developers. Clean REST endpoints, MCP server for AI operations,
            and ZAP protocol for real-time browser communication. Ship stablecoin features without the complexity.
          </DeveloperText>
          <Link href="https://docs.lux.financial" target="_blank">
            <SecondaryButton>View Documentation</SecondaryButton>
          </Link>
        </DeveloperContent>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>Node.js</CodeTab>
            <CodeTab>Python</CodeTab>
            <CodeTab>MCP</CodeTab>
          </CodeHeader>
          <CodeContent>
            {codeSnippet}
          </CodeContent>
        </CodeBlock>
      </DeveloperSection>

      {/* Security Section */}
      <SecuritySection>
        <SectionHeader>
          <SectionTitle>Security by default</SectionTitle>
          <SectionSubtitle>
            Post-quantum security, MPC custody, and enterprise HSM integration. Your assets and your customers&apos; assets, protected.
          </SectionSubtitle>
        </SectionHeader>

        <SecurityGrid>
          {securityItems.map((item, index) => (
            <SecurityItem key={index}>
              <SecurityIcon>
                <CheckIcon />
              </SecurityIcon>
              <SecurityText>{item}</SecurityText>
            </SecurityItem>
          ))}
        </SecurityGrid>
      </SecuritySection>

      {/* Final CTA */}
      <CTASection>
        <CTATitle>Ready to build the future of finance?</CTATitle>
        <CTASubtitle>
          Join companies building banks, exchanges, and DeFi products on Lux Financial&apos;s unified infrastructure.
        </CTASubtitle>
        <Link href="https://app.lux.financial/registration" target="_blank">
          <CustomButton>Start Building</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}
