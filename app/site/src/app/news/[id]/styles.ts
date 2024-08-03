"use client";

import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;

  @media ${DeviceSize.sm} {
    padding-inline: 16px;
  }
`;

export const ContentDetail = styled.div`
  display: flex;
  flex-direction: column;

  img {
    max-width: 100%;
    height: auto;
    margin-block: 32px;
  }

  p {
    font-size: 24px;
    margin-block: 12px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 860px;
`;

export const Title = styled.h1`
  font-size: 32px;
`;
