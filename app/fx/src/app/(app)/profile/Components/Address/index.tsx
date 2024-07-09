import { useMemo, useState } from 'react';

import Button from '@/components/Button';

import { useAuth } from '@/store/useAuth';

import { defaultTheme } from '@/styles/themes/default';

import DataGrid from '../DataGrid';
import ModalAddress from '../Modals/Address';

export default function Address() {
  const { currentUser } = useAuth();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  const list = useMemo(
    () => [
      {
        title: 'Address Line 1',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.addressLine1 ?? '',
      },
      {
        title: 'Address Line 2',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.addressLine2 ?? '',
      },
      {
        title: 'City',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.city ?? '',
      },
      {
        title: 'Zip Code / Post Code',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.postcode ??
          '',
      },
      {
        title: 'State / Country',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.state ?? '',
      },
      {
        title: 'Country',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.country ??
          '',
      },
      {
        title: 'Previous Address Line 1',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.previousAddressLine1 ?? '',
      },
      {
        title: 'Previous Address Line 2',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.previousAddressLine2 ?? '',
      },
      {
        title: 'Previous City',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.previousCity ?? '',
      },
      {
        title: 'Previous Zip Code / Post Code',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.previousPostcode ?? '',
      },
      {
        title: 'Previous State  / Country',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.previousCountry ?? '',
      },
      {
        title: 'Previous Country',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.previousCountry ?? '',
      },
    ],
    [currentUser]
  );

  return (
    <>
      <DataGrid
        title="Address"
        headerAction={
          <Button
            onClick={() => setModalIsVisible(true)}
            size="small"
            color={defaultTheme.colors.secondary}
            style={{ width: 100 }}
          >
            Edit
          </Button>
        }
        dataSource={list}
      />
      <ModalAddress
        openModal={modalIsVisible}
        onCloseModal={() => setModalIsVisible(false)}
      />
    </>
  );
}
