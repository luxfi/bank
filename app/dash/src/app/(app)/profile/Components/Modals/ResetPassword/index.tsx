'use client';

import { useCallback, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';

import { useNotification } from '@/context/Notification';

import { LoadingOutlined } from '@ant-design/icons';
import { Modal as ModalAntd } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { resetPassword } from '@/api/user';

import { defaultTheme } from '@/styles/themes/default';

import { IResetPasswordData } from '../../../models/types';
import { ContentModal, ContentButton } from './Style';

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

export const PASSWORD_REQUIREMENTS_TEXT =
  'Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character';

export const passwordSchema = Yup.object({
  password: Yup.string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
      PASSWORD_REQUIREMENTS_TEXT
    ),
  confirmPassword: Yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      return this.parent.password === value;
    }
  ),
});

export default function ModalResetPassword({
  openModal,
  onCloseModal,
}: IModalProps) {
  const { onShowNotification } = useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (data: IResetPasswordData) => {
    setLoading(true);

    await resetPassword({
      confirmPassword: data.confirmPassword,
      currentPassword: data.currentPassword,
      password: data.password,
    })
      .then(() => {
        onShowNotification({
          type: 'SUCCESS',
          message: 'Success',
          description: 'User updated successfully',
        });

        setLoading(false);
        onCloseModal();
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error',
          description: err.message,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const formik = useFormik<IResetPasswordData>({
    initialValues: {
      confirmPassword: '',
      currentPassword: '',
      password: '',
    },
    validationSchema: passwordSchema,
    onSubmit: handleSubmit,
  });

  return (
    <ModalAntd
      title="Reset Password"
      onCancel={onCloseModal}
      footer={null}
      centered
      open={openModal}
    >
      <ContentModal>
        <Input
          password
          value={formik.values.currentPassword}
          onChange={formik.handleChange('currentPassword')}
          label="Current Password:"
          error={formik.errors.currentPassword}
        />
        <Input
          password
          value={formik.values.password}
          onChange={formik.handleChange('password')}
          label="New Password:"
          error={formik.errors.password}
        />
        <Input
          password
          value={formik.values.confirmPassword}
          onChange={formik.handleChange('confirmPassword')}
          label="Confirm Password:"
          error={formik.errors.confirmPassword}
        />
        <ContentButton>
          {loading ? (
            <LoadingOutlined
              style={{
                color: defaultTheme.colors.secondary,
                fontSize: 40,
                fontWeight: 600,
                paddingInline: 20,
              }}
            />
          ) : (
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              color={defaultTheme.colors.secondary}
              style={{ width: 160 }}
            >
              Save
            </Button>
          )}
        </ContentButton>
      </ContentModal>
    </ModalAntd>
  );
}
