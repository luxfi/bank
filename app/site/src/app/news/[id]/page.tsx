import { redirect } from "next/navigation";

import { getPostsDetails } from "@/api/ghost";

import { Content, ContentDetail, MainContainer, Title } from "./styles";

interface IProps {
  params: {
    id: string;
  };
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
