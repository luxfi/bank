"use client";

import Link from "next/link";
import styled from "styled-components";
import AnimatedDiv from "@/components/AnimatedDiv";

export default function PlatformLaunchPressRelease() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          <AnimatedDiv>
            <HeroBadge>Press Release</HeroBadge>
            <HeroTitle>
              Lux Financial Platform Now Available: Instant Cross-Chain Settlement for Banks and PSPs
            </HeroTitle>
            <HeroMeta>
              <span>January 28, 2026</span>
              <span>•</span>
              <span>4 min read</span>
            </HeroMeta>
          </AnimatedDiv>
        </HeroContent>
      </HeroSection>

      <Container>
        <ArticleGrid>
          {/* Main Content */}
          <MainContent>
            <AnimatedDiv>
              <Tagline>Instant cross-chain settlement. No bridges required.</Tagline>

              <MetaInfo>
                <MetaItem>
                  <MetaLabel>News provided by</MetaLabel>
                  <MetaValue>Lux Industries Inc</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Date</MetaLabel>
                  <MetaValue>Jan 28, 2026, 10:00 ET</MetaValue>
                </MetaItem>
              </MetaInfo>

              <Highlight>
                After 5 years developing open banking infrastructure, Lux Financial delivers instant cross-chain settlement with zero bridge risk
              </Highlight>

              <ArticleBody>
                <p>
                  <strong>NEW YORK, Jan. 28, 2026</strong> — Lux Financial today announced general
                  availability of its cross-chain payment infrastructure, enabling banks, PSPs, and fintechs
                  to offer instant stablecoin settlements across 15+ blockchain networks with no bridge contracts.
                </p>

                <p>
                  The platform is the result of 5 years of development, beginning when CTO Zach Kelling joined
                  CDAX in October 2020 to lead technology development. Lux Financial has operated as the
                  technology services partner to CDAX, building open banking infrastructure for digital asset
                  services in the UK and Isle of Man.
                </p>

                <SectionHeading>Why this matters for financial institutions</SectionHeading>

                <p>
                  Global payment volume continues to grow, yet cross-border payments remain slow and expensive.
                  Stablecoin payment volume reached over $10 trillion in 2025 — market share being captured
                  from traditional institutions that lack the infrastructure to compete.
                </p>

                <p>
                  Lux Financial's stablecoin payment platform helps financial institutions cut cross-border
                  payment delivery time to minutes with a 90% cost reduction over industry standards. The platform,
                  which can be fully integrated in under 30 days, handles:
                </p>

                <FeatureList>
                  <li><strong>Wallet provisioning</strong> — Multi-chain custody with MPC security</li>
                  <li><strong>Treasury management</strong> — Automated liquidity and FX optimization</li>
                  <li><strong>Compliance orchestration</strong> — Built-in KYC/AML with 200+ jurisdiction support</li>
                  <li><strong>Settlement & reconciliation</strong> — Real-time atomic settlement</li>
                </FeatureList>

                <p>
                  The platform abstracts blockchain complexity while allowing institutions to maintain full
                  control over risk and customer relationships.
                </p>

                <Quote>
                  <QuoteText>
                    "We're giving institutions the full-stack infrastructure to add blockchain as a payment rail,
                    the same way they added mobile payments. We are the only platform that doesn't seek to compete
                    with banks, PSPs, or fintechs, but support them."
                  </QuoteText>
                  <QuoteAuthor>— CEO, Lux Financial</QuoteAuthor>
                </Quote>

                <SectionHeading>Platform Capabilities</SectionHeading>

                <p>
                  Lux Financial offers a complete white-label solution for financial institutions:
                </p>

                <FeatureList>
                  <li><strong>Multi-stablecoin support</strong> — USDC, USDT, EURC across 15+ blockchains</li>
                  <li><strong>Fiat on/off ramps</strong> — Direct bank integration in 40+ countries</li>
                  <li><strong>API-first architecture</strong> — Full REST and GraphQL APIs</li>
                  <li><strong>Regulatory compliance</strong> — Licensed in UK, EU, US (via sponsor bank)</li>
                  <li><strong>Enterprise security</strong> — SOC 2 Type II, ISO 27001 certified</li>
                </FeatureList>

                <SectionHeading>Availability</SectionHeading>

                <p>
                  The Lux Financial platform is available now for qualified financial institutions.
                  To learn more about the platform, schedule a demo at{" "}
                  <InlineLink href="https://lux.financial/contact">lux.financial/contact</InlineLink>{" "}
                  or reach out to our partnership team.
                </p>

                <Divider />

                <AboutSection>
                  <AboutTitle>About Lux Financial</AboutTitle>
                  <p>
                    Lux Financial is the technology services company behind the open banking infrastructure
                    developed in partnership with CDAX since 2020. The company operates as Lux Partners
                    Limited in the Isle of Man (IOMFSA regulated) and Lux Industries Inc in the United States.
                    The platform enables licensed financial institutions to connect traditional finance
                    with blockchain-based money movement, operating in the US through a partnership with
                    Metropolitan Commercial Bank, a NY State chartered, FDIC-insured bank.
                  </p>
                </AboutSection>

                <ContactSection>
                  <ContactTitle>Media Contact</ContactTitle>
                  <ContactEmail href="mailto:press@lux.financial">press@lux.financial</ContactEmail>
                </ContactSection>

                <SourceLine>SOURCE Lux Industries Inc</SourceLine>
              </ArticleBody>

              {/* Share & Actions */}
              <ActionBar>
                <ShareButtons>
                  <ShareButton href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://lux.financial/news/lux-financial-platform-launch')}&text=${encodeURIComponent('Lux Financial Launches Stablecoin Infrastructure Platform')}`} target="_blank" rel="noopener noreferrer">
                    Share on X
                  </ShareButton>
                  <ShareButton href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://lux.financial/news/lux-financial-platform-launch')}`} target="_blank" rel="noopener noreferrer">
                    Share on LinkedIn
                  </ShareButton>
                </ShareButtons>
                <BackLink href="/news">← Back to News</BackLink>
              </ActionBar>
            </AnimatedDiv>
          </MainContent>

          {/* Sidebar */}
          <Sidebar>
            <SidebarCard>
              <SidebarTitle>Related News</SidebarTitle>
              <RelatedList>
                <RelatedItem href="/news/lux-financial-cdax-partnership">
                  <RelatedDate>Jan 15, 2026</RelatedDate>
                  <RelatedTitle>Lux Financial and CDAX: Technology Partnership Powers New Banking Infrastructure</RelatedTitle>
                </RelatedItem>
                <RelatedItem href="/news/instant-settlement-network-launch">
                  <RelatedDate>Nov 12, 2025</RelatedDate>
                  <RelatedTitle>Lux Financial Launches Instant Settlement Network</RelatedTitle>
                </RelatedItem>
                <RelatedItem href="/news/us-mcb-partnership">
                  <RelatedDate>Sep 20, 2025</RelatedDate>
                  <RelatedTitle>Lux Financial Expands US Operations with MCB</RelatedTitle>
                </RelatedItem>
              </RelatedList>
            </SidebarCard>

            <SidebarCard>
              <SidebarTitle>Contact</SidebarTitle>
              <ContactInfo>
                <p><strong>Press Inquiries</strong></p>
                <p><a href="mailto:press@lux.financial">press@lux.financial</a></p>
                <p style={{ marginTop: '16px' }}><strong>Partnership Inquiries</strong></p>
                <p><a href="mailto:partnerships@lux.financial">partnerships@lux.financial</a></p>
              </ContactInfo>
            </SidebarCard>
          </Sidebar>
        </ArticleGrid>
      </Container>
    </>
  );
}

