"use client";
import Image from "next/image";

import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

const IconTextContainer = styled.div<{
  $width?: number;
  $responsive?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ $width }) => ($width ? `${$width}px` : "fit-content")};
  gap: ${({ theme }) => theme.size["24px"]};

  @media ${DeviceSize.md} {
    flex-direction: ${({ $responsive }) => ($responsive ? "column" : "row")};
    align-items: center;
    padding: 1rem;

    p {
      text-align: center;
    }
  }
`;

const Title = styled.p`
  font-size: 3.2rem;
  color: #1e3456;
  font-weight: 700;
`;

const Text = styled.p`
  font-size: 2.4rem;
  color: #1e3456;
`;

interface IIconText {
  icon?: string;
  iconSize?: number;
  title: string;
  text?: string;
  width?: number;
  responsive?: boolean;
}

export function IconText({
  icon = "/images/bolt.svg",
  iconSize = 43,
  title,
  text,
  width,
  responsive = false,
}: IIconText) {
  return (
    <IconTextContainer $width={width} $responsive={responsive}>
      <Image
        src={icon}
        alt={title}
        width={iconSize}
        height={iconSize}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Title>{title}</Title>
        {text && <Text>{text}</Text>}
      </div>
    </IconTextContainer>
  );
}
