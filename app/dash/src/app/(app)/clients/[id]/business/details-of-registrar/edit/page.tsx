'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';

import { useMessages } from '@/context/Messages';

import { convertMapInOptionList } from '@/utils/lib';

import { whoTheyAreOptions } from '@/app/(app)/clients/types';
import { useClients } from '@/store/useClient';
import { Button, Row, Text } from '@luxbank/ui';
import { useFormik } from 'formik';

import { Container, FormContainer } from './styles';

interface IForm {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: string;
  phoneNumber: string;
  businessRole: string;
}

export default function PersonalDetailsEdit() {
  const { back } = useRouter();
  const {
    masterClientSelected,
    clientSelected,
    updateDetailsOfRegistrar,
    setMasterClientSelected,
  } = useClients();
  const { onShowMessage } = useMessages();

  const handleSubmit = useCallback(
    async (data: IForm) => {
      if (!masterClientSelected) return;

      await updateDetailsOfRegistrar({
        uuid: masterClientSelected.uuid,
        businessRole: data.businessRole,
        country: masterClientSelected.contact.country,
        email: masterClientSelected.username,
        entityType: clientSelected?.businessMetadata
          ? 'business'
          : 'individual',
        firstname: data.firstName,
        lastname: data.lastName,
        mobileNumber: data.phoneNumber,
        skipWelcomeEmail: data.emailVerified.toLowerCase(),
        verifiedAt: data.emailVerified,
      })
        .then(() => {
          setMasterClientSelected({
            ...masterClientSelected,
            contact: {
              ...masterClientSelected.contact,
              businessRole: data.businessRole,
              mobileNumber: data.phoneNumber,
            },
            firstname: data.firstName,
            lastname: data.lastName,
          });

          onShowMessage({
            isVisible: true,
            title: 'Details of registrar updated successfully.',
            type: 'message',
            status: 'success',
            description: '',
            onClose: () => back(),
          });
        })
        .catch(() =>
          onShowMessage({
            isVisible: true,
            title: 'Error updating details of registrar.',
            type: 'message',
            status: 'fail',
            description: '',
            onClose: () => back(),
          })
        );
    },
    [
      back,
      clientSelected?.businessMetadata,
      masterClientSelected,
      onShowMessage,
      setMasterClientSelected,
      updateDetailsOfRegistrar,
    ]
  );

  const formik = useFormik<IForm>({
    initialValues: {
      firstName: masterClientSelected?.firstname ?? '',
      lastName: masterClientSelected?.lastname ?? '',
      email: masterClientSelected?.username ?? '',
      emailVerified: masterClientSelected?.verifiedAt ? 'Yes' : 'No',
      phoneNumber: masterClientSelected?.contact?.mobileNumber ?? '',
      businessRole: masterClientSelected?.contact?.businessRole ?? '',
    },
    validateOnChange: false,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Row gap="md">
          <Input
            label="First name"
            value={formik.values.firstName}
            onChange={formik.handleChange('firstName')}
            disabled={!!masterClientSelected?.firstname}
          />
          <Input
            label="Last name"
            value={formik.values.lastName}
            onChange={formik.handleChange('lastName')}
            disabled={!!masterClientSelected?.lastname}
          />
        </Row>
        <Input
          disabled
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange('email')}
        />
        <Select
          label={'Email verified'}
          value={formik.values.emailVerified}
          onChange={formik.handleChange('emailVerified')}
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
        />
        <Input
          label="Phone number"
          value={formik.values.phoneNumber}
          onChange={(v) => formik.setFieldValue('phoneNumber', v)}
          variant="phoneNumber"
        />
        <Select
          label="Who they are"
          value={formik.values.businessRole}
          onChange={formik.handleChange('businessRole')}
          options={convertMapInOptionList(whoTheyAreOptions)}
          showSearch
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
            text="Save Changes"
            onClick={() =>
              onShowMessage({
                isVisible: true,
                title: 'Are you sure wish to proceed with the change?',
                type: 'question',
                onConfirm: () => {
                  formik.handleSubmit();
                },
              })
            }
          />
        </Row>
      </FormContainer>
    </Container>
  );
}
