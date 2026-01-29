'use client';

import React from 'react';
import styled from 'styled-components';

interface TriangleBankLogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'default' | 'minimal' | 'dark';
  style?: React.CSSProperties;
}

const LogoContainer = styled.div<{ $size: number }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$size * 0.15}px;
`;

const TriangleSymbol = styled.span<{ $size: number; $variant: string }>`
  font-size: ${props => props.$size * 0.8}px;
  font-weight: 300;
  line-height: 1;
  color: ${props => props.$variant === 'dark' ? '#09090b' : '#fafafa'};
  font-family: system-ui, -apple-system, sans-serif;
`;

const LogoText = styled.span<{ $size: number; $variant: string }>`
  font-size: ${props => props.$size * 0.28}px;
  font-weight: 500;
  color: ${props => props.$variant === 'dark' ? '#09090b' : '#fafafa'};
  letter-spacing: -0.025em;
  font-family: system-ui, -apple-system, sans-serif;
`;

/**
 * Triangle Bank Logo
 * Uses the △ Unicode triangle symbol for a clean, shadcn-inspired look
 */
export const TriangleBankLogo: React.FC<TriangleBankLogoProps> = ({
  size = 48,
  showText = true,
  variant = 'default',
  style,
}) => {
  return (
    <LogoContainer $size={size} style={style}>
      <TriangleSymbol $size={size} $variant={variant}>△</TriangleSymbol>
      {showText && <LogoText $size={size} $variant={variant}>Triangle Bank</LogoText>}
    </LogoContainer>
  );
};

export default TriangleBankLogo;
