'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useClients } from '@/store/useClient';
import { Column } from '@luxbank/ui';

import DataChangeApproval from '../../components/DataChangeApproval';
import { HeaderClientsDetails } from '../../components/Header';
import { AddressTable } from './components/Address';
import { IAddress } from './types';

export default function Address() {
  const route = useRouter();
  const { clientSelected } = useClients();

  const address = useMemo((): IAddress => {
    const addressDetails = clientSelected?.individualMetadata;
    return {
      addressLine1: addressDetails?.addressLine1 ?? '',
      addressLine2: addressDetails?.addressLine2 ?? '',
      city: addressDetails?.city ?? '',
      country: addressDetails?.country ?? '',
      postcode: addressDetails?.postcode ?? '',
      state: addressDetails?.state ?? '',

      previousAddressLine1: addressDetails?.previousAddressLine1 ?? '',
      previousAddressLine2: addressDetails?.previousAddressLine2 ?? '',
      previousCity: addressDetails?.previousCity ?? '',
      previousPostcode: addressDetails?.previousPostcode ?? '',
      previousCountry: addressDetails?.previousCountry ?? '',
      previousState: addressDetails?.previousState ?? '',
    };
  }, [clientSelected?.individualMetadata]);

  return (
    <>
      <HeaderClientsDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <DataChangeApproval
          session="address"
          clientId={clientSelected?.uuid as string}
        />

        <AddressTable
          addressLine1={address.addressLine1}
          addressLine2={address.addressLine2}
          city={address.city}
          country={address.country}
          postcode={address.postcode}
          state={address.state}
          previousAddressLine1={address.previousAddressLine1}
          previousAddressLine2={address.previousAddressLine2}
          previousCity={address.previousCity}
          previousCountry={address.previousCountry}
          previousPostcode={address.previousPostcode}
          previousState={address.previousState}
          onEdit={() => route.push(`address/edit`)}
        />
      </Column>
    </>
  );
}
