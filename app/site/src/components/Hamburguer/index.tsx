"use client";
import React from "react";

import styled, { css } from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

interface IBurgerIconProps {
  $open: boolean;
}

const BurgerIcon = styled.div<IBurgerIconProps>`
  display: none;
  width: 30px;
  height: 20px;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  @media ${DeviceSize.sm} {
    display: flex;
  }

  div {
    width: 100%;
    height: 4px;
    background-color: #002645;
    border-radius: 3px;
    transition:
      transform 0.3s,
      opacity 0.3s;

    &:nth-child(1) {
      ${({ $open }) =>
        $open &&
        css`
          transform: translateY(8px) rotate(45deg);
        `}
    }

    &:nth-child(2) {
      opacity: ${({ $open }) => ($open ? "0" : "1")};
    }

    &:nth-child(3) {
      ${({ $open }) =>
        $open &&
        css`
          transform: translateY(-8px) rotate(-45deg);
        `}
    }
  }
`;

interface IHamburgerMenuProps {
  open: boolean;
  onClick: () => void;
}

const HamburgerMenu: React.FC<IHamburgerMenuProps> = ({ open, onClick }) => {
  return (
    <BurgerIcon $open={open} onClick={onClick}>
      <div />
      <div />
      <div />
    </BurgerIcon>
  );
};

export default HamburgerMenu;
