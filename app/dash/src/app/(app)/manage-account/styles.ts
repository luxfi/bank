'use client';

import styled from 'styled-components';

interface IPropsMenu {
  isActive?: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding-top: 48px;
`;

export const ButtonMenu = styled.button<IPropsMenu>`
  background-color: transparent;
  text-align: start;
  cursor: pointer;
  font-size: ${(props) =>
    props.isActive
      ? props.theme.fontSize.headline.value
      : props.theme.fontSize.body_md.value};
  color: ${(props) =>
    props.isActive
      ? props.theme.textColor.layout.emphasized.value
      : props.theme.textColor.layout.primary.value};
  line-height: ${(props) => (props.isActive ? '28px' : '24px')};
  letter-spacing: ${(props) => (props.isActive ? '-0.26px' : '0.08px')};
  font-weight: 500;
  padding-inline: 16px;
  padding-block: 8px;

  transition: color ease-in-out 0.4s;

  &:hover {
    color: ${(props) => props.theme.textColor.interactive.link.value};
  }
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 100%;
  border-right: 1px solid
    ${(props) => props.theme.borderColor.layout['divider-subtle'].value};
`;
