"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";

import AnimatedDiv from "@/components/AnimatedDiv";

// News categories
type TCategory = "all" | "company" | "product" | "compliance" | "industry";

const categories: { id: TCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "company", label: "Company" },
  { id: "product", label: "Product" },
  { id: "compliance", label: "Compliance" },
  { id: "industry", label: "Industry" },
];

// Featured post
const featuredPost = {
  id: "post-2026-01-lux-rebrand",
  title: "CDAX Becomes Lux Financial: A New Era of Bank Infrastructure",
  slug: "cdax-becomes-lux-financial",
  excerpt: "After five years of building trusted infrastructure for financial institutions, CDAX officially rebrands to Lux Financial with expanded stablecoin and AI capabilities. Our unified platform now supports fiat, crypto, stablecoins, and digital securities across 200+ countries.",
  feature_image: "/images/news.jpg",
  published_at: "2026-01-15T10:00:00.000Z",
  category: "company",
  reading_time: "5 min read",
};

// All posts
const POSTS = [
  {
    id: "post-2025-09-us-expansion",
    title: "Lux Financial Expands US Operations with Trust Company Partnerships",
    slug: "us-trust-company-expansion",
    excerpt: "Strategic partnerships with US trust companies enable compliant stablecoin services for American fintechs and neobanks.",
    feature_image: "/images/global.jpg",
    published_at: "2025-09-20T10:00:00.000Z",
    category: "company",
    reading_time: "4 min read",
  },
  {
    id: "post-2025-06-mcp-zap",
    title: "Introducing MCP Server and ZAP Protocol for AI-Powered Banking",
    slug: "mcp-server-zap-protocol",
    excerpt: "New AI infrastructure enables intelligent automation of bank operations, customer support, and compliance workflows.",
    feature_image: "/images/working.jpg",
    published_at: "2025-06-01T10:00:00.000Z",
    category: "product",
    reading_time: "6 min read",
  },
  {
    id: "post-2025-03-iomfsa",
    title: "IOMFSA License Approval: Strengthening UK Regulatory Position",
    slug: "iomfsa-license-approval",
    excerpt: "IOMFSA license approval strengthens our UK regulatory position and enables expanded institutional services.",
    feature_image: "/images/tower_full.jpg",
    published_at: "2025-03-10T10:00:00.000Z",
    category: "compliance",
    reading_time: "3 min read",
  },
  {
    id: "post-2024-11-stablecoins",
    title: "Native USDC and USDT Support Now Available",
    slug: "native-usdc-usdt-support",
    excerpt: "Multi-chain USDC/USDT support enables instant global payments with automatic local currency conversion.",
    feature_image: "/images/hand_currency.jpg",
    published_at: "2024-11-15T10:00:00.000Z",
    category: "product",
    reading_time: "4 min read",
  },
  {
    id: "post-2024-06-mpc-custody",
    title: "Lux MPC: Self-Hosted Custody with Multi-Party Computation",
    slug: "lux-mpc-custody-launch",
    excerpt: "Enterprise multi-party computation enables secure self-hosted custody with threshold signing.",
    feature_image: "/images/security.jpg",
    published_at: "2024-06-20T10:00:00.000Z",
    category: "product",
    reading_time: "5 min read",
  },
  {
    id: "post-2023-09-uk-launch",
    title: "CDAX Platform V1 Launches in UK and Isle of Man",
    slug: "cdax-v1-uk-iom-launch",
    excerpt: "General availability of CDAX Platform V1 for UK and IOM institutions with full regulatory compliance.",
    feature_image: "/images/laptop.png",
    published_at: "2023-09-01T10:00:00.000Z",
    category: "company",
    reading_time: "4 min read",
  },
  {
    id: "post-2022-03-blockchain",
    title: "CDAX Selected as Blockchain Exchange Platform for Government Initiative",
    slug: "cdax-government-blockchain-selection",
    excerpt: "CDAX chosen to power blockchain transactions for major government digitization initiative.",
    feature_image: "/images/global_2.jpg",
    published_at: "2022-03-15T10:00:00.000Z",
    category: "company",
    reading_time: "3 min read",
  },
  {
    id: "post-2021-06-funding",
    title: "CDAX Raises Series A to Accelerate White-Label Platform Development",
    slug: "cdax-series-a-funding",
    excerpt: "Series A funding will accelerate platform development and regulatory expansion.",
    feature_image: "/images/working_team.jpg",
    published_at: "2021-06-10T10:00:00.000Z",
    category: "company",
    reading_time: "3 min read",
  },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<TCategory>("all");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return POSTS;
    return POSTS.filter(post => post.category === activeCategory);
  }, [activeCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          <AnimatedDiv>
            <HeroBadge>News & Updates</HeroBadge>
            <HeroTitle>Stay Informed</HeroTitle>
            <HeroSubtitle>
              The latest news, product updates, and insights from Lux Financial.
            </HeroSubtitle>
          </AnimatedDiv>
        </HeroContent>
      </HeroSection>

      <Container>
        {/* Featured Post */}
        <FeaturedSection>
          <AnimatedDiv>
            <FeaturedCard href={`/news/${featuredPost.slug}`}>
              <FeaturedImage style={{ backgroundImage: `url(${featuredPost.feature_image})` }}>
                <FeaturedBadge>Featured</FeaturedBadge>
              </FeaturedImage>
              <FeaturedContent>
                <FeaturedMeta>
                  <CategoryTag>{featuredPost.category}</CategoryTag>
                  <span>•</span>
                  <span>{formatDate(featuredPost.published_at)}</span>
                  <span>•</span>
                  <span>{featuredPost.reading_time}</span>
                </FeaturedMeta>
                <FeaturedTitle>{featuredPost.title}</FeaturedTitle>
                <FeaturedExcerpt>{featuredPost.excerpt}</FeaturedExcerpt>
                <ReadMore>Read more →</ReadMore>
              </FeaturedContent>
            </FeaturedCard>
          </AnimatedDiv>
        </FeaturedSection>

        {/* Category Filter */}
        <FilterSection>
          <FilterTabs>
            {categories.map((cat) => (
              <FilterTab
                key={cat.id}
                $active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </FilterTab>
            ))}
          </FilterTabs>
        </FilterSection>

        {/* Posts Grid */}
        <PostsSection>
          <AnimatedDiv>
            <PostsGrid>
              {filteredPosts.map((post, index) => (
                <PostCard key={post.id} href={`/news/${post.slug}`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <PostImage style={{ backgroundImage: `url(${post.feature_image})` }} />
                  <PostContent>
                    <PostMeta>
                      <CategoryTag>{post.category}</CategoryTag>
                      <span>•</span>
                      <span>{formatDate(post.published_at)}</span>
                    </PostMeta>
                    <PostTitle>{post.title}</PostTitle>
                    <PostExcerpt>{post.excerpt}</PostExcerpt>
                    <PostFooter>
                      <ReadTime>{post.reading_time}</ReadTime>
                    </PostFooter>
                  </PostContent>
                </PostCard>
              ))}
            </PostsGrid>
          </AnimatedDiv>
        </PostsSection>

        {/* Newsletter CTA */}
        <NewsletterSection>
          <NewsletterContent>
            <NewsletterTitle>Subscribe to our newsletter</NewsletterTitle>
            <NewsletterText>
              Get the latest updates on stablecoin infrastructure and fintech innovation.
            </NewsletterText>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Enter your email" />
              <NewsletterButton>Subscribe</NewsletterButton>
            </NewsletterForm>
          </NewsletterContent>
        </NewsletterSection>
      </Container>
    </>
  );
}

