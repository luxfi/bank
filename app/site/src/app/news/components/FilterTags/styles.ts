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
  border: 1px solid #27272A;
  background-color: ${(props) => (props.$isActive ? "#FAFAFA" : "transparent")};
  border-color: ${(props) => (props.$isActive ? "#FAFAFA" : "#27272A")};
  color: ${(props) => (props.$isActive ? "#09090B" : "#A1A1AA")};

  &:hover {
    cursor: pointer;
    border-color: #3F3F46;
  }
`;
