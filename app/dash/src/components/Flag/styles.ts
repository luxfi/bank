'use client';

import styled from 'styled-components';

interface IProps {
  size: number;
  borderSize: number;
}

export const Container = styled.div<IProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  border-radius: 100%;
  overflow: hidden;

  border: ${(props) =>
    `${props.borderSize}px solid ${props.theme.colors.borderLabel}`};
`;
