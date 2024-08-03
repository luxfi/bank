'use client';

import Image from 'next/image';

import { DeviceSize } from '@/lib/constants';

import styled from 'styled-components';

export const Container = styled.header<{ $backgroundColor: string }>`
  @media ${DeviceSize.xs} {
    padding: 14px 20px;
  }

  @media ${DeviceSize.sm} {
    padding: 0rem 3.5rem;
  }

  grid-area: HEADER;
  background-color: ${(props) => props.$backgroundColor};
  padding: 10px ${(props) => props.theme.padding.sm.value};
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  top: 0;
  position: sticky;
  border-bottom: 1px solid
    ${(props) => props.theme.borderColor.layout['border-subtle'].value};

  max-height: ${(props) => props.theme.height.xxxl.value};

  box-shadow: '0px 2px 8px rgba(0, 0, 0, 0.1)';
  transition: box-shadow 0.3s ease;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
`;

export const ContainerLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

export const Logo = styled(Image)`
  @media ${DeviceSize.sm} {
    width: 65%;
  }
`;
