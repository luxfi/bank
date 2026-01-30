"use client";

import styled from "styled-components";
import Link from "next/link";

const guideCategories = [
  {
    title: "Getting Started",
    guides: [
      {
        title: "Quick Start Guide",
        description: "Get up and running with Lux in under 10 minutes",
        readTime: "5 min",
        href: "/guides/quickstart",
      },
      {
        title: "Authentication & API Keys",
        description: "Learn how to authenticate with the Lux API",
        readTime: "3 min",
        href: "/guides/authentication",
      },
      {
        title: "Sandbox vs Production",
        description: "Understanding environments and going live",
        readTime: "4 min",
        href: "/guides/environments",
      },
    ],
  },
  {
    title: "Payments",
    guides: [
      {
        title: "Accept Payments",
        description: "Start accepting payments from customers worldwide",
        readTime: "8 min",
        href: "/guides/accept-payments",
      },
      {
        title: "Send Payouts",
        description: "Send money to vendors, creators, and partners",
        readTime: "6 min",
        href: "/guides/payouts",
      },
      {
        title: "Cross-Border Payments",
        description: "Optimize international payments and FX",
        readTime: "10 min",
        href: "/guides/cross-border",
      },
      {
        title: "Recurring Payments",
        description: "Set up subscriptions and recurring billing",
        readTime: "7 min",
        href: "/guides/recurring",
      },
    ],
  },
  {
    title: "Accounts & Wallets",
    guides: [
      {
        title: "Create Customer Accounts",
        description: "Issue accounts with IBANs and local details",
        readTime: "8 min",
        href: "/guides/accounts",
      },
      {
        title: "Multi-Currency Wallets",
        description: "Hold and convert 34+ currencies",
        readTime: "6 min",
        href: "/guides/multicurrency",
      },
      {
        title: "Virtual Cards",
        description: "Issue virtual and physical cards for customers",
        readTime: "7 min",
        href: "/guides/cards",
      },
    ],
  },
  {
    title: "Crypto & Stablecoins",
    guides: [
      {
        title: "Stablecoin Integration",
        description: "Accept and send USDC, USDT, and more",
        readTime: "10 min",
        href: "/guides/stablecoins",
      },
      {
        title: "On-Ramp Implementation",
        description: "Let users buy crypto with fiat",
        readTime: "8 min",
        href: "/guides/onramp",
      },
      {
        title: "Off-Ramp Implementation",
        description: "Let users sell crypto for fiat",
        readTime: "8 min",
        href: "/guides/offramp",
      },
      {
        title: "Multi-Chain Support",
        description: "Work with Ethereum, Polygon, Solana, and more",
        readTime: "6 min",
        href: "/guides/multichain",
      },
    ],
  },
  {
    title: "Compliance",
    guides: [
      {
        title: "KYC Integration",
        description: "Implement identity verification",
        readTime: "12 min",
        href: "/guides/kyc",
      },
      {
        title: "AML & Transaction Monitoring",
        description: "Screen transactions for compliance",
        readTime: "10 min",
        href: "/guides/aml",
      },
      {
        title: "Sanctions Screening",
        description: "OFAC and global sanctions compliance",
        readTime: "6 min",
        href: "/guides/sanctions",
      },
    ],
  },
  {
    title: "Advanced",
    guides: [
      {
        title: "Webhooks & Events",
        description: "Real-time notifications for your application",
        readTime: "8 min",
        href: "/guides/webhooks",
      },
      {
        title: "Idempotency & Retries",
        description: "Build reliable integrations",
        readTime: "5 min",
        href: "/guides/idempotency",
      },
      {
        title: "Rate Limits & Best Practices",
        description: "Optimize your API usage",
        readTime: "4 min",
        href: "/guides/rate-limits",
      },
      {
        title: "White-Label Setup",
        description: "Brand the experience for your users",
        readTime: "15 min",
        href: "/guides/white-label",
      },
    ],
  },
];

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function GuidesPage() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroTitle>Guides & Tutorials</HeroTitle>
        <HeroSubtitle>
          Step-by-step tutorials to help you integrate Lux into your application
        </HeroSubtitle>
      </HeroSection>

      {/* Guides by Category */}
      {guideCategories.map((category) => (
        <Section key={category.title}>
          <SectionTitle>{category.title}</SectionTitle>
          <GuidesGrid>
            {category.guides.map((guide) => (
              <GuideCard key={guide.title} href={guide.href}>
                <GuideTitle>{guide.title}</GuideTitle>
                <GuideDescription>{guide.description}</GuideDescription>
                <GuideFooter>
                  <ReadTime>
                    <ClockIcon />
                    {guide.readTime}
                  </ReadTime>
                  <GuideArrow>
                    <ArrowIcon />
                  </GuideArrow>
                </GuideFooter>
              </GuideCard>
            ))}
          </GuidesGrid>
        </Section>
      ))}

      {/* CTA */}
      <CTASection>
        <CTATitle>Can't find what you're looking for?</CTATitle>
        <CTASubtitle>
          Check out our API reference or contact support
        </CTASubtitle>
        <CTALinks>
          <CTALink href="/docs">View API Docs →</CTALink>
          <CTALink href="/support">Contact Support →</CTALink>
        </CTALinks>
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

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.65);
`;

const Section = styled.section`
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
`;

const GuidesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GuideCard = styled(Link)`
  display: block;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const GuideTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const GuideDescription = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1rem;
`;

const GuideFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReadTime = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.45);
`;

const GuideArrow = styled.span`
  color: rgba(255, 255, 255, 0.35);
  transition: color 0.15s ease;

  ${GuideCard}:hover & {
    color: #8B5CF6;
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

const CTALinks = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

const CTALink = styled(Link)`
  font-size: 1.5rem;
  font-weight: 500;
  color: #8B5CF6;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;
