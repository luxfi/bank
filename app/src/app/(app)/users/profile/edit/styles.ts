'use client';

import styled from 'styled-components';

export const Container = styled.div``;

export const InputAndImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  gap: 24px;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

export const ApprovalContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: ${(props) =>
    props.theme.backgroundColor.interactive['primary-disabled'].value};
  padding: 16px;
`;
