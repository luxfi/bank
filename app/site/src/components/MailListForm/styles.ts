"use client";

import { DeviceSize } from "@/styles/theme/default";
import styled from "styled-components";

export const MailListFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 650px;
  padding-block: 80px;

  background-color: #f4f4f4;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: fit-content;

  * {
    color: #1e3456;
  }

  @media ${DeviceSize.sm} {
    p {
      text-align: center;
      font-size: 1.8rem;
    }
    p:first-child {
      font-size: 3.4rem;
    }
  }
`;

export const InputsContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: #1e3456;

  width: 910px;
  height: 100%;

  @media ${DeviceSize.sm} {
    width: 100%;
    padding-inline: 1rem;

    button {
      width: 100%;
      font-size: 1.6rem;
    }
  }
`;
