'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.size['24px']};

  h1 {
    font-size: ${(props) => props.theme.size['32px']};
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(props) => props.theme.size['24px']};
  margin-top: ${(props) => props.theme.size['24px']};

  button {
    width: 96px;
  }
`;
