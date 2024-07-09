'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';

import { LoadingOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { sendRegistrationRequest } from '@/api/registration';

import { defaultTheme } from '@/styles/themes/default';

import {
  ActionContainer,
  ButtonsContainer,
  Container,
  FormContainer,
  MainActionContainer,
  RequestRegistration,
  SubmitError,
  Subtitle,
  Title,
  TitleContainer,
} from './styles';

export interface IRequestRegistrationForm {
  firstname: string;
  lastname: string;
  email: string;
  mobileNumber: string;
}

const formActionsInit = {
  loading: false,
  error: '',
};

export default function Registration() {
  const router = useRouter();

  const [formActions, setFormActions] = useState(formActionsInit);

  const handleSubmit = async (data: IRequestRegistrationForm) => {
    setFormActions({
      error: '',
      loading: true,
    });
    await sendRegistrationRequest(data)
      .then(() => {
        router.push('/registration/success');
        formik.resetForm();
      })
      .catch(() => {
        setFormActions((pS) => ({
          ...pS,
          error: 'Error sending information, please try again later',
        }));
      })
      .finally(() => {
        setFormActions((pS) => ({
          ...pS,
          loading: false,
        }));
      });
  };

  const validationSchema = yup.object({
    firstname: yup.string().required('Please enter your first name'),
    lastname: yup.string().required('Please enter your last name'),
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    mobileNumber: yup
      .string()
      .required('Please enter your Phone Number')
      .matches(/^(\+|\d)[0-9]{7,15}$/, 'Please enter a valid phone number'),
  });

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      mobileNumber: '',
    },
    validationSchema: validationSchema,
    onSubmit: (data) => {
      handleSubmit(data);
    },
  });

  return (
    <Container>
      <FormContainer onSubmit={formik.handleSubmit}>
        <Image
          id="img1"
          src={'/image/cdax-logo.svg'}
          alt="Mini Phone"
          width={212}
          height={200}
        />
        <TitleContainer>
          <Title>Request Registration</Title>
          <Subtitle>Fill out the form to request access</Subtitle>
        </TitleContainer>

        <ActionContainer>
          <Input
            disabled={formActions.loading}
            containerStyle={{ marginBottom: 16 }}
            placeholder="First Name"
            label="First Name:"
            value={formik.values.firstname}
            onChange={formik.handleChange('firstname')}
            error={formik.errors?.firstname}
          />
          <Input
            disabled={formActions.loading}
            containerStyle={{ marginBottom: 16 }}
            placeholder="Last Name"
            label="Last Name:"
            value={formik.values.lastname}
            onChange={formik.handleChange('lastname')}
            error={formik.errors?.lastname}
          />
          <Input
            disabled={formActions.loading}
            containerStyle={{ marginBottom: 16 }}
            placeholder="email@example.com"
            label="E-mail:"
            value={formik.values.email}
            onChange={formik.handleChange('email')}
            error={formik.errors?.email}
          />
          <Input
            disabled={formActions.loading}
            label="Mobile Number"
            value={formik.values.mobileNumber}
            onChange={(v) => formik.setFieldValue('mobileNumber', v)}
            error={formik.errors.mobileNumber}
            variant="phoneNumber"
          />

          {formActions.loading ? (
            <LoadingOutlined
              style={{
                color: defaultTheme.colors.primary,
                fontSize: 40,
                fontWeight: 600,
                paddingBlock: 40,
              }}
            />
          ) : (
            <ButtonsContainer>
              {formActions.error && (
                <SubmitError>{formActions.error}</SubmitError>
              )}
              <MainActionContainer>
                <Button
                  disabled={formActions.loading}
                  type="submit"
                  color={defaultTheme.colors.primary}
                >
                  Send
                </Button>
              </MainActionContainer>

              <RequestRegistration>
                {`Already using CDAX?  `}
                <Link href={'/'}>Sign in</Link>
              </RequestRegistration>
            </ButtonsContainer>
          )}
        </ActionContainer>
      </FormContainer>
    </Container>
  );
}
