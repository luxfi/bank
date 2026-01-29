"use client";
import Link from "next/link";
import styled from "styled-components";

import { CustomButton, SecondaryButton } from "@/components/Button";
import { LUX_BRAND } from "@luxbank/brand";
import { DeviceSize } from "@/styles/theme/default";

// Icons
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 21V10h6v11M9 10h6" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
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

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const values = [
  {
    icon: BuildingIcon,
    title: "Platform-First",
    description: "We build infrastructure, not products. Your customers see your brand while our platform handles complexity.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Compliance Built-In",
    description: "Every feature is designed with regulatory requirements in mind. KYC, AML, and sanctions screening included.",
  },
  {
    icon: UsersIcon,
    title: "Partner Success",
    description: "Your success is our success. We provide dedicated support and custom solutions for enterprise clients.",
  },
  {
    icon: RocketIcon,
    title: "Speed to Market",
    description: "Launch in weeks, not quarters. Our pre-built modules accelerate your time to market significantly.",
  },
];

const capabilities = [
  "White-label account provisioning",
  "Multi-currency support (30+ currencies)",
  "Real-time FX rates API",
  "Global payment rails (SWIFT, SEPA, ACH)",
  "Stablecoin integration (USDC, USDT, EURC)",
  "Compliance tools and workflows",
  "Webhook-level observability",
  "Enterprise-grade security",
];

export default function About() {
  const { jurisdiction } = LUX_BRAND;
  const { legalEntity } = jurisdiction;

  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <HeroBadge>About Lux Financial</HeroBadge>
          <HeroTitle>
            We build the infrastructure that powers modern finance
          </HeroTitle>
          <HeroSubtitle>
            {legalEntity.name} provides white-label banking technology for fintechs,
            neobanks, and financial institutions. You bring the customers—we provide the platform.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Contact Sales</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial" target="_blank">
              <SecondaryButton>Read Documentation</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Values Grid */}
      <Section>
        <SectionHeader>
          <SectionTitle>Why teams choose us</SectionTitle>
          <SectionSubtitle>
            Built by engineers who understand what it takes to scale financial products
          </SectionSubtitle>
        </SectionHeader>

        <ValuesGrid>
          {values.map((value, index) => (
            <ValueCard key={index}>
              <ValueIcon>
                <value.icon />
              </ValueIcon>
              <ValueTitle>{value.title}</ValueTitle>
              <ValueDescription>{value.description}</ValueDescription>
            </ValueCard>
          ))}
        </ValuesGrid>
      </Section>

      {/* Capabilities */}
      <Section>
        <TwoColumn>
          <div>
            <SectionTitle style={{ textAlign: 'left' }}>
              Everything you need to build financial products
            </SectionTitle>
            <SectionSubtitle style={{ textAlign: 'left', margin: '1.5rem 0 0' }}>
              Our platform provides the complete infrastructure stack so you can focus on your core product.
            </SectionSubtitle>
          </div>
          <CapabilitiesList>
            {capabilities.map((item, index) => (
              <CapabilityItem key={index}>
                <CapabilityCheck>
                  <CheckIcon />
                </CapabilityCheck>
                <span>{item}</span>
              </CapabilityItem>
            ))}
          </CapabilitiesList>
        </TwoColumn>
      </Section>

      {/* Stats */}
      <StatsSection>
        <StatCard>
          <StatValue>30+</StatValue>
          <StatLabel>Currencies Supported</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>99.99%</StatValue>
          <StatLabel>Platform Uptime</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>&lt;2 weeks</StatValue>
          <StatLabel>Typical Integration Time</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>24/7</StatValue>
          <StatLabel>Monitoring & Support</StatLabel>
        </StatCard>
      </StatsSection>

      {/* CTA */}
      <CTASection>
        <CTATitle>Ready to build?</CTATitle>
        <CTASubtitle>
          Talk to our team about how Lux Financial can power your financial product.
        </CTASubtitle>
        <Link href="/contact">
          <CustomButton>Get in Touch</CustomButton>
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
    font-size: 3.2rem;
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

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const ValueIcon = styled.div`
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

const ValueTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const ValueDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CapabilitiesList = styled.div`
  display: grid;
  gap: 1rem;
`;

const CapabilityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.65);
`;

const CapabilityCheck = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  color: #3CE38A;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.3rem;
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
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;
