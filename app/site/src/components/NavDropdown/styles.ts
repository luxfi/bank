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
  color: ${({ $active, $open }) => ($active || $open ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.65)')};
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.92);
    background: rgba(255, 255, 255, 0.05);
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
  left: 0;
  min-width: ${(props) => (props.$type === "platform" ? "380px" : "520px")};
  background: #0a0a0a;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: visible;
  z-index: 9999;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.15s ease;
  display: ${(props) => (props.$type === "solutions" ? "grid" : "block")};
  grid-template-columns: ${(props) => (props.$type === "solutions" ? "1fr 1fr" : "1fr")};

  /* Bridge the gap to prevent mouseout when moving to dropdown */
  &::before {
    content: '';
    position: absolute;
    top: -0.5rem;
    left: 0;
    right: 0;
    height: 0.5rem;
  }
`;

export const FeaturedCard = styled.div`
  padding: 1.25rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const FeaturedTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
`;

export const FeaturedDescription = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

export const FeaturedLink = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 500;
  color: #FFFFFF;
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
  color: rgba(255, 255, 255, 0.45);
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
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const ItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.65);
  flex-shrink: 0;
  transition: all 0.15s ease;

  ${DropdownItem}:hover & {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.92);
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
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.125rem;
`;

export const ItemDescription = styled.div`
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.4;
`;
