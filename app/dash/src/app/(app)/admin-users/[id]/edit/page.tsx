'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalResult from '@/components/ModalResult';

import { IUserDetails } from '@/models/users';

import { useNotification } from '@/context/Notification';

import { useUsers } from '@/store/useUsers';
import { Button, Column, Icon, Row, Text } from '@cdaxfx/ui';
import { Modal } from 'antd';

import {
  ISuperAdminPayload,
  SuperAdminForm,
} from '../../components/SuperAdminForm';
import { Container } from '../styles';

export default function EditSuperAdminPage() {
  const { id } = useParams();
  const router = useRouter();

  const { onShowNotification } = useNotification();
  const { updateUser, getUserById, loading, errors } = useUsers();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState({} as IUserDetails);

  const [payload, setPayload] = useState<ISuperAdminPayload>(
    {} as ISuperAdminPayload
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const getUserData = useCallback(async () => {
    await getUserById(id as string)
      .then((data) => {
        setSelectedUser(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getUserById, id]);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    loading.updateUser || loading.getUserById
      ? setIsLoading(true)
      : setIsLoading(false);
  }, [loading]);

  const handleUpdateUser = useCallback(
    async (data: ISuperAdminPayload) => {
      let payload = {};
      if (!data.password || !data.confirmPassword) {
        payload = {
          username: data.email,
          firstname: data.firstName,
          lastname: data.lastName,
          phone: data.phoneNumber,
          country: data.country,
        };
      } else {
        payload = {
          username: data?.email,
          firstname: data.firstName,
          lastname: data.lastName,
          phone: data.phoneNumber,
          password: data.password,
          country: data.country,
          confirmPassword: data.confirmPassword,
        };
      }
      setConfirmModalOpen(false);

      await updateUser({ id: id, ...payload })
        .then(() => {
          setResultModalOpen(true);
        })
        .catch((err) =>
          onShowNotification({
            type: 'ERROR',
            description: '',
            message: err?.message ?? 'a',
          })
        );
    },
    [updateUser, id]
  );

  useEffect(() => {
    if (!id || !errors.updateUser) return;
    onShowNotification({
      type: 'ERROR',
      description: 'Error on updating user',
      message: errors.updateUser,
    });
  }, [errors.updateUser, onShowNotification, id]);

  return (
    <>
      <Container>
        <Column>
          <BackButton>Edit Team Member</BackButton>
          <Row align="center" width="100%" margin="lg">
            {isLoading ? (
              <Column
                height="400px"
                width="100%"
                align="center"
                justify="center"
              >
                <Loading />
              </Column>
            ) : (
              <SuperAdminForm
                selectedUser={selectedUser}
                onSubmit={(data) => {
                  setPayload(data);
                  setConfirmModalOpen(true);
                }}
              />
            )}
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
              onClick={() => handleUpdateUser(payload)}
            />
          </Row>
        }
      >
        <Column gap="sm" padding="md">
          <Row gap="sm">
            <Icon variant="exclamation-circle" />
            <Text variant="interactive_md_bold">
              {`Save changes to ${selectedUser.firstname} ${selectedUser.lastname}?`}
            </Text>
          </Row>
        </Column>
      </Modal>

      <ModalResult
        type="SUCCESS"
        isVisible={resultModalOpen}
        onCancel={() => {
          setResultModalOpen(false);
          router.push(`/admin-users/${id as string}`);
        }}
        title={'User profile updated successfully.'}
      />
    </>
  );
}
