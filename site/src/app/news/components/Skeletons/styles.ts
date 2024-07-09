"use client";

import styled from "styled-components";

export const ContainerPosts = styled.div`
  display: grid;
  padding: 32px 48px;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
`;

export const CardPost = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #d4dce8;
  height: 462px;
  border-radius: 8px;
  overflow: hidden;
`;
