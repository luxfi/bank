"use client";
import Link from "next/link";
import styled from "styled-components";

import { CustomButton, SecondaryButton } from "@/components/Button";
import { DeviceSize } from "@/styles/theme/default";

// Icons
const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </svg>
);

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
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

const industries = [
  {
    icon: BankIcon,
    title: "Fintechs & Neobanks",
    description: "Launch banking products without building from scratch. White-label accounts, cards, and payment rails.",
    features: ["Branded account provisioning", "Card issuance ready", "Compliance tools included"],
  },
  {
    icon: ExchangeIcon,
    title: "Exchanges & Trading",
    description: "Launch CEX or DEX platforms with institutional liquidity. White-label exchange infrastructure.",
    features: ["CEX & DEX platforms", "Institutional liquidity", "Trading APIs"],
  },
  {
    icon: DeFiIcon,
    title: "DeFi Protocols",
    description: "Build AMMs, lending protocols, and yield products. Institutional-grade DeFi with compliance.",
    features: ["AMM & liquidity pools", "Lending protocols", "Yield optimization"],
  },
  {
    icon: LayersIcon,
    title: "Digital Asset Businesses",
    description: "Issue stablecoins, security tokens, or tokenized assets. Full lifecycle infrastructure.",
    features: ["Stablecoin issuance", "Security token infrastructure", "Multi-chain deployment"],
  },
  {
    icon: StoreIcon,
    title: "Marketplaces & Platforms",
    description: "Enable crypto and fiat payouts globally. Multi-currency wallets with instant settlements.",
    features: ["Multi-currency wallets", "200+ country payouts", "Real-time settlements"],
  },
  {
    icon: ShoppingCartIcon,
    title: "E-commerce & Payments",
    description: "Accept crypto and fiat globally, pay suppliers anywhere. FX and treasury management.",
    features: ["Crypto & fiat checkout", "Cross-border payments", "FX optimization"],
  },
];

const capabilities = [
  { title: "CEX & DEX Platform", description: "White-label exchange with institutional liquidity. Matching engine, order books, DEX aggregation." },
  { title: "DeFi Infrastructure", description: "AMMs, lending protocols, yield vaults, and staking. Institutional compliance built in." },
  { title: "Multi-Asset Wallets", description: "Custodial and MPC self-custody. 50+ chains, HSM-backed, fiat and crypto support." },
  { title: "Global Payments", description: "200+ countries, 180+ currencies, 50+ payment rails. Real-time settlement." },
  { title: "Digital Securities", description: "Issue stablecoins, security tokens, and tokenized assets. Multi-chain deployment." },
  { title: "Compliance & Security", description: "KYC/KYB, AML screening, HSM/MPC key management, and post-quantum ready." },
];

export default function OnlinePlatform() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <HeroBadge>Solutions</HeroBadge>
          <HeroTitle>
            Complete infrastructure for every use case
          </HeroTitle>
          <HeroSubtitle>
            Whether you&apos;re launching an exchange, building DeFi protocols, issuing digital assets,
            or powering global payments—we have the complete infrastructure stack.
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

      {/* Industries */}
      <Section>
        <SectionHeader>
          <SectionTitle>Built for your industry</SectionTitle>
          <SectionSubtitle>
            Specialized solutions for different business models
          </SectionSubtitle>
        </SectionHeader>

        <IndustriesGrid>
          {industries.map((industry, index) => (
            <IndustryCard key={index}>
              <IndustryIcon>
                <industry.icon />
              </IndustryIcon>
              <IndustryTitle>{industry.title}</IndustryTitle>
              <IndustryDescription>{industry.description}</IndustryDescription>
              <FeatureList>
                {industry.features.map((feature, i) => (
                  <FeatureItem key={i}>
                    <FeatureCheck><CheckIcon /></FeatureCheck>
                    <span>{feature}</span>
                  </FeatureItem>
                ))}
              </FeatureList>
            </IndustryCard>
          ))}
        </IndustriesGrid>
      </Section>

      {/* Capabilities */}
      <Section>
        <SectionHeader>
          <SectionTitle>Core capabilities</SectionTitle>
          <SectionSubtitle>
            Everything you need to build, launch, and scale
          </SectionSubtitle>
        </SectionHeader>

        <CapabilitiesGrid>
          {capabilities.map((cap, index) => (
            <CapabilityCard key={index}>
              <CapabilityTitle>{cap.title}</CapabilityTitle>
              <CapabilityDescription>{cap.description}</CapabilityDescription>
            </CapabilityCard>
          ))}
        </CapabilitiesGrid>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeader>
          <SectionTitle>How it works</SectionTitle>
          <SectionSubtitle>
            Three steps to go live
          </SectionSubtitle>
        </SectionHeader>

        <StepsGrid>
          <Step>
            <StepNumber>1</StepNumber>
            <StepTitle>Integrate</StepTitle>
            <StepDescription>
              Connect via our RESTful APIs. Use our SDKs and sandbox environment to build and test.
            </StepDescription>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <StepTitle>Configure</StepTitle>
            <StepDescription>
              Set up your currencies, payment rails, and compliance rules through our dashboard.
            </StepDescription>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <StepTitle>Launch</StepTitle>
            <StepDescription>
              Go live with your branded financial product. We handle the complexity behind the scenes.
            </StepDescription>
          </Step>
        </StepsGrid>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Ready to get started?</CTATitle>
        <CTASubtitle>
          Talk to our team about the right solution for your business.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;

  @media ${DeviceSize.sm} {
    padding: 0 1rem;
    padding-top: 56px;
  }
`;

const HeroSection = styled.section`
  padding: 6rem 0;
  text-align: center;

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
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

  @media ${DeviceSize.sm} {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2rem;

  @media ${DeviceSize.sm} {
    font-size: 1.6rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media ${DeviceSize.sm} {
    flex-direction: column;
  }
`;

const Section = styled.section`
  padding: 5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.4rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.65);
  max-width: 600px;
  margin: 0 auto;
`;

const IndustriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const IndustryCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const IndustryIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 1.25rem;

  svg {
    width: 20px;
    height: 20px;
  }
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
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.65);
`;

const FeatureCheck = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  color: #3CE38A;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CapabilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const CapabilityCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const CapabilityTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const CapabilityDescription = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Step = styled.div`
  text-align: center;
`;

const StepNumber = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(60, 227, 138, 0.1);
  border: 1px solid rgba(60, 227, 138, 0.2);
  color: #3CE38A;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
`;

const StepTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
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
