"use client";
import Link from "next/link";
import styled from "styled-components";
import { CustomButton, SecondaryButton } from "@/components/Button";
import { DeviceSize } from "@/styles/theme/default";

const industries = [
  {
    slug: "financial-institutions",
    title: "Financial Institutions",
    description: "Like JPMorgan and BNY Mellon—offer crypto custody, cross-chain treasury, and staking yields to your institutional clients.",
    icon: "🏦",
    features: ["$2B+ assets secured", "MPC + HSM custody", "SOC 2 Type II"],
  },
  {
    slug: "fintech",
    title: "FinTech",
    description: "Build the next Revolut or Cash App. Launch a crypto neobank in 60 days with trading, staking, and global payments.",
    icon: "💳",
    features: ["60-day launch", "50+ live fintechs", "$10B+ annual volume"],
  },
  {
    slug: "insurance",
    title: "Insurance",
    description: "Like Lemonade's 3-second claims. Instant payouts, global premium collection, and treasury optimization for insurers.",
    icon: "🛡️",
    features: ["3-sec claims payout", "200+ countries", "60% cost reduction"],
  },
  {
    slug: "insurtech",
    title: "InsurTech",
    description: "Build like Etherisc—parametric insurance with smart contracts. Flight delays, weather triggers, instant USDC payouts.",
    icon: "⚡",
    features: ["0-sec parametric payouts", "90% claims automated", "Chainlink oracles"],
  },
  {
    slug: "crypto",
    title: "Crypto Funds",
    description: "Infrastructure for the next a16z or Paradigm. Multi-chain treasury, validator ops, and DeFi strategies.",
    icon: "🪙",
    features: ["$5B+ AUM supported", "20+ staking networks", "100+ DeFi protocols"],
  },
  {
    slug: "saas",
    title: "SaaS Platforms",
    description: "Like Stripe Atlas—embed subscriptions, payouts, and banking into your SaaS. Unlock 30%+ revenue uplift.",
    icon: "☁️",
    features: ["180+ currencies", "Merchant of Record", "Usage-based billing"],
  },
  {
    slug: "retail",
    title: "Retail & E-commerce",
    description: "Accept crypto like Tesla, pay suppliers like Amazon. Treasury staking yields and global payments.",
    icon: "🛒",
    features: ["Crypto checkout", "4-8% treasury APY", "200+ countries"],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    description: "Supply chain payments like Apple or Toyota. Pay suppliers in 200+ countries with 2-3% FX savings.",
    icon: "🏭",
    features: ["2-3% FX savings", "T+0 settlement", "SAP/Oracle integration"],
  },
  {
    slug: "gaming",
    title: "Gaming & Gambling",
    description: "Build like Axie Infinity or DraftKings. Instant deposits, player wallets, and NFT marketplaces.",
    icon: "🎮",
    features: ["<1 sec deposits", "MPC player wallets", "NFT marketplace"],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    description: "Global billing like Big 4 firms. Multi-currency invoicing, trust accounting, and 60% faster collections.",
    icon: "💼",
    features: ["180+ currencies", "Trust/IOLTA accounts", "Clio integration"],
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    description: "Tokenize like RealT or Cadre. Fractional ownership from $50, global investors, 24/7 liquidity.",
    icon: "🏢",
    features: ["$50 min investment", "SEC compliant", "24/7 secondary trading"],
  },
  {
    slug: "ngo",
    title: "NGOs, DAOs & Non-Profits",
    description: "Transparent treasury like Gitcoin or UNICEF. Multi-sig, quadratic funding, and grant streaming.",
    icon: "🤝",
    features: ["$10B+ DAO treasuries", "Quadratic funding", "Grant streaming"],
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
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4.4rem;
  font-weight: 600;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  @media ${DeviceSize.sm} { font-size: 3rem; }
`;

const HeroSubtitle = styled.p`
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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
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
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.75rem;
`;

const IndustryDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
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
  color: ${({ theme }) => theme.colors.secondary};
  svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; }
`;

const LearnMore = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const CTASection = styled.section`
  text-align: center;
  padding: 6rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const CTASubtitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
`;
