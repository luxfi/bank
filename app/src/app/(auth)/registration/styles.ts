'use client';

import { DeviceSize } from '@/lib/constants';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-image: url('/image/blue_background.jpeg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  @media (max-width: 768px) {
    overflow-y: hidden;
  }
`;

export const MainContainer = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: ${(props) => props.theme.size['40px']};
  @media ${DeviceSize.sm} {
    padding: ${(props) => props.theme.size['40px']} 0;
  }
`;

export const MainActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${(props) => props.theme.size['56px']};
  margin-bottom: ${(props) => props.theme.size['32px']};
  gap: 16px;
  width: 100%;

  @media ${DeviceSize.sm} {
    flex-direction: column;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  a {
    text-decoration: none;
    font-size: ${(props) => props.theme.size['24px']};
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  color: ${(props) => props.theme.colors.background};
  background-color: ${(props) => props.theme.colors.background};
  padding: 2rem;
  padding-inline: 170px;
  width: 720px;

  form {
    width: 350px;
  }

  .logo {
    margin-bottom: 64px;
    @media (max-width: 768px) {
      width: 60vw;
    }
  }
`;

export const Title = styled.h1`
  color: #1e3456;
  margin: 0;
  padding: 0;
  font-size: ${(props) => props.theme.size['56px']};
  font-weight: 700;
`;

export const Subtitle = styled.h4`
  color: #516686;
  font-size: ${(props) => props.theme.size['24px']};
  font-weight: 300;
  margin-bottom: 4rem;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: flex-start;
  gap: 8px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const SubmitError = styled.span`
  color: ${(props) => props.theme.colors.danger};
  font-size: ${(props) => props.theme.size['20px']};
  margin-top: ${(props) => props.theme.size['20px']};
  font-weight: 500;
`;

interface ICaptchaContainer {
  $hasError: boolean;
}
export const CaptchaContainer = styled.div<ICaptchaContainer>`
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;

  div {
    border: ${(props) => (props.$hasError ? props.theme.colors.danger : '')};
  }
  span {
    color: ${(props) => props.theme.colors.danger};
    padding: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const RequestRegistration = styled.span`
  font-size: 16px;
  color: #1e3456;
  margin-top: 24px;
  a {
    font-size: 16px;
  }
`;
