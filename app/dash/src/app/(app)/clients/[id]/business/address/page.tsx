'use client';

import { useRouter } from 'next/navigation';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { Button, Column, useTheme } from '@luxbank/ui';

import DataChangeApproval from '../../components/DataChangeApproval';
import { HeaderClientsDetails } from '../../components/Header';

export default function Address() {
  const route = useRouter();
  const { theme } = useTheme();

  const { clientSelected } = useClients();
  const company = clientSelected?.businessMetadata;

  return (
    <>
      <HeaderClientsDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <DataChangeApproval
          session="address"
          clientId={clientSelected?.uuid as string}
        />

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
            label="Address line 1"
            value={company?.address1 ?? ''}
          />
          <LabelAndValue
            label="Address line 2"
            value={company?.address2 ?? ''}
          />
          <LabelAndValue
            label="Post code"
            value={company?.registeredOffice1_postcode ?? ''}
          />
          <LabelAndValue
            label="City"
            value={company?.registeredOffice1_city ?? ''}
          />
          <LabelAndValue
            label="State"
            value={company?.registeredOffice1_state ?? ''}
          />
          <LabelAndValue
            label="Registered office 1"
            value={company?.registeredOffice1 ?? ''}
          />
          <LabelAndValue
            label="Registered office 2"
            value={company?.registeredOffice2 ?? ''}
          />
          <LabelAndValue
            label="Principal place of business"
            value={company?.principalPlace ?? ''}
          />
          <LabelAndValue
            label="Mailing address"
            value={company?.mailingAddress ?? ''}
          />

          <LabelAndValue
            label="Previous Registered Office 1"
            value={company?.previousOffice1 ?? ''}
          />

          <LabelAndValue
            label="Previous Registered Office 2"
            value={company?.previousOffice2 ?? ''}
          />

          <LabelAndValue
            label="Previous Registered Office 3"
            value={company?.previousOffice3 ?? ''}
          />
        </Column>

        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          leftIcon="pen-2"
          roundness="rounded"
          onClick={() => route.push('address/edit')}
        />
      </Column>
    </>
  );
}
