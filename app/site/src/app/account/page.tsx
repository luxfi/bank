"use client";
import Link from "next/link";
import styled from "styled-components";
import { useState } from "react";

import { CustomButton, SecondaryButton } from "@/components/Button";
import { DeviceSize } from "@/styles/theme/default";

// Icons
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const TrendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
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

// Sidebar Icons for Mockup
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const PaymentsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ReportsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);

const WalletsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <circle cx="18" cy="14" r="2" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Triangle Bank Logo
const TriangleLogo = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 3L22 20H2L12 3Z" fill="currentColor" />
  </svg>
);

const features = [
  {
    icon: WalletIcon,
    title: "White-Label Accounts",
    description: "Provision branded accounts under your own identity. Support for multiple account types, currencies, and jurisdictions.",
  },
  {
    icon: RefreshIcon,
    title: "Real-Time FX",
    description: "Access interbank rates via simple API calls. 38+ currency pairs with transparent pricing and instant execution.",
  },
  {
    icon: GlobeIcon,
    title: "Multi-Currency Wallets",
    description: "Enable users to hold balances in 34+ currencies. Instant conversions and global payout capabilities.",
  },
  {
    icon: TrendingIcon,
    title: "Treasury & Hedging",
    description: "Offer forward contracts and hedging tools. Lock in rates up to 12 months with flexible drawdown options.",
  },
  {
    icon: ShieldIcon,
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant infrastructure. 2FA, audit logs, and comprehensive access controls included.",
  },
  {
    icon: CodeIcon,
    title: "Developer APIs",
    description: "RESTful APIs with webhooks and SDKs. Complete documentation and sandbox environment for testing.",
  },
];

