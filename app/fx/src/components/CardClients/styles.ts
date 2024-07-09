'use client';

import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.gray};
  color: ${(props) => props.theme.colors.primary};

  border-radius: ${(props) => props.theme.size['16px']};
  width: 250px;
  height: 128px;
  cursor: pointer;

  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.gray};
  }
`;

export const Text = styled.span`
  font-size: ${(props) => props.theme.size['24px']};
  font-weight: 700;
`;
