"use client";

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #d4dce8;
  height: 462px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  transition: all ease-in-out 0.2s;

  &:hover {
    transform: scale(1.02);

    -webkit-box-shadow: -1px 3px 16px 0px rgba(128, 128, 128, 0.47);
    -moz-box-shadow: -1px 3px 16px 0px rgba(128, 128, 128, 0.47);
    box-shadow: -1px 3px 16px 0px rgba(128, 128, 128, 0.47);
  }
`;

export const ContainerText = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 16px;
  gap: 16px;
`;

export const Title = styled.h3`
  font-family: "D-DIN-PRO" sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
`;

export const Description = styled.p`
  font-family: "D-DIN-PRO" sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #516686;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Número de linhas que você quer mostrar */
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReadMoreButton = styled.button`
  align-self: flex-end;
  width: max-content;
  margin-right: 16px;
  color: #00569e;
  font-family: "D-DIN-PRO" sans-serif;
  font-size: 20px;
  font-weight: 500;
  background: transparent;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