export default function Account() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <HeroBadge>Platform</HeroBadge>
          <HeroTitle>
            The infrastructure layer for financial products
          </HeroTitle>
          <HeroSubtitle>
            Everything you need to build multi-currency accounts, payment processing, and FX services.
            Your brand, our technology.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="https://app.lux.financial/registration" target="_blank">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="/contact">
              <SecondaryButton>Talk to Sales</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>

        {/* Product Mock */}
        <MockContainer>
          <MockFrame>
            <MockSidebar>
              <MockLogo>T</MockLogo>
              <MockNavItem $active>Payments</MockNavItem>
              <MockNavItem>Reports</MockNavItem>
              <MockNavItem>Wallets</MockNavItem>
              <MockNavItem>Settings</MockNavItem>
            </MockSidebar>
            <MockMain>
              <MockTopBar>
                <MockTitle>Reports</MockTitle>
                <MockActions>
                  <MockButton>Filter</MockButton>
                  <MockButton $primary>Export CSV</MockButton>
                </MockActions>
              </MockTopBar>
              <MockTable>
                <MockTableHeader>
                  <span>Payment ID</span>
                  <span>Date/Time</span>
                  <span>Originator</span>
                  <span>Amount</span>
                  <span>Status</span>
                </MockTableHeader>
                <MockTableRow>
                  <span>1234455</span>
                  <span>Sep 20, 2025</span>
                  <span>Zoogle</span>
                  <span>$3,000.00</span>
                  <MockStatus $status="sent">Sent</MockStatus>
                </MockTableRow>
                <MockTableRow>
                  <span>6535518</span>
                  <span>Sep 20, 2025</span>
                  <span>Lunexa</span>
                  <span>$45,000.00</span>
                  <MockStatus $status="pending">Pending</MockStatus>
                </MockTableRow>
                <MockTableRow>
                  <span>6515365</span>
                  <span>Sep 20, 2025</span>
                  <span>Veridra</span>
                  <span>$100,000.00</span>
                  <MockStatus $status="sent">Sent</MockStatus>
                </MockTableRow>
              </MockTable>
            </MockMain>
          </MockFrame>
        </MockContainer>
      </HeroSection>

      {/* Features Grid */}
      <Section>
        <SectionHeader>
          <SectionTitle>Platform capabilities</SectionTitle>
          <SectionSubtitle>
            A complete toolkit for building and scaling financial products
          </SectionSubtitle>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>
                <feature.icon />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* Integration Section */}
      <Section>
        <TwoColumn>
          <div>
            <SectionTitle style={{ textAlign: 'left' }}>
              Built for developers
            </SectionTitle>
            <SectionSubtitle style={{ textAlign: 'left', margin: '1.5rem 0 2rem' }}>
              Clean APIs, comprehensive documentation, and a sandbox environment.
              Go from zero to integration in days.
            </SectionSubtitle>
            <Link href="https://docs.lux.financial" target="_blank">
              <SecondaryButton>View Documentation →</SecondaryButton>
            </Link>
          </div>
          <CodeBlock>
            <CodeHeader>
              <CodeTab $active>account.create</CodeTab>
            </CodeHeader>
            <CodeContent>
{`POST /v1/accounts

{
  "type": "business",
  "currencies": ["USD", "EUR", "GBP"],
  "country": "US",
  "metadata": {
    "customer_id": "cust_abc123"
  }
}`}
            </CodeContent>
          </CodeBlock>
        </TwoColumn>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Start building today</CTATitle>
        <CTASubtitle>
          Create an account and explore the platform with our sandbox environment.
        </CTASubtitle>
        <Link href="https://app.lux.financial/registration" target="_blank">
          <CustomButton>Create Account</CustomButton>
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
  padding: 5rem 0;

  @media ${DeviceSize.sm} {
    padding: 3rem 0;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 720px;
  margin: 0 auto 4rem;
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

const MockContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const MockFrame = styled.div`
  display: flex;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  @media ${DeviceSize.sm} {
    flex-direction: column;
  }
`;

const MockSidebar = styled.div`
  width: 180px;
  background: #1E3A5F;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media ${DeviceSize.sm} {
    width: 100%;
    flex-direction: row;
    padding: 1rem;
    gap: 0.5rem;
    overflow-x: auto;
  }
`;

const MockLogo = styled.div`
  width: 32px;
  height: 32px;
  background: #FF6B35;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;

  @media ${DeviceSize.sm} {
    display: none;
  }
`;

const MockNavItem = styled.div<{ $active?: boolean }>`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 1.3rem;
  color: ${props => props.$active ? '#FFFFFF' : 'rgba(255,255,255,0.7)'};
  background: ${props => props.$active ? 'rgba(255,255,255,0.15)' : 'transparent'};
  cursor: pointer;

  @media ${DeviceSize.sm} {
    white-space: nowrap;
  }
`;

const MockMain = styled.div`
  flex: 1;
  padding: 1.5rem;
  background: #F8FAFC;
  min-height: 320px;
`;

const MockTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media ${DeviceSize.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const MockTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1E3A5F;
`;

const MockActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MockButton = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1.2rem;
  border: 1px solid ${props => props.$primary ? '#1E3A5F' : '#E2E8F0'};
  background: ${props => props.$primary ? '#1E3A5F' : '#FFFFFF'};
  color: ${props => props.$primary ? '#FFFFFF' : '#1E3A5F'};
  cursor: pointer;
`;

const MockTable = styled.div`
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
`;

const MockTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  padding: 0.75rem 1rem;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #64748B;

  @media ${DeviceSize.sm} {
    grid-template-columns: repeat(3, 1fr);

    span:nth-child(4),
    span:nth-child(5) {
      display: none;
    }
  }
`;

const MockTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #F1F5F9;
  font-size: 1.2rem;
  color: #1E293B;

  &:last-child {
    border-bottom: none;
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: repeat(3, 1fr);

    span:nth-child(4),
    span:nth-child(5) {
      display: none;
    }
  }
`;

const MockStatus = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 500;
  background: ${props => props.$status === 'sent' ? '#DCFCE7' : '#FEF3C7'};
  color: ${props => props.$status === 'sent' ? '#166534' : '#92400E'};
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

const FeaturesGrid = styled.div`
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

const FeatureCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 1rem;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CodeBlock = styled.div`
  background: rgba(15, 22, 32, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
`;

const CodeHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
`;

const CodeTab = styled.span<{ $active?: boolean }>`
  font-size: 1.2rem;
  font-family: ui-monospace, monospace;
  color: ${props => props.$active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.45)'};
`;

const CodeContent = styled.pre`
  padding: 1.5rem;
  margin: 0;
  font-size: 1.2rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  overflow-x: auto;
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
