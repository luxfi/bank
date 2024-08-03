"use client";
import Link from "next/link";

import styled from "styled-components";

import { DeviceSize } from "./../../styles/theme/default";

export const MainContainer = styled.div``;
export const MenuContainer = styled.nav`
  display: flex;
  padding: 2.4rem 6rem;
  width: 100%;
  height: 112px;
  align-items: center;
  gap: 32px;
  margin-bottom: 1.4rem;

  @media ${DeviceSize.md} {
    padding: 0 1rem;
  }

  @media ${DeviceSize.sm} {
    padding: 0 1rem;
    height: 60px;
    justify-content: space-between;

    img {
      width: 140px;
    }
    button {
      height: 4rem;
      font-size: 1.6rem;
    }
  }
`;

export const MenuItem = styled(Link)<{ $active: boolean }>`
  padding: 1rem 2rem;
  background: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 18px;
  font-size: 1.8rem;
  text-decoration: none;
  cursor: pointer;

  border-bottom: ${(props) => (props.$active ? "2px solid #00569E90" : "none")};
  border-radius: ${(props) => (props.$active ? "0.5rem 0.5rem 0 0" : "0")};

  &:hover {
    background-color: ${(props) => props.theme.colors.gray};
  }
`;

export const ItemsContainer = styled.div<{ $open: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  z-index: 1;

  @media ${DeviceSize.sm} {
    display: ${(props) => (props.$open ? "flex" : "none")};
    position: absolute;
    top: 60px;
    left: 0;
    background-color: ${(props) => props.theme.colors.gray};
    flex-direction: column;
    width: 100vw;
    align-items: flex-start;

    button {
      display: flex;
      width: 100%;
      align-items: flex-start;
      border-radius: 0;
      border-bottom: 1px solid ${(props) => props.theme.colors.detail}50;
    }
  }
`;
