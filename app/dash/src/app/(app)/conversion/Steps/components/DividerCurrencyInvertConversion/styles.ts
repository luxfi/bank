'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: '100%';
  align-items: center;
  margin-block: 32px;
  cursor: pointer;
`;

export const Line = styled.div`
  background-color: ${(props) =>
    props.theme.borderColor.layout['divider-subtle'].value};
  height: 2px;
  flex: 1;
`;

export const ContainerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  margin-inline: 16px;
  height: 52px;
  width: 52px;
  border: 2px solid
    ${(props) =>
      props.theme.backgroundColor.interactive['primary-default'].value};
`;
