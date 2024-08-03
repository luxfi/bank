"use client";
import { DeviceSize } from "@/styles/theme/default";
import styled from "styled-components";

export const TeamCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.size["80px"]};

  margin-bottom: ${({ theme }) => theme.size["64px"]};

  @media ${DeviceSize.sm} {
    margin-top: ${({ theme }) => theme.size["64px"]};
  }
`;
