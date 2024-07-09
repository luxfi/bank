"use client";
import AnimatedDiv from "@/components/AnimatedDiv";

import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

export const MainContainer = styled(AnimatedDiv)`
  display: flex;
  width: 100%;
  height: fit-content;
  gap: 10px;
  margin-bottom: ${({ theme }) => theme.size["64px"]};

  @media ${DeviceSize.md} {
    flex-direction: column;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.size["24px"]};

  .map {
    width: 100%;
    height: 100%;
    //border-radius: ${({ theme }) => theme.size["24px"]};
  }

  @media ${DeviceSize.md} {
    .map {
      height: 550px;
    }
  }
  @media ${DeviceSize.sm} {
    .map {
      height: 350px;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.size["24px"]};
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.size["24px"]};

  padding: ${({ theme }) => theme.size["24px"]}
    ${({ theme }) => theme.size["48px"]};

  button {
    width: 50%;
  }

  @media ${DeviceSize.sm} {
    flex-direction: column;
    padding: ${({ theme }) => theme.size["24px"]};

    button {
      width: 100%;
    }
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size["24px"]};
`;

export const FullHeight = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 250px;
  height: 100%;

  p {
    width: 100%;
  }
`;
