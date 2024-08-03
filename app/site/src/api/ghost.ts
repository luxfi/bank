"use server";

import { IPage, IPagination, IPost, IPosts } from "@/models/ghost";

import { buildPath } from "./fetcher/types";

const basePath = `${process.env.GHOST_API_URL}/ghost/api/content/posts/`;

interface IParams {
  limit: string;
  page: string;
  tag?: string;
}

export async function getPosts({ limit, page, tag }: IParams): Promise<{
  posts: Array<IPosts>;
  pagination: IPagination;
}> {
  const params = new Map();
  params.set("key", process.env.GHOST_API_KEY);
  params.set("page", page);
  params.set("limit", limit);
  if (tag) {
    params.set("filter", `tag:${tag}`);
  }

  const path = buildPath({
    endpoint: basePath,
    params: Object.fromEntries(params.entries()),
  });

  const response = await fetch(path);

  if (response.ok) {
    const data = await response.json();

    return {
      posts: data.posts,
      pagination: data.meta.pagination,
    };
  }

  return {
    posts: [],
    pagination: { limit: 0, page: 0, pages: 0, total: 0 },
  };
}

export async function getPostsDetails(postId: string): Promise<IPost | null> {
  try {
    const response = await fetch(
      `${basePath}${postId}/?key=${process.env.GHOST_API_KEY}`,
    );

    if (response.ok) {
      const data = await response.json();

      return data.posts?.[0] || null;
    }

    return null;
  } catch (error) {
    throw new Error("Error get posts");
  }
}

export async function getPages(slug: string): Promise<IPage | null> {
  try {
    const response = await fetch(
      `${process.env.GHOST_API_URL}/ghost/api/content/pages/slug/${slug}/?key=${process.env.GHOST_API_KEY}`,
    );

    if (response.ok) {
      const data = await response.json();

      return data.pages[0] || null;
    }

    return null;
  } catch (error) {
    throw new Error("Error getting pages");
  }
}
