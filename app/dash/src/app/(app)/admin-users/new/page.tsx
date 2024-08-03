'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalResult from '@/components/ModalResult';

import { useNotification } from '@/context/Notification';

import { useUsers } from '@/store/useUsers';
import { Column, Row } from '@luxbank/ui';

import { SuperAdminForm } from '../components/SuperAdminForm';
import { Container } from '../styles';
import { IInviteSuperAdminPayload } from '../types';

export default function NewUser() {
  const router = useRouter();
  const { addSuperAdmin, loading, errors } = useUsers();
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const { onShowNotification } = useNotification();

  const handleInviteUser = async (data: IInviteSuperAdminPayload) => {
    await addSuperAdmin(data).then(() => {
      setResultModalOpen(true);
    });
  };

  useEffect(() => {
    if (!errors.addSuperAdmin) return;
    onShowNotification({
      type: 'ERROR',
      message: 'Error inviting user',
      description: errors.addSuperAdmin,
    });
  }, [errors, onShowNotification]);

  return (
    <>
      <Container>
        <Column>
          <BackButton>Invite a CDAX Member</BackButton>
          <Row align="center" width="100%" margin="lg">
            {loading.addSuperAdmin ? (
              <Column
                width="100%"
                height="400px"
                align="center"
                justify="center"
              >
                <Loading />
              </Column>
            ) : (
              <SuperAdminForm
                onSubmit={(data) => {
                  handleInviteUser({
                    firstname: data.firstName,
                    lastname: data.lastName,
                    email: data.email,
                    password: data.password,
                    phone: data.phoneNumber,
                    country: data.country,
                  });
                }}
              />
            )}
          </Row>
        </Column>
      </Container>

      <ModalResult
        isVisible={resultModalOpen}
        type="SUCCESS"
        title="User added succesfully."
        subtitle="An email has been dispatched, and shortly he will receive a message with the link for their initial access."
        onCancel={() => {
          setResultModalOpen(false);
          router.push(`/admin-users/`);
        }}
      />
    </>
  );
}
