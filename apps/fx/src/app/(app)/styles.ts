'use client';

import { DeviceSize } from '@/lib/constants';

import styled from 'styled-components';

export const Layout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 60px auto;
  grid-template-areas:
    'HEADER HEADER'
    'SIDEBAR MAIN';
  height: 100vh;

  
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;

  @media ${DeviceSize.sm} {
    display: grid;
    grid-template-rows: auto 1fr;
    padding: ${(props) => props.theme.size['20px']};
    gap: ${(props) => props.theme.size['8px']};
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.size['20px']};
  background-color: ${(props) => props.theme.colors.gray};

  @media ${DeviceSize.sm} {
    border-radius: 0;
    border-radius: ${(props) => props.theme.size['20px']};
    padding: ${(props) => props.theme.size['20px']};
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  padding: ${(props) => props.theme.size['24px']};
  background-color: ${(props) =>
    props.theme.backgroundColor.layout['container-L1'].value};

  overflow-y: auto;
`;

export const Wrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
`;
