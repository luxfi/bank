import { redirect } from "next/navigation";

import { getPostsDetails, getPosts } from "@/api/ghost";

import { Content, ContentDetail, MainContainer, Title } from "./styles";

interface IProps {
  params: {
    id: string;
  };
}

// Generate static params for build time
// For GitHub Pages, returns empty array (news will redirect to /news)
export async function generateStaticParams() {
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
