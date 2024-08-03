'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Loading } from '@/components/Loading';

import { IUserDetails } from '@/models/users';

import { UserDetailsCard } from '@/app/(app)/users/components/UserDetailsCard';
import { useClients } from '@/store/useClient';
import { useUsers } from '@/store/useUsers';
import { Button, Column, Text } from '@luxbank/ui';

export default function LinkedUserDetails() {
  const router = useRouter();
  const params = useParams();

  const { linked_user_id } = params;
  const { getUserById, loading } = useUsers();
  const { clientSelected } = useClients();

  const [selectedUser, setSelectedUser] = useState({} as IUserDetails);

  const id = useMemo(() => clientSelected?.uuid ?? '', [clientSelected]);

  const getUserInfo = async () => {
    await getUserById(linked_user_id as string, {
      clientId: id as string,
    }).then((data) => {
      setSelectedUser(data);
    });
  };
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linked_user_id, setSelectedUser]);

  return (
    <Column width="100%" gap="sm">
      <Text
        variant="headline_regular"
        style={{ marginLeft: 24, marginBottom: 24 }}
      >
        User details
      </Text>
      {loading.getUserById ? (
        <Column width="100%" align="center" justify="center" height="400px">
          <Loading />
        </Column>
      ) : (
        <Column width="100%" align="center" justify="center" gap="sm">
          <UserDetailsCard
            email={selectedUser?.email}
            name={`${selectedUser?.firstname} ${selectedUser?.lastname}`}
            phone={selectedUser?.phone}
            role={selectedUser?.role}
            country={selectedUser?.country}
          />

          <Button
            text="Edit "
            leftIcon="pen-2"
            roundness="rounded"
            onClick={() =>
              router.push(
                `/clients/${id}/individual/linked-users/${linked_user_id}/edit`
              )
            }
          />
        </Column>
      )}
    </Column>
  );
}
