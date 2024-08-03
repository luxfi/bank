'use client';

import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useAuth } from '@/store/useAuth';
import { Column, useTheme } from '@luxbank/ui';

import { HeaderDetails } from '../../components/Header';
import { IExpectedActivity } from './types';

export default function ExpectedActivity() {
  const { theme } = useTheme();
  const { currentClientInfo } = useAuth();

  const expectedActivity = useMemo((): IExpectedActivity => {
    return {
      value: currentClientInfo?.user?.expectedValueOfTurnover ?? '',
      volume: currentClientInfo?.user?.expectedVolumeOfTransactions ?? '',
    };
  }, [
    currentClientInfo?.user?.expectedValueOfTurnover,
    currentClientInfo?.user?.expectedVolumeOfTransactions,
  ]);

  return (
    <>
      <HeaderDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <Column
          padding="sm"
          gap="sm"
          style={{
            borderRadius: 8,
            backgroundColor: theme.backgroundColor.layout['container-L2'].value,
            width: '100%',
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <LabelAndValue
            label="Expected volume"
            value={expectedActivity.volume}
          />
          <LabelAndValue
            label="Expected value"
            value={expectedActivity.value}
          />
        </Column>
      </Column>
    </>
  );
}
