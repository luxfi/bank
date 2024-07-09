'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import Select from '@/components/Select';

import { useMessages } from '@/context/Messages';

import { countriesOptions } from '@/utils/lib';

import { useAuth } from '@/store/useAuth';
import { useManageAccount } from '@/store/useManageAccount';
import {
  Button,
  Column,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { IAddress, validationForm } from '../types';
import { Container, FormContainer } from './styles';

export default function AddressEdit() {
  const { theme } = useTheme();
  const { onShowMessage } = useMessages();
  const { currentUser } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { updateIndividualAddress } = useManageAccount();

  const init = useMemo((): IAddress => {
    const addressDetails =
      currentUser?.currentClient.account.individualMetadata;

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
      previousCountry: addressDetails?.previousCountry ?? '',
      previousPostcode: addressDetails?.previousPostcode ?? '',
      previousState: addressDetails?.previousState ?? '',
    };
  }, [currentUser?.currentClient.account.individualMetadata]);

  const handleSubmit = useCallback(
    async (data: IAddress) => {
      setIsLoading(true);
      try {
        await updateIndividualAddress({
          clientId: currentUser?.currentClient?.uuid ?? '',
          individualMetadata: {
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            city: data.city,
            country: data.country,
            postcode: data.postcode,
            state: data.state,
            previousAddressLine1: data.previousAddressLine1,
            previousAddressLine2: data.previousAddressLine2,
            previousCity: data.previousCity,
            previousCountry: data.previousCountry,
            previousPostcode: data.previousPostcode,
            previousState: data.previousState,
          },
          session: 'address',
          uuid: currentUser?.uuid ?? '',
        });

        onShowMessage({
          type: 'message',
          title: 'Account profile update request sent successfully.',
          description:
            'An email will be sent to the backoffice team for approval.',
          isVisible: true,
          status: 'success',
          onClose: router.back,
        });
      } catch {
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
      currentUser?.currentClient?.uuid,
      currentUser?.uuid,
      onShowMessage,
      router.back,
      updateIndividualAddress,
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
      {isLoading ? (
        <Column width="100%">
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
            label="Country"
            showSearch
            options={countriesOptions}
            value={formik.values.country}
            error={formik.errors.country}
            onChange={formik.handleChange('country')}
          />

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
          <Input
            label="Previous Postcode"
            value={formik.values.previousPostcode}
            error={formik.errors.previousPostcode}
            onChange={formik.handleChange('previousPostcode')}
          />

          <Select
            label="Previous Country"
            showSearch
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
              onClick={() => router.back()}
            />
            <Button
              roundness="rounded"
              text="Save Changes"
              disabled={formik.isSubmitting || !formik.isValid}
              onClick={() =>
                onShowMessage({
                  isVisible: true,
                  title: 'Are you sure you wish to proceed with the change?',
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
