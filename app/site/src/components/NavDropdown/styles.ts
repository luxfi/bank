"use client";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const DropdownTrigger = styled.button<{ $active: boolean; $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  color: ${({ theme, $active, $open }) => ($active || $open ? theme.colors.primary : theme.colors.secondary)};
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const ChevronIcon = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.15s ease;
  transform: ${(props) => (props.$open ? "rotate(180deg)" : "rotate(0)")};

  svg {
    width: 12px;
    height: 12px;
    opacity: 0.65;
  }
`;

export const DropdownMenu = styled.div<{ $type: "platform" | "solutions" }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  min-width: ${(props) => (props.$type === "platform" ? "380px" : "520px")};
  background: ${({ theme }) =>
    theme.colors.background === "#0B0F14"
      ? "rgba(15, 22, 32, 0.95)"
      : "rgba(255, 255, 255, 0.95)"
  };
  backdrop-filter: blur(16px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  z-index: 100;
  animation: ${fadeIn} 0.15s ease;
  display: ${(props) => (props.$type === "solutions" ? "grid" : "block")};
  grid-template-columns: ${(props) => (props.$type === "solutions" ? "1fr 1fr" : "1fr")};
`;

export const FeaturedCard = styled.div`
  padding: 1.25rem;
  background: ${({ theme }) =>
    theme.colors.background === "#0B0F14"
      ? "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
      : "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)"
  };
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FeaturedTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const FeaturedDescription = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

export const FeaturedLink = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const DropdownSection = styled.div`
  padding: 0.75rem;
`;

export const SectionTitle = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.muted};
`;

export const DropdownItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const ItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  flex-shrink: 0;
  transition: all 0.15s ease;

  ${DropdownItem}:hover & {
    background: ${({ theme }) => theme.colors.surfaceHover || theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.borderHover || theme.colors.border};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.125rem;
`;

export const ItemDescription = styled.div`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;
