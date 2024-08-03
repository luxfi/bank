"use client";

import styled, { keyframes } from "styled-components";

const shine = keyframes`
  0% {
    background-position: -200px;
  }
  100% {
    background-position: calc(200px + 100%);
  }
`;

const Skeleton = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shine} 2.5s infinite linear;
`;

export default Skeleton;
