"use client";

import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

export const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 392px;
  background-color: #00569e;
  width: 100%;
  padding-top: 7.5rem;
  padding-bottom: 3rem;
  color: #ffffff;
  font-size: 1.6rem;

  @media ${DeviceSize.sm} {
    height: 100%;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  width: 80vw;
  gap: 2rem;

  @media ${DeviceSize.sm} {
    width: 90vw;
  }
`;
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  width: 100%;
  height: 100%;
`;

export const LinksContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  width: 100%;
  height: fit-content;
  color: #ffffff;

  * {
    text-decoration: none;
    color: #ffffff;
  }
`;

export const ColumnsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media ${DeviceSize.sm} {
    flex-direction: column;

    * {
      p {
        line-height: 3.2rem;
      }
    }
  }
`;
