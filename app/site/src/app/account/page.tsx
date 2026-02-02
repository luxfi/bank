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

type MockPage = "dashboard" | "payments" | "reports" | "wallets" | "settings";

export default function Account() {
  const [activeMockPage, setActiveMockPage] = useState<MockPage>("dashboard");

  const renderMockContent = () => {
    switch (activeMockPage) {
      case "dashboard":
        return (
          <>
            <MockTopBar>
              <MockTitle>Dashboard</MockTitle>
              <MockActions>
                <MockButton>Last 30 Days</MockButton>
              </MockActions>
            </MockTopBar>
            <MockStatsGrid>
              <MockStatCard>
                <MockStatLabel>Total Balance</MockStatLabel>
                <MockStatValue>$1,234,567</MockStatValue>
                <MockStatChange $positive>+12.5%</MockStatChange>
              </MockStatCard>
              <MockStatCard>
                <MockStatLabel>Pending</MockStatLabel>
                <MockStatValue>$45,230</MockStatValue>
                <MockStatChange $positive>+3.2%</MockStatChange>
              </MockStatCard>
              <MockStatCard>
                <MockStatLabel>This Month</MockStatLabel>
                <MockStatValue>$89,450</MockStatValue>
                <MockStatChange>-2.1%</MockStatChange>
              </MockStatCard>
            </MockStatsGrid>
            <MockChartPlaceholder>
              <MockChartBars>
                <MockChartBar $height={60} />
                <MockChartBar $height={80} />
                <MockChartBar $height={45} />
                <MockChartBar $height={90} />
                <MockChartBar $height={70} />
                <MockChartBar $height={85} />
                <MockChartBar $height={95} />
              </MockChartBars>
            </MockChartPlaceholder>
          </>
        );
      case "payments":
        return (
          <>
            <MockTopBar>
              <MockTitle>Payments</MockTitle>
              <MockActions>
                <MockButton>Filter</MockButton>
                <MockButton $primary>+ New Payment</MockButton>
              </MockActions>
            </MockTopBar>
            <MockTable>
              <MockTableHeader>
                <span>Recipient</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Status</span>
              </MockTableHeader>
              <MockTableRow>
                <span>Acme Corp</span>
                <span>$12,500.00</span>
                <span>Jan 28, 2026</span>
                <MockStatus $status="sent">Completed</MockStatus>
              </MockTableRow>
              <MockTableRow>
                <span>Global Trade Ltd</span>
                <span>€8,750.00</span>
                <span>Jan 28, 2026</span>
                <MockStatus $status="pending">Processing</MockStatus>
              </MockTableRow>
              <MockTableRow>
                <span>Tech Solutions</span>
                <span>£5,200.00</span>
                <span>Jan 27, 2026</span>
                <MockStatus $status="sent">Completed</MockStatus>
              </MockTableRow>
            </MockTable>
          </>
        );
      case "reports":
        return (
          <>
            <MockTopBar>
              <MockTitle>Reports</MockTitle>
              <MockActions>
                <MockButton>Filter</MockButton>
                <MockButton $primary>Export CSV</MockButton>
              </MockActions>
            </MockTopBar>
            <MockTable>
              <MockTableHeader>
                <span>Report</span>
                <span>Period</span>
                <span>Generated</span>
                <span>Action</span>
              </MockTableHeader>
              <MockTableRow>
                <span>Transaction Summary</span>
                <span>Q4 2025</span>
                <span>Jan 15, 2026</span>
                <MockStatus $status="sent">Download</MockStatus>
              </MockTableRow>
              <MockTableRow>
                <span>FX Activity</span>
                <span>December 2025</span>
                <span>Jan 5, 2026</span>
                <MockStatus $status="sent">Download</MockStatus>
              </MockTableRow>
              <MockTableRow>
                <span>Account Statement</span>
                <span>2025 Annual</span>
                <span>Jan 2, 2026</span>
                <MockStatus $status="sent">Download</MockStatus>
              </MockTableRow>
            </MockTable>
          </>
        );
      case "wallets":
        return (
          <>
            <MockTopBar>
              <MockTitle>Wallets</MockTitle>
              <MockActions>
                <MockButton $primary>+ Add Wallet</MockButton>
              </MockActions>
            </MockTopBar>
            <MockWalletGrid>
              <MockWalletCard>
                <MockWalletCurrency>USD</MockWalletCurrency>
                <MockWalletBalance>$845,230.50</MockWalletBalance>
                <MockWalletLabel>US Dollar</MockWalletLabel>
              </MockWalletCard>
              <MockWalletCard>
                <MockWalletCurrency>EUR</MockWalletCurrency>
                <MockWalletBalance>€234,120.00</MockWalletBalance>
                <MockWalletLabel>Euro</MockWalletLabel>
              </MockWalletCard>
              <MockWalletCard>
                <MockWalletCurrency>GBP</MockWalletCurrency>
                <MockWalletBalance>£155,217.25</MockWalletBalance>
                <MockWalletLabel>British Pound</MockWalletLabel>
              </MockWalletCard>
            </MockWalletGrid>
          </>
        );
      case "settings":
        return (
          <>
            <MockTopBar>
              <MockTitle>Settings</MockTitle>
            </MockTopBar>
            <MockSettingsList>
              <MockSettingItem>
                <MockSettingInfo>
                  <MockSettingTitle>Two-Factor Authentication</MockSettingTitle>
                  <MockSettingDesc>Add an extra layer of security</MockSettingDesc>
                </MockSettingInfo>
                <MockToggle $active />
              </MockSettingItem>
              <MockSettingItem>
                <MockSettingInfo>
                  <MockSettingTitle>Email Notifications</MockSettingTitle>
                  <MockSettingDesc>Receive alerts for transactions</MockSettingDesc>
                </MockSettingInfo>
                <MockToggle $active />
              </MockSettingItem>
              <MockSettingItem>
                <MockSettingInfo>
                  <MockSettingTitle>API Access</MockSettingTitle>
                  <MockSettingDesc>Manage API keys and webhooks</MockSettingDesc>
                </MockSettingInfo>
                <MockButton $small>Configure</MockButton>
              </MockSettingItem>
            </MockSettingsList>
          </>
        );
    }
  };

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
              <MockLogoContainer>
                <MockLogo>
                  <TriangleLogo />
                </MockLogo>
                <MockBrandName>TriBank</MockBrandName>
              </MockLogoContainer>
              <MockNavItem
                $active={activeMockPage === "dashboard"}
                onClick={() => setActiveMockPage("dashboard")}
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </MockNavItem>
              <MockNavItem
                $active={activeMockPage === "payments"}
                onClick={() => setActiveMockPage("payments")}
              >
                <PaymentsIcon />
                <span>Payments</span>
              </MockNavItem>
              <MockNavItem
                $active={activeMockPage === "reports"}
                onClick={() => setActiveMockPage("reports")}
              >
                <ReportsIcon />
                <span>Reports</span>
              </MockNavItem>
              <MockNavItem
                $active={activeMockPage === "wallets"}
                onClick={() => setActiveMockPage("wallets")}
              >
                <WalletsIcon />
                <span>Wallets</span>
              </MockNavItem>
              <MockNavItem
                $active={activeMockPage === "settings"}
                onClick={() => setActiveMockPage("settings")}
              >
                <SettingsIcon />
                <span>Settings</span>
              </MockNavItem>
            </MockSidebar>
            <MockMain>
              {renderMockContent()}
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
    font-size: 3rem;
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

const MockContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  perspective: 1000px;
`;

const MockFrame = styled.div`
  display: flex;
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 80px -20px rgba(255, 255, 255, 0.1);
  transform: rotateX(2deg);
  transition: transform 0.3s ease;

  &:hover {
    transform: rotateX(0deg);
  }

  @media ${DeviceSize.sm} {
    flex-direction: column;
    transform: none;
  }
`;

const MockSidebar = styled.div`
  width: 200px;
  background: #000000;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media ${DeviceSize.sm} {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 1rem;
    gap: 0.5rem;
    overflow-x: auto;
  }
