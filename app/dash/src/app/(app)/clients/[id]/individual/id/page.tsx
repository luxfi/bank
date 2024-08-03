'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { Button, Column, useTheme } from '@luxbank/ui';

import { HeaderClientsDetails } from '../../components/Header';
import { IId, optionIdentificationType } from './types';

export default function Other() {
  const router = useRouter();

  const { theme } = useTheme();
  const { clientSelected } = useClients();

  const id = useMemo((): IId => {
    const otherDetails = clientSelected?.individualMetadata;
    return {
      identificationType: otherDetails?.identificationType ?? '',
      identificationNumber: otherDetails?.identificationNumber ?? '',
    };
  }, [clientSelected?.individualMetadata]);

  return (
    <>
      <HeaderClientsDetails />
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
            label="Identification type"
            value={
              optionIdentificationType.find(
                (item) => item.value === id.identificationType
              )?.label ?? ''
            }
          />
          <LabelAndValue
            label="Identification number"
            value={id.identificationNumber}
          />
        </Column>
        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          leftIcon="pen-2"
          roundness="rounded"
          onClick={() => router.push('id/edit')}
        />
      </Column>
    </>
  );
}
