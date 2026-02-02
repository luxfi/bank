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

const timeline = [
  {
    year: "2020",
    title: "Technology Partnership Begins",
    description: "Zach Kelling joins CDAX as CTO. Lux Financial begins developing open banking infrastructure in partnership with CDAX for digital asset services.",
  },
  {
    year: "2022",
    title: "Lux KMS Open Source",
    description: "Enterprise key management system released as open source, enabling HSM-backed security for institutions.",
  },
  {
    year: "2024",
    title: "Isle of Man Establishment",
    description: "Lux Partners Limited established as IOMFSA-regulated entity, providing compliant digital asset services for UK and Europe.",
  },
  {
    year: "2025",
    title: "US Market Launch",
    description: "Lux Industries Inc launched to serve the US market, bringing institutional crypto infrastructure to American banks and funds.",
  },
  {
    year: "2026",
    title: "Platform General Availability",
    description: "Full platform launch with instant cross-chain settlement, MPC custody, and post-quantum security.",
  },
];

const entities = [
  {
    name: "Lux Industries Inc",
    location: "United States",
    description: "US parent company serving banks, funds, and corporates in North America.",
    link: "https://luxindustries.xyz",
  },
  {
    name: "Lux Partners Limited",
    location: "Isle of Man",
    description: "IOMFSA-regulated entity for UK and European digital asset services.",
  },
];

const capabilities = [
  "Instant cross-chain settlement (no bridges)",
  "Native multi-chain liquidity (15+ networks)",
  "Global fiat rails (ACH, SEPA, SWIFT, PIX, SPEI)",
  "Multi-stablecoin support (USDC, USDT, EURC)",
  "MPC self-custody with HSM integration",
  "Built-in KYC/AML and sanctions screening",
  "Full REST/GraphQL APIs with webhooks",
  "Open-source infrastructure (github.com/luxfi)",
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
            Open-source enterprise crypto infrastructure for regulated financial institutions.
            Banks, funds, and corporates worldwide trust our technology.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="https://cal.com/luxfi" target="_blank">
              <CustomButton>Talk to Sales</CustomButton>
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
          <StatValue>&lt;10s</StatValue>
          <StatLabel>Cross-Chain Settlement</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>15+</StatValue>
          <StatLabel>Blockchain Networks</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>200+</StatValue>
          <StatLabel>Countries Supported</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>6 years</StatValue>
          <StatLabel>Building Infrastructure</StatLabel>
        </StatCard>
      </StatsSection>

      {/* Corporate Structure */}
      <Section>
        <SectionHeader>
          <SectionTitle>Corporate Structure</SectionTitle>
          <SectionSubtitle>
            A global organization built for institutional crypto infrastructure
          </SectionSubtitle>
        </SectionHeader>

        <EntitiesGrid>
          {entities.map((entity, index) => (
            <EntityCard key={index}>
              <EntityName>
                {entity.link ? (
                  <a href={entity.link} target="_blank" rel="noopener noreferrer">
                    {entity.name} →
                  </a>
                ) : (
                  entity.name
                )}
              </EntityName>
              <EntityLocation>{entity.location}</EntityLocation>
              <EntityDescription>{entity.description}</EntityDescription>
            </EntityCard>
          ))}
        </EntitiesGrid>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeader>
          <SectionTitle>Our Journey</SectionTitle>
          <SectionSubtitle>
            Building enterprise crypto infrastructure since 2020
          </SectionSubtitle>
        </SectionHeader>

        <Timeline>
          {timeline.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineYear>{item.year}</TimelineYear>
              <TimelineContent>
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineDescription>{item.description}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Ready to build?</CTATitle>
        <CTASubtitle>
          Talk to our team about how Lux Financial can power your financial product.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
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

  @media ${DeviceSize.sm} {
    font-size: 3.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
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
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.4rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const ValueIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1.25rem;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ValueTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const ValueDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
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
  color: ${({ theme }) => theme.colors.secondary};
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
  border-top: 1px solid ${({ theme }) => theme.colors.border};

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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.muted};
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
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const EntitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const EntityCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
`;

const EntityName = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const EntityLocation = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const EntityDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

const Timeline = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 60px 1fr;
    gap: 1rem;
  }
`;

const TimelineYear = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const TimelineContent = styled.div``;

const TimelineTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const TimelineDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;
