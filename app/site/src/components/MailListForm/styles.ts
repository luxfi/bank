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
  padding: 80px 24px;

  background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  text-align: center;

  p:first-child {
    color: rgba(255, 255, 255, 0.92);
    font-size: 3.2rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  p:last-child {
    color: rgba(255, 255, 255, 0.65);
    font-size: 1.6rem;
    line-height: 1.6;
  }

  @media ${DeviceSize.sm} {
    p:first-child {
      font-size: 2.4rem;
    }
    p:last-child {
      font-size: 1.4rem;
    }
  }
`;

export const InputsContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  color: #FFFFFF;
  width: 100%;
  max-width: 800px;

  /* Email spans full width */
  > div:first-child {
    grid-column: 1 / -1;
  }

  /* Recaptcha and button container */
  > div:nth-child(4) {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  /* Subscribe button */
  > button {
    grid-column: 1 / -1;
    max-width: 200px;
    margin: 0 auto;
  }

  input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    font-size: 1.4rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #FFFFFF;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
  }

  label {
    color: rgba(255, 255, 255, 0.65);
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);

    > div:first-child {
      grid-column: 1 / -1;
    }

    > div:nth-child(2),
    > div:nth-child(3) {
      grid-column: span 1;
    }
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;

    > div:first-child,
    > div:nth-child(2),
    > div:nth-child(3) {
      grid-column: 1;
    }

    button {
      width: 100%;
      max-width: none;
      font-size: 1.6rem;
    }
  }
`;
