'use client';

import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex: 1;

  flex-direction: column;
  gap: ${(props) => props.theme.size['24px']};
`;

export const ActionButton = styled.button`
  display: flex;
  gap: 4px;
  align-items: center;
  user-select: none;
  cursor: pointer;
  background: none;
  border: none;
`;
