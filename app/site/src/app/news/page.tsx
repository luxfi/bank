"use client";

import { useState, useMemo } from "react";

import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";

import { TTags } from "@/models/ghost";

import FilterTag from "./components/FilterTags";
import CardPost from "./components/Card";
import {
  TitleAllPosts,
  CardPostStyled,
  ContainerPosts,
  MainContainer,
} from "./styles";

// Static fallback posts for static export
const STATIC_POSTS = [
  {
    id: "post-2026-01-lux-rebrand",
    title: "CDAX Becomes Lux Financial: A New Era of Bank Infrastructure",
    slug: "cdax-becomes-lux-financial",
    excerpt: "After five years of building trusted infrastructure for financial institutions, CDAX officially rebrands to Lux Financial with expanded stablecoin and AI capabilities.",
    feature_image: "/images/news.jpg",
    published_at: "2026-01-15T10:00:00.000Z",
    primary_tag: "company",
  },
  {
    id: "post-2025-09-us-expansion",
    title: "Lux Financial Expands US Operations with Trust Company Partnerships",
    slug: "us-trust-company-expansion",
    excerpt: "Strategic partnerships with US trust companies enable compliant stablecoin services for American fintechs and neobanks.",
    feature_image: "/images/global.jpg",
    published_at: "2025-09-20T10:00:00.000Z",
    primary_tag: "company",
  },
  {
    id: "post-2025-06-mcp-zap",
    title: "Introducing MCP Server and ZAP Protocol for AI-Powered Banking",
    slug: "mcp-server-zap-protocol",
    excerpt: "New AI infrastructure enables intelligent automation of bank operations, customer support, and compliance workflows.",
    feature_image: "/images/working.jpg",
    published_at: "2025-06-01T10:00:00.000Z",
    primary_tag: "product",
  },
  {
    id: "post-2025-03-iomfsa",
    title: "IOMFSA License Approval: Strengthening UK Regulatory Position",
    slug: "iomfsa-license-approval",
    excerpt: "IOMFSA license approval strengthens our UK regulatory position and enables expanded institutional services.",
    feature_image: "/images/tower_full.jpg",
    published_at: "2025-03-10T10:00:00.000Z",
    primary_tag: "compliance",
  },
  {
    id: "post-2024-11-stablecoins",
    title: "Native USDC and USDT Support Now Available",
    slug: "native-usdc-usdt-support",
    excerpt: "Multi-chain USDC/USDT support enables instant global payments with automatic local currency conversion.",
    feature_image: "/images/hand_currency.jpg",
    published_at: "2024-11-15T10:00:00.000Z",
    primary_tag: "product",
  },
  {
    id: "post-2024-06-mpc-custody",
    title: "Lux MPC: Self-Hosted Custody with Multi-Party Computation",
    slug: "lux-mpc-custody-launch",
    excerpt: "Enterprise multi-party computation enables secure self-hosted custody with threshold signing.",
    feature_image: "/images/security.jpg",
    published_at: "2024-06-20T10:00:00.000Z",
    primary_tag: "product",
  },
  {
    id: "post-2023-09-uk-launch",
    title: "CDAX Platform V1 Launches in UK and Isle of Man",
    slug: "cdax-v1-uk-iom-launch",
    excerpt: "General availability of CDAX Platform V1 for UK and IOM institutions with full regulatory compliance.",
    feature_image: "/images/laptop.png",
    published_at: "2023-09-01T10:00:00.000Z",
    primary_tag: "company",
  },
  {
    id: "post-2022-03-blockchain",
    title: "CDAX Selected as Blockchain Exchange Platform for Government Initiative",
    slug: "cdax-government-blockchain-selection",
    excerpt: "CDAX chosen to power blockchain transactions for major government digitization initiative.",
    feature_image: "/images/global_2.jpg",
    published_at: "2022-03-15T10:00:00.000Z",
    primary_tag: "company",
  },
  {
    id: "post-2021-06-funding",
    title: "CDAX Raises Series A to Accelerate White-Label Platform Development",
    slug: "cdax-series-a-funding",
    excerpt: "Series A funding will accelerate platform development and regulatory expansion.",
    feature_image: "/images/working_team.jpg",
    published_at: "2021-06-10T10:00:00.000Z",
    primary_tag: "company",
  },
];

export default function News() {
  const [activeTag, setActiveTag] = useState<TTags>("all");

  const filteredPosts = useMemo(() => {
    if (activeTag === "all") return STATIC_POSTS;
    return STATIC_POSTS.filter(post => post.primary_tag === activeTag);
  }, [activeTag]);

  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/background_news.jpg"
          showCard={false}
          imageTitle="News & Insights"
          responsiveHeight="250px"
        />
      </AnimatedDiv>

      <AnimatedDiv style={{ paddingInline: "18px" }}>
        <FilterTag onClick={setActiveTag} activeTag={activeTag} />

        <TitleAllPosts style={{ marginTop: "48px" }}>All Posts</TitleAllPosts>

        <MainContainer>
          <ContainerPosts>
            {filteredPosts.map((post, index) => (
              <CardPostStyled key={post.id} delay={index * 0.1}>
                <CardPost
                  id={post.id}
                  thumbnail={post.feature_image}
                  description={post.excerpt}
                  title={post.title}
                />
              </CardPostStyled>
            ))}
          </ContainerPosts>
        </MainContainer>
      </AnimatedDiv>
    </>
  );
}
