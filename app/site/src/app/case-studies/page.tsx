"use client";

import styled from "styled-components";
import Link from "next/link";
import { CustomButton } from "@/components/Button";

const caseStudies = [
  {
    slug: "defi-protocol",
    title: "How a Top DeFi Protocol Reduced Settlement Time by 99%",
    description: "A leading DeFi lending protocol needed reliable fiat on/off ramps for their users. With Lux, they reduced settlement from 3-5 days to under 1 hour.",
    category: "DeFi",
    metrics: [
      { value: "99%", label: "Faster Settlement" },
      { value: "$500M+", label: "Monthly Volume" },
      { value: "180+", label: "Countries" },
    ],
    logo: "Protocol X",
  },
  {
    slug: "crypto-exchange",
    title: "Scaling a Crypto Exchange to $2B Daily Volume",
    description: "When traditional banking partners couldn't keep up with growth, this exchange turned to Lux for scalable banking infrastructure.",
    category: "Exchange",
    metrics: [
      { value: "$2B", label: "Daily Volume" },
      { value: "15", label: "Banking Partners" },
      { value: "99.99%", label: "Uptime" },
    ],
    logo: "Exchange Y",
  },
  {
    slug: "neobank",
    title: "Launching a Neobank in 12 Weeks",
    description: "A fintech startup used Lux's white-label infrastructure to launch their neobank, avoiding months of regulatory complexity.",
    category: "Neobank",
    metrics: [
      { value: "12", label: "Weeks to Launch" },
      { value: "500K", label: "Users (Year 1)" },
      { value: "85%", label: "Cost Savings" },
    ],
    logo: "Neobank Z",
  },
  {
    slug: "global-payments",
    title: "Cross-Border Payments for a Fortune 500",
    description: "A global enterprise replaced their legacy treasury system with Lux, saving millions in FX costs and operational overhead.",
    category: "Enterprise",
    metrics: [
      { value: "$50M", label: "Annual Savings" },
      { value: "45", label: "Countries" },
      { value: "T+0", label: "Settlement" },
    ],
    logo: "Enterprise Corp",
  },
  {
    slug: "stablecoin-issuer",
    title: "Building a Regulated Stablecoin from Scratch",
    description: "A fintech built their regulated stablecoin on Lux's infrastructure, from reserve management to mint/redeem operations.",
    category: "Stablecoin",
    metrics: [
      { value: "$1B", label: "Market Cap" },
      { value: "100%", label: "Reserve Ratio" },
      { value: "8", label: "Chain Support" },
    ],
    logo: "Stablecoin Co",
  },
  {
    slug: "web3-wallet",
    title: "Adding Fiat to a 10M User Wallet",
    description: "A popular Web3 wallet integrated Lux to offer fiat on-ramps, card payments, and bank transfers for their global user base.",
    category: "Wallet",
    metrics: [
      { value: "10M", label: "Users" },
      { value: "$100M+", label: "Monthly Deposits" },
      { value: "34", label: "Currencies" },
    ],
    logo: "Wallet App",
  },
];

const testimonials = [
  {
    quote: "Lux gave us the banking infrastructure we needed to scale globally. What would have taken years to build, we launched in weeks.",
    author: "CTO",
    company: "Top 10 Crypto Exchange",
  },
  {
    quote: "The compliance tooling alone saved us millions. We went from manual processes to automated screening that handles our entire volume.",
    author: "Head of Compliance",
    company: "Regulated Stablecoin Issuer",
  },
  {
    quote: "Our treasury operations are now instant instead of taking days. The ROI was immediate and substantial.",
    author: "CFO",
    company: "Fortune 500 Enterprise",
  },
];

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.2">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  );
}

export default function CaseStudiesPage() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroBadge>Case Studies</HeroBadge>
        <HeroTitle>See How Industry Leaders Build with Lux</HeroTitle>
        <HeroSubtitle>
          From DeFi protocols to Fortune 500 enterprises, see how companies are using
          Lux to transform their financial infrastructure.
        </HeroSubtitle>
      </HeroSection>

      {/* Featured Metrics */}
      <MetricsRow>
        <MetricCard>
          <MetricValue>$10B+</MetricValue>
          <MetricLabel>Transaction Volume</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>150+</MetricValue>
          <MetricLabel>Enterprise Clients</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>45+</MetricValue>
          <MetricLabel>Countries Served</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>99.99%</MetricValue>
          <MetricLabel>Uptime SLA</MetricLabel>
        </MetricCard>
      </MetricsRow>

      {/* Case Studies Grid */}
      <Section>
        <CaseStudiesGrid>
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug}>
              <CaseStudyCategory>{study.category}</CaseStudyCategory>
              <CaseStudyLogo>{study.logo}</CaseStudyLogo>
              <CaseStudyTitle>{study.title}</CaseStudyTitle>
              <CaseStudyDescription>{study.description}</CaseStudyDescription>
              <CaseStudyMetrics>
                {study.metrics.map((metric) => (
                  <CaseStudyMetric key={metric.label}>
                    <MetricVal>{metric.value}</MetricVal>
                    <MetricLbl>{metric.label}</MetricLbl>
                  </CaseStudyMetric>
                ))}
              </CaseStudyMetrics>
              <CaseStudyLink href={`/case-studies/${study.slug}`}>
                Read Case Study <ArrowIcon />
              </CaseStudyLink>
            </CaseStudyCard>
          ))}
        </CaseStudiesGrid>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionHeader>
          <SectionTitle>What Our Customers Say</SectionTitle>
        </SectionHeader>
        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index}>
              <QuoteIcon />
              <TestimonialQuote>{testimonial.quote}</TestimonialQuote>
              <TestimonialAuthor>
                <AuthorName>{testimonial.author}</AuthorName>
                <AuthorCompany>{testimonial.company}</AuthorCompany>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </Section>

      {/* CTA */}
      <CTASection>
        <CTATitle>Ready to build your success story?</CTATitle>
        <CTASubtitle>
          Join the companies transforming financial infrastructure with Lux
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
  font-size: 4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.65);
  max-width: 700px;
  margin: 0 auto;
`;

const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetricCard = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const MetricLabel = styled.div`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.45);
`;

const Section = styled.section`
  padding: 4rem 0;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const CaseStudiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CaseStudyCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.3);
  }
`;

const CaseStudyCategory = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #8B5CF6;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const CaseStudyLogo = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 0.75rem;
`;

const CaseStudyTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const CaseStudyDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1.5rem;
`;

const CaseStudyMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 1.5rem;
`;

const CaseStudyMetric = styled.div`
  text-align: center;
`;

const MetricVal = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #22D3EE;
`;

const MetricLbl = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.45);
`;

const CaseStudyLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #8B5CF6;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
`;

const TestimonialQuote = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const AuthorName = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
`;

const AuthorCompany = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.45);
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