const HeroSection = styled.section`
  position: relative;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 24px 60px;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 800px 400px at 50% 100%, rgba(212, 175, 55, 0.08), transparent);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 720px;
`;

const HeroBadge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #D4AF37;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  padding: 8px 16px;
  border-radius: 24px;
  margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #FAFAFA;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #888;
  line-height: 1.6;
`;

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px 96px;
`;

const FeaturedSection = styled.section`
  margin-bottom: 64px;
`;

const FeaturedCard = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #333;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const FeaturedImage = styled.div`
  position: relative;
  min-height: 320px;
  background-size: cover;
  background-position: center;

  @media (max-width: 768px) {
    min-height: 200px;
  }
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background: #D4AF37;
  color: #000;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border-radius: 4px;
`;

const FeaturedContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
`;

const CategoryTag = styled.span`
  text-transform: capitalize;
  color: #D4AF37;
`;

const FeaturedTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #FAFAFA;
  line-height: 1.3;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const FeaturedExcerpt = styled.p`
  font-size: 16px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const ReadMore = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #D4AF37;
`;

const FilterSection = styled.section`
  margin-bottom: 32px;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ $active: boolean }>`
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 24px;
  border: 1px solid ${({ $active }) => ($active ? "#D4AF37" : "#333")};
  background: ${({ $active }) => ($active ? "rgba(212, 175, 55, 0.1)" : "transparent")};
  color: ${({ $active }) => ($active ? "#D4AF37" : "#888")};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $active }) => ($active ? "#D4AF37" : "#444")};
    color: ${({ $active }) => ($active ? "#D4AF37" : "#FAFAFA")};
  }
`;

const PostsSection = styled.section`
  margin-bottom: 64px;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled(Link)`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.2s ease;
  animation: fadeIn 0.5s ease-out backwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    border-color: #333;
    transform: translateY(-4px);
  }
`;

const PostImage = styled.div`
  height: 180px;
  background-size: cover;
  background-position: center;
`;

const PostContent = styled.div`
  padding: 20px;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
`;

const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #FAFAFA;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const PostExcerpt = styled.p`
  font-size: 14px;
  color: #888;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostFooter = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #222;
`;

const ReadTime = styled.span`
  font-size: 12px;
  color: #666;
`;

const NewsletterSection = styled.section`
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  border: 1px solid #222;
  border-radius: 16px;
  padding: 64px 24px;
  text-align: center;
`;

const NewsletterContent = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const NewsletterTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #FAFAFA;
  margin-bottom: 12px;
`;

const NewsletterText = styled.p`
  font-size: 16px;
  color: #888;
  margin-bottom: 24px;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #FAFAFA;
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: #666;
  }

  &:focus {
    border-color: #444;
  }
`;

const NewsletterButton = styled.button`
  background: #D4AF37;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #e5c04b;
  }
`;
