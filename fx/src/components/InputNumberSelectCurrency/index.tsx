'use client';

import { useMemo } from 'react';
import Flag from 'react-world-flags';

import { formatCurrency } from '@/utils/lib';

import { useCurrenciesAndCountries } from '@/store/useCurrenciesAndCountries';
import { Select, Space } from 'antd';

import Input from '@/components/Input';

import {
  Container,
  ContainerInput,
  ContainerOption,
  FlagContainer,
  Label,
  LabelSubtitle,
  LabelTitle,
  TextContainer,
} from './styles';

export interface IDataSelectCurrency {
  id: string;
  name: string;
  amount: number;
  currency: string;
  countryName: string;
}

interface IProps {
  label: string;
  value: string;
  valueCurrency?: string;
  disabled?: boolean;
  disabledCurrency?: boolean;
  error?: string;
  onChange(value: string): void;
  onChangeCurrency(value?: IDataSelectCurrency): void;
  currencyToExclude?: string;
  defaultCurrency?: string;
}

export const InputNumberSelectCurrency: React.FC<IProps> = ({
  label,
  value,
  disabled,
  disabledCurrency,
  error,
  onChange,
  valueCurrency,
  onChangeCurrency,
  currencyToExclude,
  defaultCurrency,
}) => {
  const { allCurrencies, balances } = useCurrenciesAndCountries();

  const currenciesList = useMemo(() => {
    if (label === 'Buy' && Array.isArray(allCurrencies)) {
      return allCurrencies.map((currency) => ({
        id: currency.currency,
        name: currency.name,
        amount: currency.amount || null,
        currency: currency.currency,
        countryName: currency.name,
      }));
    }

    if (Array.isArray(balances)) {
      return balances.map((balance) => ({
        id: balance.currency,
        name: balance.name,
        amount: balance.amount,
        currency: balance.currency,
        countryName: balance.name,
      }));
    }

    return [];
  }, [allCurrencies, balances, label]);

  return (
    <Container>
      <Label>{label}</Label>
      <Space.Compact>
        <ContainerInput>
          <Input
            variant="currency"
            value={value}
            disabled={disabled}
            placeholder="0.00"
            label=""
            onChange={(value) => onChange(value)}
          />
        </ContainerInput>
        <Select
          style={{ minWidth: 200 }}
          loading={currenciesList.length === 0}
          disabled={disabledCurrency}
          status={error && 'error'}
          onChange={(val) => {
            onChangeCurrency(currenciesList.find((b) => b.id === val) as any);
          }}
          placeholder={'Select Currency'}
          value={valueCurrency}
          dropdownStyle={{ width: 400 }}
          optionLabelProp="label"
          size="large"
          defaultValue={defaultCurrency}
        >
          {currenciesList
            ?.filter((balance) => balance.id !== currencyToExclude)
            .map((balance) => (
              <Select.Option
                key={balance.id}
                value={balance.id}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FlagContainer style={{ marginRight: 4 }}>
                      <Flag
                        code={balance.currency.slice(0, 2)}
                        width={56}
                        height={56}
                      />
                    </FlagContainer>
                    <span style={{ marginLeft: 8 }}>{balance.currency}</span>
                  </div>
                }
              >
                <ContainerOption>
                  <FlagContainer>
                    <Flag
                      code={balance.currency.slice(0, 2)}
                      width={56}
                      height={56}
                    />
                  </FlagContainer>
                  <TextContainer>
                    <LabelTitle>
                      {`${balance.currency} - ${balance.countryName}`}
                    </LabelTitle>
                    {label === 'Buy' && balance.amount === null ? (
                      <LabelSubtitle>{`Not added yet`}</LabelSubtitle>
                    ) : (
                      <LabelSubtitle>
                        {formatCurrency(balance.amount || 0)}
                      </LabelSubtitle>
                    )}
                  </TextContainer>
                </ContainerOption>
              </Select.Option>
            ))}
        </Select>
      </Space.Compact>
    </Container>
  );
};
