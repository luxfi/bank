'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${(props) => props.theme.inline.sm.value};
  margin-right: ${(props) => props.theme.margin.sm.value};

  div {
    // adjusts to the select component
    width: 300px;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  width: 130px;

  span {
    width: 100%;
  }
`;
