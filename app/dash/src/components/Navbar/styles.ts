'use client';

import { DeviceSize } from '@/lib/constants';

import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  z-index: 4;
  padding: 8px;
  height: 100%;
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L1'].value};
`;

interface INavbar {
  $show?: boolean;
  $expanded?: boolean;
}
export const ContentContainer = styled.nav<INavbar>`
  display: flex;
  flex-direction: column;
  height: ${(props) => (props.$show ? '100%' : '0')};
  opacity: ${(props) => (props.$show ? '1' : '0')};
  overflow: hidden;
  width: ${(props) => (props.$expanded ? '230px' : '56px')};
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L0'].value};

  padding: 8px;
  gap: 10px;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  transition:
    padding 0.3s ease-in-out ${(props) => (props.$show ? '0s' : '0.3s')},
    height 0.3s ease-in-out,
    opacity 0.3s ease-in-out,
    width 0.3s ease-in-out;

  @media ${DeviceSize.sm} {
    width: 95vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: ${(props) =>
      '0 0' + ' ' + props.theme.size['20px'] + ' ' + props.theme.size['20px']};
  }
  @media (max-width: 420px) {
    display: flex;
    width: 90vw;
  }
`;
interface INavItem extends INavbar {
  $active: boolean;
  $badgeValue?: number;
}
export const NavbarItem = styled.button<INavItem>`
  display: flex;
  gap: ${(props) => props.theme.size['16px']};
  align-items: center;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  padding: 4px;
  position: relative;
  background-color: ${(props) =>
    props.$active
      ? props.theme.backgroundColor.layout['container-emphasized'].value
      : 'transparent'};
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  font-size: 23px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  white-space: nowrap;

  .label {
    font-size: 14px;
    visibility: ${(props) => (props.$expanded ? 'visible' : 'hidden')};
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-emphasized'].value};
  }

  & > div > span::after {
    content: '${(props) => (props.$badgeValue ? props.$badgeValue : '')}';
    color: ${(props) => props.theme.textColor.layout.primary.value};

    position: absolute;
    top: 4px;
    left: 22px;

    border-radius: 50%;
    display: ${(props) => (props.$badgeValue ? 'flex' : 'none')};

    font-size: 11px;
    font-weight: 500;
    width: 14px;
    height: 14px;
    background-color: ${(props) =>
      props.theme.textColor.feedback['icon-negative'].value};
    color: #fff;
    justify-content: center; /* Alinhando o texto ao centro */
    align-items: center; /* Alinhando o texto ao centro */
  }
`;

export const MenuContainer = styled.div<INavbar>`
  display: none;
  flex-direction: column;
  height: fit-content;
  overflow: hidden;
  width: 230px;

  padding: ${(props) => props.theme.size['20px']};
  background-color: ${(props) => props.theme.colors.primary};
  gap: ${(props) => props.theme.size['16px']};
  transition: width 0.3s ease-in-out;
  border-radius: ${(props) =>
    props.$show
      ? props.theme.size['20px'] + ' ' + props.theme.size['20px'] + ' 0 0'
      : props.theme.size['20px']};

  @media ${DeviceSize.sm} {
    width: 95vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 420px) {
    display: flex;
    width: 90vw;
  }
`;

export const MenuItem = styled.button<INavbar>`
  display: none;
  gap: ${(props) => props.theme.size['16px']};
  align-items: center;
  height: 40px;

  border-radius: ${(props) => props.theme.size['8px']};

  padding: ${(props) =>
    props.theme.size['8px'] + ' ' + props.theme.size['20px']};
  background-color: ${(props) => props.theme.colors.primary};
  transition: background-color ease-in-out 0.3s;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.background};

  &:hover {
    color: ${(props) => props.theme.colors.secondary};
    background-color: ${(props) => props.theme.colors.sky};
  }

  @media ${DeviceSize.sm} {
    display: flex;
  }
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
  white-space: nowrap;
`;

export const ExpandButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  white-space: nowrap;
`;

export const ExpandButton = styled.button`
  height: 40px;
  width: 40px;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  background: transparent;
  color: ${(props) => props.theme.textColor.layout.primary.value};
  border: 1px solid
    ${(props) => props.theme.borderColor.interactive.primary.value};
  cursor: pointer;

  transition: all 0.3s ease-in-out;

  @media ${DeviceSize.sm} {
    display: none;
  }

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.layout['container-L1'].value};
  }
`;
export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${(props) =>
    props.theme.borderColor.layout['divider-subtle'].value};
`;
