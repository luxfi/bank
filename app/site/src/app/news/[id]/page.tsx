import { redirect } from "next/navigation";

import { getPostsDetails, getPosts } from "@/api/ghost";

import { Content, ContentDetail, MainContainer, Title } from "./styles";

interface IProps {
  params: {
    id: string;
  };
}

// For static export, disable dynamic params and return empty list
// News details won't be pre-rendered without Ghost API env vars
export const dynamicParams = false;

export async function generateStaticParams() {
  // Skip API calls during static export if env vars not available
  if (!process.env.GHOST_API_URL || !process.env.GHOST_API_KEY) {
    return [];
  }

  try {
    const { posts } = await getPosts({ limit: "100", page: "1" });
    return posts.map((post) => ({ id: post.id }));
  } catch {
    return [];
  }
}

export default async function NewsDetails({ params }: IProps) {
  const post = await getPostsDetails(params.id);

  if (!post) {
    redirect("/news");
  }

  return (
    <MainContainer>
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 1020,
          width: "100%",
        }}
      >
        <Title>{post.title}</Title>
        <ContentDetail dangerouslySetInnerHTML={{ __html: post.html }} />
      </Content>
    </MainContainer>
  );
}
