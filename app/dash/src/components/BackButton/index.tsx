'use client';

import { useRouter } from 'next/navigation';

import { Icon } from '@cdaxfx/ui';
import styled from 'styled-components';

interface IProps {
  containerStyle?: React.CSSProperties;
  children: React.ReactNode;
}

export function BackButton({ children, containerStyle }: IProps) {
  const router = useRouter();
  return (
    <StyledBackButton style={containerStyle} onClick={() => router.back()}>
      <Icon variant="arrow-left" />
      {children}
    </StyledBackButton>
  );
}

const StyledBackButton = styled.button`
  display: flex;
  background: none;
  gap: ${(props) => props.theme.gap.sm.value};
  align-items: center;
  padding: ${(props) => props.theme.padding.sm.value};
  font-size: ${(props) => props.theme.fontSize.headline.value};
  color: ${(props) => props.theme.textColor.layout.primary};
  width: fit-content;

  font-weight: 600;
  height: fit-content;
  cursor: pointer;

  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;
