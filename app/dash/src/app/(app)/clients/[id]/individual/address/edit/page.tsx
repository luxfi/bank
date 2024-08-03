'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';

import { useMessages } from '@/context/Messages';

import { countriesOptions } from '@/utils/lib';

import { useClients } from '@/store/useClient';
import { Button, Icon, Row, Text, useTheme } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { IAddress, validationForm } from '../types';
import { Container, FormContainer } from './styles';

export default function AddressEdit() {
  const { theme } = useTheme();
  const { onShowMessage } = useMessages();
  const { back } = useRouter();
  const {
    postIndividualMetadata,
    clientSelected,
    masterClientSelected,
    getClientsInfo,
  } = useClients();

  const [, setLoading] = useState(false);

  const init = useMemo((): IAddress => {
    const addressDetails = clientSelected?.individualMetadata;

    return {
      addressLine1: addressDetails?.addressLine1 ?? '',
      addressLine2: addressDetails?.addressLine2 ?? '',
      city: addressDetails?.city ?? '',
      country: addressDetails?.country ?? '',
      postcode: addressDetails?.postcode ?? '',
      state: addressDetails?.state ?? '',

      previousAddressLine1: addressDetails?.previousAddressLine1 ?? '',
      previousAddressLine2: addressDetails?.previousAddressLine2 ?? '',
      previousCity: addressDetails?.previousCity ?? '',
      previousPostcode: addressDetails?.previousPostcode ?? '',
      previousCountry: addressDetails?.previousCountry ?? '',
      previousState: addressDetails?.previousState ?? '',
    };
  }, [clientSelected]);

  const handleSubmit = useCallback(
    async (data: IAddress) => {
      setLoading(true);
      await postIndividualMetadata({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        individualMetadata: {
          ...(clientSelected?.individualMetadata as any),
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          country: data.country,
          postcode: data.postcode,
          state: data.state,

          previousAddressLine1: data.previousAddressLine1,
          previousAddressLine2: data.previousAddressLine2,
          previousCity: data.previousCity,
          previousPostcode: data.previousPostcode,
          previousCountry: data.previousCountry,
          previousState: data.previousState,
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
            title: 'Error address saving data.',
            description: '',
            isVisible: true,
            status: 'fail',
          })
        )
        .finally(() => setLoading(false));
    },
    [
      postIndividualMetadata,
      masterClientSelected?.uuid,
      clientSelected?.uuid,
      getClientsInfo,
      clientSelected?.individualMetadata,
      onShowMessage,
      back,
    ]
  );

  const formik = useFormik<IAddress>({
    initialValues: init,
    validationSchema: validationForm,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Row
          align="center"
          style={{
            backgroundColor: theme.backgroundColor.layout['container-L0'].value,
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
        <Input
          label="Address Line 1"
          value={formik.values.addressLine1}
          error={formik.errors.addressLine1}
          onChange={formik.handleChange('addressLine1')}
        />
        <Input
          label="Address Line 2"
          value={formik.values.addressLine2}
          error={formik.errors.addressLine2}
          onChange={formik.handleChange('addressLine2')}
        />

        <Input
          label="Postcode"
          value={formik.values.postcode}
          error={formik.errors.postcode}
          onChange={formik.handleChange('postcode')}
        />

        <Input
          label="City"
          value={formik.values.city}
          error={formik.errors.city}
          onChange={formik.handleChange('city')}
        />

        <Input
          label="State"
          value={formik.values.state}
          error={formik.errors.state}
          onChange={formik.handleChange('state')}
        />

        <Select
          showSearch
          label="Country"
          options={countriesOptions}
          value={formik.values.country}
          error={formik.errors.country}
          onChange={formik.handleChange('country')}
        />

        {/* PREVIOUS ADDRESS */}
        <Input
          label="Previous Address Line 1"
          value={formik.values.previousAddressLine1}
          error={formik.errors.previousAddressLine1}
          onChange={formik.handleChange('previousAddressLine1')}
        />
        <Input
          label="Previous Address Line 2"
          value={formik.values.previousAddressLine2}
          error={formik.errors.previousAddressLine2}
          onChange={formik.handleChange('previousAddressLine2')}
        />

        <Input
          label="Previous Postcode"
          value={formik.values.previousPostcode}
          error={formik.errors.previousPostcode}
          onChange={formik.handleChange('previousPostcode')}
        />

        <Input
          label="Previous City"
          value={formik.values.previousCity}
          error={formik.errors.previousCity}
          onChange={formik.handleChange('previousCity')}
        />

        <Input
          label="Previous State"
          value={formik.values.previousState}
          error={formik.errors.previousState}
          onChange={formik.handleChange('previousState')}
        />

        <Select
          showSearch
          label="Previous Country"
          options={countriesOptions}
          value={formik.values.previousCountry}
          error={formik.errors.previousCountry}
          onChange={formik.handleChange('previousCountry')}
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
    </Container>
  );
}
