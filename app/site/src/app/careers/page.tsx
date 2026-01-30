"use client";

import Link from "next/link";
import styled from "styled-components";
import { CustomButton, SecondaryButton } from "@/components/Button";
import AnimatedDiv from "@/components/AnimatedDiv";

const openPositions = [
  {
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Build enterprise crypto infrastructure with Go, Rust, and distributed systems.",
  },
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Create beautiful banking experiences with React, Next.js, and TypeScript.",
  },
  {
    title: "Cryptography Engineer",
    department: "Research",
    location: "Remote",
    type: "Full-time",
    description: "Implement MPC, threshold signatures, and post-quantum cryptography.",
  },
  {
    title: "DevOps / Infrastructure Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Scale Kubernetes, manage HSMs, and build secure infrastructure.",
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Shape the future of enterprise crypto infrastructure products.",
  },
  {
    title: "Solutions Engineer",
    department: "Sales",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Help banks and funds integrate with our platform.",
  },
];

const benefits = [
  "Competitive salary + equity",
  "Remote-first culture",
  "Health, dental, and vision insurance",
  "Unlimited PTO",
  "Home office stipend",
  "Conference and learning budget",
  "Work on cutting-edge crypto infrastructure",
  "Contribute to open-source research",
];

export default function CareersPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          <AnimatedDiv>
            <HeroBadge>Careers</HeroBadge>
            <HeroTitle>Build the future of finance</HeroTitle>
            <HeroSubtitle>
              Join us in creating enterprise crypto infrastructure for banks, funds, and corporates worldwide.
            </HeroSubtitle>
          </AnimatedDiv>
        </HeroContent>
      </HeroSection>

      <Container>
        {/* Mission Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>Our mission</SectionTitle>
            <SectionSubtitle>
              We&apos;re building the infrastructure layer for institutional crypto. Teleport, MPC custody,
              post-quantum security, staking, and treasury management—everything banks, funds, and corporates
              need to operate in crypto.
            </SectionSubtitle>
          </SectionHeader>
        </Section>

        {/* Open Positions */}
        <Section>
          <SectionHeader>
            <SectionTitle>Open positions</SectionTitle>
          </SectionHeader>

          <PositionsGrid>
            {openPositions.map((position, index) => (
              <PositionCard key={index}>
                <PositionHeader>
                  <PositionTitle>{position.title}</PositionTitle>
                  <PositionMeta>
                    <MetaBadge>{position.department}</MetaBadge>
                    <span>{position.location}</span>
                    <span>•</span>
                    <span>{position.type}</span>
                  </PositionMeta>
                </PositionHeader>
                <PositionDescription>{position.description}</PositionDescription>
                <Link href={`mailto:careers@lux.financial?subject=Application: ${position.title}`}>
                  <SecondaryButton style={{ marginTop: '1rem' }}>Apply →</SecondaryButton>
                </Link>
              </PositionCard>
            ))}
          </PositionsGrid>

          <NoPositionFit>
            <p>Don&apos;t see a perfect fit? We&apos;re always looking for exceptional talent.</p>
            <Link href="mailto:careers@lux.financial?subject=General Application">
              <CustomButton>Send us your resume</CustomButton>
            </Link>
          </NoPositionFit>
        </Section>

        {/* Benefits Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>Benefits & perks</SectionTitle>
          </SectionHeader>

          <BenefitsGrid>
            {benefits.map((benefit, index) => (
              <BenefitItem key={index}>
                <CheckIcon />
                {benefit}
              </BenefitItem>
            ))}
          </BenefitsGrid>
        </Section>

        {/* CTA Section */}
        <CTASection>
          <CTATitle>Ready to join us?</CTATitle>
          <CTASubtitle>
            We&apos;re a remote-first team building at the intersection of crypto, security, and traditional finance.
          </CTASubtitle>
          <Link href="mailto:careers@lux.financial">
            <CustomButton>Get in touch</CustomButton>
          </Link>
        </CTASection>
      </Container>
    </>
  );
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const HeroSection = styled.section`
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 100px 24px 60px;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 800px 400px at 50% 100%, rgba(255, 255, 255, 0.04), transparent);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
`;

const HeroBadge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 24px;
  margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #FAFAFA;
  line-height: 1.2;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #888;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px 96px;
`;

const Section = styled.section`
  padding: 48px 0;
  border-bottom: 1px solid #222;

  &:last-of-type {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #FAFAFA;
  margin-bottom: 16px;
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #888;
  line-height: 1.6;
  max-width: 700px;
`;

const PositionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PositionCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #333;
  }
`;

const PositionHeader = styled.div`
  margin-bottom: 12px;
`;

const PositionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #FAFAFA;
  margin-bottom: 8px;
`;

const PositionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span`
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const PositionDescription = styled.p`
  font-size: 16px;
  color: #888;
  line-height: 1.5;
`;

const NoPositionFit = styled.div`
  text-align: center;
  margin-top: 48px;
  padding: 32px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;

  p {
    font-size: 16px;
    color: #888;
    margin-bottom: 16px;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #CCC;
  padding: 12px 0;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 80px 0;
`;

const CTATitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #FAFAFA;
  margin-bottom: 16px;
`;

const CTASubtitle = styled.p`
  font-size: 18px;
  color: #888;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;
