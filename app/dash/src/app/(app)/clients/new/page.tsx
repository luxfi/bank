'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import Input from '@/components/Input';
import ModalMessage from '@/components/ModalMessage';
import ModalResult from '@/components/ModalResult';
import Select from '@/components/Select';

import { INewClient } from '@/models/clients';

import { useNotification } from '@/context/Notification';

import { convertMapInOptionList } from '@/utils/lib';

import { CountriesList } from '@/lib/constants';

import { useUsers } from '@/store/useUsers';
import { LoadingOutlined } from '@ant-design/icons';
import { Button } from '@luxbank/ui';
import { useFormik } from 'formik';

import { newClient } from '@/api/clients';

import { defaultTheme } from '@/styles/themes/default';

import { entityTypes, newClientSchema, whoTheyAreOptions } from '../types';
import {
  ActionContainer,
  ButtonsContainer,
  Container,
  Content,
  ContentContainer,
  FormFullRow,
  TagContainer,
  TagTitle,
} from './styles';

const initFormValues = {
  accountType: 'individual',
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  phone: '',
  password: '',
  confirmPassword: '',
  businessRole: 'Board director / Business owner',
  pleaseSpecify: '',
  companyName: '',
};

export default function NewClient() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isCancelModalVisible, setIsCancelModalVisible] =
    useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  const [disablePasswordFields, setDisablePasswordFields] = useState(true);

  const { checkEmailExists } = useUsers();

  const { onShowNotification } = useNotification();

  const handleCancelModalVisibility = useCallback(() => {
    setIsCancelModalVisible((prev) => !prev);
  }, []);

  const handleSuccessModalVisibility = useCallback(() => {
    setIsSuccessModalVisible((prev) => !prev);
  }, []);

  const handleCancel = useCallback(() => {
    handleCancelModalVisibility();
    router.back();
  }, [handleCancelModalVisibility, router]);

  const handleBackToClientsList = useCallback(() => {
    handleSuccessModalVisibility();
    router.push('/clients');
  }, [handleSuccessModalVisibility, router]);

  const [disableButton, setDisableButton] = useState(false);

  const handleSubmit = useCallback(
    async (formData: INewClient) => {
      try {
        setLoading(true);

        await newClient({
          ...formData,
        });

        handleSuccessModalVisibility();
      } catch (error: any) {
        onShowNotification({
          type: 'ERROR',
          message: error?.message || 'An error occurred',
          description: '',
        });
      } finally {
        setLoading(false);
      }
    },
    [handleSuccessModalVisibility, onShowNotification]
  );

  const formik = useFormik({
    initialValues: initFormValues,
    validationSchema: newClientSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      handleSubmit({
        mobileNumber: values.phone,
        lastname: values.lastName,
        firstname: values.firstName,
        entityType: values.accountType,
        companyName: values.companyName,
        country: values.country,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        businessRoleSelect: values.businessRole,
        companyType: 'LIMITED_LIABILITY',
        businessRole:
          values.businessRole === 'other'
            ? values.pleaseSpecify
            : values.businessRole,
        complyLaunchId: '',
        verifiedAt: '',
        cloudCurrencyId: '',
        contact: null,
      });
    },
  });

  const veirfyEmail = useCallback(
    async (email: string) => {
      if (!email) return;

      await checkEmailExists(email).then((data) => {
        if (data.statusCode === 400) {
          formik.setFieldError('email', data.message);
          setDisableButton(true);
          return;
        }

        setDisableButton(false);

        if (data.statusCode === 404) {
          formik.resetForm();
          formik.setFieldValue('email', email);
          setDisablePasswordFields(false);
          return;
        }

        if (!data.uuid) return;

        setDisablePasswordFields(true);

        formik
          .setValues({
            ...initFormValues,
            email,
            accountType: data.clients?.[0]?.account?.entityType || '',
            businessRole:
              data.contact.businessRole === 'Board director / Business owner'
                ? 'Board director / Business owner'
                : 'other',
            pleaseSpecify:
              data.contact.businessRole !== 'Board director / Business owner'
                ? data.contact.businessRole
                : '',
            firstName: data.firstname || '',
            lastName: data.lastname || '',
            phone: data.contact.mobileNumber || '',
            country: data.contact.country || '',
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
    <Container>
      <BackButton containerStyle={{ marginBottom: 16 }}>Add Account</BackButton>

      <ContentContainer>
        <Content>
          <TagContainer>
            <TagTitle>Account details</TagTitle>
          </TagContainer>

          <Input
            disabled={loading}
            label="Email"
            placeholder="email@example.com"
            value={formik.values.email}
            error={formik.errors.email as string}
            onFocus={() => formik.setErrors({ email: '' })}
            onBlur={() => veirfyEmail(formik.values.email)}
            onChange={(v) => formik.setFieldValue('email', v.trim())}
          />

          <Select
            disabled={loading}
            value={formik.values.accountType}
            label="Account type"
            onChange={formik.handleChange('accountType')}
            options={convertMapInOptionList(entityTypes)}
            error={formik.errors.accountType}
          />

          <FormFullRow>
            <Input
              disabled={loading}
              label="First name"
              placeholder="First name"
              value={formik.values.firstName}
              onChange={formik.handleChange('firstName')}
              error={formik.errors.firstName}
            />
            <Input
              disabled={loading}
              label="Last name"
              placeholder="Last name"
              value={formik.values.lastName}
              onChange={formik.handleChange('lastName')}
              error={formik.errors.lastName}
            />
          </FormFullRow>

          {formik.values.accountType === 'business' && (
            <Input
              label="Company name"
              onChange={formik.handleChange('companyName')}
              error={formik.errors.companyName}
              value={formik.values.companyName}
            />
          )}

          <Input
            variant="phoneNumber"
            disabled={loading}
            label="Phone number"
            value={formik.values.phone}
            onChange={(v) => formik.setFieldValue('phone', v)}
            error={formik.errors.phone}
          />

          <Select
            disabled={loading}
            label="Country"
            showSearch
            value={formik.values.country}
            onChange={formik.handleChange('country')}
            options={convertMapInOptionList(CountriesList)}
            error={formik.errors.country}
          />

          {formik.values.accountType === 'business' && (
            <TagContainer>
              <TagTitle>Employment details</TagTitle>
            </TagContainer>
          )}

          {formik.values.accountType === 'business' && (
            <Select
              disabled={loading}
              label="Who are you?"
              options={convertMapInOptionList(whoTheyAreOptions)}
              value={formik.values.businessRole}
              onChange={formik.handleChange('businessRole')}
              error={formik.errors.businessRole}
            />
          )}

          {formik.values.accountType === 'business' &&
            formik.values.businessRole === 'other' && (
              <Input
                disabled={loading}
                label="Please specify"
                value={formik.values.pleaseSpecify}
                onChange={formik.handleChange('pleaseSpecify')}
                error={formik.errors.pleaseSpecify}
              />
            )}

          <TagContainer>
            <TagTitle>Setup</TagTitle>
          </TagContainer>

          <Input
            disabled={loading || disablePasswordFields}
            password
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange('password')}
            error={formik.errors.password}
          />
          <Input
            disabled={loading || disablePasswordFields}
            password
            label="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange('confirmPassword')}
            error={formik.errors.confirmPassword}
          />

          <ActionContainer>
            {loading ? (
              <LoadingOutlined
                style={{
                  color: defaultTheme.colors.secondary,
                  fontSize: 42,
                  fontWeight: 600,
                }}
              />
            ) : (
              <ButtonsContainer>
                <Button
                  variant="secondary"
                  text="Cancel"
                  roundness="rounded"
                  onClick={handleCancelModalVisibility}
                />
                <Button
                  text="Create account"
                  roundness="rounded"
                  onClick={formik.submitForm}
                  disabled={loading || !formik.isValid || disableButton}
                />
              </ButtonsContainer>
            )}
          </ActionContainer>
        </Content>
      </ContentContainer>

      <ModalMessage
        isVisible={isCancelModalVisible}
        title="Exit add account?"
        description="All data changed in the form will be deleted, would you like to continue?"
        onConfirm={handleCancel}
        onCancel={handleCancelModalVisibility}
      />

      <ModalResult
        isVisible={isSuccessModalVisible}
        onCancel={handleBackToClientsList}
        title={`Account ${formik.values.firstName} ${formik.values.lastName} created successfully.`}
        subtitle=""
        type="SUCCESS"
      />
    </Container>
  );
}
