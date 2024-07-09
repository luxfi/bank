'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.button`
  background-color: ${(props) =>
    props.theme.backgroundColor.interactive['primary-default'].value};
  border-radius: 100%;
  width: 40px;
  height: 40px;

  &:hover {
    cursor: pointer;
  }
`;

export const Label = styled.span`
  color: ${(props) => props.theme.textColor.layout.primary.value};
  font-size: ${(props) => props.theme.fontSize.caption.value};
  line-height: 20px;
  letter-spacing: 0.07px;
`;
