'use client';

import { DeviceSize } from '@/lib/constants';

import styled from 'styled-components';

export const Container = styled.div`
  /* background-color: ${(props) => props.theme.colors.primary}; */
  background-image: url('/image/blue_background.jpeg');

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
  align-items: center;
  margin-block: 4rem;

  width: 475px;
  background-color: #fff;
  border-radius: 16px;
  padding: 32px 48px;

  @media ${DeviceSize.sm} {
    width: 100%;
    padding: ${(props) => props.theme.size['16px']},
      ${(props) => props.theme.size['48px']};
  }

  h1 {
    font-size: 28px;

    @media ${DeviceSize.sm} {
      font-size: 26px;
    }
  }
  h2 {
    font-size: 14px;
  }
  .timer {
    font-size: 16px;
    color: rgba(99, 64, 6, 0.16);
  }
`;
export const InputsContainer = styled.div`
  display: flex;
  gap: 12px;
`;
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;
export const LinkBtn = styled.button`
  display: flex;
  background: none;
  border: none;
  color: #000;
  text-decoration: underline;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:disabled {
    color: rgba(99, 64, 6, 0.16);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    color: #6b6b6b;
  }
`;
