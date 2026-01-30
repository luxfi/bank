"use client";
import Link from "next/link";
import { CustomButton, SecondaryButton } from "@/components/Button";
import {
  PageContainer,
  HeroSection,
  HeroContent,
  ProductBadge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  CardGrid,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  CTASection,
  CTATitle,
  CTASubtitle,
} from "./styles";

// Icons
const PaymentsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

const SmartphoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

// Exchange Icon
const ExchangeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
  </svg>
);

// DeFi Icon
const DeFiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

// Securities Icon
const SecuritiesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const products = [
  {
    icon: SmartphoneIcon,
    title: "Mobile Banking App",
    description: "White-label mobile app for iOS and Android. Fiat, crypto, stablecoins—beautiful UI with bank-grade security.",
    href: "/products/mobile",
    color: "#22C55E",
  },
  {
    icon: ExchangeIcon,
    title: "CEX & DEX Platform",
    description: "White-label exchange infrastructure. Launch your own CEX with institutional liquidity or integrate DEX aggregation.",
    href: "/products/exchange",
    color: "#8B5CF6",
  },
  {
    icon: DeFiIcon,
    title: "DeFi & AMM",
    description: "Deploy AMMs, liquidity pools, and yield products. Full DeFi stack with institutional-grade compliance.",
    href: "/products/defi",
    color: "#3B82F6",
  },
  {
    icon: SecuritiesIcon,
    title: "Digital Securities",
    description: "Issue, trade, and settle tokenized securities. Compliant infrastructure for STOs, bonds, and equity tokens.",
    href: "/products/issuance",
    color: "#FFFFFF",
  },
  {
    icon: GlobeIcon,
    title: "Global Payments",
    description: "Fiat and crypto payments to 200+ countries. All currencies with real-time settlement and local rails.",
    href: "/products/cross-border",
    color: "#22D3EE",
  },
  {
    icon: WalletIcon,
    title: "Multi-Asset Wallets",
    description: "Custodial and MPC wallets for fiat, crypto, stablecoins, and securities. 50+ chains supported.",
    href: "/products/wallets",
    color: "#EC4899",
  },
  {
    icon: ServerIcon,
    title: "Infrastructure",
    description: "KMS, MPC, IAM, HSM, and post-quantum security. Enterprise-grade foundation for any financial product.",
    href: "/products/infrastructure",
    color: "#666666",
  },
];

export default function Products() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge>Products</ProductBadge>
          <HeroTitle>
            Complete financial infrastructure
          </HeroTitle>
          <HeroSubtitle>
            Banking, trading, DeFi, and digital assets. CEX, DEX, AMM, wallets, payments.
            Everything to build any financial product, in 200+ countries.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Talk to Sales</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial" target="_blank">
              <SecondaryButton>View API Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Our Platform</SectionTitle>
          <SectionSubtitle>
            Unified infrastructure for banks, exchanges, and DeFi
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          {products.map((product, index) => (
            <Link key={index} href={product.href} style={{ textDecoration: 'none' }}>
              <Card $accent={product.color}>
                <CardIcon $color={product.color}>
                  <product.icon />
                </CardIcon>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </Card>
            </Link>
          ))}
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Ready to get started?</CTATitle>
        <CTASubtitle>
          Talk to our team about building with Lux Financial.
        </CTASubtitle>
        <Link href="/contact">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}
