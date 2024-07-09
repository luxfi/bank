'use client';

import { useCallback, useEffect, useState } from 'react';

import { IRequestError } from '@/models/request';

import { LoadingOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import * as ApiAuth from '@/api/auth';

import { defaultTheme } from '@/styles/themes/default';

import Button from '../Button';
import Input from '../Input';
import { Container, LoadingContainer, SubmitError } from './styles';

interface IProps {
  isVisible: boolean;
  onClose(value: false): void;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail invalid')
    .required('Please enter the email address.'),
});

const formActionsInit = {
  loading: false,
  error: '',
};

export default function ModalForgotPassword({ isVisible, onClose }: IProps) {
  const [formActions, setFormActions] = useState(formActionsInit);

  const handleSendEmail = useCallback(async (email: string) => {
    try {
      setFormActions({
        error: '',
        loading: true,
      });

      await ApiAuth.forgotPassword({ email });

      onClose(false);
    } catch (err) {
      const error = err as unknown as IRequestError;

      setFormActions({
        error: error?.message,
        loading: false,
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSendEmail(values.email);
    },
  });

  useEffect(() => {
    if (isVisible) {
      formik.resetForm();
      setFormActions(formActionsInit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return (
    <Modal
      onCancel={() => !formActions.loading && onClose(false)}
      title="Forgot Password"
      open={isVisible}
      footer={() => null}
    >
      <Container>
        <Input
          disabled={formActions.loading}
          label="E-mail"
          value={formik.values.email}
          onChange={formik.handleChange('email')}
          error={formik.errors.email}
        />

        {formActions.loading ? (
          <LoadingContainer>
            <LoadingOutlined
              style={{
                color: defaultTheme.colors.primary,
                fontSize: 40,
                paddingBlock: 16,
              }}
            />
          </LoadingContainer>
        ) : (
          <>
            {formActions.error && (
              <SubmitError>{formActions.error}</SubmitError>
            )}
            <Button
              color={defaultTheme.colors.primary}
              onClick={() => formik.handleSubmit()}
            >
              Send Request
            </Button>
          </>
        )}
      </Container>
    </Modal>
  );
}
