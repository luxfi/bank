'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import Select from '@/components/Select';
import { Tooltip } from '@/components/Tooltip';

import { countriesToSelect } from '@/models/countries';

import { useAuth } from '@/store/useAuth';
import { useUsers } from '@/store/useUsers';
import { Button, Column, Icon, Row, Text, useTheme } from '@luxbank/ui';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { EditUserForm } from '../styles';
import { userRoles } from '../types';

export const userFormSchema: yup.SchemaOf<any> = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email')
    .min(5),
  firstName: yup.string().required('First name is required').min(1),
  country: yup.string().required('Country is required').min(2),
  lastName: yup.string().required('Last name is required').min(1),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^(\+|\d)[0-9]{7,15}$/, 'Please enter a valid phone number')
    .min(6),
  role: yup.string().required('Role is required').min(6),
});

export interface IUserPayload extends yup.InferType<typeof userFormSchema> {}

interface IUserFormProps {
  data?: IUserPayload;
  onSubmit: (data: IUserPayload) => void;
}

export function UserForm({ data, onSubmit }: IUserFormProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { checkEmailExists, loading } = useUsers();
  const path = usePathname();

  const [disableButton, setDisableButton] = useState(false);

  const initialFormValues = useMemo(() => {
    return {
      email: data?.email || '',
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      country: data?.country || '',
      phoneNumber: data?.phoneNumber || '',
      role: data?.role || '',
    };
  }, [data]);

  const formik = useFormik({
    validationSchema: userFormSchema,
    initialValues: initialFormValues,
    validateOnMount: path.includes('/edit'),
    onSubmit: async (values) => {
      onSubmit(values);
    },
  });

  const checkEmail = useCallback(
    async (email: string) => {
      if (!email || !!formik.errors.email) return;
      await checkEmailExists(email).then((userData) => {
        if (userData.statusCode === 400) {
          formik.setFieldError('email', 'User already exists!');
          setDisableButton(true);
          return;
        }

        setDisableButton(false);

        if (userData.statusCode === 404) {
          formik.setFieldValue('email', email);
          return;
        }

        if (!userData.uuid) return;

        formik
          .setValues({
            email: email,
            firstName: userData?.firstname || '',
            lastName: userData?.lastname || '',
            country: userData?.contact?.country || '',
            phoneNumber: userData?.contact?.mobileNumber || '',
            role: userData?.role || '',
          })
          .then(() => {
            formik.setFieldError(
              'email',
              'Please be advised that the email is already associated with an active user account.'
            );
          });
      });
    },
    [checkEmailExists, formik]
  );

  return (
    <>
      <EditUserForm onSubmit={formik.handleSubmit}>
        <Column gap="sm">
          <Row
            width="100%"
            padding="xs"
            style={{
              backgroundColor:
                theme.backgroundColor.layout['container-L0'].value,
              borderRadius: theme.borderRadius['radius-md'].value,
            }}
          >
            <Text variant="body_md_semibold">User details</Text>
          </Row>
          <Input
            label="Email"
            value={formik.values.email}
            error={formik.errors.email as string}
            disabled={loading.checkEmailExists || path.includes('/edit')}
            onFocus={() => formik.setErrors({ email: '' })}
            onBlur={() => checkEmail(formik.values.email)}
            onChange={(v) => formik.setFieldValue('email', v.trim())}
          />
          <Row gap="sm" width="100%">
            <Input
              label="First name"
              value={formik.values.firstName}
              onChange={formik.handleChange('firstName')}
              error={formik.errors.firstName as string}
              disabled={loading.checkEmailExists}
            />
            <Input
              label="Last name"
              value={formik.values.lastName}
              onChange={formik.handleChange('lastName')}
              error={formik.errors.lastName as string}
              disabled={loading.checkEmailExists}
            />
          </Row>
          <Row gap="sm" width="100%">
            <Select
              label="Country"
              value={formik.values.country}
              error={formik.errors.country as string}
              onChange={formik.handleChange('country')}
              disabled={loading.checkEmailExists}
              options={countriesToSelect}
              showSearch
            />
            <Input
              label="Phone number"
              value={formik.values.phoneNumber}
              onChange={(V) => formik.setFieldValue('phoneNumber', V)}
              error={formik.errors.phoneNumber as string}
              disabled={loading.checkEmailExists}
              variant="phoneNumber"
            />
          </Row>
          <Select
            label={
              <Row gap="xxs" align="center">
                Role
                <Tooltip
                  width="700px"
                  title="Users are separated into roles, viewer, who can only see the dashboard screens, team member, who can see and take actions within the dashboard in some cases requiring approval from a superior. Team Manager can take actions within the dashboard without the need for approval and can approve actions from a team member. Admin is the dashboard administrator account and can perform all functions within the dashboard."
                >
                  <>
                    <Icon variant="exclamation-circle" size="xs" />
                  </>
                </Tooltip>
              </Row>
            }
            value={formik.values.role}
            onChange={formik.handleChange('role')}
            options={userRoles(currentUser?.role)}
            error={formik.errors.role as string}
            disabled={loading.checkEmailExists}
          />
        </Column>
        <Row width="100%" justify="center" gap="lg">
          <Button
            text="Cancel"
            variant="secondary"
            roundness="rounded"
            onClick={() => router.back()}
          />

          <Button
            disabled={disableButton || formik.isSubmitting}
            text={path.includes('invite') ? 'Invite' : 'Save Changes'}
            variant="primary"
            roundness="rounded"
            onClick={() => formik.submitForm()}
          />
        </Row>
      </EditUserForm>
      {loading.checkEmailExists && (
        <div style={{ position: 'absolute', top: '30%' }}>
          <Loading />
        </div>
      )}
    </>
  );
}
