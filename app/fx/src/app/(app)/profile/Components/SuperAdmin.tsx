import Link from 'next/link';
import { useState } from 'react';

import Button from '@/components/Button';

import { ICurrentUser } from '@/models/auth';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { FormikConfig } from 'formik';

import { updateUser } from '@/api/user';

import { defaultTheme } from '@/styles/themes/default';

import {
  Container,
  Content,
  ContentItem,
  ContentModal,
  Text,
  Title,
} from '../styled';
import Modal from './Modal';

export default function SuperAdminProfile() {
  const { currentUser } = useAuth();
  const { onShowNotification } = useNotification();

  const [openModal, setOpenModal] = useState(false);

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const onSubmit: FormikConfig<ICurrentUser>['onSubmit'] = async (values) => {
    const { username } = values;

    setOpenModal(false);
    await updateUser({ ...values, email: username })
      .then(() => {
        onShowNotification({
          type: 'SUCCESS',
          message: 'Success',
          description: 'User updated successfully',
        });
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error',
          description: err.message,
        });
      });
  };

  return (
    <Container>
      <Content>
        <ContentItem>
          <Title> Full name: </Title>
          <Text>
            {' '}
            {currentUser?.firstname} {currentUser?.lastname}{' '}
          </Text>
        </ContentItem>
        <ContentItem>
          <Title> Email: </Title>
          <Text> {currentUser?.username}</Text>
        </ContentItem>
        <ContentModal>
          <Button
            onClick={handleModal}
            color={defaultTheme.colors.secondary}
            style={{ width: 160 }}
          >
            Edit profile
          </Button>

          <Link href={'/profile/reset-password'}>
            <Button
              color={defaultTheme.colors.secondary}
              style={{ width: 160 }}
            >
              Reset password
            </Button>
          </Link>
        </ContentModal>
      </Content>

      {currentUser && (
        <Modal
          onSubmit={onSubmit}
          data={currentUser}
          onCloseModal={handleModal}
          openModal={openModal}
        />
      )}
    </Container>
  );
}
