"use client";

import styled from "styled-components";
import Link from "next/link";
import { CustomButton, SecondaryButton } from "@/components/Button";

const bankFeatures = [
  {
    title: "Core Banking Integration",
    description: "REST APIs that integrate with your existing core banking system. Support for ISO 20022, SWIFT MT, and legacy formats.",
    icon: BankIcon,
  },
  {
    title: "Ledger & Accounting",
    description: "Double-entry ledger with real-time reconciliation. Full audit trail and regulatory reporting built-in.",
    icon: LedgerIcon,
  },
  {
    title: "Multi-Rail Payments",
    description: "Single API for ACH, Wire, SEPA, Faster Payments, SWIFT, and 20+ local payment rails.",
    icon: PaymentIcon,
  },
  {
    title: "Digital Asset Custody",
    description: "Institutional-grade MPC custody for digital assets. Support for stablecoins and tokenized deposits.",
    icon: VaultIcon,
  },
  {
    title: "Compliance Engine",
    description: "Real-time transaction monitoring, sanctions screening, and automated SAR filing.",
    icon: ShieldIcon,
  },
  {
    title: "White-Label Solutions",
    description: "Launch branded digital banking products. Mobile apps, cards, and payment experiences.",
    icon: BrandIcon,
  },
];

const useCases = [
  {
    title: "Stablecoin Settlement",
    description: "Enable instant settlement using USDC, USDT, and other regulated stablecoins. Reduce counterparty risk and settlement times from days to seconds.",
    stats: [
      { value: "T+0", label: "Settlement" },
      { value: "24/7", label: "Operations" },
      { value: "85%", label: "Cost Reduction" },
    ],
  },
  {
    title: "Cross-Border Payments",
    description: "Offer competitive FX rates and instant transfers to 180+ countries. Replace correspondent banking with direct settlement.",
    stats: [
      { value: "180+", label: "Countries" },
      { value: "<1hr", label: "Settlement" },
      { value: "60%", label: "Cheaper" },
    ],
  },
  {
    title: "Digital Asset Services",
    description: "Offer custody, trading, and yield products for digital assets. Fully compliant infrastructure for regulated institutions.",
    stats: [
      { value: "$10B+", label: "AUC Capacity" },
      { value: "MPC", label: "Custody" },
      { value: "SOC 2", label: "Certified" },
    ],
  },
];

const logos = [
  "Leading European Bank",
  "Top 10 US Credit Union",
  "Global Payments Provider",
  "Regulated Crypto Exchange",
  "Fortune 500 Treasury",
  "Central Bank Pilot",
];

function BankIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6M8 11h8" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BrandIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 12 2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function BanksPage() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroBadge>For Financial Institutions</HeroBadge>
        <HeroTitle>
          The Infrastructure Layer for<br />
          <GradientText>Modern Banking</GradientText>
        </HeroTitle>
        <HeroSubtitle>
          Lux provides the rails that connect traditional banking to the digital asset economy.
          Launch new products faster, reduce costs, and serve customers globally.
        </HeroSubtitle>
        <HeroButtons>
          <Link href="https://cal.com/luxfi" target="_blank">
            <CustomButton>Schedule Executive Briefing</CustomButton>
          </Link>
          <Link href="/security">
            <SecondaryButton>View Security & Compliance</SecondaryButton>
          </Link>
        </HeroButtons>
        <TrustIndicators>
          <TrustItem>
            <CheckIcon />
            <span>SOC 2 Type II Certified</span>
          </TrustItem>
          <TrustItem>
            <CheckIcon />
            <span>Bank-Grade Security</span>
          </TrustItem>
          <TrustItem>
            <CheckIcon />
            <span>Regulatory Compliant</span>
          </TrustItem>
        </TrustIndicators>
      </HeroSection>

      {/* Logos */}
      <LogoSection>
        <LogoLabel>Trusted by forward-thinking institutions</LogoLabel>
        <LogoGrid>
          {logos.map((logo) => (
            <LogoPlaceholder key={logo}>{logo}</LogoPlaceholder>
          ))}
        </LogoGrid>
      </LogoSection>

      {/* Features */}
      <Section>
        <SectionHeader>
          <SectionTitle>Enterprise Banking Infrastructure</SectionTitle>
          <SectionSubtitle>
            Everything you need to modernize your banking stack and launch digital asset services
          </SectionSubtitle>
        </SectionHeader>
        <FeaturesGrid>
          {bankFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <FeatureCard key={feature.title}>
                <FeatureIcon>
                  <Icon />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            );
          })}
        </FeaturesGrid>
      </Section>

      {/* Use Cases */}
      <Section>
        <SectionHeader>
          <SectionTitle>Proven Use Cases</SectionTitle>
          <SectionSubtitle>
            See how leading institutions are using Lux to transform their operations
          </SectionSubtitle>
        </SectionHeader>
        <UseCasesGrid>
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.title}>
              <UseCaseTitle>{useCase.title}</UseCaseTitle>
              <UseCaseDescription>{useCase.description}</UseCaseDescription>
              <UseCaseStats>
                {useCase.stats.map((stat) => (
                  <UseCaseStat key={stat.label}>
                    <UseCaseStatValue>{stat.value}</UseCaseStatValue>
                    <UseCaseStatLabel>{stat.label}</UseCaseStatLabel>
                  </UseCaseStat>
                ))}
              </UseCaseStats>
            </UseCaseCard>
          ))}
        </UseCasesGrid>
      </Section>

      {/* ROI Calculator Teaser */}
      <Section>
        <ROICard>
          <ROIContent>
            <ROITitle>Calculate Your ROI</ROITitle>
            <ROIDescription>
              See how much you could save on cross-border payments, settlement costs,
              and operational overhead by switching to Lux infrastructure.
            </ROIDescription>
            <ROIStats>
              <ROIStat>
                <ROIStatValue>60-85%</ROIStatValue>
                <ROIStatLabel>Cost Reduction</ROIStatLabel>
              </ROIStat>
              <ROIStat>
                <ROIStatValue>90%</ROIStatValue>
                <ROIStatLabel>Faster Settlement</ROIStatLabel>
              </ROIStat>
              <ROIStat>
                <ROIStatValue>6 months</ROIStatValue>
                <ROIStatLabel>Avg. Payback Period</ROIStatLabel>
              </ROIStat>
            </ROIStats>
            <Link href="/contact">
              <CustomButton>Get Custom ROI Analysis</CustomButton>
            </Link>
          </ROIContent>
        </ROICard>
      </Section>

      {/* Integration */}
      <Section>
        <SectionHeader>
          <SectionTitle>Seamless Integration</SectionTitle>
          <SectionSubtitle>
            Connect to your existing systems with minimal disruption
          </SectionSubtitle>
        </SectionHeader>
        <IntegrationGrid>
          <IntegrationCard>
            <IntegrationTitle>API-First Architecture</IntegrationTitle>
            <IntegrationList>
              <li>RESTful APIs with OpenAPI specs</li>
              <li>Webhooks for real-time events</li>
              <li>SDKs for major languages</li>
              <li>Sandbox environment</li>
            </IntegrationList>
          </IntegrationCard>
          <IntegrationCard>
            <IntegrationTitle>Format Support</IntegrationTitle>
            <IntegrationList>
              <li>ISO 20022 messaging</li>
              <li>SWIFT MT/MX formats</li>
              <li>FIX protocol</li>
              <li>Legacy format translation</li>
            </IntegrationList>
          </IntegrationCard>
          <IntegrationCard>
            <IntegrationTitle>Core Banking</IntegrationTitle>
            <IntegrationList>
              <li>Temenos integration</li>
              <li>Finastra connectivity</li>
              <li>FIS certified</li>
              <li>Custom integration support</li>
            </IntegrationList>
          </IntegrationCard>
        </IntegrationGrid>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Ready to modernize your infrastructure?</CTATitle>
        <CTASubtitle>
          Join the leading financial institutions already building on Lux.
          Our team is ready to discuss your specific requirements.
        </CTASubtitle>
        <CTAButtons>
          <Link href="https://cal.com/luxfi" target="_blank">
            <CustomButton>Schedule Demo</CustomButton>
          </Link>
          <Link href="/contact">
            <SecondaryButton>Contact Sales</SecondaryButton>
          </Link>
        </CTAButtons>
      </CTASection>
    </PageContainer>
  );
}

const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;
`;

const HeroSection = styled.section`
  padding: 6rem 0 4rem;
  text-align: center;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: #22D3EE;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4.8rem;
  font-weight: 600;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const TrustIndicators = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.65);

  svg {
    color: #22C55E;
  }
`;

const LogoSection = styled.section`
  padding: 4rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const LogoLabel = styled.p`
  text-align: center;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 2rem;
`;

const LogoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LogoPlaceholder = styled.div`
  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
`;

const Section = styled.section`
  padding: 6rem 0;
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
`;

const SectionSubtitle = styled.p`
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.65);
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5CF6;
  margin-bottom: 1.25rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
`;

const UseCasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UseCaseCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
`;

const UseCaseTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const UseCaseDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1.5rem;
`;

const UseCaseStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const UseCaseStat = styled.div`
  text-align: center;
`;

const UseCaseStatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #22D3EE;
`;

const UseCaseStatLabel = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.45);
`;

const ROICard = styled.div`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(34, 211, 238, 0.15) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 3rem;
`;

const ROIContent = styled.div`
  text-align: center;
`;

const ROITitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const ROIDescription = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const ROIStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ROIStat = styled.div`
  text-align: center;
`;

const ROIStatValue = styled.div`
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const ROIStatLabel = styled.div`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.55);
`;

const IntegrationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IntegrationCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
`;

const IntegrationTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const IntegrationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.55);
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    &:last-child {
      border-bottom: none;
    }
  }
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
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;
