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
  PlatformShowcase,
  PlatformLeft,
  PlatformRight,
  DashboardMock,
  DashboardBrowser,
  BrowserDots,
  BrowserDot,
  BrowserUrl,
  BrowserUrlBox,
  DashboardBody,
  DashboardSidebar,
  DashboardBrand,
  DashboardBrandIcon,
  DashboardBrandText,
  DashboardNavItem,
  DashboardMain,
  DashboardTopBar,
  DashboardPageTitle,
  DashboardStatus,
  StatusDot,
  DashboardStats,
  DashboardStat,
  DashboardStatLabel,
  DashboardStatValue,
  DashboardStatChange,
  DashboardTable,
  DashboardTableRow,
  TerminalMock,
  TerminalHeader,
  TerminalTitle,
  TerminalBody,
  TerminalLine,
  TerminalCursor,
  MobileDeviceMock,
  MobileDeviceScreen,
  MobileDeviceNotch,
  MobileDeviceNotchInner,
  MobileDeviceContent,
  MobileDeviceHeader,
  MobileDeviceBrand,
  MobileDeviceLogo,
  MobileDeviceName,
  MobileDeviceBalance,
  MobileDeviceBalanceLabel,
  MobileDeviceBalanceValue,
  MobileDeviceActions,
  MobileDeviceAction,
  MobileDeviceActionIcon,
  MobileDeviceActionLabel,
  MobileDeviceAsset,
  MobileDeviceAssetInfo,
  MobileDeviceAssetIcon,
  MobileDeviceAssetName,
  MobileDeviceAssetValue,
  MobileDeviceHomeBar,
  MobileDeviceHomeBarInner,
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
  MobileSection,
  MobileContent,
  MobileText,
  MobileBadge,
  MobileTitle,
  MobileDescription,
  MobileFeatures,
  MobileFeature,
  MobileButtons,
  AppStoreBadge,
  AppStoreText,
  AppStoreLabel,
  AppStoreName,
  MobilePhones,
  PhoneMockup,
  PhoneScreen,
  PhoneNotch,
  PhoneContent,
  PhoneBalance,
  PhoneBalanceLabel,
  PhoneBalanceValue,
  PhoneActions,
  PhoneAction,
  PhoneActionIcon,
  PhoneActionLabel,
  PhoneAssets,
  PhoneAsset,
  PhoneAssetInfo,
  PhoneAssetIcon,
  PhoneAssetName,
  PhoneAssetValue,
  StatsSection,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  IndustriesSection,
  IndustriesGrid,
  IndustryCard,
  IndustryIcon,
  IndustryName,
  ViewAllLink,
  ComplianceSection,
  ComplianceGrid,
  ComplianceCard,
  ComplianceTitle,
  ComplianceDescription,
} from "./styles";

// Icons as inline SVGs
const SmartphoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const ReceiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const PlayStoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.5 12.92 20.16 13.19L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"/>
  </svg>
);

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

const VoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
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
    icon: ZapIcon,
    title: "Teleport: Instant Cross-Chain",
    description: "Move assets between Ethereum, Polygon, Arbitrum, Base, Solana, and 15+ chains in seconds. No bridges, no delays, no risk.",
  },
  {
    icon: ShieldIcon,
    title: "MPC + KMS + HSM Security",
    description: "Multi-party computation custody with enterprise key management. HSM integration for AWS CloudHSM, Azure, and Thales.",
  },
  {
    icon: WalletIcon,
    title: "Omni-Chain Treasury",
    description: "Unified wallet and treasury management across all chains. Real-time balance aggregation, automated rebalancing, and FX optimization.",
  },
  {
    icon: AtomIcon,
    title: "Post-Quantum Ready",
    description: "Future-proof cryptography with CRYSTALS-Dilithium, Kyber, and SPHINCS+. Enterprise banking security for the quantum era.",
  },
  {
    icon: CurrencyIcon,
    title: "Staking & Validators",
    description: "Run validators and stake across 20+ PoS networks. Liquid staking, automated compounding, and institutional-grade yields.",
  },
  {
    icon: GlobeIcon,
    title: "Global Fiat Rails",
    description: "Convert crypto to local currency in 40+ countries. Real-time settlement via ACH, SEPA, SWIFT, PIX, SPEI, and UPI.",
  },
  {
    icon: VoteIcon,
    title: "DAO Governance (lux.vote)",
    description: "Native Lux DAO stack with multi-sig treasury, token voting, role management, and payment streams. Full on-chain proposal execution.",
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

const researchPapers = [
  { title: "Key Management System (KMS)", lp: "0070", description: "Pluggable key storage with HSM integration" },
  { title: "Teleport Protocol", lp: "3004", description: "Cross-chain bridge architecture" },
  { title: "MPC Bridge Security", lp: "3001", description: "Multi-party computation for bridges" },
  { title: "Threshold Signatures", lp: "5014", description: "CGG+21 UC Non-Interactive ECDSA" },
  { title: "FROST Signatures", lp: "5104", description: "Flexible Round-Optimized Schnorr Threshold" },
  { title: "HSM Integration", lp: "5325", description: "Hardware Security Module support" },
  { title: "Post-Quantum Suite", lp: "2200", description: "ML-DSA, ML-KEM, SLH-DSA cryptography" },
  { title: "Threshold Crypto Library", lp: "5340", description: "Core threshold cryptography primitives" },
];

const industries = [
  { slug: "financial-institutions", title: "Financial Institutions", icon: "🏦" },
  { slug: "fintech", title: "FinTech", icon: "💳" },
  { slug: "insurance", title: "Insurance", icon: "🛡️" },
  { slug: "insurtech", title: "InsurTech", icon: "⚡" },
  { slug: "crypto", title: "Crypto & Web3", icon: "🪙" },
  { slug: "saas", title: "SaaS Platforms", icon: "☁️" },
  { slug: "retail", title: "Retail & E-commerce", icon: "🛒" },
  { slug: "manufacturing", title: "Manufacturing", icon: "🏭" },
  { slug: "gaming", title: "Gaming & Gambling", icon: "🎮" },
  { slug: "professional-services", title: "Professional Services", icon: "💼" },
  { slug: "real-estate", title: "Real Estate", icon: "🏢" },
  { slug: "ngo", title: "NGOs, DAOs & Non-Profits", icon: "🤝" },
];

const stats = [
  { value: "<10s", label: "Cross-Chain Teleport" },
  { value: "15+", label: "Blockchain Networks" },
  { value: "20+", label: "Staking Networks" },
  { value: "PQ", label: "Post-Quantum Ready" },
];

const complianceFeatures = [
  {
    title: "KYC/KYB APIs",
    description: "Pluggable identity verification layer. Integrate any provider via unified API.",
  },
  {
    title: "Sanctions Screening",
    description: "Real-time screening against OFAC, UN, EU, UK lists. Daily automated updates via GitHub Actions.",
  },
  {
    title: "Transaction Monitoring",
    description: "Configurable AML rules engine with behavioral analytics and risk scoring.",
  },
  {
    title: "MCP Server",
    description: "Model Context Protocol for AI-powered operations. Natural language banking queries.",
  },
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
  { id: '1234455', date: 'Jan 29, 2026', originator: 'Zoogle', country: 'Nigeria', currency: 'USDC', sent: '3,000.00', received: '₦4,380,000.00', status: 'completed' as const },
  { id: '6535518', date: 'Jan 29, 2026', originator: 'Lunexa', country: 'Mexico', currency: 'USDC', sent: '45,000.00', received: 'MX$854,000.00', status: 'completed' as const },
  { id: '6515366', date: 'Jan 28, 2026', originator: 'Veridra', country: 'Brazil', currency: 'USDT', sent: '100,000.00', received: 'R$580,000.00', status: 'completed' as const },
  { id: '5586812', date: 'Jan 28, 2026', originator: 'Nuvanti', country: 'India', currency: 'USDT', sent: '5,124.00', received: '₹427,118.92', status: 'completed' as const },
  { id: '6535318', date: 'Jan 27, 2026', originator: 'Klyra', country: 'Philippines', currency: 'USDC', sent: '5,100.00', received: '₱285,600.00', status: 'completed' as const },
];

export default function Home() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Enterprise crypto infrastructure. Post-quantum secure.
          </HeroTitle>
          <HeroSubtitle>
            Teleport assets across 15+ chains instantly. MPC custody with HSM integration.
            Treasury management, staking, and validators. Everything banks, funds, and crypto corporates need.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="https://app.lux.financial/registration" target="_blank">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="https://cal.com/luxfi" target="_blank">
              <SecondaryButton>Talk to Sales</SecondaryButton>
            </Link>
          </HeroButtons>
          <BadgeRow>
            <Badge>Teleport</Badge>
            <Badge>MPC + HSM</Badge>
            <Badge>Post-Quantum</Badge>
            <Badge>Staking</Badge>
          </BadgeRow>
        </HeroContent>

        {/* Multi-Platform Showcase */}
        <PlatformShowcase>
          <PlatformLeft>
            {/* Dashboard Mockup - app.lux.financial */}
            <DashboardMock>
              <DashboardBrowser>
                <BrowserDots>
                  <BrowserDot $color="rgba(255, 255, 255, 0.4)" />
                  <BrowserDot $color="rgba(255, 255, 255, 0.25)" />
                  <BrowserDot $color="rgba(255, 255, 255, 0.15)" />
                </BrowserDots>
                <BrowserUrl>
                  <BrowserUrlBox>app.lux.financial</BrowserUrlBox>
                </BrowserUrl>
              </DashboardBrowser>
              <DashboardBody>
                <DashboardSidebar>
                  <DashboardBrand>
                    <DashboardBrandIcon>L</DashboardBrandIcon>
                    <DashboardBrandText>Lux</DashboardBrandText>
                  </DashboardBrand>
                  <DashboardNavItem $active>
                    <DashboardIcon />
                    <span>Dashboard</span>
                  </DashboardNavItem>
                  <DashboardNavItem>
                    <WalletIcon />
                    <span>Wallets</span>
                  </DashboardNavItem>
                  <DashboardNavItem>
                    <GlobeIcon />
                    <span>Payments</span>
                  </DashboardNavItem>
                  <DashboardNavItem>
                    <CurrencyIcon />
                    <span>Exchange</span>
                  </DashboardNavItem>
                </DashboardSidebar>
                <DashboardMain>
                  <DashboardTopBar>
                    <DashboardPageTitle>Dashboard</DashboardPageTitle>
                    <DashboardStatus>
                      <StatusDot />
                      All systems live
                    </DashboardStatus>
                  </DashboardTopBar>
                  <DashboardStats>
                    <DashboardStat>
                      <DashboardStatLabel>
                        <CurrencyIcon />
                        Balance
                      </DashboardStatLabel>
                      <DashboardStatValue>$2.84M</DashboardStatValue>
                      <DashboardStatChange $positive>+12.5%</DashboardStatChange>
                    </DashboardStat>
                    <DashboardStat>
                      <DashboardStatLabel>
                        <GlobeIcon />
                        24h Volume
                      </DashboardStatLabel>
                      <DashboardStatValue>$428K</DashboardStatValue>
                      <DashboardStatChange $positive>+8.2%</DashboardStatChange>
                    </DashboardStat>
                    <DashboardStat>
                      <DashboardStatLabel>
                        <WalletIcon />
                        Wallets
                      </DashboardStatLabel>
                      <DashboardStatValue>1,247</DashboardStatValue>
                      <DashboardStatChange $positive>+156</DashboardStatChange>
                    </DashboardStat>
                    <DashboardStat>
                      <DashboardStatLabel>
                        <ZapIcon />
                        Transactions
                      </DashboardStatLabel>
                      <DashboardStatValue>8,392</DashboardStatValue>
                      <DashboardStatChange $positive>+2.1K</DashboardStatChange>
                    </DashboardStat>
                  </DashboardStats>
                  <DashboardTable>
                    <DashboardTableRow $header>
                      <span>Asset</span>
                      <span>Balance</span>
                      <span>Chain</span>
                      <span>Status</span>
                    </DashboardTableRow>
                    <DashboardTableRow>
                      <span>USDC</span>
                      <span>$1,428,500</span>
                      <span>Polygon</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Active</span>
                    </DashboardTableRow>
                    <DashboardTableRow>
                      <span>USDT</span>
                      <span>$876,293</span>
                      <span>Ethereum</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Active</span>
                    </DashboardTableRow>
                    <DashboardTableRow>
                      <span>BTC</span>
                      <span>$542,500</span>
                      <span>Bitcoin</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Active</span>
                    </DashboardTableRow>
                  </DashboardTable>
                </DashboardMain>
              </DashboardBody>
            </DashboardMock>

            {/* Terminal Mockup - CLI */}
            <TerminalMock>
              <TerminalHeader>
                <BrowserDots>
                  <BrowserDot $color="rgba(255, 255, 255, 0.4)" />
                  <BrowserDot $color="rgba(255, 255, 255, 0.25)" />
                  <BrowserDot $color="rgba(255, 255, 255, 0.15)" />
                </BrowserDots>
                <TerminalTitle>lux-cli — zsh</TerminalTitle>
              </TerminalHeader>
              <TerminalBody>
                <TerminalLine $type="command">$ lux balance --all</TerminalLine>
                <TerminalLine $type="info">Fetching balances across 3 chains...</TerminalLine>
                <TerminalLine $type="success">✓ USDC (Polygon): $1,428,500.00</TerminalLine>
                <TerminalLine $type="success">✓ USDT (Ethereum): $876,293.00</TerminalLine>
                <TerminalLine $type="success">✓ BTC (Bitcoin): $542,500.00</TerminalLine>
                <TerminalLine $type="highlight">Total: $2,847,293.00</TerminalLine>
                <TerminalLine $type="command">$ lux pay --to NG --amount 10000 --currency USDC</TerminalLine>
                <TerminalLine $type="success">✓ Payment sent to Nigeria</TerminalLine>
                <TerminalLine $type="info">$ <TerminalCursor /></TerminalLine>
              </TerminalBody>
            </TerminalMock>
          </PlatformLeft>

          <PlatformRight>
            {/* Mobile Device Mockup */}
            <MobileDeviceMock>
              <MobileDeviceScreen>
                <MobileDeviceNotch>
                  <MobileDeviceNotchInner />
                </MobileDeviceNotch>
                <MobileDeviceContent>
                  <MobileDeviceHeader>
                    <MobileDeviceBrand>
                      <MobileDeviceLogo>L</MobileDeviceLogo>
                      <MobileDeviceName>Lux</MobileDeviceName>
                    </MobileDeviceBrand>
                  </MobileDeviceHeader>
                  <MobileDeviceBalance>
                    <MobileDeviceBalanceLabel>Total Balance</MobileDeviceBalanceLabel>
                    <MobileDeviceBalanceValue>$24,850</MobileDeviceBalanceValue>
                  </MobileDeviceBalance>
                  <MobileDeviceActions>
                    <MobileDeviceAction>
                      <MobileDeviceActionIcon>
                        <SendIcon />
                      </MobileDeviceActionIcon>
                      <MobileDeviceActionLabel>Send</MobileDeviceActionLabel>
                    </MobileDeviceAction>
                    <MobileDeviceAction>
                      <MobileDeviceActionIcon $color="rgba(59, 130, 246, 0.15)">
                        <ReceiveIcon />
                      </MobileDeviceActionIcon>
                      <MobileDeviceActionLabel>Receive</MobileDeviceActionLabel>
                    </MobileDeviceAction>
                  </MobileDeviceActions>
                  <MobileDeviceAsset>
                    <MobileDeviceAssetInfo>
                      <MobileDeviceAssetIcon $color="#2775CA">$</MobileDeviceAssetIcon>
                      <MobileDeviceAssetName>USDC</MobileDeviceAssetName>
                    </MobileDeviceAssetInfo>
                    <MobileDeviceAssetValue>$15,000</MobileDeviceAssetValue>
                  </MobileDeviceAsset>
                  <MobileDeviceAsset>
                    <MobileDeviceAssetInfo>
                      <MobileDeviceAssetIcon $color="#26A17B">₮</MobileDeviceAssetIcon>
                      <MobileDeviceAssetName>USDT</MobileDeviceAssetName>
                    </MobileDeviceAssetInfo>
                    <MobileDeviceAssetValue>$8,500</MobileDeviceAssetValue>
                  </MobileDeviceAsset>
                  <MobileDeviceAsset>
                    <MobileDeviceAssetInfo>
                      <MobileDeviceAssetIcon $color="#F7931A">₿</MobileDeviceAssetIcon>
                      <MobileDeviceAssetName>BTC</MobileDeviceAssetName>
                    </MobileDeviceAssetInfo>
                    <MobileDeviceAssetValue>$1,350</MobileDeviceAssetValue>
                  </MobileDeviceAsset>
                  <MobileDeviceHomeBar>
                    <MobileDeviceHomeBarInner />
                  </MobileDeviceHomeBar>
                </MobileDeviceContent>
              </MobileDeviceScreen>
            </MobileDeviceMock>
          </PlatformRight>
        </PlatformShowcase>
      </HeroSection>

      {/* Stats Section */}
      <StatsSection>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </StatsSection>

      {/* Feature Grid */}
      <FeatureSection>
        <SectionHeader>
          <SectionTitle>Full-stack crypto infrastructure</SectionTitle>
          <SectionSubtitle>
            Everything you need to operate in crypto: teleport, custody, treasury, staking, validators, and global fiat rails. Post-quantum secure.
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

      {/* Mobile App Section */}
      <MobileSection>
        <MobileContent>
          <MobileText>
            <MobileBadge>
              <SmartphoneIcon />
              Mobile Banking
            </MobileBadge>
            <MobileTitle>
              Your bank in your pocket
            </MobileTitle>
            <MobileDescription>
              White-label mobile app for iOS and Android. Fiat, crypto, stablecoins, and digital securities—all in a beautiful interface with bank-grade security.
            </MobileDescription>
            <MobileFeatures>
              <MobileFeature>
                <CheckIcon /> Multi-Asset Wallet
              </MobileFeature>
              <MobileFeature>
                <CheckIcon /> Biometric Security
              </MobileFeature>
              <MobileFeature>
                <CheckIcon /> Instant Transfers
              </MobileFeature>
              <MobileFeature>
                <CheckIcon /> 200+ Countries
              </MobileFeature>
              <MobileFeature>
                <CheckIcon /> Real-Time Alerts
              </MobileFeature>
              <MobileFeature>
                <CheckIcon /> QR Payments
              </MobileFeature>
            </MobileFeatures>
            <MobileButtons>
              <Link href="/products/mobile">
                <CustomButton>Learn More</CustomButton>
              </Link>
              <AppStoreBadge href="#" target="_blank">
                <AppleIcon />
                <AppStoreText>
                  <AppStoreLabel>Download on the</AppStoreLabel>
                  <AppStoreName>App Store</AppStoreName>
                </AppStoreText>
              </AppStoreBadge>
              <AppStoreBadge href="#" target="_blank">
                <PlayStoreIcon />
                <AppStoreText>
                  <AppStoreLabel>Get it on</AppStoreLabel>
                  <AppStoreName>Google Play</AppStoreName>
                </AppStoreText>
              </AppStoreBadge>
            </MobileButtons>
          </MobileText>

          <MobilePhones>
            {/* Left Phone - Send Money */}
            <PhoneMockup $position="left">
              <PhoneScreen>
                <PhoneNotch />
                <PhoneContent>
                  <PhoneBalance>
                    <PhoneBalanceLabel>Send Money</PhoneBalanceLabel>
                    <PhoneBalanceValue>$1,250.00</PhoneBalanceValue>
                  </PhoneBalance>
                  <PhoneAssets>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="rgba(255, 255, 255, 0.7)">→</PhoneAssetIcon>
                        <PhoneAssetName>To: John D.</PhoneAssetName>
                      </PhoneAssetInfo>
                    </PhoneAsset>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="#2775CA">$</PhoneAssetIcon>
                        <PhoneAssetName>Via USDC</PhoneAssetName>
                      </PhoneAssetInfo>
                    </PhoneAsset>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="#8B5CF6">₦</PhoneAssetIcon>
                        <PhoneAssetName>Receives NGN</PhoneAssetName>
                      </PhoneAssetInfo>
                    </PhoneAsset>
                  </PhoneAssets>
                </PhoneContent>
              </PhoneScreen>
            </PhoneMockup>

            {/* Center Phone - Main Dashboard */}
            <PhoneMockup>
              <PhoneScreen>
                <PhoneNotch />
                <PhoneContent>
                  <PhoneBalance>
                    <PhoneBalanceLabel>Total Balance</PhoneBalanceLabel>
                    <PhoneBalanceValue>$24,850.00</PhoneBalanceValue>
                  </PhoneBalance>
                  <PhoneActions>
                    <PhoneAction>
                      <PhoneActionIcon>
                        <SendIcon />
                      </PhoneActionIcon>
                      <PhoneActionLabel>Send</PhoneActionLabel>
                    </PhoneAction>
                    <PhoneAction>
                      <PhoneActionIcon $color="rgba(59, 130, 246, 0.15)">
                        <ReceiveIcon />
                      </PhoneActionIcon>
                      <PhoneActionLabel>Receive</PhoneActionLabel>
                    </PhoneAction>
                  </PhoneActions>
                  <PhoneAssets>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="#2775CA">$</PhoneAssetIcon>
                        <PhoneAssetName>USDC</PhoneAssetName>
                      </PhoneAssetInfo>
                      <PhoneAssetValue>$15,000</PhoneAssetValue>
                    </PhoneAsset>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="#26A17B">₮</PhoneAssetIcon>
                        <PhoneAssetName>USDT</PhoneAssetName>
                      </PhoneAssetInfo>
                      <PhoneAssetValue>$8,500</PhoneAssetValue>
                    </PhoneAsset>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="#F7931A">₿</PhoneAssetIcon>
                        <PhoneAssetName>BTC</PhoneAssetName>
                      </PhoneAssetInfo>
                      <PhoneAssetValue>$1,350</PhoneAssetValue>
                    </PhoneAsset>
                  </PhoneAssets>
                </PhoneContent>
              </PhoneScreen>
            </PhoneMockup>

            {/* Right Phone - Activity */}
            <PhoneMockup $position="right">
              <PhoneScreen>
                <PhoneNotch />
                <PhoneContent>
                  <PhoneBalance>
                    <PhoneBalanceLabel>Recent Activity</PhoneBalanceLabel>
                    <PhoneBalanceValue style={{ fontSize: '1.6rem' }}>Today</PhoneBalanceValue>
                  </PhoneBalance>
                  <PhoneAssets>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="rgba(255, 255, 255, 0.7)">↓</PhoneAssetIcon>
                        <PhoneAssetName>Received</PhoneAssetName>
                      </PhoneAssetInfo>
                      <PhoneAssetValue style={{ color: 'rgba(255, 255, 255, 0.7)' }}>+$500</PhoneAssetValue>
                    </PhoneAsset>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="#EF4444">↑</PhoneAssetIcon>
                        <PhoneAssetName>Sent</PhoneAssetName>
                      </PhoneAssetInfo>
                      <PhoneAssetValue>-$1,250</PhoneAssetValue>
                    </PhoneAsset>
                    <PhoneAsset>
                      <PhoneAssetInfo>
                        <PhoneAssetIcon $color="#8B5CF6">⟳</PhoneAssetIcon>
                        <PhoneAssetName>Swap</PhoneAssetName>
                      </PhoneAssetInfo>
                      <PhoneAssetValue>$2,000</PhoneAssetValue>
                    </PhoneAsset>
                  </PhoneAssets>
                </PhoneContent>
              </PhoneScreen>
            </PhoneMockup>
          </MobilePhones>
        </MobileContent>
      </MobileSection>

      {/* Solutions by Industry */}
      <IndustriesSection>
        <SectionHeader>
          <SectionTitle>Solutions for every industry</SectionTitle>
          <SectionSubtitle>
            Institutional-grade digital asset infrastructure. Banks, funds, corporates, and regulated entities.
          </SectionSubtitle>
        </SectionHeader>

        <IndustriesGrid>
          {industries.map((industry) => (
            <Link key={industry.slug} href={`/solutions/${industry.slug}`} passHref legacyBehavior>
              <IndustryCard>
                <IndustryIcon>{industry.icon}</IndustryIcon>
                <IndustryName>{industry.title}</IndustryName>
              </IndustryCard>
            </Link>
          ))}
        </IndustriesGrid>

        <div style={{ textAlign: 'center' }}>
          <Link href="/solutions" passHref legacyBehavior>
            <ViewAllLink>View all solutions →</ViewAllLink>
          </Link>
        </div>
      </IndustriesSection>

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

      {/* Compliance & AI Section */}
      <ComplianceSection>
        <SectionHeader>
          <SectionTitle>Built-in compliance & AI</SectionTitle>
          <SectionSubtitle>
            KYC, AML, sanctions screening, and AI-powered operations. Pluggable integrations with Chainalysis, Jumio, Onfido, and more.
          </SectionSubtitle>
        </SectionHeader>

        <ComplianceGrid>
          {complianceFeatures.map((feature, index) => (
            <ComplianceCard key={index}>
              <ComplianceTitle>{feature.title}</ComplianceTitle>
              <ComplianceDescription>{feature.description}</ComplianceDescription>
            </ComplianceCard>
          ))}
        </ComplianceGrid>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="https://docs.lux.financial/guides/compliance" target="_blank">
            <SecondaryButton>View Compliance Docs</SecondaryButton>
          </Link>
        </div>
      </ComplianceSection>

      {/* Demo Showcase - Triangle Bank */}
      <DemoSection>
        <SectionHeader>
          <SectionTitle>Real-time cross-border payments</SectionTitle>
          <SectionSubtitle>
            Watch stablecoins settle in seconds. USDC on Polygon to Naira in Nigeria. No bridges, no delays.
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

      {/* Research Section */}
      <InfraSection>
        <SectionHeader>
          <SectionTitle>Open research & specifications</SectionTitle>
          <SectionSubtitle>
            Our infrastructure is built on peer-reviewed cryptographic research. Explore the Lux Protocol Specifications (LPs).
          </SectionSubtitle>
        </SectionHeader>

        <InfraGrid>
          {researchPapers.map((paper, index) => (
            <Link key={index} href={`https://lps.lux.network/docs/lp-${paper.lp}`} target="_blank" style={{ textDecoration: 'none' }}>
              <InfraCard style={{ cursor: 'pointer' }}>
                <InfraIcon>
                  <CodeIcon />
                </InfraIcon>
                <InfraTitle>LP-{paper.lp}</InfraTitle>
                <InfraDescription>{paper.title}</InfraDescription>
              </InfraCard>
            </Link>
          ))}
        </InfraGrid>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="https://lps.lux.network" target="_blank">
            <SecondaryButton>View All Specifications →</SecondaryButton>
          </Link>
        </div>
      </InfraSection>

      {/* Final CTA */}
      <CTASection>
        <CTATitle>Ready to operate in crypto?</CTATitle>
        <CTASubtitle>
          Banks adding crypto. Funds deploying to DeFi. Corporates managing treasury. All on post-quantum secure infrastructure.
        </CTASubtitle>
        <Link href="https://app.lux.financial/registration" target="_blank">
          <CustomButton>Start Building</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}
