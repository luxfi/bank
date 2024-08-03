'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #c4c4c4;
  border-radius: 8px;
  overflow: hidden;
`;

export const LabelTitle = styled.h1`
  font-size: ${(props) => props.theme.size['24px']};
  font-weight: 600;
`;

export const LabelValue = styled.h3`
  font-size: ${(props) => props.theme.size['24px']};
  font-weight: 500;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.colors.background};
  font-size: ${(props) => props.theme.size['24px']};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.size['16px']};
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  .row-odd {
    background-color: ${(props) => props.theme.colors.gray};
  }

  .row-even,
  .row-odd {
    padding: ${(props) => props.theme.size['16px']};
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${(props) => props.theme.size['16px']};
`;
