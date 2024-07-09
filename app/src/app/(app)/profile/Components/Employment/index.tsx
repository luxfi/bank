import { useMemo, useState } from 'react';

import Button from '@/components/Button';

import { useAuth } from '@/store/useAuth';

import { defaultTheme } from '@/styles/themes/default';

import DataGrid from '../DataGrid';
import ModalEmploymentDetails from '../Modals/EmploymentDetails';

export default function EmploymentDetail() {
  const { currentUser } = useAuth();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  const list = useMemo(
    () => [
      {
        title: 'Occupation',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.occupation ??
          '',
      },
      {
        title: 'Employer Name',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.employerName ?? '',
      },
      {
        title: 'Employer Address 1',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.employerAddress1 ?? '',
      },
      {
        title: 'Employer Address 2',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.employerAddress2 ?? '',
      },
      {
        title: 'Employer Address 3',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.employerAddress3 ?? '',
      },
    ],
    [currentUser]
  );

  return (
    <>
      <DataGrid
        title="Employment Details"
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

      <ModalEmploymentDetails
        onCloseModal={() => setModalIsVisible(false)}
        openModal={modalIsVisible}
      />
    </>
  );
}
