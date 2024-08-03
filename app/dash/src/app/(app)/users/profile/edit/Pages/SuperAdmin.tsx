'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import Input from '@/components/Input';
import ModalMessage from '@/components/ModalMessage';
import ModalResult from '@/components/ModalResult';

import { useNotification } from '@/context/Notification';

import { Button, Row, Text } from '@luxbank/ui';
import { useFormik } from 'formik';

import {
  IGetCurrentUserV2Response,
  getCurrentUserV2,
  updateCurrentUserV2,
} from '@/api/user';

import { Container, GrayCard } from '../../../styles';
import { InputAndImageContainer, InputsContainer } from '../styles';
import { IFormSuperAdmin, validationSchemaSuperAdmin } from '../type';

export function SuperAdmin() {
  const router = useRouter();
  const { onShowNotification } = useNotification();

  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalVisible, SetIsSuccessModalVisible] = useState(false);

  const [currentUser, setCurrentUser] =
    useState<IGetCurrentUserV2Response['data']>();

  const getCurrentUser = useCallback(async () => {
    if (currentUser) return;

    const response = await getCurrentUserV2();

    setCurrentUser(response.data);
  }, [currentUser]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const onSubmit = useCallback(
    async (data: IFormSuperAdmin) => {
      try {
        setIsLoading(true);

        await updateCurrentUserV2({
          firstName: data.firstName,
          lastName: data.lastName,
        });

        setModalIsVisible(false);
        SetIsSuccessModalVisible(true);
      } catch (error) {
        setModalIsVisible(false);
        setIsLoading(false);

        onShowNotification({
          type: 'ERROR',
          description: 'Error updating user',
          message: '',
        });
      }
    },
    [onShowNotification]
  );

  const handleModalVisibility = useCallback(() => {
    setModalIsVisible((prev) => !prev);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: currentUser?.firstName ?? '',
      lastName: currentUser?.lastName ?? '',
      email: currentUser?.email ?? '',
    },
    validationSchema: validationSchemaSuperAdmin,
    onSubmit: (data) => onSubmit(data),
  });

  const handleBackToProfile = useCallback(() => {
    SetIsSuccessModalVisible(false);
    router.back();
  }, [router]);

  if (!currentUser) return null;

  return (
    <>
      <Container>
        <BackButton>
          <Text variant="headline_regular">Edit profile</Text>
        </BackButton>

        <div style={{ marginTop: 40, width: 808, alignSelf: 'center' }}>
          <GrayCard style={{ marginBottom: 32 }}>
            <Text variant="body_sm_bold">My details</Text>
          </GrayCard>

          <InputAndImageContainer>
            {/* <UploadImage
              initials={`${currentUser?.firstName?.[0]}${currentUser?.lastName?.[0]}`}
            /> */}

            <InputsContainer>
              <Input
                containerStyle={{ marginBottom: 16 }}
                placeholder="First name"
                label="First name"
                value={formik.values.firstName}
                onChange={formik.handleChange('firstName')}
                error={formik.errors?.firstName}
              />
              <Input
                containerStyle={{ marginBottom: 16 }}
                placeholder="Last name"
                label="Last name"
                value={formik.values.lastName}
                onChange={formik.handleChange('lastName')}
                error={formik.errors?.lastName}
              />
            </InputsContainer>
          </InputAndImageContainer>

          <Input
            disabled
            containerStyle={{ marginBottom: 16 }}
            placeholder="email@example.com"
            label="E-mail"
            value={formik.values.email}
            onChange={formik.handleChange('email')}
            error={formik.errors?.email}
          />

          <Row style={{ gap: 16, justifyContent: 'center', marginTop: 40 }}>
            <Button
              onClick={() => router.back()}
              text="Cancel"
              variant="secondary"
              roundness="rounded"
            />
            <Button
              onClick={handleModalVisibility}
              text="Save Changes"
              disabled={!formik.isValid}
              roundness="rounded"
            />
          </Row>
        </div>
      </Container>

      <ModalMessage
        title="Save changes?"
        description=""
        isVisible={modalIsVisible}
        onConfirm={formik.handleSubmit}
        onCancel={() => setModalIsVisible(false)}
        isLoading={isLoading}
        textButtonCancel="No"
        textButtonConfirm="Yes"
      />

      <ModalResult
        title="User profile updated successfully."
        subtitle=""
        type="SUCCESS"
        isVisible={isSuccessModalVisible}
        onCancel={handleBackToProfile}
      />
    </>
  );
}
