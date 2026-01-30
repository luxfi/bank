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
  id: "post-2026-01-platform-launch",
  title: "Lux Financial Platform Now Available: Instant Cross-Chain Settlement for Banks and PSPs",
  slug: "lux-financial-platform-launch",
  excerpt: "After 5 years developing open banking infrastructure in partnership with CDAX, Lux Financial announces general availability of its stablecoin payment platform. Instant cross-chain settlement with no bridges required.",
  feature_image: "/images/news.jpg",
  published_at: "2026-01-28T10:00:00.000Z",
  category: "company",
  reading_time: "4 min read",
};

// Company History:
// - Oct 2020: Zach Kelling joins CDAX as CTO
// - 2020-2023: Lux Financial develops open banking infrastructure in partnership with CDAX
// - Lux Partners Limited: Isle of Man entity
// - Lux Industries Inc: USA entity (current)
const POSTS = [
  {
    id: "post-2025-12-kms-hsm",
    title: "Lux KMS: HSM Provider Support Now Available",
    slug: "kms-hsm-support",
    excerpt: "Enterprise Hardware Security Module integration added to our open-source secret management platform for bank-grade key security.",
    feature_image: "/images/working.jpg",
    published_at: "2025-12-31T10:00:00.000Z",
    category: "product",
    reading_time: "4 min read",
  },
  {
    id: "post-2025-09-lux-industries-usa",
    title: "Lux Industries Inc Launches to Serve US Market",
    slug: "lux-industries-usa-launch",
    excerpt: "Lux Industries Inc established to bring stablecoin payment infrastructure to US banks and fintechs, operating under US regulatory framework.",
    feature_image: "/images/tower_full.jpg",
    published_at: "2025-09-01T10:00:00.000Z",
    category: "company",
    reading_time: "4 min read",
  },
  {
    id: "post-2025-08-fiat-rails",
    title: "Global Fiat Rails: PIX, SPEI, and UPI Now Live",
    slug: "global-fiat-rails-expansion",
    excerpt: "Expanded payment rail coverage to 40+ countries with direct integrations for Brazil (PIX), Mexico (SPEI), and India (UPI).",
    feature_image: "/images/global.jpg",
    published_at: "2025-08-15T10:00:00.000Z",
    category: "product",
    reading_time: "4 min read",
  },
  {
    id: "post-2025-03-mpc-custody",
    title: "Lux MPC: Self-Custody Infrastructure for Institutions",
    slug: "mpc-custody-launch",
    excerpt: "Multi-party computation custody launches with 2-of-3 threshold signing. Your keys, your control, with enterprise HSM integration.",
    feature_image: "/images/security.jpg",
    published_at: "2025-03-20T10:00:00.000Z",
    category: "product",
    reading_time: "5 min read",
  },
  {
    id: "post-2024-09-stablecoin-support",
    title: "Native USDC and USDT Support Across 15 Chains",
    slug: "native-stablecoin-support",
    excerpt: "Multi-chain stablecoin support enables instant global payments with automatic local currency conversion in 40+ countries.",
    feature_image: "/images/hand_currency.jpg",
    published_at: "2024-09-10T10:00:00.000Z",
    category: "product",
    reading_time: "4 min read",
  },
  {
    id: "post-2024-01-lux-partners-iom",
    title: "Lux Partners Limited Established in Isle of Man",
    slug: "lux-partners-iom",
    excerpt: "Lux Partners Limited launches in Isle of Man to provide regulated fintech infrastructure services to banks and PSPs across Europe and UK.",
    feature_image: "/images/global_2.jpg",
    published_at: "2024-01-15T10:00:00.000Z",
    category: "company",
    reading_time: "4 min read",
  },
  {
    id: "post-2022-11-kms-launch",
    title: "Lux KMS: Enterprise Secret Management Goes Open Source",
    slug: "kms-open-source-launch",
    excerpt: "Enterprise secret management platform developed in collaboration with CDAX goes open source with native cloud integrations.",
    feature_image: "/images/working.jpg",
    published_at: "2022-11-17T10:00:00.000Z",
    category: "product",
    reading_time: "4 min read",
  },
  {
    id: "post-2021-03-open-banking",
    title: "Lux Financial and CDAX Launch Open Banking Infrastructure",
    slug: "open-banking-infrastructure",
    excerpt: "Joint development initiative delivers open banking APIs and payment infrastructure for digital asset services in UK and Isle of Man.",
    feature_image: "/images/laptop.png",
    published_at: "2021-03-01T10:00:00.000Z",
    category: "product",
    reading_time: "5 min read",
  },
  {
    id: "post-2020-10-cto-joins",
    title: "Zach Kelling Joins CDAX as CTO to Lead Technology Development",
    slug: "zach-kelling-joins-cdax",
    excerpt: "Zach Kelling joins CDAX as Chief Technology Officer, bringing expertise in distributed systems and blockchain infrastructure to accelerate platform development.",
    feature_image: "/images/working_team.jpg",
    published_at: "2020-10-15T10:00:00.000Z",
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
  background: radial-gradient(ellipse 800px 400px at 50% 100%, rgba(255, 255, 255, 0.04), transparent);
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
  background: #FFFFFF;
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
  color: #FFFFFF;
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
  color: #FFFFFF;
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
  border: 1px solid ${({ $active }) => ($active ? "#FFFFFF" : "#333")};
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.05)" : "transparent")};
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#888")};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $active }) => ($active ? "#FFFFFF" : "#444")};
    color: ${({ $active }) => ($active ? "#FFFFFF" : "#FAFAFA")};
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
  background: #FFFFFF;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;
