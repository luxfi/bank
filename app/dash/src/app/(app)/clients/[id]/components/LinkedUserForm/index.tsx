'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import Select from '@/components/Select';

import { UserRole } from '@/models/auth';
import { IUserDetails } from '@/models/users';

import { useMessages } from '@/context/Messages';

import { countriesOptions } from '@/utils/lib';

import { userRoles } from '@/app/(app)/users/types';
import { useClients } from '@/store/useClient';
import { useUsers } from '@/store/useUsers';
import { Button, Row } from '@luxbank/ui';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { PASSWORD_REQUIREMENTS_TEXT } from '../../../types';
import { LinkedUserForm } from './styles';

export const linkedUserFormSchema = (isNewUser: boolean) => {
  //if new user, password must be required
  const passwordValidation = isNewUser
    ? yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
          PASSWORD_REQUIREMENTS_TEXT
        )
    : yup.string().min(6, 'Password must be at least 6 characters').optional();

  const confirmPasswordValidation = isNewUser
    ? yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required')
    : yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .optional();

  // ================================================

  return yup.object({
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
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  });
};

export interface ILinkedUserForm {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  role: string;
  password: string;
  confirmPassword: string;
}

interface IProps {
  data?: IUserDetails;
  onSubmit: (data: ILinkedUserForm) => void;
}

export function LinkedUserFormComponent({ onSubmit, data }: IProps) {
  const { back } = useRouter();
  const path = usePathname();
  const { onShowMessage } = useMessages();
  const { checkEmailExists, loading } = useUsers();
  const { clientSelected } = useClients();

  const id = useMemo(() => clientSelected?.uuid ?? '', [clientSelected]);

  const [disableButton, setDisableButton] = useState(false);

  const initialFormValues = useMemo<ILinkedUserForm>(
    () => ({
      firstName: data?.firstname || '',
      lastName: data?.lastname || '',
      email: data?.email || '',
      country: data?.country || '',
      phoneNumber: data?.phone || '',
      role: data?.role || '',
      password: '',
      confirmPassword: '',
    }),
    [data]
  );

  const formik = useFormik<ILinkedUserForm>({
    validationSchema: linkedUserFormSchema(data ? false : true),
    initialValues: initialFormValues,
    validateOnMount: path.includes('/edit'),
    onSubmit: (data) => onSubmit(data),
  });

  const checkEmail = useCallback(
    async (email: string) => {
      if (!email || !!formik.errors.email) return;
      await checkEmailExists(email, { clientId: id as string }).then(
        (userData) => {
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
              password: '',
              confirmPassword: '',
            })
            .then(() => {
              formik.setFieldError(
                'email',
                'Please be advised that the email is already associated with an active user account.'
              );
            });
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkEmailExists, formik]
  );

  return (
    <>
      <LinkedUserForm
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          label="Email"
          value={formik.values.email}
          error={formik.errors.email as string}
          disabled={loading.checkEmailExists || path.includes('/edit')}
          onFocus={() => formik.setErrors({ email: '' })}
          onBlur={() => checkEmail(formik.values.email)}
          onChange={(v) => formik.setFieldValue('email', v.trim())}
        />

        <Row gap="md">
          <Input
            label="First name"
            value={formik.values.firstName}
            onChange={formik.handleChange('firstName')}
            error={formik.errors.firstName}
            disabled={loading.checkEmailExists}
          />
          <Input
            label="Last name"
            value={formik.values.lastName}
            onChange={formik.handleChange('lastName')}
            error={formik.errors.lastName}
            disabled={loading.checkEmailExists}
          />
        </Row>

        <Select
          label="Country"
          options={countriesOptions}
          value={formik.values.country}
          error={formik.errors.country}
          onChange={formik.handleChange('country')}
          showSearch
          disabled={loading.checkEmailExists}
        />

        <Input
          label="Phone number"
          value={formik.values.phoneNumber}
          onChange={(v) => formik.setFieldValue('phoneNumber', v)}
          variant="phoneNumber"
          error={formik.errors.phoneNumber}
          disabled={loading.checkEmailExists}
        />

        <Select
          label="Role"
          placeholder="Select role"
          options={userRoles(UserRole.AdminUser)}
          onChange={formik.handleChange('role')}
          value={formik.values.role}
          error={formik.errors.role}
          disabled={loading.checkEmailExists}
        />

        <Input
          password
          label="Create password"
          value={formik.values.password}
          onChange={formik.handleChange('password')}
          error={formik.errors.password}
          disabled={loading.checkEmailExists}
        />

        <Input
          password
          label="Confirm password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange('confirmPassword')}
          error={formik.errors.confirmPassword}
          disabled={loading.checkEmailExists}
        />

        <Row gap="sm" style={{ alignSelf: 'center', marginTop: 24 }}>
          <Button
            roundness="rounded"
            variant="secondary"
            text="Cancel"
            onClick={() => back()}
          />
          <Button
            roundness="rounded"
            text={data ? 'Save Changes' : 'Add User'}
            leftIcon={data ? undefined : 'user-plus'}
            disabled={
              disableButton || loading.checkEmailExists || !formik.isValid
            }
            onClick={() =>
              onShowMessage({
                isVisible: true,
                title: `${
                  data
                    ? 'Are you sure wish to proceed with the change?'
                    : 'Are you sure you want to add this user?'
                }`,
                type: 'question',
                onConfirm: () => {
                  formik.handleSubmit();
                },
              })
            }
          />
        </Row>
      </LinkedUserForm>
      {loading.checkEmailExists && (
        <div style={{ position: 'absolute', top: '30%' }}>
          <Loading />
        </div>
      )}
    </>
  );
}
