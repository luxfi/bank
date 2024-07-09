'use client';

import styled from 'styled-components';

export const CurrenciesContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-y: auto;
  padding-bottom: 8px;
  width: 100%;
  /* &::-webkit-scrollbar {
    display: none;
  } */
`;

export const ArrowButton = styled.div<{ $show: boolean }>`
  cursor: pointer;

  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 8px;

  transform: scaleX(${({ $show }) => ($show ? 1 : 0)});
  width: ${({ $show }) => ($show ? '40px' : '0px')};

  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L2'].value};
  }
`;
