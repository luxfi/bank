'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useAuth } from '@/store/useAuth';
import { Column } from '@luxbank/ui';

import DataChangeApproval from '../../../clients/[id]/components/DataChangeApproval';
import { HeaderDetails } from '../../components/Header';
import { AddressTable } from './components/Address';
import { IAddress } from './types';

export default function Address() {
  const route = useRouter();
  const { currentUser } = useAuth();

  const address = useMemo((): IAddress => {
    const addressDetails =
      currentUser?.currentClient.account.individualMetadata;
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
      previousCountry: addressDetails?.previousCountry ?? '',
      previousPostcode: addressDetails?.previousPostcode ?? '',
      previousState: addressDetails?.previousState ?? '',
    };
  }, [currentUser?.currentClient.account.individualMetadata]);

  return (
    <>
      <HeaderDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <DataChangeApproval
          session="address"
          clientId={currentUser?.currentClient.uuid as string}
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
