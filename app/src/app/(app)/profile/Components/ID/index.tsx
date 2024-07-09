import { useMemo, useState } from 'react';

import Button from '@/components/Button';

import { useAuth } from '@/store/useAuth';

import { defaultTheme } from '@/styles/themes/default';

import DataGrid from '../DataGrid';
import ModalIdentification from '../Modals/Identification';

export default function ID() {
  const { currentUser } = useAuth();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  const list = useMemo(
    () => [
      {
        title: 'Identification Type',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.identificationNumber ?? '',
      },
      {
        title: 'Identification Number',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.identificationType ?? '',
      },
    ],
    [currentUser]
  );

  return (
    <>
      <DataGrid
        title="ID"
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

      <ModalIdentification
        onCloseModal={() => setModalIsVisible(false)}
        openModal={modalIsVisible}
      />
    </>
  );
}
