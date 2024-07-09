'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalResult from '@/components/ModalResult';
import { Tooltip } from '@/components/Tooltip';

import { UserRole } from '@/models/auth';
import { IUserDetails } from '@/models/users';

import { useMessages } from '@/context/Messages';
import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { useUsers } from '@/store/useUsers';
import { Button, Column, Icon, Row, Text } from '@cdaxfx/ui';
import { Modal } from 'antd';

import { UserDetailsCard } from '../components/UserDetailsCard';
import { Container } from '../styles';

export default function UserDetails() {
  const params = useParams();
  const { currentUser } = useAuth();
  const id = params?.id;
  const { onShowNotification } = useNotification();
  const router = useRouter();
  const { onShowMessage } = useMessages();

  const { getUserById, loading, errors, archiveUser } = useUsers();

  const [selectedUser, setSelectedUser] = useState({} as IUserDetails);

  const [archiveUserModalOpen, setArchiveUserModalOpen] = useState(false);
  const [resultModalInfo, setResultModalInfo] = useState({
    title: '',
    subtitle: '',
    open: false,
  });

  const getUserDetails = async () => {
    await getUserById(id as string).then((data) => {
      setSelectedUser(data);
    });
  };

  useEffect(() => {
    if (errors.getUserById) {
      onShowNotification({
        type: 'ERROR',
        message: 'Error loading user details',
        description: errors.getUserById,
      });
    }
  }, [errors.getUserById, onShowNotification]);

  const handleArchiveUser = async () => {
    setArchiveUserModalOpen(false);
    try {
      await archiveUser(id as string);
      setResultModalInfo({
        title: `User ${selectedUser.firstname} ${selectedUser.lastname} removed succesfully.`,
        subtitle:
          'Note: To restore a user, please contact the CDAX back office.',
        open: true,
      });
    } catch (error) {
      onShowMessage({
        type: 'message',
        title: 'Error removing user',
        description: (error as any)?.message ?? '',
        isVisible: true,
        status: 'fail',
      });
    }
  };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Column>
        <Row justify="space-between" width="100%" align="center">
          <BackButton>User details</BackButton>
          {selectedUser.status !== 'archived' ? (
            <Button
              text="Remove User"
              variant="tertiary"
              leftIcon="cross-circle"
              roundness="rounded"
              onClick={() => setArchiveUserModalOpen(true)}
              disabled={
                currentUser?.role !== UserRole.SuperAdmin &&
                currentUser?.role !== UserRole.AdminUser
              }
            />
          ) : (
            <Row gap="xxs" align="center" style={{ marginRight: '24px' }}>
              <Tooltip
                placement="bottomLeft"
                title="Note: To restore a user, please contact the CDAX back office."
              >
                <>
                  <Icon variant="exclamation-circle" size="sm" />
                </>
              </Tooltip>
              <Text variant="body_md_regular">User archived</Text>
            </Row>
          )}
        </Row>
      </Column>
      <Row justify="center">
        {loading.getUserById || loading.archiveUser || loading.restoreUser ? (
          <Column width="640px" justify="center" align="center" height="300px">
            <Loading />
          </Column>
        ) : (
          <Column gap="sm">
            <UserDetailsCard
              name={`${selectedUser?.firstname} ${selectedUser?.lastname}`}
              email={selectedUser?.email}
              phone={selectedUser?.phone}
              role={selectedUser?.role}
              country={selectedUser?.country}
            />
            <Row justify="center" width="100%">
              {currentUser?.role !== UserRole.ViewerUser && (
                <Button
                  text="Edit "
                  leftIcon="pen-2"
                  roundness="rounded"
                  onClick={() => router.push(`/users/${id}/edit`)}
                />
              )}
            </Row>
          </Column>
        )}
      </Row>
      <Modal
        open={archiveUserModalOpen}
        onCancel={() => setArchiveUserModalOpen(false)}
        centered
        footer={
          <Row gap="sm" justify="flex-end">
            <Button
              text="No"
              roundness="rounded"
              variant="secondary"
              size="small"
              onClick={() => setArchiveUserModalOpen(false)}
            />
            <Button
              text="Yes"
              roundness="rounded"
              variant="primary"
              size="small"
              onClick={() => handleArchiveUser()}
            />
          </Row>
        }
      >
        <Column gap="sm" padding="md">
          <Row gap="sm">
            <Icon variant="exclamation-circle" />
            <Text variant="interactive_md_bold">
              {`Are you sure you want to remove the user ${selectedUser.firstname} ${selectedUser.lastname}?`}
            </Text>
          </Row>
        </Column>
      </Modal>

      <ModalResult
        type="SUCCESS"
        isVisible={resultModalInfo.open}
        onCancel={() => {
          setResultModalInfo({ ...resultModalInfo, open: false });
          resultModalInfo.title.includes('removed') && router.push('/users');
        }}
        title={resultModalInfo.title}
        subtitle={resultModalInfo.subtitle}
      />
    </Container>
  );
}
