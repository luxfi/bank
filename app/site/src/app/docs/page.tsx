"use client";

import styled from "styled-components";
import Link from "next/link";
import { CustomButton } from "@/components/Button";

const docCategories = [
  {
    title: "Getting Started",
    description: "Quick start guides and tutorials to get up and running",
    icon: RocketIcon,
    links: [
      { title: "Quick Start Guide", href: "https://docs.lux.financial/quickstart" },
      { title: "Authentication", href: "https://docs.lux.financial/auth" },
      { title: "Making Your First API Call", href: "https://docs.lux.financial/first-call" },
      { title: "Sandbox Environment", href: "https://docs.lux.financial/sandbox" },
    ],
  },
  {
    title: "API Reference",
    description: "Complete API documentation with examples",
    icon: CodeIcon,
    links: [
      { title: "Accounts API", href: "https://docs.lux.financial/api/accounts" },
      { title: "Payments API", href: "https://docs.lux.financial/api/payments" },
      { title: "FX API", href: "https://docs.lux.financial/api/fx" },
      { title: "Webhooks", href: "https://docs.lux.financial/api/webhooks" },
    ],
  },
  {
    title: "SDKs & Libraries",
    description: "Official client libraries for popular languages",
    icon: PackageIcon,
    links: [
      { title: "Node.js SDK", href: "https://docs.lux.financial/sdk/node" },
      { title: "Python SDK", href: "https://docs.lux.financial/sdk/python" },
      { title: "Go SDK", href: "https://docs.lux.financial/sdk/go" },
      { title: "REST API", href: "https://docs.lux.financial/sdk/rest" },
    ],
  },
  {
    title: "Guides",
    description: "Step-by-step tutorials for common use cases",
    icon: BookIcon,
    links: [
      { title: "Implementing KYC", href: "https://docs.lux.financial/guides/kyc" },
      { title: "Cross-Border Payments", href: "https://docs.lux.financial/guides/cross-border" },
      { title: "Stablecoin Integration", href: "https://docs.lux.financial/guides/stablecoins" },
      { title: "White-Label Setup", href: "https://docs.lux.financial/guides/white-label" },
    ],
  },
  {
    title: "Security",
    description: "Security best practices and compliance",
    icon: ShieldIcon,
    links: [
      { title: "Security Overview", href: "https://docs.lux.financial/security" },
      { title: "API Key Management", href: "https://docs.lux.financial/security/api-keys" },
      { title: "Webhook Verification", href: "https://docs.lux.financial/security/webhooks" },
      { title: "Compliance", href: "https://docs.lux.financial/security/compliance" },
    ],
  },
  {
    title: "Changelog",
    description: "Latest updates and API changes",
    icon: HistoryIcon,
    links: [
      { title: "API Changelog", href: "https://docs.lux.financial/changelog" },
      { title: "SDK Releases", href: "https://docs.lux.financial/releases" },
      { title: "Migration Guides", href: "https://docs.lux.financial/migrations" },
      { title: "Deprecations", href: "https://docs.lux.financial/deprecations" },
    ],
  },
];

const popularDocs = [
  { title: "API Quick Start", description: "Get started in 5 minutes", href: "https://docs.lux.financial/quickstart" },
  { title: "Webhook Events", description: "Real-time event notifications", href: "https://docs.lux.financial/webhooks" },
  { title: "Error Handling", description: "Handle errors gracefully", href: "https://docs.lux.financial/errors" },
  { title: "Rate Limits", description: "API rate limiting explained", href: "https://docs.lux.financial/rate-limits" },
];

function RocketIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6M8 11h8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5M12 7v5l4 2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  );
}

export default function DocsPage() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroTitle>Documentation</HeroTitle>
        <HeroSubtitle>
          Everything you need to integrate Lux Financial into your application
        </HeroSubtitle>
        <SearchBox>
          <SearchIcon />
          <SearchInput placeholder="Search documentation..." />
          <SearchShortcut>⌘K</SearchShortcut>
        </SearchBox>
      </HeroSection>

      {/* Popular Docs */}
      <Section>
        <SectionLabel>Popular</SectionLabel>
        <PopularGrid>
          {popularDocs.map((doc) => (
            <PopularCard key={doc.title} href={doc.href} target="_blank">
              <PopularTitle>{doc.title}</PopularTitle>
              <PopularDescription>{doc.description}</PopularDescription>
              <ArrowIcon />
            </PopularCard>
          ))}
        </PopularGrid>
      </Section>

      {/* Categories */}
      <Section>
        <CategoriesGrid>
          {docCategories.map((category) => {
            const Icon = category.icon;
            return (
              <CategoryCard key={category.title}>
                <CategoryHeader>
                  <CategoryIcon>
                    <Icon />
                  </CategoryIcon>
                  <CategoryInfo>
                    <CategoryTitle>{category.title}</CategoryTitle>
                    <CategoryDescription>{category.description}</CategoryDescription>
                  </CategoryInfo>
                </CategoryHeader>
                <CategoryLinks>
                  {category.links.map((link) => (
                    <CategoryLink key={link.title} href={link.href} target="_blank">
                      {link.title}
                      <ArrowIcon />
                    </CategoryLink>
                  ))}
                </CategoryLinks>
              </CategoryCard>
            );
          })}
        </CategoriesGrid>
      </Section>

      {/* API Status */}
      <Section>
        <StatusCard>
          <StatusContent>
            <StatusIndicator />
            <StatusText>
              <StatusTitle>API Status: Operational</StatusTitle>
              <StatusDescription>All systems are running normally</StatusDescription>
            </StatusText>
          </StatusContent>
          <StatusLink href="https://status.lux.financial" target="_blank">
            View Status Page →
          </StatusLink>
        </StatusCard>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Need help?</CTATitle>
        <CTASubtitle>
          Our developer support team is available to help you integrate
        </CTASubtitle>
        <CTAButtons>
          <Link href="/support">
            <CustomButton>Contact Support</CustomButton>
          </Link>
          <Link href="https://discord.gg/luxfinance" target="_blank">
            <SecondaryButton>Join Discord</SecondaryButton>
          </Link>
        </CTAButtons>
      </CTASection>
    </PageContainer>
  );
}

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

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

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2rem;
`;

const SearchBox = styled.div`
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.45);
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.92);

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
`;

const SearchShortcut = styled.kbd`
  padding: 0.25rem 0.5rem;
  font-size: 1.1rem;
  font-family: ui-monospace, monospace;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.45);
`;

const Section = styled.section`
  padding: 3rem 0;
`;

const SectionLabel = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 1.5rem;
`;

const PopularGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PopularCard = styled.a`
  display: block;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    color: rgba(255, 255, 255, 0.35);
    margin-top: 0.75rem;
  }
`;

const PopularTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.25rem;
`;

const PopularDescription = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.45);
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const CategoryIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5CF6;
  flex-shrink: 0;
`;

const CategoryInfo = styled.div``;

const CategoryTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.25rem;
`;

const CategoryDescription = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.45);
`;

const CategoryLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CategoryLink = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.92);
  }

  svg {
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const StatusCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const StatusContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  background: #22C55E;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
`;

const StatusText = styled.div``;

const StatusTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
`;

const StatusDescription = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.55);
`;

const StatusLink = styled.a`
  font-size: 1.3rem;
  color: #22C55E;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const CTASection = styled.section`
  text-align: center;
  padding: 6rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const CTATitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const CTASubtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;
