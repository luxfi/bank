'use client';

import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useAuth } from '@/store/useAuth';
import { Column, useTheme } from '@luxbank/ui';

import { HeaderDetails } from '../../components/Header';
import { IOther } from './types';

export default function Other() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const other = useMemo((): IOther => {
    const otherDetails = currentUser?.currentClient.account.individualMetadata;
    return {
      highProfilePosition: otherDetails?.highProfilePosition ?? '',
      publicPosition: otherDetails?.publicPosition ?? '',
    };
  }, [currentUser?.currentClient.account.individualMetadata]);

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
            label="Public position held"
            value={other.publicPosition}
          />
          <LabelAndValue
            label="High profile position held"
            value={other.highProfilePosition}
          />
        </Column>
      </Column>
    </>
  );
}
