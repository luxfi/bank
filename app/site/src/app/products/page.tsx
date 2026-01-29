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

const products = [
  {
    icon: PaymentsIcon,
    title: "Orchestration",
    description: "Move money globally with stablecoin rails. Real-time settlement, multi-currency support, and intelligent routing.",
    href: "/products/orchestration",
    color: "#8B5CF6",
  },
  {
    icon: WalletIcon,
    title: "Wallets",
    description: "Custodial and self-custody wallet infrastructure. Multi-chain support with enterprise-grade security.",
    href: "/products/wallets",
    color: "#22C55E",
  },
  {
    icon: GlobeIcon,
    title: "Cross-Border Payments",
    description: "Send payments to 150+ countries. Instant stablecoin settlement with local currency payout.",
    href: "/products/cross-border",
    color: "#3B82F6",
  },
  {
    icon: ServerIcon,
    title: "Infrastructure",
    description: "Enterprise-grade key management, MPC custody, and post-quantum security for future-proof operations.",
    href: "/products/infrastructure",
    color: "#22D3EE",
  },
  {
    icon: ShieldIcon,
    title: "Issuance",
    description: "Launch your own stablecoin or digital asset. Full compliance framework and reserve management.",
    href: "/products/issuance",
    color: "#F59E0B",
  },
  {
    icon: CpuIcon,
    title: "AI Operations",
    description: "MCP server for AI-powered bank operations. Natural language queries and automated workflows.",
    href: "/products/infrastructure#mcp",
    color: "#EC4899",
  },
];

export default function Products() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge>Products</ProductBadge>
          <HeroTitle>
            Build the future of finance
          </HeroTitle>
          <HeroSubtitle>
            Everything you need to build, launch, and scale financial products.
            From stablecoin payments to post-quantum security.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Contact Sales</CustomButton>
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
            Modular infrastructure that grows with your needs
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
          <CustomButton>Contact Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}
