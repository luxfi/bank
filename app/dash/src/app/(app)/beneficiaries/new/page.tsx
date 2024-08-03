'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

import { BackButton } from '@/components/BackButton';
import Input from '@/components/Input';
import Select from '@/components/Select';
import SelectCurrencies from '@/components/SelectCurrencyCountry';

import { countries } from '@/models/countries';

import { useNotification } from '@/context/Notification';

import { atLeastTwoFieldsValidation } from '@/utils/atLeastTwoFieldsYupValidator';
import { convertMapInOptionList } from '@/utils/lib';

import { CountriesList } from '@/lib/constants';

import { Button, Icon, useTheme } from '@luxbank/ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { getBeneficiaryDetails } from '@/api/beneficiaries';

import { IFormParams } from '../type';
import {
  ActionContainer,
  Container,
  Content,
  ContentContainer,
  TagContainer,
  TagSubtitle,
  TagTitle,
  Title,
  TwoContent,
} from './styles';

const validationForm = Yup.object({
  entityType: Yup.string().required('Select entity type'),
  address: Yup.string().required('Enter Address'),
  addressLine2: Yup.string(),
  postCode: Yup.string().required('Enter Postcode'),
  city: Yup.string().required('Enter City'),
  state: Yup.string().required('Enter State'),
  country: Yup.string().required('Enter Country'),
  bankAccountCountry: Yup.string()
    .required('Please select a Bank Country')
    .oneOf(Array.from(countries.keys())),
  currency: Yup.string().required('Enter Currency'),

  firstName: Yup.string().when('entityType', {
    is: 'individual',
    then: () => Yup.string().required('Please enter the First Name'),
    otherwise: () => Yup.string().nullable(),
  }),
  lastName: Yup.string().when('entityType', {
    is: 'individual',
    then: () => Yup.string().required('Please enter the Last Name'),
    otherwise: () => Yup.string().nullable(),
  }),
  companyName: Yup.string().when('entityType', {
    is: 'business',
    then: () => Yup.string().required('Please enter the Company Name'),
    otherwise: () => Yup.string().nullable(),
  }),

  iban: Yup.string()
    .min(15, 'IBAN needs to have 15 to 34 digits.')
    .max(34, 'IBAN needs to have 15 to 34 digits.')
    .matches(/^([A-Z0-9]\s*){15,34}$/, 'Please enter a valid IBAN.')
    .concat(
      atLeastTwoFieldsValidation(['bicSwift', 'accountNumber', 'sortCode'])
    ),

  bicSwift: Yup.string()
    .min(8, 'BIC SWIFT needs to have 8 to 11 digits.')
    .max(11, 'BIC SWIFT needs to have 8 to 11 digits.')
    .matches(/^[0-9A-Z]{8}$|^[0-9A-Z]{11}$/, 'Please enter a valid BIC SWIFT.')
    .concat(atLeastTwoFieldsValidation(['iban', 'accountNumber', 'sortCode'])),

  accountNumber: Yup.string()
    .min(8, 'Account number needs to be 8 digits.')
    .max(8, 'Account number needs to be 8 digits.')
    .matches(/^[0-9]{8}$/, 'Please enter a valid account number.')
    .concat(atLeastTwoFieldsValidation(['iban', 'bicSwift', 'sortCode'])),

  sortCode: Yup.string()
    .min(6, 'Sort code needs to be 6 digits.')
    .max(6, 'Sort code needs to be 6 digits.')
    .matches(/^[0-9]{6}$/, 'Please enter a valid sort code.')
    .concat(atLeastTwoFieldsValidation(['iban', 'bicSwift', 'accountNumber'])),
});

