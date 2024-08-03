'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Loading } from '@/components/Loading';

import { IUserDetails } from '@/models/users';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { IUpdateLinkedUserPayload } from '@/store/useClient/types';
import { useUsers } from '@/store/useUsers';
import { Column, Text } from '@cdaxfx/ui';

import {
  ILinkedUserForm,
  LinkedUserFormComponent,
} from '../../../../components/LinkedUserForm';
import { Container } from './styles';

export default function PersonalDetailsEdit() {
  const params = useParams();
  const { linked_user_id } = params;

  const router = useRouter();

  const { onShowMessage } = useMessages();
  const { getUserById } = useUsers();

  const { updateLinkedUser, loading, getClientsInfo, clientSelected } =
    useClients();

  const id = useMemo(() => clientSelected?.uuid ?? '', [clientSelected]);

  const [selectedUser, setSelectedUser] = useState({} as IUserDetails);
  const [isLoading, setIsLoading] = useState(false);

  const getLinkedUser = useCallback(async () => {
    setIsLoading(true);
    await getUserById(linked_user_id as string, { clientId: id as string })
      .then((data) => {
        setSelectedUser(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserById, id, linked_user_id]);

  useEffect(() => {
    getLinkedUser();
  }, [getLinkedUser]);

  const handleSubmit = async (values: ILinkedUserForm) => {
    const payload: IUpdateLinkedUserPayload = {
      firstname: values.firstName,
      lastname: values.lastName,
      email: values.email,
      password: values.password,
      clientId: id as string,
      mobileNumber: values.phoneNumber,
      role: values.role,
      uuid: selectedUser?.id as string,
      linked_user_uuid: linked_user_id as string,
      country: values.country,
    };

    await updateLinkedUser(payload).then(() => {
      onShowMessage({
        isVisible: true,
        type: 'message',
        title: `User ${values.email} updated successfully.`,
        description: '',
        status: 'success',
      });
      getClientsInfo(id as string);

      router.back();
    });
  };

  return (
    <Container>
      <Text variant="headline_regular" style={{ marginBottom: 24 }}>
        Edit user
      </Text>
      <Column width="100%" justify="center" align="center">
        {isLoading || loading.updateLinkedUser ? (
          <Column width="100%" height="400px" align="center" justify="center">
            <Loading />
          </Column>
        ) : (
          <LinkedUserFormComponent
            data={selectedUser}
            onSubmit={handleSubmit}
          />
        )}
      </Column>
    </Container>
  );
}
