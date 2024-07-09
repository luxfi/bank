'use client';

import styled from 'styled-components';

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.8rem;
  width: 32px;
  height: 32px;
  transition: all 0.3s ease-in-out;
  background-color: ${(props) => props.theme.colors.gray};
  color: ${(props) => props.theme.colors.detail};
  border: 1px solid;
  border-color: ${(props) => props.theme.colors.detail};

  &:hover {
    opacity: 0.7;
    scale: 1.05;
  }
`;
