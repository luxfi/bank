'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import Input from '@/components/Input';
import ModalMessage from '@/components/ModalMessage';
import ModalResult from '@/components/ModalResult';
import Select from '@/components/Select';

import { useNotification } from '@/context/Notification';

import { convertMapInOptionList } from '@/utils/lib';

import { CountriesList } from '@/lib/constants';

import { Button, Row, Text } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import {
  IGetCurrentUserV2Response,
  getCurrentUserV2,
  updateCurrentUserV2,
} from '@/api/user';

import { Container, GrayCard } from '../../../styles';
import { InputAndImageContainer, InputsContainer } from '../styles';
import { IFormAdmin, optionsRole, validationSchemaAdmin } from '../type';

export function Admin() {
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

  const onSubmit = useCallback(async (data: IFormAdmin) => {
    try {
      setIsLoading(true);

      await updateCurrentUserV2({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        country: data.country,
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
  }, []);

  const handleModalVisibility = useCallback(() => {
    setModalIsVisible((prev) => !prev);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: currentUser?.firstName ?? '',
      lastName: currentUser?.lastName ?? '',
      email: currentUser?.email ?? '',
      role: currentUser?.role ?? '',
      country: currentUser?.country ?? '',
      mobileNumber: currentUser?.mobileNumber ?? '',
    },
    validationSchema: validationSchemaAdmin,
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

          <Row align="center" style={{ gap: 16, marginBottom: 16 }}>
            <Select
              label="Country"
              value={formik.values.country}
              onChange={formik.handleChange('country')}
              error={formik.errors.country}
              options={convertMapInOptionList(CountriesList)}
              showSearch
            />

            <Input
              variant="phoneNumber"
              label="Phone number"
              onChange={(value) => formik.setFieldValue('mobileNumber', value)}
              error={formik.errors?.mobileNumber}
              value={formik.values.mobileNumber}
            />
          </Row>
          <Input
            disabled
            containerStyle={{ marginBottom: 16 }}
            placeholder="email@example.com"
            label="E-mail"
            value={formik.values.email}
            onChange={formik.handleChange('email')}
            error={formik.errors?.email}
          />
          <Select
            disabled
            containerStyle={{ marginBottom: 16 }}
            label="Role:"
            options={optionsRole}
            value={formik.values.role}
            onChange={formik.handleChange('role')}
            error={formik.errors?.role}
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
