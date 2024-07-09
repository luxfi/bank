"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Container,
  Title,
  Description,
  ContainerText,
  ReadMoreButton,
} from "./styles";

interface IProps {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
}

export default function CardPost({
  description,
  thumbnail,
  id,
  title,
}: IProps) {
  const router = useRouter();

  return (
    <Container onClick={() => router.push(`/news/${id}`)}>
      <Image
        src={thumbnail}
        height={242}
        width={500}
        alt="thumbnail blog post"
        sizes="max-width: 100%"
        style={{
          maxWidth: "100%",
          objectFit: "cover",
        }}
      />
      <ContainerText>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </ContainerText>

      {/* <ReadMoreButton onClick={() => router.push(`/news/${id}`)}>
        Read More
      </ReadMoreButton> */}
    </Container>
  );
}
