"use client";
import AnimatedDiv from "@/components/AnimatedDiv";
import { DeviceSize } from "@/styles/theme/default";
import styled from "styled-components";

export const ToolkitCard = styled(AnimatedDiv)`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 315px;
  padding: ${({ theme }) => theme.size["48px"]};
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.size["24px"]};

  @media ${DeviceSize.sm} {
    width: 95%;
  }
`;

export const ToolkitCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.size["24px"]};

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
  }
  @media ${DeviceSize.sm} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
export const TitleContainer = styled.div`
  display: flex;

  @media ${DeviceSize.sm} {
    p {
      font-size: 3.6rem;
      text-align: center;
    }
  }
`;
