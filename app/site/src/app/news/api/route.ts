import { getPosts } from "@/api/ghost";

export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const response = await getPosts({
    limit: searchParams.get("limit") ?? "9",
    page: searchParams.get("page") ?? "1",
    tag: searchParams.get("tag") ?? undefined,
  });

  return Response.json({
    posts: response.posts,
    pagination: response.pagination,
  });
}
