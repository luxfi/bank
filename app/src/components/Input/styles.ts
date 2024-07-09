'use client';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { Input as InputAntd } from 'antd';
import styled from 'styled-components';

import CurrencyInput from 'react-currency-input-field';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .css-dev-only-do-not-override-2i2tap.ant-input:hover,
  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }

  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:focus,
  .css-dev-only-do-not-override-2i2tap.ant-input-affix-wrapper:focus-within,
  .css-dev-only-do-not-override-2i2tap.ant-input:focus,
  .css-dev-only-do-not-override-2i2tap.ant-input:focus-within {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
`;

export const Label = styled.label`
  font-weight: ${({ theme }) =>
    theme.typography.caption.regular.value.fontWeight};
  font-size: ${({ theme }) => theme.typography.caption.regular.value.fontSize};
  margin-bottom: ${(props) => props.theme.size['8px']};
  color: ${({ theme }) => theme.textColor.interactive.enabled.value};
`;

export const LabelError = styled.span`
  font-size: 500;
  font-size: ${(props) => props.theme.size['16px']};
  margin-top: ${(props) => props.theme.size['4px']};
  margin-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.colors.danger};
`;

export const LabelHelper = styled.span`
  font-size: 400;
  font-size: ${(props) => props.theme.size['12px']};
  margin-top: ${(props) => props.theme.size['8px']};
  margin-left: ${(props) => props.theme.size['16px']};
  color: ${(props) => props.theme.textColor.layout.secondary.value};
`;

export const Input = styled(InputAntd)``;

export const StyledPhoneInput = styled(PhoneInput)`
  display: flex;
  height: 40px;
  border: 1px solid;
  border-radius: 8px;
  border-color: #d9d9d9;
  padding: 0 1rem;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }

  &.hasError {
    border-color: ${(props) => props.theme.colors.danger};
  }

  .PhoneInputCountry {
    padding-right: 1rem;
    margin-right: 1rem;
    border-right: 1px solid;
    border-color: #d9d9d9;
  }

  .PhoneInputCountryIcon {
    width: 23px;
    height: 23px;
    border-radius: 50%;
    margin-right: 8px;

    .PhoneInputCountryIconImg {
      width: 23px;
      height: 23px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
`;

export const StyledCurrencyInput = styled(CurrencyInput)`
  display: flex;
  height: 40px;
  border: 1px solid;
  border-radius: 8px;
  border-color: #d9d9d9;
  padding: 0 1rem;
  font-size: 16px;
  line-height: 1.5;

  &:focus {
    border-color: ${(props) => props.theme.colors.secondary};
  }

  &.hasError {
    border-color: ${(props) => props.theme.colors.danger};
  }
`;
