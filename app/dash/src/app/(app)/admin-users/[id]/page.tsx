'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalResult from '@/components/ModalResult';

import { IUserDetails } from '@/models/users';

import { useNotification } from '@/context/Notification';

import { useUsers } from '@/store/useUsers';
import { Button, Column, Icon, Row, Text } from '@luxbank/ui';
import { Modal } from 'antd';

import { UserDetailsCard } from '../../users/components/UserDetailsCard';
import { Container } from './styles';

interface IUserAdminProps {
  params: {
    id: string;
  };
}

export default function UserAdmin({ params }: IUserAdminProps) {
  const router = useRouter();
  const { restoreUser, archiveUser, getUserById, errors } = useUsers();
  const { onShowNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserDetails>(
    {} as IUserDetails
  );

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const getUserDetails = async () => {
    setIsLoading(true);
    await getUserById(params.id)
      .then((data) => {
        setSelectedUser(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!params.id) return;
    getUserDetails();
  }, [params, setSelectedUser]);

  useEffect(() => {
    if (!errors.getUserById) return;
    onShowNotification({
      type: 'ERROR',
      message: 'Error loading user details',
      description: errors.getUserById,
    });
  }, [errors, onShowNotification]);

  const handleArchiveUser = async () => {
    setConfirmModalOpen(false);
    await archiveUser(params.id)
      .then(() => {
        setResultModalOpen(true);
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error archiving user',
          description: err.message,
        });
      });
  };

  const handleRestoreUser = async () => {
    await restoreUser(params.id)
      .then(() => {
        setResultModalOpen(true);
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error restoring user',
          description: err.message,
        });
      });
  };

  return (
    <>
      <Container>
        <Column>
          <Row justify="space-between" align="center" width="100%">
            <BackButton>Team Member Details</BackButton>
            {selectedUser && !isLoading && (
              <Button
                variant="tertiary"
                leftIcon={
                  selectedUser?.status === 'archived' ? 'restart' : 'archive-up'
                }
                text={
                  selectedUser?.status === 'archived'
                    ? 'Restore User'
                    : 'Archive User'
                }
                onClick={() => setConfirmModalOpen(true)}
              />
            )}
          </Row>
          <Row justify="center" width="100%">
            <Column gap="sm" align="center">
              {isLoading ? (
                <Column height="400px" justify="center" align="center">
                  <Loading />
                </Column>
              ) : (
                <>
                  <UserDetailsCard
                    name={`${selectedUser?.firstname} ${selectedUser?.lastname}`}
                    email={selectedUser.email}
                    phone={selectedUser.phone}
                    status={selectedUser.status}
                    country={selectedUser?.country}
                  />
                  {selectedUser?.status !== 'archived' && (
                    <Button
                      text="Edit "
                      leftIcon="pen-2"
                      roundness="rounded"
                      onClick={() =>
                        router.push(`/admin-users/${params.id}/edit`)
                      }
                    />
                  )}
                </>
              )}
            </Column>
          </Row>
        </Column>
      </Container>

      <Modal
        open={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        centered
        footer={
          <Row gap="sm" justify="flex-end">
            <Button
              text="No"
              roundness="rounded"
              variant="secondary"
              size="small"
              onClick={() => setConfirmModalOpen(false)}
            />
            <Button
              text="Yes"
              roundness="rounded"
              variant="primary"
              size="small"
              onClick={() => {
                setConfirmModalOpen(false);
                if (selectedUser?.status === 'archived') {
                  handleRestoreUser();
                  return;
                }
                handleArchiveUser();
              }}
            />
          </Row>
        }
      >
        <Column gap="sm" padding="md">
          <Row gap="sm">
            <Icon variant="exclamation-circle" />
            <Text variant="interactive_md_bold">
              {`Are you sure you want to ${
                selectedUser?.status === 'archived' ? 'restore' : 'archive'
              } the user ${selectedUser.firstname} ${selectedUser.lastname}?`}
            </Text>
          </Row>
        </Column>
      </Modal>

      <ModalResult
        isVisible={resultModalOpen}
        type="SUCCESS"
        title={`User ${selectedUser?.firstname} ${selectedUser?.lastname} ${
          selectedUser?.status === 'archived' ? 'restored' : 'archived'
        } successfully.`}
        onCancel={() => {
          setResultModalOpen(false);
          if (selectedUser?.status !== 'archived') router.push(`/admin-users/`);
          else getUserDetails();
        }}
      />
    </>
  );
}
