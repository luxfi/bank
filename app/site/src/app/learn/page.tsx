"use client";

import styled from "styled-components";
import Link from "next/link";
import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";

const topics = [
  {
    category: "Stablecoins 101",
    articles: [
      {
        id: "what-are-stablecoins",
        title: "What Are Stablecoins?",
        description: "A comprehensive guide to understanding stablecoins, how they work, and why they matter for global payments.",
        readTime: "5 min",
        level: "Beginner",
      },
      {
        id: "usdc-vs-usdt",
        title: "USDC vs USDT: Key Differences",
        description: "Compare the two largest stablecoins by market cap, their backing mechanisms, regulatory compliance, and use cases.",
        readTime: "7 min",
        level: "Beginner",
      },
      {
        id: "stablecoin-risks",
        title: "Understanding Stablecoin Risks",
        description: "Learn about depegging events, counterparty risk, regulatory uncertainty, and how to evaluate stablecoin safety.",
        readTime: "8 min",
        level: "Intermediate",
      },
    ],
  },
  {
    category: "Cross-Border Payments",
    articles: [
      {
        id: "traditional-vs-crypto",
        title: "Traditional Rails vs Crypto Rails",
        description: "How stablecoin payments compare to SWIFT, ACH, and SEPA in terms of speed, cost, and accessibility.",
        readTime: "6 min",
        level: "Beginner",
      },
      {
        id: "payment-corridors",
        title: "Major Payment Corridors Explained",
        description: "Understanding key remittance and B2B payment routes: US-LATAM, Europe-Africa, and Asia-Pacific.",
        readTime: "10 min",
        level: "Intermediate",
      },
      {
        id: "fx-settlement",
        title: "FX Settlement with Stablecoins",
        description: "How real-time FX settlement works using stablecoins as a bridge currency between fiat pairs.",
        readTime: "8 min",
        level: "Advanced",
      },
    ],
  },
  {
    category: "Building on Lux",
    articles: [
      {
        id: "quickstart",
        title: "Getting Started with the API",
        description: "Create your first customer, wallet, and transfer in under 10 minutes with our REST API.",
        readTime: "10 min",
        level: "Beginner",
      },
      {
        id: "webhooks-guide",
        title: "Implementing Webhooks",
        description: "Set up real-time notifications for transfers, KYC status changes, and wallet activity.",
        readTime: "8 min",
        level: "Intermediate",
      },
      {
        id: "compliance-integration",
        title: "Compliance Integration Patterns",
        description: "Best practices for KYC/KYB flows, sanctions screening, and transaction monitoring.",
        readTime: "12 min",
        level: "Advanced",
      },
    ],
  },
  {
    category: "Custody & Security",
    articles: [
      {
        id: "custody-options",
        title: "Custodial vs MPC Wallets",
        description: "Understand the trade-offs between fully custodial and self-custody MPC wallet solutions.",
        readTime: "7 min",
        level: "Intermediate",
      },
      {
        id: "mpc-explained",
        title: "Multi-Party Computation Explained",
        description: "How threshold signing and key sharding work to secure digital assets without a single point of failure.",
        readTime: "10 min",
        level: "Advanced",
      },
      {
        id: "post-quantum",
        title: "Post-Quantum Security",
        description: "Preparing financial infrastructure for quantum computing threats with CRYSTALS and SPHINCS+ algorithms.",
        readTime: "12 min",
        level: "Advanced",
      },
    ],
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "#22C55E";
    case "Intermediate":
      return "#FFFFFF";
    case "Advanced":
      return "#EF4444";
    default:
      return "#666";
  }
};

export default function LearnPage() {
  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/tablet.jpg"
          showCard={false}
          imageTitle="Learn"
          responsiveHeight="250px"
        />
      </AnimatedDiv>

      <Container>
        <PageIntro>
          <IntroTitle>Master Stablecoin Infrastructure</IntroTitle>
          <IntroText>
            Guides, tutorials, and deep dives to help you understand stablecoins,
            cross-border payments, and how to build on Lux Financial.
          </IntroText>
        </PageIntro>

        {topics.map((topic) => (
          <Section key={topic.category}>
            <CategoryTitle>{topic.category}</CategoryTitle>
            <ArticlesGrid>
              {topic.articles.map((article) => (
                <ArticleCard key={article.id}>
                  <ArticleMeta>
                    <LevelBadge $color={getLevelColor(article.level)}>
                      {article.level}
                    </LevelBadge>
                    <ReadTime>{article.readTime} read</ReadTime>
                  </ArticleMeta>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleDescription>{article.description}</ArticleDescription>
                  <ReadLink href={`/learn/${article.id}`}>
                    Read article →
                  </ReadLink>
                </ArticleCard>
              ))}
            </ArticlesGrid>
          </Section>
        ))}

        {/* CTA */}
        <CTASection>
          <CTATitle>Ready to build?</CTATitle>
          <CTAText>
            Put your knowledge into practice with our developer documentation.
          </CTAText>
          <CTAButtons>
            <CTAButton href="https://docs.lux.financial" target="_blank" rel="noopener noreferrer">
              API Documentation
            </CTAButton>
            <CTAButtonSecondary href="https://cal.com/luxfi" target="_blank">
              Talk to Sales
            </CTAButtonSecondary>
          </CTAButtons>
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

const CategoryTitle = styled.h2`
  color: #FAFAFA;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #222;
`;

const ArticlesGrid = styled.div`
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

const ArticleCard = styled.article`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #333;
    transform: translateY(-2px);
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const LevelBadge = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}15`};
  padding: 4px 8px;
  border-radius: 4px;
`;

const ReadTime = styled.span`
  font-size: 12px;
  color: #666;
`;

const ArticleTitle = styled.h3`
  color: #FAFAFA;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 12px;
`;

const ArticleDescription = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 16px;
`;

const ReadLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
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

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
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

const CTAButtonSecondary = styled(Link)`
  display: inline-block;
  background: transparent;
  color: #FAFAFA;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  border: 1px solid #333;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #111;
    border-color: #444;
  }
`;
