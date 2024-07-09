'use client';

import { CSSProperties, useEffect, useState } from 'react';
import Flag from 'react-world-flags';

import { useCreatePayment } from '@/context/CreatePayment';
import { useNotification } from '@/context/Notification';

import { useWallet } from '@/store/useWallet';
import { IWallet } from '@/store/useWallet/types';
import { Select as SelectStyled } from 'antd';

import { LabelTile } from '../Label/styles';
import {
  Container,
  ContainerOption,
  FlagContainer,
  Label,
  LabelError,
  LabelHelper,
  LabelSubtitle,
  TextContainer,
} from './styles';
import { formatCurrency } from '@/utils/lib';

interface IProps {
  label: string;
  containerStyle?: CSSProperties;
  placeholder?: string;
  error?: string;
  value?: string;
  disabled?: boolean;
  onChange(value: string): void;
  helper?: string;
  password?: boolean;
}

export default function SelectBalances({
  label,
  containerStyle,
  placeholder,
  error,
  disabled,
  onChange,
  helper,
  value,
}: IProps) {
  const { getAllCurrencies } = useWallet();
  const { onChangeData } = useCreatePayment();

  const { onShowNotification } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [currencyBalanceList, setCurrencyBalanceList] = useState<
    Array<IWallet>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const balances = await getAllCurrencies();

        onChangeData('balances', balances);
        Array.isArray(balances) && setCurrencyBalanceList(balances);
      } catch (error) {
        setCurrencyBalanceList([]);
        onShowNotification({
          type: 'ERROR',
          message: 'Error retiriving balances',
          description: '',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Container style={containerStyle}>
      <Label>{label}</Label>

      <SelectStyled
        loading={loading}
        disabled={disabled}
        status={error && 'error'}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        value={value}
        size="large"
      >
        {currencyBalanceList?.map((balance) => (
          <SelectStyled.Option key={balance.currency} value={balance.currency}>
            <ContainerOption>
              <FlagContainer>
                <Flag
                  code={balance.currency.slice(0, 2)}
                  width={56}
                  height={56}
                />
              </FlagContainer>
              <TextContainer>
                <LabelTile>{`${balance.currency} - ${balance.name}`}</LabelTile>
                {value !== balance.currency && (
                  <LabelSubtitle>
                    {formatCurrency(balance.amount)}
                  </LabelSubtitle>
                )}
              </TextContainer>
            </ContainerOption>
          </SelectStyled.Option>
        ))}
      </SelectStyled>

      {error && <LabelError>{error}</LabelError>}
      {helper && <LabelHelper>{helper}</LabelHelper>}
    </Container>
  );
}
