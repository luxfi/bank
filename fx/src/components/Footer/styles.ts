'use client';

import styled from 'styled-components';

export const Container = styled.footer`
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  color: ${(props) => props.theme.colors.label};
  font-size: 12px;
  width: 100%;
`;

export const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${(props) => `${props.theme.size['48px']}`};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(1, 1fr);
    align-items: center;
    text-align: center;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  text-align: left;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const LeftColumnText = styled.span`
  margin-left: ${(props) => props.theme.size['24px']};

  @media (max-width: 1100px) {
    margin-left: 0;
    margin-top: ${(props) => props.theme.size['8px']};
  }
`;

export const CenterColumn = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;

  a {
    color: ${(props) => props.theme.colors.label};
    text-decoration: none;
  }

  @media (max-width: 1100px) {
    justify-content: center;
  }
`;

export const MaxRightColumn = styled.div`
  @media (max-width: 1100px) {
    display: inherit;
    margin-top: 24px;
  }

  display: none;
  text-align: center;
  align-items: center;
`;
