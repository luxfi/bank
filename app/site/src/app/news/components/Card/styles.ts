"use client";

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #27272A;
  background-color: #18181B;
  height: 462px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  transition: all ease-in-out 0.2s;

  &:hover {
    transform: scale(1.02);
    border-color: #3F3F46;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }
`;

export const ContainerText = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 16px;
  gap: 16px;
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 500;
  color: #FAFAFA;
`;

export const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  color: #A1A1AA;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReadMoreButton = styled.button`
  align-self: flex-end;
  width: max-content;
  margin-right: 16px;
  color: #FAFAFA;
  font-size: 20px;
  font-weight: 500;
  background: transparent;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
