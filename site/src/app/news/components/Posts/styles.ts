"use client";

import styled, { css } from "styled-components";

const fadeInAnimation = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

interface ICardPostStyle {
  delay: number;
}

export const CardPostStyled = styled.div<ICardPostStyle>`
  ${fadeInAnimation}
  animation: fadeIn 0.5s ease-out;
  animation-delay: ${({ delay }) => delay}s;
`;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContainerPosts = styled.div`
  display: grid;
  padding: 32px 48px;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0;
  }

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
`;

export const ContainerPagination = styled.div`
  align-self: flex-end;
  margin-right: 32px;
  margin-bottom: 32px;
`;
