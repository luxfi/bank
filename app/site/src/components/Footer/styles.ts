"use client";

import styled from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

export const FooterContainer = styled.footer`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.4rem;
  overflow: hidden;
  transition: background-color 0.2s ease;
`;

export const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1120px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;

  @media ${DeviceSize.sm} {
    padding: 3rem 1rem 2rem;
  }
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const NavColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const NavColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const NavTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 0.5rem;
`;

export const NavLink = styled.a`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  transition: color 0.15s ease;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  p {
    color: ${({ theme }) => theme.colors.secondary};
    line-height: 1.6;
    font-size: 1.3rem;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 2.5rem 0;
`;

export const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 1.3rem;
    transition: color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  span {
    color: ${({ theme }) => theme.colors.border};
  }
`;

export const CopyrightRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Copyright = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.muted};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.muted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 300;
    transition: color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.secondary};
    transition: all 0.15s ease;

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover || theme.colors.surface};
      border-color: ${({ theme }) => theme.colors.borderHover || theme.colors.border};
      color: ${({ theme }) => theme.colors.primary};
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const DisclaimerText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.15rem;
  line-height: 1.8;
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 0;
`;

export const ColumnsContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 3rem;

  @media ${DeviceSize.sm} {
    flex-direction: column;
    gap: 2rem;
  }
`;
