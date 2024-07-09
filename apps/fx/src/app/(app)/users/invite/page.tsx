'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalResult from '@/components/ModalResult';

import { useNotification } from '@/context/Notification';

import { useUsers } from '@/store/useUsers';
import { Button, Column, Row } from '@cdaxfx/ui';

import { UserDetailsCard } from '../components/UserDetailsCard';
import { UserForm } from '../components/UserForm';
import { Container } from '../styles';

interface IInvitePayload {
  firstname: string;
  lastname: string;
  mobileNumber: string;
  email: string;
  userRole: string;
  country: string;
}

export default function InviteUser() {
  const router = useRouter();
  const { inviteUser, loading, errors } = useUsers();
  const { onShowNotification } = useNotification();

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [userDetails, setUserDetails] = useState<IInvitePayload>(
    {} as IInvitePayload
  );

  const handleInvite = async (data: any) => {
    const inviteData: IInvitePayload = {
      firstname: data.firstName,
      lastname: data.lastName,
      mobileNumber: data.phoneNumber,
      email: data.email,
      userRole: data.role,
      country: data.country,
    };
    await inviteUser(inviteData)
      .then(() => {
        setResultModalOpen(true);
        setUserDetails(inviteData);
      })
      .catch(() => {
        onShowNotification({
          type: 'ERROR',
          message: 'Something went wrong',
          description: errors.inviteUser,
        });
        router.push('/users/invite');
      });
  };

  useEffect(() => {
    if (errors.inviteUser) {
      onShowNotification({
        type: 'ERROR',
        message: 'Something went wrong',
        description: errors.inviteUser,
      });
    }
  }, [errors.inviteUser, onShowNotification]);

  return (
    <>
      <Container>
        <Column>
          <BackButton>Invite User</BackButton>
          {loading.inviteUser ? (
            <Column width="100%" height="400px" justify="center" align="center">
              <Loading />
            </Column>
          ) : (
            <Row width="100%" justify="center">
              {showDetailsCard ? (
                <Column gap="sm">
                  <UserDetailsCard
                    name={`${userDetails?.firstname} ${userDetails?.lastname}`}
                    email={userDetails?.email}
                    phone={userDetails?.mobileNumber}
                    country={userDetails?.country}
                    role={userDetails?.userRole}
                  />
                  <Row width="100%" justify="center">
                    <Button
                      roundness="rounded"
                      text="Invite another user"
                      onClick={() => {
                        setUserDetails({} as IInvitePayload);
                        setShowDetailsCard(false);
                      }}
                    />
                  </Row>
                </Column>
              ) : (
                <UserForm onSubmit={handleInvite} />
              )}
            </Row>
          )}
        </Column>
      </Container>
      <ModalResult
        type="SUCCESS"
        title="User added succesfully."
        subtitle="An email has been dispatched, and shortly he will receive a message with the link for their initial access."
        isVisible={resultModalOpen}
        onCancel={() => {
          setResultModalOpen(false);
          setShowDetailsCard(true);
        }}
      />
    </>
  );
}
