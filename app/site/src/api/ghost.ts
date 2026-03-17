import { IPage, IPagination, IPost, IPosts } from "@/models/ghost";

import { buildPath } from "./fetcher/types";

// Use NEXT_PUBLIC_ env vars for client-side access
const GHOST_API_URL = process.env.NEXT_PUBLIC_GHOST_API_URL || "";
const GHOST_API_KEY = process.env.NEXT_PUBLIC_GHOST_API_KEY || "";

const basePath = `${GHOST_API_URL}/ghost/api/content/posts/`;

// Static fallback posts when Ghost CMS is not configured
// Using Partial<IPosts> to allow optional fields in fallback data
const FALLBACK_POSTS: Array<Partial<IPosts> & Pick<IPosts, 'id' | 'uuid' | 'title' | 'slug' | 'html' | 'excerpt' | 'feature_image' | 'reading_time'>> = [
  {
    id: "post-2026-01-lux-partnership",
    uuid: "lux-partnership-2026",
    title: "Lux Financial and CDAX: Technology Partnership Powers New Banking Infrastructure",
    slug: "lux-financial-cdax-partnership",
    html: "<p>Lux Financial announces expanded capabilities built through its long-standing technology partnership with CDAX. Since 2020, Lux Financial has served as the technology services partner to CDAX, developing open banking infrastructure for digital asset services. This partnership now delivers native USDC/USDT support, AI-powered operations via MCP, and post-quantum security to regulated financial institutions.</p>",
    excerpt: "Lux Financial expands capabilities through its technology partnership with CDAX, delivering stablecoin infrastructure and AI-powered operations to regulated institutions.",
    feature_image: "/images/news.jpg",
    published_at: new Date("2026-01-15T10:00:00.000Z"),
    reading_time: 4,
    primary_tag: "company",
    tags: ["company"],
  },
  {
    id: "post-2025-09-us-expansion",
    uuid: "us-expansion-2025",
    title: "Lux Financial Expands US Operations with Trust Company Partnerships",
    slug: "us-trust-company-expansion",
    html: "<p>We're excited to announce our expansion into the US market through strategic partnerships with licensed trust companies. This enables us to offer compliant stablecoin services to US-based fintechs and neobanks while maintaining our commitment to regulatory excellence.</p>",
    excerpt: "Strategic partnerships with US trust companies enable compliant stablecoin services for American fintechs and neobanks.",
    feature_image: "/images/global.jpg",
    published_at: new Date("2025-09-20T10:00:00.000Z"),
    reading_time: 5,
    primary_tag: "company",
    tags: ["company"],
  },
  {
    id: "post-2025-06-mcp-zap",
    uuid: "mcp-zap-2025",
    title: "Introducing MCP Server and ZAP Protocol for AI-Powered Banking",
    slug: "mcp-server-zap-protocol",
    html: "<p>Today we launch our Model Context Protocol (MCP) server and ZAP browser communication protocol. These technologies enable AI assistants to securely manage bank operations, power customer support, and automate compliance workflows.</p>",
    excerpt: "New AI infrastructure enables intelligent automation of bank operations, customer support, and compliance workflows.",
    feature_image: "/images/working.jpg",
    published_at: new Date("2025-06-01T10:00:00.000Z"),
    reading_time: 6,
    primary_tag: "product",
    tags: ["product"],
  },
  {
    id: "post-2025-03-iomfsa",
    uuid: "iomfsa-2025",
    title: "IOMFSA License Approval: Strengthening UK Regulatory Position",
    slug: "iomfsa-license-approval",
    html: "<p>We're pleased to announce our Isle of Man Financial Services Authority (IOMFSA) license has been approved. This enhances our regulatory standing in the UK market and enables expanded services for institutional clients across Europe.</p>",
    excerpt: "IOMFSA license approval strengthens our UK regulatory position and enables expanded institutional services.",
    feature_image: "/images/tower_full.jpg",
    published_at: new Date("2025-03-10T10:00:00.000Z"),
    reading_time: 4,
    primary_tag: "compliance",
    tags: ["compliance"],
  },
  {
    id: "post-2024-11-stablecoins",
    uuid: "stablecoins-2024",
    title: "Native USDC and USDT Support Now Available",
    slug: "native-usdc-usdt-support",
    html: "<p>We've integrated native support for USDC and USDT stablecoins across Polygon, Ethereum, and Arbitrum networks. Clients can now send and receive stablecoins globally with instant settlement and automatic conversion to local currencies.</p>",
    excerpt: "Multi-chain USDC/USDT support enables instant global payments with automatic local currency conversion.",
    feature_image: "/images/hand_currency.jpg",
    published_at: new Date("2024-11-15T10:00:00.000Z"),
    reading_time: 5,
    primary_tag: "product",
    tags: ["product"],
  },
  {
    id: "post-2024-06-mpc-custody",
    uuid: "mpc-custody-2024",
    title: "Lux MPC: Self-Hosted Custody with Multi-Party Computation",
    slug: "lux-mpc-custody-launch",
    html: "<p>Introducing Lux MPC, our enterprise-grade multi-party computation custody solution. Financial institutions can now self-host their digital asset custody with threshold signing, eliminating single points of failure while maintaining full control over their assets.</p>",
    excerpt: "Enterprise multi-party computation enables secure self-hosted custody with threshold signing.",
    feature_image: "/images/security.jpg",
    published_at: new Date("2024-06-20T10:00:00.000Z"),
    reading_time: 6,
    primary_tag: "product",
    tags: ["product"],
  },
  {
    id: "post-2023-09-uk-launch",
    uuid: "uk-launch-2023",
    title: "CDAX Platform V1 Launches in UK and Isle of Man",
    slug: "cdax-v1-uk-iom-launch",
    html: "<p>After three years of development, we're proud to announce the general availability of CDAX Platform V1 for UK and Isle of Man based institutions. Our white-label solution enables banks and fintechs to offer fiat-to-digital asset conversion with full regulatory compliance.</p>",
    excerpt: "General availability of CDAX Platform V1 for UK and IOM institutions with full regulatory compliance.",
    feature_image: "/images/laptop.png",
    published_at: new Date("2023-09-01T10:00:00.000Z"),
    reading_time: 5,
    primary_tag: "company",
    tags: ["company"],
  },
  {
    id: "post-2022-03-blockchain",
    uuid: "blockchain-2022",
    title: "CDAX Selected as Blockchain Exchange Platform for Government Initiative",
    slug: "cdax-government-blockchain-selection",
    html: "<p>CDAX has been selected as the blockchain exchange platform for a major government digitization initiative. Our infrastructure will power secure, transparent transactions for public sector operations, demonstrating the viability of blockchain technology at scale.</p>",
    excerpt: "CDAX chosen to power blockchain transactions for major government digitization initiative.",
    feature_image: "/images/global_2.jpg",
    published_at: new Date("2022-03-15T10:00:00.000Z"),
    reading_time: 4,
    primary_tag: "company",
    tags: ["company"],
  },
  {
    id: "post-2021-06-funding",
    uuid: "funding-2021",
    title: "CDAX Raises Series A to Accelerate White-Label Platform Development",
    slug: "cdax-series-a-funding",
    html: "<p>We're excited to announce the completion of our Series A funding round. This investment will accelerate development of our white-label platform, expand our regulatory footprint, and grow our team of financial technology experts.</p>",
    excerpt: "Series A funding will accelerate platform development and regulatory expansion.",
    feature_image: "/images/working_team.jpg",
    published_at: new Date("2021-06-10T10:00:00.000Z"),
    reading_time: 3,
    primary_tag: "company",
    tags: ["company"],
  },
  {
    id: "post-2020-04-founding",
    uuid: "founding-2020",
    title: "CDAX Founded to Power Government PPE Procurement During COVID-19",
    slug: "cdax-founded-ppe-procurement",
    html: "<p>CDAX is founded to provide secure, transparent payment infrastructure for government procurement of personal protective equipment (PPE) during the COVID-19 pandemic. Our blockchain-based platform enables rapid, compliant cross-border payments when speed and trust are critical.</p>",
    excerpt: "CDAX founded to provide secure payment infrastructure for government PPE procurement during COVID-19 pandemic.",
    feature_image: "/images/about.jpg",
    published_at: new Date("2020-04-01T10:00:00.000Z"),
    reading_time: 4,
    primary_tag: "company",
    tags: ["company"],
  },
];