`;

const MockLogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 1.5rem;

  @media ${DeviceSize.sm} {
    display: none;
  }
`;

const MockLogo = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MockBrandName = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: -0.02em;
`;

const MockNavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 500;
  border: none;
  width: 100%;
  text-align: left;
  color: ${props => props.$active ? '#FFFFFF' : 'rgba(255,255,255,0.6)'};
  background: ${props => props.$active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s ease;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover {
    color: #FFFFFF;
    background: rgba(255,255,255,0.08);
  }

  @media ${DeviceSize.sm} {
    width: auto;
    white-space: nowrap;
    padding: 0.5rem 0.75rem;

    span {
      display: none;
    }
  }
`;

const MockMain = styled.div`
  flex: 1;
  padding: 1.5rem;
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
  min-height: 380px;
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
  font-size: 1.8rem;
  font-weight: 600;
  color: #0F172A;
  letter-spacing: -0.02em;
`;

const MockActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MockButton = styled.button<{ $primary?: boolean; $small?: boolean }>`
  padding: ${props => props.$small ? '0.4rem 0.75rem' : '0.5rem 1rem'};
  border-radius: 6px;
  font-size: ${props => props.$small ? '1.1rem' : '1.2rem'};
  font-weight: 500;
  border: 1px solid ${props => props.$primary ? '#0F172A' : '#E2E8F0'};
  background: ${props => props.$primary ? '#0F172A' : '#FFFFFF'};
  color: ${props => props.$primary ? '#FFFFFF' : '#0F172A'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => props.$primary ? '#1E293B' : '#F8FAFC'};
  }
`;

