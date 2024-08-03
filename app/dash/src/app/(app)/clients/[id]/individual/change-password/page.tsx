'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import ModalMessage from '@/components/ModalMessage';

import { useMessages } from '@/context/Messages';

import { GrayCard } from '@/app/(app)/users/styles';
import { useClients } from '@/store/useClient';
import { Button, Icon, Row, Text, useTheme } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { validationSchema } from './type';

interface IDataSubmit {
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { changePassword, clientSelected, masterClientSelected, loading } =
    useClients();

  const router = useRouter();
  const { theme } = useTheme();
  const { onShowMessage } = useMessages();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (data) => handleSubmit(data),
  });

  const handleModalVisibility = useCallback(() => {
    setIsModalVisible((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (data: IDataSubmit) => {
      try {
        if (!clientSelected?.uuid) return router.back();

        setIsModalVisible(false);

        await changePassword({
          uuid: masterClientSelected?.uuid ?? '',
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        });

        onShowMessage({
          title: 'Your password has been successfully changed.',
          description: '',
          isVisible: true,
          status: 'success',
          onClose: router.back,
          type: 'message',
        });
      } catch (error) {
        setIsModalVisible(false);
        formik.setFieldError('currentPassword', 'Invalid password');

        onShowMessage({
          title: 'The current password is wrong.',
          description: '',
          isVisible: true,
          status: 'fail',
          onClose: () => {},
          type: 'message',
        });
      }
    },
    [masterClientSelected?.uuid]
  );

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

  return (
    <>
      <BackButton>
        <Text variant="headline_regular">Change password</Text>
      </BackButton>

      <div style={{ marginTop: 40, width: 808, alignSelf: 'center' }}>
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

        {loading.changePassword ? (
          <Row style={{ marginTop: 40, justifyContent: 'center' }}>
            <Loading />
          </Row>
        ) : (
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
        )}
      </div>

      <ModalMessage
        title="Are you sure you want to change your password?"
        description=""
        isVisible={isModalVisible}
        onConfirm={formik.handleSubmit}
        onCancel={handleModalVisibility}
        isLoading={formik.isSubmitting}
        textButtonCancel="No"
        textButtonConfirm="Yes"
      />
    </>
  );
}
