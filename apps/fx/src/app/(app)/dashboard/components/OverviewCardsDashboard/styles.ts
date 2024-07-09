'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 16px;
  margin-top: ${(props) => props.theme.margin.sm.value};
`;
