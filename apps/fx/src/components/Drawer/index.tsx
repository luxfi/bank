import React, { useMemo, useRef } from 'react';

import { useSidebar } from '@/context/useSidebar';

import styled, { keyframes } from 'styled-components';

interface IDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Drawer: React.FC<IDrawerProps> = ({ open, onClose, children }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { isOpen } = useSidebar();

  const left = useMemo(() => {
    if (open) {
      return isOpen ? '245px' : '70px';
    }

    return isOpen ? '-20%' : '-100%';
  }, [isOpen, open]);

  return (
    <>
      <DrawerWrapper ref={drawerRef} $left={left}>
        {children}
      </DrawerWrapper>
      <BackDrop $open={open} $sidebarOpen={isOpen} onClick={onClose} />
    </>
  );
};

const DrawerWrapper = styled.div<{ $left: string }>`
  position: absolute;
  top: 60px;
  left: ${({ $left }) => $left};
  width: ${({ theme }) => theme.width['80x'].value};
  height: 100%;
  padding: ${({ theme }) => theme.padding.sm.value};
  z-index: 2;
  background-color: ${({ theme }) =>
    theme.backgroundColor.layout['container-L1'].value};

  transition: left 0.3s ease-in-out;
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const BackDrop = styled.div<{ $open: boolean; $sidebarOpen: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  top: 60px;
  width: ${({ $open, $sidebarOpen }) =>
    $open ? `calc(100vw - ${$sidebarOpen ? '261px' : '90px'})` : '0'};
  z-index: 1;
  height: 100%;

  transition: width 0.3s ease-in-out;
  background-color: #0000007f;
  opacity: ${({ $open }) => ($open ? '1' : '0')};

  animation: ${({ $open }) => ($open ? fadeInOut : 'none')} 0.5s ease-in-out
    forwards;
`;