export default function BeneficiariesNew() {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onShowNotification } = useNotification();

  const data: IFormParams = useMemo(() => {
    const entries = searchParams.entries();
    const obj = Object.fromEntries(entries);
    return obj as unknown as IFormParams;
  }, [searchParams]);

  const handleSubmit = useCallback(
    async (formData: IFormParams) => {
      router.push(
        `/beneficiaries/review?${Object.entries(formData)
          .map(([key, value]) => (value ? `&${key}=${value}` : ''))
          .join('')}${data.id ? `&id=${data.id}` : ''}`
      );
    },
    [data.id, router]
  );

  const formik = useFormik<IFormParams>({
    initialValues: {
      address: data?.address || '',
      postCode: data?.postCode || '',
      addressLine2: data?.addressLine2 || '',
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      companyName: data?.companyName || '',
      bankAccountCountry: data?.bankAccountCountry || '',
      city: data?.city || '',
      state: data?.state || '',
      country: data?.country || '',
      currency: data?.currency || '',
      entityType: data?.entityType || '',
      accountNumber: data?.accountNumber || '',
      bicSwift: data?.bicSwift || '',
      sortCode: data?.sortCode || '',
      iban: data?.iban || '',
    },
    onSubmit: (v) => {
      handleSubmit(v);
    },
    validationSchema: validationForm,
    validateOnChange: true,
  });

  const getBeneficiary = useCallback(async () => {
    await getBeneficiaryDetails(data?.id ?? '').then(({ data }) => {
      formik
        .setValues({
          entityType: data?.entityType ?? 'individual',
          currency: data?.currency ?? '',
          firstName: data?.firstName ?? '',
          lastName: data?.lastName ?? '',

          companyName: data?.companyName ?? '',

          address: data?.address ?? '',
          addressLine2: data.addressLine2 ?? '',
          city: data?.city ?? '',
          country: data?.country ?? '',
          postCode: data?.postCode ?? '',
          state: data?.state ?? '',

          bicSwift: data?.bicSwift ?? '',
          accountNumber: data?.accountNumber ?? '',
          bankAccountCountry: data?.bankCountry ?? '',
          iban: data?.iban ?? '',
          sortCode: data?.sortCode ?? '',
        })
        .catch(() => {
          onShowNotification({
            type: 'ERROR',
            message: 'Error',
            description: '',
          });
        });
    });
  }, [formik, data, onShowNotification]);

  useEffect(() => {
    if (data?.id) getBeneficiary();
  }, [data]);

  return (
    <Container>
      <BackButton>
        <Title>{data.id ? 'Edit Beneficiary' : 'Add Beneficiary'}</Title>
      </BackButton>
      <ContentContainer>
        <Content>
          <TagContainer>
            <TagTitle>Beneficiary Detail</TagTitle>
          </TagContainer>

          <Select
            label="Entity Type"
            value={formik.values.entityType}
            onChange={formik.handleChange('entityType')}
            error={formik?.errors?.entityType ?? ''}
            options={[
              { label: 'Individual', value: 'individual' },
              { label: 'Business', value: 'business' },
            ]}
          />

          {formik.values.entityType === 'business' ? (
            <Input
              label="Company Name"
              value={formik.values.companyName}
              onChange={formik.handleChange('companyName')}
              error={formik?.errors?.companyName ?? ''}
            />
          ) : (
            <TwoContent>
              <Input
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange('firstName')}
                error={formik?.errors?.firstName ?? ''}
              />
              <Input
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange('lastName')}
                error={formik?.errors?.lastName ?? ''}
              />
            </TwoContent>
          )}

          <Input
            label="Address"
            value={formik.values.address}
            onChange={formik.handleChange('address')}
            error={formik?.errors?.address ?? ''}
          />
          <Input
            label="Address Line 2"
            value={formik.values.addressLine2}
            onChange={formik.handleChange('addressLine2')}
            error={formik?.errors?.addressLine2 ?? ''}
          />

          <TwoContent>
            <Input
              label="Postcode"
              value={formik.values.postCode}
              onChange={formik.handleChange('postCode')}
              error={formik?.errors?.postCode ?? ''}
            />
            <Input
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange('city')}
              error={formik?.errors?.city ?? ''}
            />
          </TwoContent>

          <TwoContent>
            <Input
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange('state')}
              error={formik?.errors?.state ?? ''}
            />
            <Select
              label="Country"
              value={formik.values.country}
              onChange={formik.handleChange('country')}
              error={formik?.errors?.country ?? ''}
              showSearch
              options={convertMapInOptionList(CountriesList)}
            />
          </TwoContent>

          <TagContainer>
            <TagTitle>Currency Bank Detail</TagTitle>
          </TagContainer>

          <TwoContent>
            <Select
              label="Bank Account Country*"
              value={formik.values.bankAccountCountry}
              onChange={formik.handleChange('bankAccountCountry')}
              error={formik?.errors?.bankAccountCountry ?? ''}
              options={convertMapInOptionList(CountriesList)}
              showSearch
            />
            <SelectCurrencies
              label="Currency"
              value={formik.values.currency}
              onChange={formik.handleChange('currency')}
              error={formik?.errors?.currency ?? ''}
            />
          </TwoContent>

          <TwoContent>
            <Input
              label="IBAN"
              value={formik.values.iban}
              onChange={formik.handleChange('iban')}
              error={formik?.errors?.iban ?? ''}
            />
            <Input
              label="BIC SWIFT"
              value={formik.values.bicSwift}
              onChange={formik.handleChange('bicSwift')}
              error={formik?.errors?.bicSwift ?? ''}
            />
          </TwoContent>

          <TwoContent>
            <Input
              label="Account Number"
              value={formik.values.accountNumber}
              onChange={formik.handleChange('accountNumber')}
              error={formik?.errors?.accountNumber ?? ''}
            />
            <Input
              label="Sort Code"
              value={formik.values.sortCode}
              onChange={formik.handleChange('sortCode')}
              error={formik?.errors?.sortCode ?? ''}
            />
          </TwoContent>

          <TagContainer style={{ display: 'flex', gap: 8, padding: 16 }}>
            <Icon
              variant="exclamation-circle"
              color={theme.textColor.feedback['icon-warning'].value}
            />
            <TagSubtitle>{`To add a beneficiary, you need to include at least one of the two options in the banking details: IBAN and BIC/SWIFT or Account Number and Sort Code.`}</TagSubtitle>
          </TagContainer>

          <ActionContainer>
            <Button
              onClick={router.back}
              text="Cancelar"
              variant="secondary"
              roundness="rounded"
            />
            <Button
              text="Confirm Beneficiary"
              variant="primary"
              roundness="rounded"
              onClick={() => formik?.handleSubmit}
            />
          </ActionContainer>
        </Content>
      </ContentContainer>
    </Container>
  );
}
