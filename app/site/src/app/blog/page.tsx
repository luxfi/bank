"use client";

import styled from "styled-components";
import Link from "next/link";

const blogPosts = [
  {
    slug: "future-of-stablecoin-infrastructure",
    title: "The Future of Stablecoin Infrastructure: What Banks Need to Know",
    excerpt: "As stablecoins mature from crypto curiosity to essential financial infrastructure, traditional banks face a pivotal decision: adapt or be disrupted.",
    category: "Industry Insights",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    featured: true,
  },
  {
    slug: "building-compliant-crypto-rails",
    title: "Building Compliant Crypto Rails: A Technical Deep Dive",
    excerpt: "How to implement cryptocurrency payment rails that satisfy both regulators and users, with real-world architecture patterns.",
    category: "Engineering",
    date: "Jan 10, 2025",
    readTime: "12 min read",
    featured: true,
  },
  {
    slug: "defi-meets-tradfi",
    title: "When DeFi Meets TradFi: Bridging the Infrastructure Gap",
    excerpt: "Exploring the technical and regulatory challenges of connecting decentralized finance with traditional banking systems.",
    category: "Industry Insights",
    date: "Jan 5, 2025",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "real-time-settlement-guide",
    title: "Real-Time Settlement: From T+2 to T+0",
    excerpt: "How blockchain-based settlement is eliminating the traditional two-day clearing window and what it means for treasury operations.",
    category: "Guides",
    date: "Dec 28, 2024",
    readTime: "10 min read",
  },
  {
    slug: "multi-chain-treasury-management",
    title: "Multi-Chain Treasury Management for Enterprises",
    excerpt: "Best practices for managing corporate treasury across multiple blockchain networks while maintaining security and compliance.",
    category: "Engineering",
    date: "Dec 20, 2024",
    readTime: "9 min read",
  },
  {
    slug: "kyc-aml-crypto-age",
    title: "KYC and AML in the Crypto Age: A Practical Framework",
    excerpt: "How to implement robust identity verification and transaction monitoring for crypto-native financial products.",
    category: "Compliance",
    date: "Dec 15, 2024",
    readTime: "11 min read",
  },
  {
    slug: "embedded-finance-crypto",
    title: "Embedded Finance Goes Crypto: The Next Wave",
    excerpt: "Why embedded crypto services are the logical evolution of embedded finance, and how to implement them safely.",
    category: "Industry Insights",
    date: "Dec 10, 2024",
    readTime: "7 min read",
  },
  {
    slug: "api-design-financial-services",
    title: "API Design Patterns for Financial Services",
    excerpt: "Lessons from building APIs that handle billions in transaction volume while maintaining developer experience.",
    category: "Engineering",
    date: "Dec 5, 2024",
    readTime: "14 min read",
  },
  {
    slug: "cross-border-payments-2025",
    title: "Cross-Border Payments in 2025: What's Changed",
    excerpt: "A comprehensive look at how stablecoins and new rails are transforming international money movement.",
    category: "Industry Insights",
    date: "Nov 28, 2024",
    readTime: "8 min read",
  },
];

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Industry Insights", count: blogPosts.filter(p => p.category === "Industry Insights").length },
  { name: "Engineering", count: blogPosts.filter(p => p.category === "Engineering").length },
  { name: "Compliance", count: blogPosts.filter(p => p.category === "Compliance").length },
  { name: "Guides", count: blogPosts.filter(p => p.category === "Guides").length },
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(p => p.featured);
  const recentPosts = blogPosts.filter(p => !p.featured);

  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroTitle>Blog</HeroTitle>
        <HeroSubtitle>
          Insights on building the future of financial infrastructure
        </HeroSubtitle>
      </HeroSection>

      {/* Categories */}
      <CategoriesRow>
        {categories.map((cat) => (
          <CategoryPill key={cat.name} $active={cat.name === "All"}>
            {cat.name} <CategoryCount>{cat.count}</CategoryCount>
          </CategoryPill>
        ))}
      </CategoriesRow>

      {/* Featured Posts */}
      <Section>
        <SectionTitle>Featured</SectionTitle>
        <FeaturedGrid>
          {featuredPosts.map((post) => (
            <FeaturedCard key={post.slug} href={`/blog/${post.slug}`}>
              <PostCategory>{post.category}</PostCategory>
              <PostTitle>{post.title}</PostTitle>
              <PostExcerpt>{post.excerpt}</PostExcerpt>
              <PostMeta>
                <span>{post.date}</span>
                <MetaDot />
                <span>{post.readTime}</span>
              </PostMeta>
            </FeaturedCard>
          ))}
        </FeaturedGrid>
      </Section>

      {/* Recent Posts */}
      <Section>
        <SectionTitle>Recent Posts</SectionTitle>
        <PostsList>
          {recentPosts.map((post) => (
            <PostRow key={post.slug} href={`/blog/${post.slug}`}>
              <PostRowContent>
                <PostRowCategory>{post.category}</PostRowCategory>
                <PostRowTitle>{post.title}</PostRowTitle>
                <PostRowExcerpt>{post.excerpt}</PostRowExcerpt>
              </PostRowContent>
              <PostRowMeta>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
                <ArrowIcon />
              </PostRowMeta>
            </PostRow>
          ))}
        </PostsList>
      </Section>

      {/* Newsletter CTA */}
      <NewsletterSection>
        <NewsletterContent>
          <NewsletterTitle>Stay Updated</NewsletterTitle>
          <NewsletterSubtitle>
            Get the latest insights on fintech infrastructure delivered to your inbox.
          </NewsletterSubtitle>
          <NewsletterForm>
            <NewsletterInput type="email" placeholder="Enter your email" />
            <NewsletterButton>Subscribe</NewsletterButton>
          </NewsletterForm>
          <NewsletterDisclaimer>
            No spam. Unsubscribe anytime.
          </NewsletterDisclaimer>
        </NewsletterContent>
      </NewsletterSection>
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
  padding: 6rem 0 3rem;
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

const CategoriesRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
`;

const CategoryPill = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: ${props => props.$active ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.55)'};
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.08)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const CategoryCount = styled.span`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.35);
`;

const Section = styled.section`
  padding: 3rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.75rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
  }
`;

const PostCategory = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #8B5CF6;
  margin-bottom: 0.75rem;
`;

const PostTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const PostExcerpt = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1.25rem;
  flex: 1;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.45);
`;

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 50%;
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
`;

const PostRow = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const PostRowContent = styled.div`
  flex: 1;
`;

const PostRowCategory = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #8B5CF6;
`;

const PostRowTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin: 0.25rem 0;
`;

const PostRowExcerpt = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.55);
`;

const PostRowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;

  svg {
    color: rgba(255, 255, 255, 0.35);
    transition: color 0.15s ease;
  }

  ${PostRow}:hover & svg {
    color: #8B5CF6;
  }
`;

const NewsletterSection = styled.section`
  padding: 5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const NewsletterContent = styled.div`
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
`;

const NewsletterTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

const NewsletterSubtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 2rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  outline: none;
  transition: all 0.15s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &:focus {
    border-color: rgba(139, 92, 246, 0.5);
  }
`;

const NewsletterButton = styled.button`
  padding: 0.875rem 1.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: white;
  background: #8B5CF6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const NewsletterDisclaimer = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.35);
`;
