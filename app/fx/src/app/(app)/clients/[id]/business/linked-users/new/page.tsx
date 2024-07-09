'use client';

import { useMemo } from 'react';

import { Loading } from '@/components/Loading';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { ILinkUserPayload } from '@/store/useClient/types';
import { Column, Text } from '@cdaxfx/ui';

import {
  ILinkedUserForm,
  LinkedUserFormComponent,
} from '../../../components/LinkedUserForm';

export default function AddLinkedUser() {
  const { postLinkedUser, loading, getClientsInfo, clientSelected } =
    useClients();
  const { onShowMessage } = useMessages();

  const id = useMemo(() => clientSelected?.uuid ?? '', [clientSelected]);

  const handleSubmit = async (values: ILinkedUserForm) => {
    const payload: ILinkUserPayload = {
      clientId: id as string,
      email: values.email,
      firstname: values.firstName,
      lastname: values.lastName,
      password: values.password,
      confirmPassword: values.confirmPassword,
      role: values.role,
      country: values.country,
      mobileNumber: values.phoneNumber,
    };

    await postLinkedUser(payload).then(() => {
      onShowMessage({
        isVisible: true,
        type: 'message',
        title: `User ${values.firstName} ${values.lastName} added successfully.`,
        description: '',
        status: 'success',
      });
      getClientsInfo(id as string);
    });
  };

  return (
    <Column width="100%" style={{ marginInline: 24 }}>
      <Text variant="headline_regular" style={{ marginBottom: 24 }}>
        Add a new user
      </Text>
      <Column width="100%" justify="center" align="center">
        {loading.postLinkedUser ? (
          <Column width="100%" height="400px" align="center" justify="center">
            <Loading />
          </Column>
        ) : (
          <LinkedUserFormComponent onSubmit={handleSubmit} />
        )}
      </Column>
    </Column>
  );
}
