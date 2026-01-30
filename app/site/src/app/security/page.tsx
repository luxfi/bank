"use client";

import styled from "styled-components";
import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";

const securityFeatures = [
  {
    icon: "🔐",
    title: "HSM-Backed Key Management",
    description: "All private keys are generated and stored in FIPS 140-2 Level 3 certified Hardware Security Modules (HSMs) using AWS CloudHSM, Azure Dedicated HSM, or Thales Luna.",
  },
  {
    icon: "🛡️",
    title: "Multi-Party Computation (MPC)",
    description: "Threshold signing with 2-of-3 or 3-of-5 configurations ensures no single party can unilaterally move funds. Key shares are distributed across geographic regions.",
  },
  {
    icon: "⚛️",
    title: "Post-Quantum Cryptography",
    description: "Future-proofed against quantum threats with CRYSTALS-Dilithium, Kyber, and SPHINCS+ algorithms. Hybrid classical/quantum signatures available.",
  },
  {
    icon: "🔒",
    title: "Enterprise Identity & Access",
    description: "SAML 2.0, OIDC, and OAuth 2.0 integration with your existing IdP. Role-based access control, audit logging, and session management.",
  },
  {
    icon: "🌐",
    title: "Network Security",
    description: "All traffic encrypted with TLS 1.3. WAF protection, DDoS mitigation, and IP allowlisting. Private endpoints available for enterprise deployments.",
  },
  {
    icon: "📋",
    title: "Compliance & Audits",
    description: "SOC 2 Type II certified. Regular penetration testing by independent security firms. Full audit trail of all transactions and administrative actions.",
  },
];

const certifications = [
  { name: "SOC 2 Type II", status: "Certified" },
  { name: "ISO 27001", status: "In Progress" },
  { name: "PCI DSS", status: "Compliant" },
  { name: "GDPR", status: "Compliant" },
];

export default function SecurityPage() {
  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/security.jpg"
          showCard={false}
          imageTitle="Security"
          responsiveHeight="250px"
        />
      </AnimatedDiv>

      <Container>
        <PageIntro>
          <IntroTitle>Enterprise-Grade Security</IntroTitle>
          <IntroText>
            Protecting digital assets with institutional-grade infrastructure.
            Our security architecture is designed to meet the requirements of
            regulated financial institutions.
          </IntroText>
        </PageIntro>

        {/* Security Features Grid */}
        <Section>
          <SectionTitle>Security Architecture</SectionTitle>
          <FeaturesGrid>
            {securityFeatures.map((feature) => (
              <FeatureCard key={feature.title}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Section>

        {/* Certifications */}
        <Section>
          <SectionTitle>Certifications & Compliance</SectionTitle>
          <CertGrid>
            {certifications.map((cert) => (
              <CertCard key={cert.name}>
                <CertName>{cert.name}</CertName>
                <CertStatus $active={cert.status === "Certified" || cert.status === "Compliant"}>
                  {cert.status}
                </CertStatus>
              </CertCard>
            ))}
          </CertGrid>
        </Section>

        {/* Security Practices */}
        <Section>
          <SectionTitle>Operational Security</SectionTitle>
          <PracticesList>
            <PracticeItem>
              <PracticeTitle>Penetration Testing</PracticeTitle>
              <PracticeText>
                Annual third-party penetration tests conducted by leading security firms.
                Continuous vulnerability scanning with automated remediation workflows.
              </PracticeText>
            </PracticeItem>
            <PracticeItem>
              <PracticeTitle>Incident Response</PracticeTitle>
              <PracticeText>
                24/7 security operations center (SOC) monitoring. Documented incident
                response procedures with defined SLAs and communication protocols.
              </PracticeText>
            </PracticeItem>
            <PracticeItem>
              <PracticeTitle>Business Continuity</PracticeTitle>
              <PracticeText>
                Multi-region disaster recovery with RPO/RTO targets. Regular DR drills
                and documented recovery procedures. Encrypted off-site backups.
              </PracticeText>
            </PracticeItem>
            <PracticeItem>
              <PracticeTitle>Vendor Management</PracticeTitle>
              <PracticeText>
                Rigorous third-party risk assessment program. All critical vendors
                undergo security review and contractual security requirements.
              </PracticeText>
            </PracticeItem>
          </PracticesList>
        </Section>

        {/* Bug Bounty */}
        <Section>
          <BugBountyCard>
            <BugBountyTitle>Security Research Program</BugBountyTitle>
            <BugBountyText>
              We work with security researchers to identify and address vulnerabilities.
              If you discover a security issue, please report it responsibly.
            </BugBountyText>
            <BugBountyLink href="mailto:security@lux.financial">
              security@lux.financial
            </BugBountyLink>
          </BugBountyCard>
        </Section>

        {/* CTA */}
        <CTASection>
          <CTATitle>Questions about our security?</CTATitle>
          <CTAText>
            Our security team is available to discuss your specific requirements.
          </CTAText>
          <CTAButton href="https://cal.com/luxfi" target="_blank">Talk to Sales</CTAButton>
        </CTASection>
      </Container>
    </>
  );
}

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px 96px;
`;

const PageIntro = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const IntroTitle = styled.h1`
  color: #FAFAFA;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const IntroText = styled.p`
  color: #888;
  font-size: 18px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 64px;
`;

const SectionTitle = styled.h2`
  color: #FAFAFA;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #222;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #333;
  }
`;

const FeatureIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  color: #FAFAFA;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
`;

const CertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CertCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const CertName = styled.div`
  color: #FAFAFA;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const CertStatus = styled.div<{ $active: boolean }>`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ $active }) => ($active ? "#22C55E" : "#FFFFFF")};
`;

const PracticesList = styled.div`
  display: grid;
  gap: 24px;
`;

const PracticeItem = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
`;

const PracticeTitle = styled.h3`
  color: #FAFAFA;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const PracticeText = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
`;

const BugBountyCard = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  border: 1px solid #222;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
`;

const BugBountyTitle = styled.h3`
  color: #FAFAFA;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const BugBountyText = styled.p`
  color: #888;
  font-size: 16px;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 24px;
`;

const BugBountyLink = styled.a`
  display: inline-block;
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: underline;
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  border: 1px solid #222;
  border-radius: 16px;
`;

const CTATitle = styled.h3`
  color: #FAFAFA;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const CTAText = styled.p`
  color: #888;
  font-size: 16px;
  margin-bottom: 24px;
`;

const CTAButton = styled.a`
  display: inline-block;
  background: #FFFFFF;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
`;
