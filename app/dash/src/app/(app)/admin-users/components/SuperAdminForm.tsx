import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { IUserDetails } from '@/models/users';
import { convertMapInOptionList } from '@/utils/lib';
import { CountriesList } from '@/lib/constants';
import { Button, Column, Icon, Row, Text, useTheme } from '@luxbank/ui';
import { useFormik } from 'formik';
import * as yup from 'yup';

const adminUserSchema = (isNewUser: boolean) => {
  const passwordValidation = isNewUser
    ? yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    : yup.string().min(6, 'Password must be at least 6 characters').optional();

  const confirmPasswordValidation = isNewUser
    ? yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Password confirmation is required')
    : yup.string().oneOf([yup.ref('password')], 'Passwords must match').optional();

  return yup.object({
    email: yup.string().required('Email is required').email('Invalid email').min(5),
    firstName: yup.string().required('First name is required').min(1),
    lastName: yup.string().required('Last name is required').min(1),
    phoneNumber: yup.string().required('Phone number is required').matches(/^(\+|\d)[0-9]{6,14}$/, 'Please enter a valid phone number').min(6),
    country: yup.string().required('Please enter your country'),
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  });
};

export interface ISuperAdminPayload {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  country: string;
  confirmPassword: string;
}

export function SuperAdminForm({
  selectedUser,
  onSubmit,
}: {
  selectedUser?: IUserDetails;
  onSubmit: (data: ISuperAdminPayload) => void;
}) {
  const { theme } = useTheme();
  const path = usePathname();
  const { back } = useRouter();

  const defaultValues = useMemo(() => ({
    email: selectedUser?.email || '',
    firstName: selectedUser?.firstname || '',
    lastName: selectedUser?.lastname || '',
    phoneNumber: selectedUser?.phone || '',
    country: selectedUser?.country || '',
    password: '',
    confirmPassword: '',
  }), [selectedUser]);

  const formik = useFormik({
    validationSchema: adminUserSchema(!selectedUser),
    validateOnMount: path.includes('/edit'),
    validateOnBlur: false,
    initialValues: defaultValues,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const Requirement = useCallback(({ test, label }: { test: RegExp; label: string }) => {
    const regex = new RegExp(test);
    const color = formik.values.password
      ? regex.test(formik.values.password)
        ? theme.textColor.feedback['text-positive'].value
        : theme.textColor.feedback['text-negative'].value
      : theme.textColor.layout.secondary.value;

    return (
      <Row align="center">
        <Icon variant={regex.test(formik.values.password) ? 'check-circle' : 'exclamation-circle'} color={color} size="sm" style={{ marginRight: 8 }}/>
        <Text variant="caption_regular" color={color}>
          {label}
        </Text>
      </Row>
    );
  }, [formik.values.password, theme.textColor.feedback, theme.textColor.layout.secondary.value]);

  const isButtonDisabled = useMemo(() => (
    !formik.isValid ||
    !new RegExp(/^.{8,}$/).test(formik.values.password) ||
    !new RegExp(/[^A-Za-z0-9]/).test(formik.values.password) ||
    !new RegExp(/[A-Z]/).test(formik.values.password) ||
    !new RegExp(/[a-z]/).test(formik.values.password) ||
    !new RegExp(/[0-9]/).test(formik.values.password)
  ), [formik.isValid, formik.values.password]);

  return (
    <Column width="100%" gap="sm" align="center">
      <Column width="800px" gap="sm">
        <Input
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange('email')}
          error={formik.errors.email}
        />
        <Row gap="sm" width="100%">
          <Input
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange('firstName')}
            error={formik.errors.firstName}
          />
          <Input
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange('lastName')}
            error={formik.errors.lastName}
          />
        </Row>
        <Select
          showSearch
          label="Country"
          value={formik.values.country}
          onChange={(value) => formik.setFieldValue('country', value)}
          error={formik.errors.country ?? ''}
          options={convertMapInOptionList(CountriesList)}
        />
        <Input
          label="Phone number"
          value={formik.values.phoneNumber}
          onChange={(value) => formik.setFieldValue('phoneNumber', value)}
          error={formik.errors.phoneNumber as string}
          variant="phoneNumber"
        />
        <Input
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange('password')}
          error={formik.errors.password}
          password
        />
        <Input
          label="Confirm Password"
          password
          value={formik.values.confirmPassword}
          onChange={formik.handleChange('confirmPassword')}
          error={formik.errors.confirmPassword}
        />
        <Text
          variant="body_sm_regular"
          color={theme.textColor.layout.secondary.value}
          style={{ marginTop: 8 }}
        >
          Your password must contain:
        </Text>
        <Column>
          <Requirement test={/^.{8,}$/} label="8 characters" />
          <Requirement test={/[A-Z]/} label="1 uppercase letter" />
          <Requirement test={/[a-z]/} label="1 lowercase letter" />
          <Requirement test={/[0-9]/} label="1 number" />
          <Requirement test={/[^A-Za-z0-9]/} label="1 special character" />
        </Column>
        <Row width="100%" gap="sm" align="center" justify="center">
          <Button
            text="Cancel"
            roundness="rounded"
            variant="secondary"
            onClick={() => back()}
          />
          <Button
            text={selectedUser ? 'Save Changes' : 'Add Team Member'}
            variant="primary"
            roundness="rounded"
            onClick={() => formik.submitForm()}
            disabled={(!selectedUser && isButtonDisabled) || !formik.isValid}
          />
        </Row>
      </Column>
    </Column>
  );
}
