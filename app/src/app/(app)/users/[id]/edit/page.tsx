'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalResult from '@/components/ModalResult';

import { IUserDetails } from '@/models/users';

import { useNotification } from '@/context/Notification';

import { useUsers } from '@/store/useUsers';
import { Button, Column, Icon, Row, Text } from '@cdaxfx/ui';
import { Modal } from 'antd';

import { UserForm } from '../../components/UserForm';
import { Container } from '../../styles';

export default function EditUser() {
  const { id } = useParams();
  const router = useRouter();
  const { onShowNotification } = useNotification();
  const { getUserById, updateUser, loading, errors } = useUsers();

  const [selectedUser, setSelectedUser] = useState({} as IUserDetails);
  const [newUserData, setNewUserData] = useState({});
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [confirmUpdateUserModalOpen, setConfirmUpdateUserModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const getUserData = async () => {
    await getUserById(id as string)
      .then((data) => {
        setSelectedUser(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateUser = async (data: any) => {
    setConfirmUpdateUserModalOpen(false);
    const updatePayload = {
      username: data.email,
      firstname: data.firstName,
      lastname: data.lastName,
      phone: data.phoneNumber,
      country: data.country,
      role: data.role,
    };

    await updateUser({ ...updatePayload, id }).then(() => {
      setResultModalOpen(true);
    });
  };

  useEffect(() => {
    if (errors.updateUser || errors.getUserById) {
      onShowNotification({
        type: 'ERROR',
        message: 'Something went wrong',
        description: errors.updateUser || errors.getUserById,
      });
    }
  }, [errors.updateUser, errors.getUserById, onShowNotification]);

  useEffect(() => {
    loading.updateUser || loading.getUserById
      ? setIsLoading(true)
      : setIsLoading(false);
  }, [loading]);

  return (
    <>
      <Container>
        <Column>
          <BackButton>Edit User</BackButton>
          {isLoading ? (
            <Column width="100%" justify="center" align="center" height="400px">
              <Loading />
            </Column>
          ) : (
            <Row width="100%" justify="center">
              <UserForm
                data={{
                  firstName: selectedUser?.firstname,
                  lastName: selectedUser?.lastname,
                  email: selectedUser?.email,
                  phoneNumber: selectedUser?.phone,
                  country: selectedUser?.country,
                  role: selectedUser?.role,
                }}
                onSubmit={(data) => {
                  setConfirmUpdateUserModalOpen(true);
                  setNewUserData(data);
                }}
              />
            </Row>
          )}
        </Column>
      </Container>
      <Modal
        open={confirmUpdateUserModalOpen}
        onCancel={() => setConfirmUpdateUserModalOpen(false)}
        centered
        footer={
          <Row gap="sm" justify="flex-end">
            <Button
              text="No"
              roundness="rounded"
              variant="secondary"
              size="small"
              onClick={() => setConfirmUpdateUserModalOpen(false)}
            />
            <Button
              text="Yes"
              roundness="rounded"
              variant="primary"
              size="small"
              onClick={() => handleUpdateUser(newUserData)}
            />
          </Row>
        }
      >
        <Column gap="sm" padding="md">
          <Row gap="sm" align="center">
            <Icon variant="exclamation-circle" />
            <Text variant="interactive_md_bold">
              {`Save changes to ${selectedUser.firstname} ${selectedUser.lastname}?`}
            </Text>
          </Row>
        </Column>
      </Modal>
      <ModalResult
        isVisible={resultModalOpen}
        type="SUCCESS"
        title="User profile updated successfully."
        onCancel={() => {
          setResultModalOpen(false);
          router.push(`/users/${id as string}`);
        }}
      />
    </>
  );
}
