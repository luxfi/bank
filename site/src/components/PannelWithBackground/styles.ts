"use client";
import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

interface IPannelContainer {
  $img: string;
  $responsiveImg?: string;
  $responsiveHeight?: string;
  $height: number;
  $hasChildren: boolean;
}

export const PannelContainer = styled.div<IPannelContainer>`
  display: flex;
  justify-content: end;
  background-color: ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.size["32px"]};
  padding: ${({ theme }) => theme.size["48px"]};
  height: ${({ $height }) => `${$height}px`};
  width: 100%;
  background-image: url(${({ $img }) => $img});
  background-size: cover;
  background-repeat: no-repeat;

  @media ${DeviceSize.md} {
    flex-direction: column;
    justify-content: flex-end;
    height: fit-content;
    padding-top: ${({ $responsiveHeight }) => $responsiveHeight};
    padding-inline: 1rem;
    background-size: contain;
    background-image: url(${({ $responsiveImg }) => $responsiveImg});

    button {
      width: 100%;
    }
  }
  @media ${DeviceSize.sm} {
    flex-direction: column;
    justify-content: flex-end;
    border-radius: 0;
    height: fit-content;
    padding-top: 230px;
    padding-inline: 1rem;
    background-size: 100%;
    background-image: url(${({ $responsiveImg }) => $responsiveImg});

    button {
      width: 100%;
    }
  }
`;

export const ContentContainer = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ $width }) => `${$width}%`};

  @media ${DeviceSize.md} {
    width: 100%;
    height: 70%;

    p {
      font-size: 2.8rem;
    }

    .title {
      text-align: center;
      font-size: 3.8rem;
      margin-bottom: 3rem;
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  @media ${DeviceSize.md} {
    margin-top: ${({ theme }) => theme.size["48px"]};
    justify-content: center;
  }
`;
