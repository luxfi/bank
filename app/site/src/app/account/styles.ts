"use client";
import styled from "styled-components";

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size["48px"]};
`;
