'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import Select from '@/components/Select';
import SelectDate from '@/components/SelectDate';

import { useMessages } from '@/context/Messages';

import { countriesOptions } from '@/utils/lib';

import { useClients } from '@/store/useClient';
import { Button, Column, Row, Text } from '@luxbank/ui';
import dayjs from 'dayjs';
import { useFormik } from 'formik';

import { Container, FormContainer } from './styles';

interface IForm {
  entityType: 'individual' | 'business';
  fullName: string;
  dateOfBirth?: string;
  occupation?: string;
  phoneNumber: string;
  companyType?: string;
  email: string;
  nationality?: string;
  shareHeld: string;
  address1: string;
  address2: string;
  previousAddress1: string;
  previousAddress2: string;
  country: string;
  state: string;
}

export default function ShareholdersEdit() {
  const searchParams = useSearchParams();
  const { back } = useRouter();
  const {
    masterClientSelected,
    clientSelected,
    postShareholder,
    getClientsInfo,
  } = useClients();
  const { onShowMessage } = useMessages();

  const [loading, setLoading] = useState(false);

  const editingShareholder = useMemo(() => {
    return clientSelected?.shareholders?.find(
      (shareholder) => shareholder.uuid === searchParams.get('uuid')
    );
  }, [clientSelected?.shareholders, searchParams]);

  const handleSubmit = useCallback(
    async (data: IForm) => {
      if (!masterClientSelected?.uuid) return;
      if (!clientSelected?.uuid) return;
      setLoading(true);

      const shareholders =
        clientSelected?.shareholders?.filter(
          (item) => item.uuid !== editingShareholder?.uuid
        ) || [];

      await postShareholder({
        clientId: clientSelected?.uuid,
        masterClientId: masterClientSelected.uuid,
        shareholders: [
          ...shareholders,
          {
            entityType: data.entityType,
            fullName: data.fullName,
            dob: data?.dateOfBirth
              ? dayjs(data?.dateOfBirth).format('YYYY-MM-DD')
              : '',
            telephoneNumber: data.phoneNumber,
            email: data.email,
            shares: data.shareHeld,
            address1: data.address1,
            address2: data.address2,
            previousAddress1: data.previousAddress1,
            previousAddress2: data.previousAddress2,
            country: data.country,
            state: data.state,
            nationality: data?.nationality,
            occupation: data?.occupation,
            companyType: data?.companyType,
          },
        ],
      })
        .then(() => {
          getClientsInfo(clientSelected.uuid);

          onShowMessage({
            isVisible: true,
            title: editingShareholder
              ? `The shareholder details has been updated`
              : `The shareholder ${data.fullName} has been added`,
            type: 'message',
            status: 'success',
            description: '',
            onClose: () => back(),
          });
        })
        .catch(() => {
          onShowMessage({
            isVisible: true,
            title: 'Error saving shareholder data.',
            type: 'message',
            status: 'fail',
            description: '',
            // onClose: () => back(),
          });
        })
        .finally(() => setLoading(false));
    },
    [
      back,
      clientSelected?.shareholders,
      clientSelected?.uuid,
      editingShareholder?.uuid,
      getClientsInfo,
      masterClientSelected?.uuid,
      onShowMessage,
      postShareholder,
      searchParams,
    ]
  );

  const formik = useFormik<IForm>({
    initialValues: {
      entityType: (editingShareholder?.entityType || 'individual') as any,
      fullName: editingShareholder?.fullName || '',
      dateOfBirth: editingShareholder?.dob || '',
      companyType: editingShareholder?.companyType || '',
      occupation: editingShareholder?.occupation || '',
      phoneNumber: editingShareholder?.telephoneNumber || '',
      email: editingShareholder?.email || '',
      nationality: editingShareholder?.nationality || '',
      shareHeld: editingShareholder?.shares || '',
      address1: editingShareholder?.address1 || '',
      address2: editingShareholder?.address1 || '',
      previousAddress1: editingShareholder?.previousAddress1 || '',
      previousAddress2: editingShareholder?.previousAddress2 || '',
      country: editingShareholder?.country || '',
      state: editingShareholder?.state || '',
    },
    validateOnChange: false,
    onSubmit: (data) => handleSubmit(data),
  });

  const companyTypeOptions = useMemo(
    () => [
      { value: 'LIMITED_LIABILITY', label: 'Limited Liability' },
      { value: 'SOLE_TRADER', label: 'Sole Trader' },
      { value: 'PARTNERSHIP', label: 'Partnership' },
      { value: 'CHARITY', label: 'Charity' },
      { value: 'JOINT_STOCK_COMPANY', label: 'Joint Stock Company' },
      { value: 'PUBLIC_LIMITED_COMPANY', label: 'Public Limited Company' },
    ],
    []
  );

  const allowedKeys = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Home',
    'End',
  ];

  return (
    <Container>
      <Text variant="headline_regular">Edit Shareholder</Text>
      {loading ? (
        <Column width="100%" align="center" height="600px" justify="center">
          <Loading />
        </Column>
      ) : (
        <FormContainer>
          <Select
            label={'Type'}
            value={formik.values.entityType}
            onChange={formik.handleChange('entityType')}
            options={[
              { label: 'Business', value: 'business' },
              { label: 'Individual', value: 'individual' },
            ]}
          />

          <Input
            label="Full name"
            value={formik.values.fullName}
            onChange={formik.handleChange('fullName')}
          />

          {formik.values.entityType === 'individual' && (
            <SelectDate
              label="Date of birth"
              format="DD MMM YYYY"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange('dateOfBirth')}
            />
          )}

          {formik.values.entityType === 'individual' && (
            <Input
              label="Occupation"
              value={formik.values.occupation}
              onChange={formik.handleChange('occupation')}
            />
          )}

          <Input
            variant="phoneNumber"
            label="Phone number"
            value={formik.values.phoneNumber}
            onChange={(v) => formik.setFieldValue('phoneNumber', v)}
          />

          <Input
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange('email')}
            type="email"
          />

          {formik.values.entityType === 'business' && (
            <Select
              label={'Company Type'}
              value={formik.values.companyType}
              onChange={formik.handleChange('companyType')}
              options={companyTypeOptions}
            />
          )}

          {formik.values.entityType === 'individual' && (
            <Select
              showSearch
              label={'Nationality'}
              value={formik.values.nationality}
              onChange={formik.handleChange('nationality')}
              options={countriesOptions}
            />
          )}

          <Input
            label="Shares Held"
            value={formik.values.shareHeld}
            onChange={formik.handleChange('shareHeld')}
            onKeyDown={(e) => {
              if (allowedKeys.includes(e.key)) {
                return;
              }
              if (!/^[0-9]$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />

          <Input
            label="Address 1"
            value={formik.values.address1}
            onChange={formik.handleChange('address1')}
          />

          <Input
            label="Address 2"
            value={formik.values.address2}
            onChange={formik.handleChange('address2')}
          />

          <Input
            label="Previous Address 1"
            value={formik.values.previousAddress1}
            onChange={formik.handleChange('previousAddress1')}
          />

          <Input
            label="Previous Address 2"
            value={formik.values.previousAddress2}
            onChange={formik.handleChange('previousAddress2')}
          />

          <Input
            label="State"
            value={formik.values.state}
            onChange={formik.handleChange('state')}
          />

          <Select
            showSearch
            label={'Country'}
            value={formik.values.country}
            onChange={formik.handleChange('country')}
            options={countriesOptions}
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
                  onConfirm: formik.handleSubmit,
                })
              }
            />
          </Row>
        </FormContainer>
      )}
    </Container>
  );
}
