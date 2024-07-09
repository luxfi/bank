'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: ${(props) => props.theme.size['32px']};
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const SubmitError = styled.span`
  color: ${(props) => props.theme.colors.danger};
  font-size: ${(props) => props.theme.size['20px']};
  margin-bottom: ${(props) => props.theme.size['20px']};
  font-weight: 500;
`;