interface IParams {
  limit: string;
  page: string;
  tag?: string;
}

export async function getPosts({ limit, page, tag }: IParams): Promise<{
  posts: Array<IPosts>;
  pagination: IPagination;
}> {
  // If Ghost API is configured, use it
  if (GHOST_API_URL && GHOST_API_KEY) {
    const params = new Map();
    params.set("key", GHOST_API_KEY);
    params.set("page", page);
    params.set("limit", limit);
    if (tag) {
      params.set("filter", `tag:${tag}`);
    }

    const path = buildPath({
      endpoint: basePath,
      params: Object.fromEntries(params.entries()),
    });

    try {
      const response = await fetch(path);

      if (response.ok) {
        const data = await response.json();

        return {
          posts: data.posts,
          pagination: data.meta.pagination,
        };
      }
    } catch (error) {
      console.error("Error fetching posts from Ghost:", error);
    }
  }

  // Use fallback posts
  let filteredPosts = [...FALLBACK_POSTS];

  if (tag && tag !== "all") {
    filteredPosts = FALLBACK_POSTS.filter(post =>
      post.tags?.includes(tag) || post.primary_tag === tag
    );
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 9;
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginatedPosts = filteredPosts.slice(start, end);

  return {
    posts: paginatedPosts as unknown as Array<IPosts>,
    pagination: {
      limit: limitNum,
      page: pageNum,
      pages: Math.ceil(filteredPosts.length / limitNum),
      total: filteredPosts.length,
    },
  };
}

export async function getPostsDetails(postId: string): Promise<IPost | null> {
  // If Ghost API is configured, use it
  if (GHOST_API_URL && GHOST_API_KEY) {
    try {
      const response = await fetch(
        `${basePath}${postId}/?key=${GHOST_API_KEY}`,
      );

      if (response.ok) {
        const data = await response.json();
        return data.posts?.[0] || null;
      }
    } catch (error) {
      console.error("Error fetching post details from Ghost:", error);
    }
  }

  // Find in fallback posts
  const post = FALLBACK_POSTS.find(p => p.id === postId || p.slug === postId);
  if (post) {
    return {
      ...post,
      authors: [{ name: "Lux Financial", profile_image: null }],
    } as unknown as IPost;
  }

  return null;
}

export async function getPages(slug: string): Promise<IPage | null> {
  // Return null if Ghost API not configured
  if (!GHOST_API_URL || !GHOST_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${GHOST_API_URL}/ghost/api/content/pages/slug/${slug}/?key=${GHOST_API_KEY}`,
    );

    if (response.ok) {
      const data = await response.json();

      return data.pages[0] || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return null;
  }
}
