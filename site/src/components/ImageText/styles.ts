"use client";
import { CheckOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { DeviceSize, defaultTheme } from "@/styles/theme/default";

export const ImageTextContainer = styled.div<{ $imgPlacement: string }>`
  display: flex;
  flex-direction: ${({ $imgPlacement }) => $imgPlacement};
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.size["80px"]};
  width: 100%;
  height: 555px;
  padding: ${({ theme }) => theme.size["48px"]};

  @media ${DeviceSize.md} {
    margin-block: ${({ theme }) => theme.size["48px"]};
    height: fit-content;
    flex-direction: column;
    gap: ${({ theme }) => theme.size["20px"]};
    padding: ${({ theme }) => theme.size["20px"]};
  }
  @media ${DeviceSize.sm} {
    height: fit-content;
    flex-direction: column;
    gap: ${({ theme }) => theme.size["20px"]};
    padding: ${({ theme }) => theme.size["20px"]};
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: ${({ theme }) => theme.size["16px"]};
  height: 100%;

  @media ${DeviceSize.sm} {
    p:first-child {
      font-size: 4rem;
    }
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  min-width: 460px;
  height: 460px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    align-self: stretch;
  }

  border-radius: ${({ theme }) => theme.size["24px"]};

  @media ${DeviceSize.sm} {
    width: 100%;
    min-width: 100%;
    height: 215px;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 48px;
  height: 400px;
  background-color: ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.size["24px"]};
  margin-bottom: ${({ theme }) => theme.size["24px"]};

  @media ${DeviceSize.md} {
    flex-direction: column;
    gap: 2rem;
    height: 100%;
  }
`;

export const CardItemsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.size["24px"]};
  align-items: center;
  width: 100%;
  height: 100%;

  @media ${DeviceSize.md} {
    flex-direction: column;
  }

  @media ${DeviceSize.sm} {
    flex-direction: column;
    gap: ${({ theme }) => theme.size["20px"]};
    height: 100%;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size["24px"]};
  margin-bottom: ${({ theme }) => theme.size["48px"]};
`;

export const Row = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.size["32px"]};
  font-size: 2.2rem;
  color: ${defaultTheme.colors.success};
  align-items: center;
  height: fit-content;
`;

export const Grid = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  margin-top: ${({ theme }) => theme.size["48px"]};
  width: 100%;
  row-gap: ${({ theme }) => theme.size["40px"]};

  @media ${DeviceSize.sm} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FeaturesContainer = styled.div`
  display: flex;
  padding-inline: ${({ theme }) => theme.size["80px"]};

  @media ${DeviceSize.md} {
    flex-direction: column;

    .girl {
      display: none;
    }
  }
  @media ${DeviceSize.sm} {
    flex-direction: column;

    .girl {
      display: none;
    }
  }
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size["24px"]};

  @media ${DeviceSize.sm} {
    align-items: flex-start;
    gap: ${({ theme }) => theme.size["32px"]};
  }
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.size["8px"]};
  height: fit-content;
  padding-inline: ${({ theme }) => theme.size["40px"]};
  width: fit-content;
  background-color: ${({ theme }) => theme.colors.gray};
  gap: ${({ theme }) => theme.size["24px"]};

  @media ${DeviceSize.sm} {
    padding-inline: ${({ theme }) => theme.size["20px"]};

    p {
      font-size: 2rem !important;
    }
  }
`;

export const CustomIconCheck = styled(CheckOutlined)`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.success};
`;
