import { useMemo, useState } from 'react';

import Button from '@/components/Button';

import { useAuth } from '@/store/useAuth';

import { defaultTheme } from '@/styles/themes/default';

import DataGrid from '../DataGrid';
import ModalOther from '../Modals/Other';

export default function Other() {
  const { currentUser } = useAuth();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  const list = useMemo(
    () => [
      {
        title: 'Public positions held',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.publicPosition ?? '',
      },
      {
        title: 'High Profile Held',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.highProfilePosition ?? '',
      },
    ],
    [currentUser]
  );

  return (
    <>
      <DataGrid
        title="Other"
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

      <ModalOther
        openModal={modalIsVisible}
        onCloseModal={() => setModalIsVisible(false)}
      />
    </>
  );
}
