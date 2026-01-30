"use client";
import Link from "next/link";
import styled from "styled-components";
import { CustomButton, SecondaryButton } from "@/components/Button";
import { DeviceSize } from "@/styles/theme/default";

const industries = [
  {
    slug: "financial-institutions",
    title: "Financial Institutions",
    description: "Modernize legacy systems with digital asset infrastructure. Multi-chain custody, stablecoin payments, and tokenization.",
    icon: "🏦",
    features: ["Core banking modernization", "Digital asset custody", "Cross-border payments"],
  },
  {
    slug: "fintech",
    title: "FinTech",
    description: "Launch banking products without building from scratch. White-label accounts, cards, wallets, and payment rails.",
    icon: "💳",
    features: ["White-label banking", "Embedded finance", "Mobile wallets"],
  },
  {
    slug: "insurance",
    title: "Insurance",
    description: "Streamline premium collection and claims payouts globally. Multi-currency accounts and instant settlements.",
    icon: "🛡️",
    features: ["Global premium collection", "Instant claims payouts", "Multi-currency treasury"],
  },
  {
    slug: "insurtech",
    title: "InsurTech",
    description: "Build parametric insurance and on-chain claims with smart contracts. Automated underwriting and instant payouts.",
    icon: "⚡",
    features: ["Parametric insurance", "Smart contract claims", "Automated payouts"],
  },
  {
    slug: "crypto",
    title: "Crypto & Web3",
    description: "Launch exchanges, DeFi protocols, or NFT marketplaces. Full infrastructure from custody to compliance.",
    icon: "🪙",
    features: ["CEX & DEX platforms", "DeFi infrastructure", "NFT & gaming"],
  },
  {
    slug: "saas",
    title: "SaaS Platforms",
    description: "Monetize globally with multi-currency billing and payouts. Embedded payments for your platform users.",
    icon: "☁️",
    features: ["Global billing", "Marketplace payouts", "Embedded payments"],
  },
  {
    slug: "retail",
    title: "Retail & E-commerce",
    description: "Accept crypto and fiat globally. Omnichannel payments with instant settlement and treasury management.",
    icon: "🛒",
    features: ["Crypto & fiat checkout", "Cross-border payments", "Treasury management"],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    description: "Pay global suppliers efficiently. FX optimization, trade finance, and supply chain payments.",
    icon: "🏭",
    features: ["Supplier payments", "FX optimization", "Trade finance"],
  },
  {
    slug: "gaming",
    title: "Gaming & Gambling",
    description: "Fast deposits and withdrawals globally. Multi-currency wallets, in-game economies, and NFT integration.",
    icon: "🎮",
    features: ["Instant deposits/withdrawals", "In-game currencies", "NFT marketplace"],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    description: "Bill clients globally and manage multi-currency receivables. Automated invoicing and reconciliation.",
    icon: "💼",
    features: ["Global invoicing", "Multi-currency billing", "Automated reconciliation"],
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    description: "Tokenize properties and enable fractional ownership. Cross-border transactions and investor management.",
    icon: "🏢",
    features: ["Property tokenization", "Fractional ownership", "Investor portals"],
  },
  {
    slug: "ngo",
    title: "NGOs, DAOs & Non-Profits",
    description: "DAO treasury management with multi-sig, quadratic voting, and on-chain governance. Global donations and transparent fund tracking.",
    icon: "🤝",
    features: ["DAO treasury", "Governance voting", "Fund transparency"],
  },
];

export default function SolutionsPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroBadge>Solutions by Industry</HeroBadge>
          <HeroTitle>Built for your business</HeroTitle>
          <HeroSubtitle>
            Complete digital asset and payment infrastructure tailored for every industry.
            Banks, funds, corporates, and regulated institutions.
          </HeroSubtitle>
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

      <Section>
        <IndustriesGrid>
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} href={`/solutions/${industry.slug}`}>
              <IndustryIcon>{industry.icon}</IndustryIcon>
              <IndustryTitle>{industry.title}</IndustryTitle>
              <IndustryDescription>{industry.description}</IndustryDescription>
              <FeatureList>
                {industry.features.map((feature, i) => (
                  <FeatureItem key={i}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </FeatureItem>
                ))}
              </FeatureList>
              <LearnMore>Learn more →</LearnMore>
            </IndustryCard>
          ))}
        </IndustriesGrid>
      </Section>

      <CTASection>
        <CTATitle>Not sure which solution fits?</CTATitle>
        <CTASubtitle>
          Talk to our team. We&apos;ll help you find the right infrastructure for your use case.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;
  @media ${DeviceSize.sm} { padding: 0 1rem; padding-top: 56px; }
`;

const HeroSection = styled.section`
  padding: 6rem 0;
  text-align: center;
  @media ${DeviceSize.sm} { padding: 4rem 0; }
`;

const HeroContent = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4.4rem;
  font-weight: 600;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  @media ${DeviceSize.sm} { font-size: 3rem; }
`;

const HeroSubtitle = styled.p`
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

const Section = styled.section`
  padding: 5rem 0;
`;

const IndustriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  @media ${DeviceSize.md} { grid-template-columns: repeat(2, 1fr); }
  @media ${DeviceSize.sm} { grid-template-columns: 1fr; }
`;

const IndustryCard = styled(Link)`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const IndustryIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const IndustryTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.75rem;
`;

const IndustryDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 1.25rem;
  flex: 1;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.65);
  svg { color: #FFFFFF; flex-shrink: 0; }
`;

const LearnMore = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  color: #FFFFFF;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 6rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const CTASubtitle = styled.p`
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2rem;
`;