const MockTable = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const MockTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  padding: 0.875rem 1.25rem;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr 1fr auto;

    span:nth-child(3) {
      display: none;
    }
  }
`;

const MockTableRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #F1F5F9;
  font-size: 1.25rem;
  color: #1E293B;
  align-items: center;
  transition: background 0.1s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #FAFBFC;
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr 1fr auto;

    span:nth-child(3) {
      display: none;
    }
  }
`;

const MockStatus = styled.span<{ $status: string }>`
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 500;
  background: ${props => props.$status === 'sent' ? '#DCFCE7' : '#FEF3C7'};
  color: ${props => props.$status === 'sent' ? '#166534' : '#92400E'};
`;

// Dashboard specific
const MockStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const MockStatCard = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const MockStatLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #64748B;
  margin-bottom: 0.5rem;
`;

const MockStatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #0F172A;
  letter-spacing: -0.02em;
`;

const MockStatChange = styled.div<{ $positive?: boolean }>`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${props => props.$positive ? '#16A34A' : '#DC2626'};
  margin-top: 0.25rem;
`;

const MockChartPlaceholder = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  padding: 1.5rem;
  height: 140px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const MockChartBars = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  align-items: flex-end;
`;

const MockChartBar = styled.div<{ $height: number }>`
  flex: 1;
  height: ${props => props.$height}%;
  background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
`;

// Wallets specific
const MockWalletGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const MockWalletCard = styled.div`
  background: linear-gradient(135deg, #000000 0%, #1A1A1A 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
`;

const MockWalletCurrency = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
`;

const MockWalletBalance = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
`;

const MockWalletLabel = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
`;

// Settings specific
const MockSettingsList = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const MockSettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #F1F5F9;

  &:last-child {
    border-bottom: none;
  }
`;

const MockSettingInfo = styled.div`
  flex: 1;
`;

const MockSettingTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  color: #0F172A;
  margin-bottom: 0.25rem;
`;

const MockSettingDesc = styled.div`
  font-size: 1.15rem;
  color: #64748B;
`;

const MockToggle = styled.div<{ $active?: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.$active ? '#16A34A' : '#E2E8F0'};
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #FFFFFF;
    top: 2px;
    left: ${props => props.$active ? '22px' : '2px'};
    transition: left 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1rem;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
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
