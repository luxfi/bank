'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { Button, Column, useTheme } from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';
import { IOther } from './types';

export default function Other() {
  const router = useRouter();

  const { theme } = useTheme();
  const { clientSelected } = useClients();

  const other = useMemo((): IOther => {
    const otherDetails = clientSelected?.individualMetadata;
    return {
      highProfilePosition: otherDetails?.highProfilePosition ?? '',
      publicPosition: otherDetails?.publicPosition ?? '',
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
            label="Public position held"
            value={other.publicPosition}
          />
          <LabelAndValue
            label="High profile position held"
            value={other.highProfilePosition}
          />
        </Column>

        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          leftIcon="pen-2"
          roundness="rounded"
          onClick={() => router.push('other/edit')}
        />
      </Column>
    </>
  );
}
