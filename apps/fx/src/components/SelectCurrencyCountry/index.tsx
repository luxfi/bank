'use client';

import { CSSProperties, useEffect, useState } from 'react';
import Flag from 'react-world-flags';

import { ICurrencies } from '@/models/currencies';

import { useCurrenciesAndCountries } from '@/store/useCurrenciesAndCountries';
import { Select as SelectStyled } from 'antd';

import { Container, Label, LabelError } from './styles';

interface IProps {
  label: string;
  containerStyle?: CSSProperties;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  value?: string;
  disabled?: boolean;
  onChange(value: string): void;
  password?: boolean;
}

export default function SelectCurrencies({
  label,
  containerStyle,
  defaultValue,
  placeholder,
  error,
  disabled,
  onChange,
  value,
}: IProps) {
  const { currencieCountries } = useCurrenciesAndCountries();

  const [currenciesList, setCurrenciesList] = useState<Array<ICurrencies>>([]);

  useEffect(() => {
    setCurrenciesList([{ name: 'All', code: 'all' }, ...currencieCountries]);
  }, [currencieCountries]);

  return (
    <Container style={containerStyle}>
      <Label>{label}</Label>

      <SelectStyled
        showSearch={true}
        defaultValue={defaultValue}
        disabled={disabled}
        status={error && 'error'}
        onChange={(value) => onChange(value)}
        placeholder={placeholder}
        value={value}
        size="large"
      >
        {currenciesList?.map((currencie) => (
          <SelectStyled.Option key={currencie.code} value={currencie.code}>
            {currencie.code !== 'all' && (
              <Flag
                style={{
                  marginRight: 8,
                  marginTop: 8,
                  marginBottom: -4,
                  width: 23,
                  height: 23,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                code={currencie.code.slice(0, 2)}
                height={16}
              />
            )}
            {`${currencie.code !== 'all' ? currencie.code + ' - ' : ''}  ${
              currencie.name
            }`}
          </SelectStyled.Option>
        ))}
      </SelectStyled>

      {error && <LabelError>{error}</LabelError>}
    </Container>
  );
}
