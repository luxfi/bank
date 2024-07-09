'use client';

import { Container, Content, ContainerInputs } from './styles';
import { BackButton } from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { defaultTheme } from '@/styles/themes/default';
import { FormikConfig, useFormik } from 'formik';
import { IResetPasswordData } from '../models/types';
import { resetPasswordSchema } from '../models/reset-password-schema';
import { resetPassword as ApiResetPassword } from '@/api/user';
import { useNotification } from '@/context/Notification';

export default function ResetPassword() {
  const { onShowNotification } = useNotification();

  const onSubmit: FormikConfig<IResetPasswordData>['onSubmit'] = (value) => {
    formik.resetForm();
    ApiResetPassword(value)
      .then(() => {
        onShowNotification({
          type: 'SUCCESS',
          message: 'Success',
          description: 'Reset password successfully',
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

  const formik = useFormik<IResetPasswordData>({
    initialValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: onSubmit,
  });

  return (
    <Container>
      <BackButton>Profile</BackButton>
      <Content>
        <ContainerInputs>
          <Input
            label="Current password"
            password
            onChange={formik.handleChange('currentPassword')}
            placeholder="Type your current password"
            value={formik.values.currentPassword}
            error={formik.errors.currentPassword}
          />
          <Input
            label="password"
            password
            onChange={formik.handleChange('password')}
            placeholder="Type new password"
            value={formik.values.password}
            error={formik.errors.password}
          />
          <Input
            label="confirm your password"
            password
            onChange={formik.handleChange('confirmPassword')}
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            error={formik.errors.confirmPassword}
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            type="submit"
            color={defaultTheme.colors.secondary}
          >
            Reset Password
          </Button>
        </ContainerInputs>
      </Content>
    </Container>
  );
}
