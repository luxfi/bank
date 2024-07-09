'use client';

import { useRouter } from 'next/navigation';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { Button, Column, useTheme } from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';

export default function ExpectedActivity() {
  const route = useRouter();
  const { theme } = useTheme();
  const { clientSelected } = useClients();

  const company = clientSelected?.businessMetadata;

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
            label="Expected volume"
            value={company?.expectedVolume}
          />
          <LabelAndValue
            label="Expected value"
            value={company?.expectedActivity}
          />
        </Column>

        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          leftIcon="pen-2"
          roundness="rounded"
          onClick={() => route.push('expected-activity/edit')}
        />
      </Column>
    </>
  );
}
