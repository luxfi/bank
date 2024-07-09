'use client';

import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.gap.lg.value};
`;

export const Divider = styled.div`
  height: 100%;
  width: 1px;
  background-color: ${({ theme }) =>
    theme.borderColor.layout['border-subtle'].value};
`;
