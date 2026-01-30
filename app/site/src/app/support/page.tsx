"use client";

import styled from "styled-components";
import Link from "next/link";
import { CustomButton } from "@/components/Button";

const supportChannels = [
  {
    title: "Documentation",
    description: "Comprehensive guides, API reference, and tutorials",
    icon: BookIcon,
    link: "/docs",
    linkText: "Browse Docs",
  },
  {
    title: "Developer Discord",
    description: "Join our community of developers building with Lux",
    icon: DiscordIcon,
    link: "https://discord.gg/luxfinance",
    linkText: "Join Discord",
    external: true,
  },
  {
    title: "Email Support",
    description: "Get help from our technical support team",
    icon: EmailIcon,
    link: "mailto:support@lux.financial",
    linkText: "support@lux.financial",
  },
  {
    title: "Enterprise Support",
    description: "Dedicated support with SLA for enterprise customers",
    icon: HeadsetIcon,
    link: "/contact",
    linkText: "Contact Sales",
  },
];

const faqItems = [
  {
    question: "How do I get API credentials?",
    answer: "Sign up for a sandbox account at app.lux.financial. You'll receive API keys immediately for testing. Production keys are issued after completing verification.",
  },
  {
    question: "What are the API rate limits?",
    answer: "Sandbox: 100 requests/minute. Production: 1,000 requests/minute standard, 10,000 requests/minute for enterprise. Contact us for higher limits.",
  },
  {
    question: "How long does integration take?",
    answer: "Most integrations are completed in 2-4 weeks. Simple payment flows can be live in days. Our team provides dedicated support throughout.",
  },
  {
    question: "What compliance requirements do I need?",
    answer: "Requirements vary by use case and jurisdiction. We provide compliance guidance and can handle KYC/AML through our platform for most scenarios.",
  },
  {
    question: "Do you support webhooks?",
    answer: "Yes, we provide real-time webhooks for all transaction events, account changes, and compliance alerts. Webhook signatures ensure authenticity.",
  },
  {
    question: "What currencies and payment rails do you support?",
    answer: "34+ fiat currencies via ACH, Wire, SEPA, Faster Payments, SWIFT, and local rails. Plus USDC, USDT, PYUSD across 8+ blockchain networks.",
  },
];

const supportPlans = [
  {
    name: "Developer",
    description: "For startups and developers getting started",
    features: [
      "Community Discord access",
      "Documentation & guides",
      "Email support (48hr response)",
      "Sandbox environment",
    ],
    price: "Free",
  },
  {
    name: "Growth",
    description: "For scaling businesses with production needs",
    features: [
      "Everything in Developer",
      "Priority email support (24hr response)",
      "Slack channel access",
      "Monthly check-in calls",
      "Integration assistance",
    ],
    price: "Included with Growth plan",
  },
  {
    name: "Enterprise",
    description: "For large organizations with critical requirements",
    features: [
      "Everything in Growth",
      "Dedicated support engineer",
      "4-hour response SLA",
      "24/7 emergency support",
      "Custom integrations",
      "Quarterly business reviews",
    ],
    price: "Custom",
  },
];

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function SupportPage() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroTitle>How can we help?</HeroTitle>
        <HeroSubtitle>
          Get the support you need to build with Lux Financial
        </HeroSubtitle>
      </HeroSection>

      {/* Support Channels */}
      <Section>
        <ChannelsGrid>
          {supportChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <ChannelCard key={channel.title}>
                <ChannelIcon>
                  <Icon />
                </ChannelIcon>
                <ChannelTitle>{channel.title}</ChannelTitle>
                <ChannelDescription>{channel.description}</ChannelDescription>
                <ChannelLink
                  href={channel.link}
                  target={channel.external ? "_blank" : undefined}
                >
                  {channel.linkText} →
                </ChannelLink>
              </ChannelCard>
            );
          })}
        </ChannelsGrid>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
        </SectionHeader>
        <FAQList>
          {faqItems.map((faq) => (
            <FAQItem key={faq.question}>
              <FAQQuestion>
                {faq.question}
                <ChevronIcon />
              </FAQQuestion>
              <FAQAnswer>{faq.answer}</FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>
      </Section>

      {/* Support Plans */}
      <Section>
        <SectionHeader>
          <SectionTitle>Support Plans</SectionTitle>
          <SectionSubtitle>
            Choose the level of support that matches your needs
          </SectionSubtitle>
        </SectionHeader>
        <PlansGrid>
          {supportPlans.map((plan) => (
            <PlanCard key={plan.name}>
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              <PlanFeatures>
                {plan.features.map((feature) => (
                  <PlanFeature key={feature}>
                    <CheckIcon />
                    {feature}
                  </PlanFeature>
                ))}
              </PlanFeatures>
              <PlanPrice>{plan.price}</PlanPrice>
            </PlanCard>
          ))}
        </PlansGrid>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Still have questions?</CTATitle>
        <CTASubtitle>
          Our team is ready to help you get started
        </CTASubtitle>
        <Link href="/contact">
          <CustomButton>Contact Us</CustomButton>
        </Link>
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
  padding: 4rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const SectionSubtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.55);
`;

const ChannelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ChannelCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
`;

const ChannelIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5CF6;
`;

const ChannelTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const ChannelDescription = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 1rem;
`;

const ChannelLink = styled.a`
  font-size: 1.4rem;
  color: #8B5CF6;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const FAQList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.details`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;

  &[open] {
    background: rgba(255, 255, 255, 0.04);
  }
`;

const FAQQuestion = styled.summary`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  svg {
    transition: transform 0.2s ease;
  }

  details[open] & svg {
    transform: rotate(180deg);
  }
`;

const FAQAnswer = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
`;

const PlanName = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const PlanDescription = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 1.5rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.65);
  padding: 0.5rem 0;

  svg {
    color: #22C55E;
    flex-shrink: 0;
  }
`;

const PlanPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
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
