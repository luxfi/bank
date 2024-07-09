"use client";
import styled from "styled-components";

export const MainContainer = styled.main`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
  font-size: 24px;
`;

export const ContentContainer = styled.div`
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-inline: 16px;
  width: 100%;

  color: #0f244da3;
  font-size: 16px;
  line-height: 24px;

  * {
    width: 100%;
  }

  h3 {
    padding-block: 16px;
    color: #0b1936;
    font-size: 24px;
  }

  ul {
    margin-left: 28px;
    padding-block: 16px;
  }
  p {
    padding-block: 8px;
  }
`;
