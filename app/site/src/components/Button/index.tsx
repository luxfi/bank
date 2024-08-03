"use client";
import styled from "styled-components";

export const CustomButton = styled.button`
  background-color: #00569e;
  height: 60px;
  border-radius: 1rem;
  color: #ffffff;
  font-size: 2rem;
  width: fit-content;
  padding: 1rem 3rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  z-index: 1;

  &:hover {
    background-color: #f49c0e;
  }
`;
