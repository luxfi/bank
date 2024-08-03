'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';
import SelectDate from '@/components/SelectDate';

import { useMessages } from '@/context/Messages';

import { convertMapInOptionList } from '@/utils/lib';

import { CountriesList } from '@/lib/constants';

import { useClients } from '@/store/useClient';
import { Button, Row, Text } from '@luxbank/ui';
import { useFormik } from 'formik';

import { IForm, companyType } from '../types';
import { Container, FormContainer } from './styles';

export default function PersonalDetailsEdit() {
  const { back } = useRouter();
  const {
    masterClientSelected,
    clientSelected,
    getClientsInfo,
    postBusinessMetadata,
  } = useClients();

  const { onShowMessage } = useMessages();

  const company = clientSelected?.businessMetadata;

  const handleSubmit = useCallback(
    async (data: IForm) => {
      await postBusinessMetadata({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        businessMetadata: {
          ...(clientSelected?.businessMetadata as any),

          companyName: data.companyName,
          companyType: data.companyType,
          tradingName: !data.tradingName ? null : data.tradingName,
          otherTradingNames: !data.otherTradingName
            ? null
            : data.otherTradingName,
          legalEntity: !data.legalEntity ? null : data.legalEntity,
          email: !data.email ? null : data.email,
          isPubliclyTrading: data.publicityTrading === 'Yes' ? true : false,
          telephoneNumber: !data.phoneNumber ? null : data.phoneNumber,
          countryOfRegistration: !data.countryOfRegistration
            ? null
            : data.countryOfRegistration,
          companyRegistrationNumber: !data.companyRegNumber
            ? null
            : data.companyRegNumber,
          vatNumber: !data.vatNumber ? null : data.vatNumber,
          dateOfRegistration: data.dateOfIncorporation,
          dateOfIncorporation: data.dateOfIncorporation,
          websiteUrl: !data.website ? null : data.website,
          otherContactInfo: !data.otherContactInfo
            ? null
            : data.otherContactInfo,
          statutoryProvision: !data.statutory ? null : data.statutory,
          stockMarketLocation: !data.whereListed ? null : data.whereListed,
          stockMarket: !data.whichMarket ? null : data.whichMarket,
          regulatorName: !data.nameOfRegulator ? null : data.nameOfRegulator,
        },
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: 'Company updated successfully.',
            description: '',
            isVisible: true,
            status: 'success',
            onClose: () => {
              getClientsInfo(clientSelected?.uuid ?? '');
              back();
            },
          })
        )
        .catch(() =>
          onShowMessage({
            type: 'message',
            title: 'Account profile update request not save.',
            description: 'Error to save account profile',
            isVisible: true,
            status: 'fail',
          })
        );
    },
    [
      back,
      clientSelected,
      getClientsInfo,
      masterClientSelected,
      onShowMessage,
      postBusinessMetadata,
    ]
  );

  const formik = useFormik<IForm>({
    initialValues: {
      companyName: company?.companyName ?? '',
      companyType: company?.companyType ?? '',
      tradingName: company?.tradingName ?? '',
      otherTradingName: company?.otherTradingNames ?? '',
      legalEntity: company?.legalEntity ?? '',
      email: company?.email ?? '',
      phoneNumber: company?.telephoneNumber ?? '',
      countryOfRegistration: company?.countryOfRegistration ?? '',
      companyRegNumber: company?.companyRegistrationNumber ?? '',
      vatNumber: company?.vatNumber ?? '',
      dateOfRegistration: company?.dateOfRegistration ?? '',
      dateOfIncorporation: company?.dateOfIncorporation ?? '',
      website: company?.websiteUrl ?? '',
      otherContactInfo: company?.otherContactInfo ?? '',
      statutory: company?.statutoryProvision ?? '',
      publicityTrading: company?.isPubliclyTrading ? 'Yes' : 'No',
      whereListed: company?.stockMarketLocation ?? '',
      whichMarket: company?.stockMarket ?? '',
      nameOfRegulator: company?.regulatorName ?? '',
    },
    validateOnChange: false,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Input
          label="Company name"
          value={formik.values.companyName}
          onChange={formik.handleChange('companyName')}
          warning={
            !formik.values.companyName ? 'Please enter the company name' : ''
          }
        />

        <Select
          label={'Company type'}
          value={formik.values.companyType}
          onChange={formik.handleChange('companyType')}
          options={companyType}
          warning={
            !formik.values.companyType ? 'Please select the company type' : ''
          }
        />

        <Input
          label="Trading name"
          value={formik.values.tradingName}
          onChange={formik.handleChange('tradingName')}
          warning={
            !formik.values.tradingName ? 'Please enter the trading name' : ''
          }
        />

        <Input
          label="Other trading names"
          value={formik.values.otherTradingName}
          onChange={formik.handleChange('otherTradingName')}
        />

        <Input
          label="Legal entity"
          value={formik.values.legalEntity}
          onChange={formik.handleChange('legalEntity')}
          warning={
            !formik.values.legalEntity ? 'Please enter the legal entity' : ''
          }
        />

        <Input
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange('email')}
          warning={!formik.values.email ? 'Please enter the email' : ''}
        />

        <Input
          label="Phone number"
          value={formik.values.phoneNumber}
          onChange={(v) => formik.setFieldValue('phoneNumber', v)}
          variant="phoneNumber"
        />

        <Select
          label="Country of registration"
          value={formik.values.countryOfRegistration}
          onChange={formik.handleChange('countryOfRegistration')}
          options={convertMapInOptionList(CountriesList)}
          showSearch
          warning={
            !formik.values.countryOfRegistration
              ? 'Please select the country of registration'
              : ''
          }
        />

        <Input
          label="Company reg number"
          value={formik.values.companyRegNumber}
          onChange={formik.handleChange('companyRegNumber')}
          warning={
            !formik.values.companyRegNumber
              ? 'Please enter the company reg number'
              : ''
          }
        />

        <Input
          label="Tax/VAT number"
          value={formik.values.vatNumber}
          onChange={formik.handleChange('vatNumber')}
          warning={
            !formik.values.vatNumber ? 'Please enter the tax/VAT number' : ''
          }
        />

        <SelectDate
          label="Date of registration"
          format="YYYY-MM-DD"
          value={formik.values.dateOfRegistration}
          onChange={formik.handleChange('dateOfRegistration')}
          warning={
            !formik.values.dateOfRegistration
              ? 'Please enter the date of registration'
              : ''
          }
        />

        <SelectDate
          label="Date of incorporation"
          format="YYYY-MM-DD"
          value={formik.values.dateOfIncorporation}
          onChange={formik.handleChange('dateOfIncorporation')}
          warning={
            !formik.values.dateOfIncorporation
              ? 'Please enter the date of incorporation'
              : ''
          }
        />

        <Input
          label="Website"
          value={formik.values.website}
          onChange={formik.handleChange('website')}
          warning={!formik.values.website ? 'Please enter the website' : ''}
        />

        <Input
          label="Other contact info"
          value={formik.values.otherContactInfo}
          onChange={formik.handleChange('otherContactInfo')}
        />

        <Input
          label="Statutory provision under which it is incorporated"
          value={formik.values.statutory}
          onChange={formik.handleChange('statutory')}
          warning={
            !formik.values.statutory
              ? 'Please enter the statutory provision under which it is incorporated'
              : ''
          }
        />

        <Select
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
          label="Publicly trading"
          value={formik.values.publicityTrading}
          onChange={formik.handleChange('publicityTrading')}
          warning={
            !formik.values.publicityTrading
              ? 'Please select the publicly trading'
              : ''
          }
        />

        <Input
          label="Where listed"
          value={formik.values.whereListed}
          onChange={formik.handleChange('whereListed')}
          warning={
            !formik.values.whereListed ? 'Please enter the where listed' : ''
          }
        />

        <Input
          label="Which market"
          value={formik.values.whichMarket}
          onChange={formik.handleChange('whichMarket')}
          warning={
            !formik.values.whichMarket ? 'Please enter the which market' : ''
          }
        />

        <Input
          label="Name of regulator"
          value={formik.values.nameOfRegulator}
          onChange={formik.handleChange('nameOfRegulator')}
          warning={
            !formik.values.nameOfRegulator
              ? 'Please enter the name of regulator'
              : ''
          }
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
