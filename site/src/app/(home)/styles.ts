"use client";
import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

export const Card = styled.div`
  display: flex;
  background-color: #f4f4f4;
  height: 595px;
  width: 100%;
  padding: 60px;
  border-radius: 24px;
  align-items: center;
  margin-top: ${({ theme }) => theme.size["136px"]};
  margin-bottom: ${({ theme }) => theme.size["240px"]};

  @media ${DeviceSize.md} {
    height: 410px;
    margin-bottom: 0;
    margin-top: 60px;
    padding: 0;
  }
  @media ${DeviceSize.sm} {
    margin-bottom: 0;
    height: 210px;
    margin-top: 60px;
    padding: 0;
  }
`;
export const ImgContainer = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  background: none;
  top: -50px;
  right: 40px;
  position: absolute;

  @media ${DeviceSize.md} {
    top: -50px;
    right: 220px;
    img {
      width: 580px;
    }
  }

  @media ${DeviceSize.sm} {
    top: -50px;
    right: 30px;
    img {
      width: 380px;
      height: 320px;
    }
  }
`;
export const TextContainer = styled.div<{ $mobile?: boolean }>`
  display: ${(props) => (props.$mobile ? "none" : "flex")};
  flex-direction: column;
  gap: 2.6rem;
  justify-content: center;
  width: 60%;
  height: fit-content;

  @media ${DeviceSize.md} {
    display: ${(props) => (props.$mobile ? "flex" : "none")};
    width: 100%;
    margin-top: 100px;

    button {
      font-size: 1.6rem;
      width: 100%;
    }
  }
  @media ${DeviceSize.sm} {
    display: ${(props) => (props.$mobile ? "flex" : "none")};
    width: 100%;
    margin-top: 100px;

    button {
      font-size: 1.6rem;
      width: 100%;
    }
  }
`;
