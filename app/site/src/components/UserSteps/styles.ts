"use client";
import { RightOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size["64px"]};
  align-items: center;
  justify-content: center;

  width: 100%;
  
  padding-block: ${({ theme }) => theme.size["64px"]};

  @media ${DeviceSize.sm} {
    p {
      text-align: center;
    }
  }
`;

export const StepsLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: ${({ theme }) => theme.size["32px"]};

  p {
    font-weight: 600;
  }

  @media ${DeviceSize.sm} {
    flex-direction: column;
    gap: ${({ theme }) => theme.size["20px"]};
    svg {
      display: none;
    }
  }
`;

export const ArrowIcon = styled(RightOutlined)`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.success};
`;

export const StepsImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.size["32px"]};

  img {
    max-width: 700px;
  }

  @media ${DeviceSize.sm} {
    width: 90%;
  }
`;
