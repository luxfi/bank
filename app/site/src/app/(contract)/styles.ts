"use client";
import styled from "styled-components";

export const MainContainer = styled.main`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
  font-size: 24px;
`;

export const ContentContainer = styled.div`
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-inline: 16px;
  width: 100%;
  max-width: 800px;

  color: rgba(255, 255, 255, 0.65);
  font-size: 16px;
  line-height: 1.7;

  * {
    width: 100%;
  }

  h1, h2 {
    padding-block: 24px 16px;
    color: rgba(255, 255, 255, 0.92);
    font-size: 32px;
    font-weight: 600;
  }

  h3 {
    padding-block: 20px 12px;
    color: rgba(255, 255, 255, 0.92);
    font-size: 24px;
    font-weight: 600;
  }

  h4 {
    padding-block: 16px 8px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 18px;
    font-weight: 500;
  }

  ul, ol {
    margin-left: 28px;
    padding-block: 12px;
  }

  li {
    padding-block: 4px;
  }

  p {
    padding-block: 8px;
  }

  a {
    color: #FFFFFF;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      opacity: 0.8;
    }
  }

  strong {
    color: rgba(255, 255, 255, 0.85);
  }
`;
