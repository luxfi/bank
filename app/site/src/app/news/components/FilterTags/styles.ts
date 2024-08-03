"use client";

import styled from "styled-components";

interface IProps {
  $isActive: boolean;
}

export const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 32px;
  margin-bottom: 72px;
  flex-wrap: wrap;
`;

export const TagButton = styled.button<IProps>`
  font-size: 24px;
  background: transparent;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: "D-DIN-PRO" sans-serif;
  border: 1px solid #d4dce8;
  background-color: ${(props) => (props.$isActive ? "#00569E" : "transparent")};
  border-color: ${(props) => (props.$isActive ? "#00569E" : "#d4dce8")};
  color: ${(props) => (props.$isActive ? "#F2F2F2" : "#002645")};

  &:hover {
    cursor: pointer;
  }
`;
