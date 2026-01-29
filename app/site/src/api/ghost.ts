import { IPage, IPagination, IPost, IPosts } from "@/models/ghost";

import { buildPath } from "./fetcher/types";

// Use NEXT_PUBLIC_ env vars for client-side access
const GHOST_API_URL = process.env.NEXT_PUBLIC_GHOST_API_URL || "";
const GHOST_API_KEY = process.env.NEXT_PUBLIC_GHOST_API_KEY || "";

const basePath = `${GHOST_API_URL}/ghost/api/content/posts/`;

interface IParams {
  limit: string;
  page: string;
  tag?: string;
}

export async function getPosts({ limit, page, tag }: IParams): Promise<{
  posts: Array<IPosts>;
  pagination: IPagination;
}> {
  // Return empty if Ghost API not configured
  if (!GHOST_API_URL || !GHOST_API_KEY) {
    return {
      posts: [],
      pagination: { limit: 0, page: 0, pages: 0, total: 0 },
    };
  }

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
    console.error("Error fetching posts:", error);
  }

  return {
    posts: [],
    pagination: { limit: 0, page: 0, pages: 0, total: 0 },
  };
}

export async function getPostsDetails(postId: string): Promise<IPost | null> {
  // Return null if Ghost API not configured
  if (!GHOST_API_URL || !GHOST_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${basePath}${postId}/?key=${GHOST_API_KEY}`,
    );

    if (response.ok) {
      const data = await response.json();

      return data.posts?.[0] || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
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
