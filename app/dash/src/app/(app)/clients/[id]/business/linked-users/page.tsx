'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import Table from '@/components/Table';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { ILinkedUser } from '@/store/useClient/types';
import { Button, Column, Icon, Row, Text, useTheme } from '@luxbank/ui';

import { HeaderClientsDetails } from '../../components/Header';
import { ActionGridButton } from './styles';
import { columns } from './types';

export default function LinkedUsers() {
  const router = useRouter();
  const { clientSelected, removeLinkedUser, loading, getClientsInfo } =
    useClients();

  const { id: urlId } = useParams();

  const id = useMemo(() => clientSelected?.uuid ?? '', [clientSelected]);

  const { theme } = useTheme();
  const { onShowMessage } = useMessages();

  const [linkedUsers, setLinkedUsers] = useState<ILinkedUser[]>([]);

  useEffect(() => {
    setLinkedUsers(clientSelected?.linkedUsers || []);
  }, [clientSelected]);

  const handleRemoveLink = async (user: ILinkedUser) => {
    const clientId = id as string;
    await removeLinkedUser(user.uuid, clientId)
      .then(() => {
        onShowMessage({
          type: 'message',
          status: 'success',
          title: `The user ${user.firstname} ${user.lastname} has been removed.`,
          description: '',
          isVisible: true,
        });
        getClientsInfo(id as string);
      })
      .catch((error) => {
        onShowMessage({
          type: 'message',
          status: 'fail',
          title: `Error removing the user ${user.firstname} ${user.lastname}.`,
          description: error.message,
          isVisible: true,
        });
      });
  };

  return (
    <>
      <HeaderClientsDetails />
      <Column style={{ paddingInline: 24, marginTop: 40, marginBottom: 24 }}>
        <Row width="100%" align="center" justify="space-between">
          <Text variant="headline_regular">Linked Users</Text>
          <Button
            onClick={() => router.push('linked-users/new')}
            roundness="rounded"
            leftIcon="user-plus"
            text="Add user"
          />
        </Row>
      </Column>
      <Table
        loading={loading.removeLinkedUser}
        columns={columns}
        dataSource={linkedUsers || []}
        actionsContainer={(value: ILinkedUser) => {
          return (
            <Row gap="lg">
              <ActionGridButton
                onClick={() => {
                  router.push(
                    `/clients/${urlId}/business/linked-users/${value.uuid}`
                  );
                }}
              >
                <Text variant="body_sm_semibold">Details</Text>
                <Icon
                  size="sm"
                  variant="notebook-1"
                  color={
                    theme.backgroundColor.interactive['primary-default'].value
                  }
                />
              </ActionGridButton>

              <ActionGridButton
                onClick={() =>
                  onShowMessage({
                    isVisible: true,
                    title: `Are you sure you want to remove user ${value?.firstname} ${value?.lastname}?`,
                    type: 'question',
                    onConfirm: () => handleRemoveLink(value),
                    textButtonCancel: 'Cancel',
                    textButtonConfirm: 'Confirm',
                  })
                }
              >
                <Text variant="body_sm_semibold">Remove</Text>
                <Icon
                  size="sm"
                  variant="trash-bin-minimalistic"
                  color={theme.textColor.feedback['icon-negative'].value}
                />
              </ActionGridButton>
            </Row>
          );
        }}
      />
    </>
  );
}
