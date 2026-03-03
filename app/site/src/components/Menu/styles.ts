"use client";
import Link from "next/link";

import styled from "styled-components";

import { DeviceSize } from "./../../styles/theme/default";

export const MainContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  backdrop-filter: blur(12px);
  background: ${({ theme }) =>
    theme.colors.background === "#FFFFFF"
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(0, 0, 0, 0.8)"
  };
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
`;

export const MenuContainer = styled.nav`
  display: flex;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  height: 64px;
  align-items: center;
  justify-content: space-between;

  @media ${DeviceSize.md} {
    padding: 0 1.5rem;
  }

  @media ${DeviceSize.sm} {
    padding: 0 1rem;
    height: 56px;

    img {
      width: 100px;
    }
  }
`;

export const MenuItem = styled(Link)<{ $active: boolean }>`
  padding: 0.6rem 1rem;
  background: none;
  border-radius: 12px;
  transition: all 0.15s ease;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.secondary)};
  font-weight: 500;
  font-size: 1.4rem;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  position: relative;
  z-index: 1;

  @media ${DeviceSize.sm} {
    display: none;
  }
`;

export const ItemsContainer = styled.div<{ $open: boolean }>`
  display: none;

  @media ${DeviceSize.sm} {
    display: ${(props) => (props.$open ? "flex" : "none")};
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: ${({ theme }) =>
      theme.colors.background === "#FFFFFF"
        ? "rgba(255, 255, 255, 0.98)"
        : "rgba(0, 0, 0, 0.98)"
    };
    backdrop-filter: blur(16px);
    flex-direction: column;
    width: 100vw;
    align-items: flex-start;
    padding: 1rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    max-height: calc(100vh - 56px);
    overflow-y: auto;

    a {
      width: 100%;
      padding: 1.2rem 2rem;
      border-radius: 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      font-size: 1.6rem;

      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 1.3rem;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    background: ${({ theme }) => theme.colors.surfaceHover || theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.borderHover || theme.colors.border};
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media ${DeviceSize.sm} {
    padding: 0.4rem 0.6rem;

    span {
      display: none;
    }
  }
`;

export const SearchText = styled.span`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.muted};

  @media ${DeviceSize.md} {
    display: none;
  }
`;

export const SearchShortcut = styled.kbd`
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.2rem 0.4rem;
  font-size: 1rem;
  font-family: ui-monospace, monospace;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.muted};

  span {
    font-size: 1.1rem;
  }

  @media ${DeviceSize.sm} {
    display: none;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media ${DeviceSize.sm} {
    a {
      display: none;
    }
  }
`;

export const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.borderHover || theme.colors.border};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media ${DeviceSize.sm} {
    gap: 1rem;
  }
`;