// Styles
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
  font-size: 40px;
  font-weight: 700;
  color: #FAFAFA;
  line-height: 1.2;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  color: #888;
`;

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px 96px;
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.article`
  min-width: 0;
`;

const Tagline = styled.p`
  font-size: 20px;
  font-weight: 500;
  font-style: italic;
  color: #FFFFFF;
  margin-bottom: 32px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 32px;
  padding: 16px 0;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  margin-bottom: 32px;
`;

const MetaItem = styled.div``;

const MetaLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
  margin-bottom: 4px;
`;

const MetaValue = styled.div`
  font-size: 14px;
  color: #FAFAFA;
`;

const Highlight = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #FAFAFA;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #FFFFFF;
  margin-bottom: 32px;
`;

const ArticleBody = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #CCC;

  p {
    margin-bottom: 20px;
  }

  strong {
    color: #FAFAFA;
  }
`;

const SectionHeading = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #FAFAFA;
  margin: 40px 0 20px;
`;

const FeatureList = styled.ul`
  margin: 20px 0;
  padding-left: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 24px;
    margin-bottom: 12px;

    &::before {
      content: "→";
      position: absolute;
      left: 0;
      color: #FFFFFF;
    }
  }
`;

const Quote = styled.blockquote`
  margin: 40px 0;
  padding: 32px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
`;

const QuoteText = styled.p`
  font-size: 18px;
  font-style: italic;
  color: #FAFAFA;
  line-height: 1.6;
  margin-bottom: 16px !important;
`;

const QuoteAuthor = styled.cite`
  font-size: 14px;
  font-style: normal;
  color: #888;
`;

const InlineLink = styled.a`
  color: #FFFFFF;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #222;
  margin: 48px 0;
`;

const AboutSection = styled.div`
  margin-bottom: 32px;

  p {
    color: #888;
    font-size: 14px;
    line-height: 1.7;
  }
`;

const AboutTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #FAFAFA;
  margin-bottom: 12px;
`;

const ContactSection = styled.div`
  margin-bottom: 32px;
`;

const ContactTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #888;
  margin-bottom: 8px;
`;

const ContactEmail = styled.a`
  font-size: 14px;
  color: #FFFFFF;

  &:hover {
    text-decoration: underline;
  }
`;

const SourceLine = styled.p`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
  margin-top: 32px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #222;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ShareButton = styled.a`
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #333;
  border-radius: 6px;
  color: #888;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: #444;
    color: #FAFAFA;
  }
`;

const BackLink = styled(Link)`
  font-size: 14px;
  color: #FFFFFF;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Sidebar = styled.aside`
  @media (max-width: 900px) {
    display: none;
  }
`;

const SidebarCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SidebarTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 16px;
`;

const RelatedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RelatedItem = styled(Link)`
  display: block;
  text-decoration: none;
  padding-bottom: 16px;
  border-bottom: 1px solid #222;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  &:hover h4 {
    color: #FFFFFF;
  }
`;

const RelatedDate = styled.span`
  font-size: 12px;
  color: #666;
`;

const RelatedTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #FAFAFA;
  line-height: 1.4;
  margin-top: 4px;
  transition: color 0.15s ease;
`;

const ContactInfo = styled.div`
  font-size: 14px;
  color: #888;

  a {
    color: #FFFFFF;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
