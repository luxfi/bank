"use client";
import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

export const MainContainer = styled.div<{
  $showCard: boolean;
  $height?: string;
  $responsiveHeight?: string;
}>`
  display: flex;
  width: 100%;
  min-height: ${({ $height }) => $height};
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  height: 100%;

  @media ${DeviceSize.md} {
    height: ${({ $responsiveHeight }) => $responsiveHeight || "750px"};
    margin-bottom: ${({ theme }) => theme.size["16px"]};
  }

`;

export const ImageContainer = styled.div<{ $positionY?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 370px;
  align-items: center;
  border-radius: ${({ theme }) => theme.size["24px"]};
  overflow: hidden;
  object-fit: fill;

  p {
    top: 65px;
    position: absolute;
    color: #1e3456;
  }

  img {
    position: relative;
    top: ${({ $positionY }) => $positionY};
    object-fit: cover;
    border-radius: ${({ theme }) => theme.size["24px"]};
  }

  @media ${DeviceSize.md} {
    height: 200px;
    width: 95%;
    overflow: unset;

    p {
      font-size: ${({ theme }) => theme.size["64px"]} !important;
    }

    img {
      position: unset;
      min-height: 100%;
      width: auto;
      border-radius: ${({ theme }) => theme.size["24px"]};
    }
  }
 
`;

export const BannerCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  align-items: center;
  gap: 4rem;
  width: 65%;
  padding: ${({ theme }) => theme.size["32px"]}
    ${({ theme }) => theme.size["48px"]};
  position: absolute;
  border-radius: ${({ theme }) => theme.size["24px"]};
  top: ${({ theme }) => theme.size["320px"]};

  p {
    text-align: center;
  }

  @media ${DeviceSize.sm} {
    width: 95%;
    padding: ${({ theme }) => theme.size["32px"]}
      ${({ theme }) => theme.size["24px"]};

    p:first-child {
      font-size: ${({ theme }) => theme.size["56px"]};
    }
  }
`;
