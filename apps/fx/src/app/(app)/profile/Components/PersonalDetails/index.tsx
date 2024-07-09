import { useMemo, useState } from 'react';

import Button from '@/components/Button';

import { useAuth } from '@/store/useAuth';

import { defaultTheme } from '@/styles/themes/default';

import DataGrid from '../DataGrid';
import ModalPersonalDetails from '../Modals/PersonalDetails';

export default function PersonalDetails() {
  const { currentUser } = useAuth();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  const list = useMemo(
    () => [
      {
        title: 'Title',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.title ?? '',
      },
      {
        title: 'Full Name',
        content:
          `${currentUser?.currentClient?.account?.individualMetadata?.firstname} ${currentUser?.currentClient?.account?.individualMetadata?.lastname}` ??
          '',
      },
      {
        title: 'Former names',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.formerName ??
          '',
      },
      {
        title: 'DOB',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.dateOfBirth?.toString() ??
          '',
      },
      {
        title: 'Place of Birth',
        content:
          currentUser?.currentClient?.account?.individualMetadata
            ?.placeOfBirth ?? '',
      },
      {
        title: 'Email',
        content: currentUser?.username ?? '',
      },
      {
        title: 'Tel No.',
        content: currentUser?.contact?.mobileNumber ?? '',
      },
      {
        title: 'Nationality',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.country ??
          '',
      },
      {
        title: 'Gender',
        content:
          currentUser?.currentClient?.account?.individualMetadata?.gender ?? '',
      },
    ],
    [currentUser]
  );

  return (
    <>
      <DataGrid
        title="Personal Details"
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

      <ModalPersonalDetails
        openModal={modalIsVisible}
        onCloseModal={() => setModalIsVisible(false)}
      />
    </>
  );
}
