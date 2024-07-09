'use client';

import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
`;

interface IButton {
  variant?: 'negative' | 'neutral';
}

const variants = (props: any) => ({
  negative: {
    color: props.theme.colors.background,
    'background-color': props.theme.colors.danger,
  },
  neutral: {
    color: props.theme.colors.detail,
    'background-color': props.theme.colors.gray,
    border: '1px solid',
    'border-color': props.theme.colors.detail,
  },
});

export const IconButton = styled.button<IButton>`
  ${(props) => variants(props)[props.variant || 'neutral']};

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.8rem;
  width: 32px;
  height: 32px;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.7;
    scale: 1.05;
  }
`;
