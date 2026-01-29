"use client";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
`;

export const PaletteOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) =>
    theme.colors.background === "#0B0F14"
      ? "rgba(11, 15, 20, 0.7)"
      : "rgba(0, 0, 0, 0.3)"
  };
  backdrop-filter: blur(4px);
  z-index: 100;
  animation: ${fadeIn} 0.15s ease;
`;

export const PaletteContainer = styled.div`
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2rem);
  max-width: 520px;
  background: ${({ theme }) =>
    theme.colors.background === "#0B0F14"
      ? "rgba(15, 22, 32, 0.95)"
      : "rgba(255, 255, 255, 0.95)"
  };
  backdrop-filter: blur(16px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  z-index: 101;
  animation: ${slideIn} 0.15s ease;

  @media (min-width: 640px) {
    width: calc(100% - 4rem);
  }
`;

export const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SearchIcon = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export const EscKey = styled.kbd`
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  font-family: ui-monospace, monospace;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const ResultsContainer = styled.div`
  max-height: 360px;
  overflow-y: auto;
  padding: 0.5rem 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`;

export const CategoryTitle = styled.div`
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.muted};
`;

export const ResultItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  text-align: left;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.surface : "transparent")};
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const ResultIconContainer = styled.div<{ $selected: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.surfaceHover || theme.colors.surface : theme.colors.surface)};
  border: 1px solid ${({ theme, $selected }) => ($selected ? theme.colors.borderHover || theme.colors.border : theme.colors.border)};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.secondary)};
  flex-shrink: 0;
  transition: all 0.15s ease;
`;

export const ResultContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ResultTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.35rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};

  svg {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export const ResultDescription = styled.div`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ArrowIcon = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
`;

export const NoResults = styled.div`
  padding: 2rem 1.25rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.35rem;
`;

export const PaletteFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const KeyHint = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const KeyboardKey = styled.kbd`
  padding: 0.125rem 0.375rem;
  font-size: 1rem;
  font-family: ui-monospace, monospace;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.secondary};
`;
