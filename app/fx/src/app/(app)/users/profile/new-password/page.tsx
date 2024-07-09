'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import Input from '@/components/Input';
import ModalMessage from '@/components/ModalMessage';
import ModalResult from '@/components/ModalResult';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import {
  Button,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { resetPassword } from '@/api/user';

import { Container, GrayCard } from '../../styles';
import { validationSchema } from './type';

interface IDataSubmit {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function NewPassword() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const router = useRouter();
  const { theme } = useTheme();
  const { onShowNotification } = useNotification();
  const { setSignOut } = useAuth();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (data) => handleSubmit(data),
  });

  const handleModalVisibility = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async (data: IDataSubmit) => {
    try {
      setIsModalVisible(false);

      await resetPassword({
        currentPassword: data.currentPassword,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      setIsSuccessModalVisible(true);
    } catch (error) {
      setIsModalVisible(false);
      formik.setFieldError('currentPassword', 'Invalid password');

      onShowNotification({
        description: 'The current password is wrong.',
        message: '',
        type: 'ERROR',
      });
    }
  }, []);

  const Requirement = useCallback(
    ({ test, label }: { test: RegExp; label: string }) => {
      const regex = new RegExp(test);

      const color = formik.values.newPassword
        ? regex.test(formik.values.newPassword)
          ? theme.textColor.feedback['text-positive'].value
          : theme.textColor.feedback['text-negative'].value
        : theme.textColor.layout.secondary.value;

      return (
        <Row align="center">
          <Icon
            variant={
              regex.test(formik.values.newPassword)
                ? 'check-circle'
                : 'exclamation-circle'
            }
            color={color}
            size="sm"
            style={{ marginRight: 8 }}
          />

          <Text variant="caption_regular" color={color}>
            {label}
          </Text>
        </Row>
      );
    },
    [
      formik.values.newPassword,
      theme.textColor.feedback,
      theme.textColor.layout.secondary.value,
    ]
  );

  const isButtonDisabled = useMemo(
    () =>
      !formik.isValid ||
      !new RegExp(/^.{8,}$/).test(formik.values.newPassword) ||
      !new RegExp(/[^A-Za-z0-9]/).test(formik.values.newPassword) ||
      !new RegExp(/[A-Z]/).test(formik.values.newPassword) ||
      !new RegExp(/[a-z]/).test(formik.values.newPassword) ||
      !new RegExp(/[0-9]/).test(formik.values.newPassword),
    [formik.isValid, formik.values.newPassword]
  );

  const handleLogOut = useCallback(() => {
    setSignOut();
    router.push('/');
  }, [router, setSignOut]);

  return (
    <>
      <Container>
        <BackButton>
          <Text variant="headline_regular">Change password</Text>
        </BackButton>

        <div style={{ marginTop: 40, width: 808, alignSelf: 'center' }}>
          <GrayCard style={{ marginBottom: 16 }}>
            <Text variant="body_sm_bold">Password</Text>
          </GrayCard>

          <Input
            label="Current password"
            placeholder="Type your current password"
            value={formik.values.currentPassword}
            password={true}
            onChange={formik.handleChange('currentPassword')}
            error={formik.errors?.currentPassword}
            containerStyle={{ marginBottom: 16 }}
          />

          <GrayCard style={{ marginBottom: 16 }}>
            <Text variant="body_sm_bold">Create new password</Text>
          </GrayCard>

          <Input
            label="New password"
            placeholder="Type your new password"
            value={formik.values.newPassword}
            password={true}
            onChange={formik.handleChange('newPassword')}
            error={formik.errors?.newPassword}
            containerStyle={{ marginBottom: 16 }}
          />

          <Input
            label="Confirm password"
            placeholder="Type your new password"
            value={formik.values.confirmPassword}
            password={true}
            onChange={formik.handleChange('confirmPassword')}
            error={formik.errors?.confirmPassword}
            containerStyle={{ marginBottom: 16 }}
          />

          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
            style={{ marginBottom: 8 }}
          >
            Your password must contain:
          </Text>

          <Requirement test={/^.{8,}$/} label="8 characters" />
          <Requirement test={/[A-Z]/} label="1 uppercase letter" />
          <Requirement test={/[a-z]/} label="1 lowercase letter" />
          <Requirement test={/[0-9]/} label="1 number" />
          <Requirement test={/[^A-Za-z0-9]/} label="1 special character" />

          <Row style={{ gap: 16, justifyContent: 'center', marginTop: 40 }}>
            <Button
              onClick={router.back}
              text="Cancel"
              variant="secondary"
              roundness="rounded"
            />
            <Button
              onClick={handleModalVisibility}
              text="Change password"
              disabled={isButtonDisabled}
              roundness="rounded"
            />
          </Row>
        </div>
      </Container>

      <ModalMessage
        title="Are you sure you want to change your password?"
        description=""
        isVisible={isModalVisible}
        onConfirm={formik.handleSubmit}
        onCancel={handleModalVisibility}
        isLoading={formik.isSubmitting}
        textButtonCancel="No"
        textButtonConfirm="Yes change password"
      />

      <ModalResult
        isVisible={isSuccessModalVisible}
        onCancel={handleLogOut}
        title="Your password has been successfully changed."
        subtitle=""
        type="SUCCESS"
      />
    </>
  );
}
