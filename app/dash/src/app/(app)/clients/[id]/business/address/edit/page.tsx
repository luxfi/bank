'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import Input from '@/components/Input';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { Button, Row, Text } from '@luxbank/ui';
import { useFormik } from 'formik';

import { IAddress } from '../types';
import { Container, FormContainer } from './styles';

export default function AddressEdit() {
  const { back } = useRouter();
  const {
    masterClientSelected,
    postBusinessMetadata,
    getClientsInfo,
    clientSelected,
  } = useClients();
  const { onShowMessage } = useMessages();

  const company = clientSelected?.businessMetadata;

  const handleSubmit = useCallback(
    async (data: IAddress) => {
      await postBusinessMetadata({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        businessMetadata: {
          ...(clientSelected?.businessMetadata as any),
          address1: data.addressLine1,
          address2: data.addressLine2,
          registeredOffice1_postcode: data.postcode,
          registeredOffice1_city: data.city,
          registeredOffice1_state: data.state,
          registeredOffice1: data.registeredOffice1,
          registeredOffice2: data.registeredOffice2,
          principalPlace: data.principalPlaceOfBusiness,
          mailingAddress: data.mailingAddress,

          previousOffice1: data.previousOffice1,
          previousOffice2: data.previousOffice2,
          previousOffice3: data.previousOffice3,
        },
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: 'Address updated successfully.',
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

  const formik = useFormik<IAddress>({
    initialValues: {
      addressLine1: company?.address1 ?? '',
      addressLine2: company?.address2 ?? '',
      postcode: company?.registeredOffice1_postcode ?? '',
      city: company?.registeredOffice1_city ?? '',
      state: company?.registeredOffice1_state ?? '',
      registeredOffice1: company?.registeredOffice1 ?? '',
      registeredOffice2: company?.registeredOffice2 ?? '',
      principalPlaceOfBusiness: company?.principalPlace ?? '',
      mailingAddress: company?.mailingAddress ?? '',
      country: company?.countryOfRegistration ?? '',

      previousOffice1: company?.previousOffice1 ?? '',
      previousOffice2: company?.previousOffice2 ?? '',
      previousOffice3: company?.previousOffice3 ?? '',
    },
    validateOnChange: false,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Input
          label="Address Line 1"
          value={formik.values.addressLine1}
          onChange={formik.handleChange('addressLine1')}
        />

        <Input
          label={'Address Line 2'}
          value={formik.values.addressLine2}
          onChange={formik.handleChange('addressLine2')}
        />

        <Input
          label="Postcode"
          value={formik.values.postcode}
          onChange={formik.handleChange('postcode')}
        />

        <Input
          label="City"
          value={formik.values.city}
          onChange={formik.handleChange('city')}
        />

        <Input
          label="State"
          value={formik.values.state}
          onChange={formik.handleChange('state')}
        />

        <Input
          value={formik.values.registeredOffice1}
          label="Registered Office 1"
          onChange={formik.handleChange('registeredOffice1')}
        />

        <Input
          label="Registered Office 2"
          value={formik.values.registeredOffice2}
          onChange={formik.handleChange('registeredOffice2')}
        />

        <Input
          label="Principal place of business"
          value={formik.values.principalPlaceOfBusiness}
          onChange={formik.handleChange('principalPlaceOfBusiness')}
        />

        <Input
          label="Mailing address"
          value={formik.values.mailingAddress}
          onChange={formik.handleChange('mailingAddress')}
        />

        <Input
          label="Previous Registered Office 1"
          value={formik.values.previousOffice1}
          onChange={formik.handleChange('previousOffice1')}
        />

        <Input
          label="Previous Registered Office 2"
          value={formik.values.previousOffice2}
          onChange={formik.handleChange('previousOffice2')}
        />

        <Input
          label="Previous Registered Office 3"
          value={formik.values.previousOffice3}
          onChange={formik.handleChange('previousOffice3')}
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
