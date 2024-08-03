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
    const addressDetails = currentUser?.currentClient?.account.businessMetadata;
    return {
      addressLine1: addressDetails?.address1 ?? '',
      addressLine2: addressDetails?.address2 ?? '',
      postcode: addressDetails?.registeredOffice1_postcode ?? '',
      city: addressDetails?.registeredOffice1_city ?? '',
      state: addressDetails?.registeredOffice1_state ?? '',
      country: addressDetails?.countryOfRegistration ?? '',
      registeredOffice1: addressDetails?.registeredOffice1 ?? '',
      registeredOffice2: addressDetails?.registeredOffice2 ?? '',
      principalPlaceOfBusiness: addressDetails?.principalPlace ?? '',
      mailingAddress: addressDetails?.mailingAddress ?? '',
      previousOffice1: addressDetails?.previousOffice1 ?? '',
      previousOffice2: addressDetails?.previousOffice2 ?? '',
      previousOffice3: addressDetails?.previousOffice3 ?? '',
    };
  }, [currentUser?.currentClient?.account.businessMetadata]);

  return (
    <>
      <HeaderDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <DataChangeApproval
          session="address"
          clientId={currentUser?.currentClient?.uuid as string}
        />

        <AddressTable
          addressLine1={address.addressLine1}
          addressLine2={address.addressLine2}
          postcode={address.postcode}
          city={address.city}
          state={address.state}
          country={address.country}
          registeredOffice1={address.registeredOffice1}
          registeredOffice2={address.registeredOffice2}
          principalPlaceOfBusiness={address.principalPlaceOfBusiness}
          mailingAddress={address.mailingAddress}
          previousOffice1={address.previousOffice1}
          previousOffice2={address.previousOffice2}
          previousOffice3={address.previousOffice3}
          onEdit={() => route.push(`address/edit`)}
        />
      </Column>
    </>
  );
}
