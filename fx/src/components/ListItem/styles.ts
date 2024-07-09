'use client';

import styled from 'styled-components';

interface IProps {
  color?: string;
}

export const Item = styled.li<IProps>`
  color: ${(props) => props.theme.colors.background};
  font-size: 18px;
  margin: 25px auto;
`;
