'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import Select from '@/components/Select';
import SelectDate from '@/components/SelectDate';

import { useMessages } from '@/context/Messages';

import { countriesOptions, formattedDate } from '@/utils/lib';

import { useClients } from '@/store/useClient';
import { Button, Column, Icon, Row, Text, useTheme } from '@cdaxfx/ui';
import { DefaultOptionType } from 'antd/es/select';
import { useFormik } from 'formik';

import { IPersonDetail, validationForm } from '../types';
import { Container, FormContainer } from './styles';

const titleOptions: DefaultOptionType[] = [
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Miss', value: 'Miss' },
  { label: 'Ms.', value: 'Ms.' },
];

const genderOption: DefaultOptionType[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function PersonalDetailsEdit() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { onShowMessage } = useMessages();
  const router = useRouter();
  const {
    clientSelected,
    masterClientSelected,
    postIndividualMetadata,
    updateDetailsOfRegistrar,
    setMasterClientSelected,
    getClientsInfo,
  } = useClients();

  const initValues = useMemo((): IPersonDetail => {
    const client = clientSelected?.individualMetadata;

    return {
      title: client?.title ?? '',
      fullName: `${client?.firstname} ${client?.lastname}`,
      otherNames: `${client?.otherName ?? ''}`,
      dateOfBirth: client?.dateOfBirth
        ? formattedDate(client?.dateOfBirth, 'DD MMM YYYY')
        : '',
      email: masterClientSelected?.username ?? '',
      formerName: client?.formerName ?? '',
      emailVerify: masterClientSelected?.verifiedAt ? 'Yes' : 'No',
      gender: client?.gender ?? '',
      nationality: client?.nationality ?? '',
      phoneNumber: masterClientSelected?.contact?.mobileNumber ?? '',
      country: client?.country ?? '',
      placeOfBirth: client?.placeOfBirth ?? '',
    };
  }, [
    clientSelected?.individualMetadata,
    masterClientSelected?.contact?.mobileNumber,
    masterClientSelected?.username,
    masterClientSelected?.verifiedAt,
  ]);

  const redirectClients = useCallback(() => {
    return router.push('/clients');
  }, [router]);

  const handleSubmit = useCallback(
    async (data: IPersonDetail) => {
      try {
        if (!clientSelected) return redirectClients();
        if (!masterClientSelected) return redirectClients();

        setIsLoading(true);

        const nameIndexOf = data.fullName?.indexOf(' ');

        await postIndividualMetadata({
          clientUuid: clientSelected?.uuid ?? '',
          masterClientId: masterClientSelected?.uuid ?? '',

          individualMetadata: {
            ...clientSelected?.individualMetadata,
            title: data.title,
            firstname: data.fullName.substring(0, nameIndexOf),
            lastname: data.fullName.substring(nameIndexOf + 1),
            formerName: data.formerName,
            otherName: data?.otherNames,
            dateOfBirth: data?.dateOfBirth
              ? formattedDate(data?.dateOfBirth, 'DD MMM YYYY')
              : '',
            placeOfBirth: data?.placeOfBirth,
            country: data?.country,
            nationality: data?.nationality,
            gender: data?.gender,
          },
        });

        await updateDetailsOfRegistrar({
          uuid: masterClientSelected?.uuid ?? '',
          entityType: 'individual',
          businessRole: masterClientSelected?.contact?.businessRole ?? '',
          country: masterClientSelected?.contact?.country ?? '',
          firstname: masterClientSelected?.firstname ?? '',
          lastname: masterClientSelected?.lastname ?? '',

          email: data?.email,
          mobileNumber: data.phoneNumber,
          skipWelcomeEmail: data.emailVerify.toLowerCase(),
          verifiedAt: data.emailVerify.toLowerCase(),
        });

        onShowMessage({
          type: 'message',
          title: 'Personal details updated successfully.',
          description: '',
          isVisible: true,
          status: 'success',
          onClose: () => {
            getClientsInfo(clientSelected?.uuid ?? '');
            setMasterClientSelected({
              ...masterClientSelected,
              contact: {
                ...masterClientSelected.contact,
                mobileNumber: data.phoneNumber,
              },
              username: data.email,
              verifiedAt: data.emailVerify.toLowerCase(),
            });
            router.back();
          },
        });
      } catch (error) {
        onShowMessage({
          type: 'message',
          title: 'Account profile update request not save.',
          description: 'Error to save account profile',
          isVisible: true,
          status: 'fail',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      clientSelected,
      redirectClients,
      masterClientSelected,
      postIndividualMetadata,
      updateDetailsOfRegistrar,
      onShowMessage,
      getClientsInfo,
      setMasterClientSelected,
      router,
    ]
  );

  const formik = useFormik<IPersonDetail>({
    initialValues: initValues,
    validationSchema: validationForm,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <>
      <Container>
        <Text variant="headline_regular">Edit</Text>
        {isLoading ? (
          <Column>
            <Loading />
          </Column>
        ) : (
          <FormContainer>
            <Row
              align="center"
              style={{
                backgroundColor:
                  theme.backgroundColor.layout['container-L0'].value,
                padding: 16,
                borderRadius: 8,
                gap: 16,
              }}
            >
              <Icon
                variant="exclamation-circle"
                color={theme.textColor.feedback['icon-warning'].value}
              />
              <Text
                variant="body_sm_regular"
                color={theme.textColor.layout.secondary.value}
              >
                Updating this information will require validation before being
                applied.
              </Text>
            </Row>
            <Row gap="sm">
              <div style={{ width: 188 }}>
                <Select
                  options={titleOptions}
                  value={formik.values.title}
                  onChange={formik.handleChange('title')}
                  label="Title:"
                  error={formik.errors.title}
                />
              </div>
              <Input
                label="Full name"
                value={formik.values.fullName}
                onChange={formik.handleChange('fullName')}
                error={formik.errors.fullName}
              />
            </Row>
            <Input
              label="Former names"
              value={formik.values.formerName}
              onChange={formik.handleChange('formerName')}
              error={formik.errors.formerName}
            />
            <Input
              label="Other names"
              value={formik.values.otherNames}
              onChange={formik.handleChange('otherNames')}
              error={formik.errors.otherNames}
            />
            <SelectDate
              value={formik.values.dateOfBirth}
              format="DD MMM YYYY"
              onChange={formik.handleChange('dateOfBirth')}
              label="Date of birth:"
              error={formik.errors.dateOfBirth}
            />
            <Select
              showSearch
              options={countriesOptions}
              value={formik.values.placeOfBirth}
              onChange={formik.handleChange('placeOfBirth')}
              label="Place of birth:"
              error={formik.errors.placeOfBirth}
            />
            <Input
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange('email')}
              error={formik.errors.email}
            />
            <Select
              showSearch
              options={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
              ]}
              value={formik.values.emailVerify}
              onChange={formik.handleChange('emailVerify')}
              label="Email verified"
              error={formik.errors.emailVerify}
            />
            <Input
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={(v) => formik.setFieldValue('phoneNumber', v)}
              error={formik.errors.phoneNumber}
              variant="phoneNumber"
            />
            <Select
              showSearch
              label="Country"
              options={countriesOptions}
              value={formik.values.country}
              error={formik.errors.country}
              onChange={formik.handleChange('country')}
            />
            <Select
              showSearch
              label="Nationality"
              options={countriesOptions}
              value={formik.values.nationality}
              error={formik.errors.nationality}
              onChange={formik.handleChange('nationality')}
            />
            <Select
              showSearch
              label="Gender"
              options={genderOption}
              value={formik.values.gender}
              error={formik.errors.gender}
              onChange={formik.handleChange('gender')}
            />

            <Row gap="sm" style={{ alignSelf: 'center', marginTop: 24 }}>
              <Button
                onClick={router.back}
                roundness="rounded"
                variant="secondary"
                text="Cancel"
              />
              <Button
                roundness="rounded"
                text="Save Changes"
                disabled={formik.isSubmitting || !formik.isValid}
                onClick={() => {
                  onShowMessage({
                    isVisible: true,
                    title: 'Are you sure you wish to proceed with the change?',
                    type: 'question',
                    onConfirm: () => formik.handleSubmit(),
                  });
                }}
              />
            </Row>
          </FormContainer>
        )}
      </Container>
    </>
  );
}
