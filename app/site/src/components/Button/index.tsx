"use client";
import styled from "styled-components";

// Primary accent button - use sparingly for main CTAs
export const CustomButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  height: 40px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.accentForeground || theme.colors.background};
  font-size: 1.4rem;
  font-weight: 600;
  width: fit-content;
  padding: 0 1.6rem;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 1;
  border: none;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Secondary ghost button - transparent with border
export const SecondaryButton = styled.button`
  background: transparent;
  height: 40px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.4rem;
  font-weight: 500;
  width: fit-content;
  padding: 0 1.6rem;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 1;
  border: 1px solid ${({ theme }) => theme.colors.borderHover || theme.colors.border};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Ghost button - minimal, text only feel
export const GhostButton = styled.button`
  background: transparent;
  height: 40px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.4rem;
  font-weight: 500;
  width: fit-content;
  padding: 0 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 1;
  border: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }

  &:active {
    transform: scale(0.98);
  }
`;
