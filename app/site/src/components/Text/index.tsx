"use client";

import styled from "styled-components";

const getFontProps: Record<
  string,
  { size: string; weight: string; lineHeight?: string }
> = {
  title: { size: "4.8rem", weight: "700", lineHeight: "5.6rem" },
  subtitle: { size: "3.6rem", weight: "600", lineHeight: "4.8rem" },
  subtitle_sm: { size: "3.2 rem", weight: "600", lineHeight: "4.8rem" },
  body: { size: "2rem", weight: "400", lineHeight: "3.2rem" },
  body_lg: { size: "2.4rem", weight: "600", lineHeight: "3.6rem" },
  body_sm: { size: "1.2rem", weight: "400", lineHeight: "2rem" },
};

const variants = ["title", "subtitle", "body", "body_sm", "body_lg"];

interface ITextStyled {
  $variant: (typeof variants)[number];
  $color?: string;
  $weight?: string;
}

export const CustomText = styled.p<ITextStyled>`
  color: ${(props) => props.$color || props.theme.colors.primary};
  font-size: ${(props) => getFontProps[props.$variant].size};
  font-weight: ${(props) =>
    props.$weight || getFontProps[props.$variant].weight};
  line-height: ${(props) => getFontProps[props.$variant].lineHeight};
`;

interface IText extends React.HTMLProps<HTMLParagraphElement> {
  variant: (typeof variants)[number];
  color?: string;
  weight?: string;
}

export default function Text({ children, variant, ...props }: IText) {
  return (
    <CustomText
      rel="preload"
      $variant={variant}
      $color={props.color}
      $weight={props.weight}
      {...props}
    >
      {children}
    </CustomText>
  );
}
