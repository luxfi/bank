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
import { Button, Column, Icon, Row, Text, useTheme } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { IAddress, validationForm } from '../types';
import { Container, FormContainer } from './styles';

export default function AddressEdit() {
  const { theme } = useTheme();

  const { onShowMessage } = useMessages();
  const { currentUser } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { updateBusinessAddress } = useManageAccount();

  const initForm = useMemo((): IAddress => {
    const addressDetails = currentUser?.currentClient?.account.businessMetadata;
    return {
      addressLine1: addressDetails?.address1 ?? '',
      addressLine2: addressDetails?.address2 ?? '',
      postcode: addressDetails?.registeredOffice1_postcode ?? '',
      city: addressDetails?.registeredOffice1_city ?? '',
      state: addressDetails?.registeredOffice1_state ?? '',
      country: addressDetails?.countryOfRegistration ?? '',
      registeredOffice1: addressDetails?.registeredOffice1 ?? '',
      registeredOffice2: addressDetails?.registeredOffice2 ?? '',
      principalPlaceOfBusiness: addressDetails?.principalPlace ?? '',
      mailingAddress: addressDetails?.mailingAddress ?? '',
      previousOffice1: addressDetails?.previousOffice1 ?? '',
      previousOffice2: addressDetails?.previousOffice2 ?? '',
      previousOffice3: addressDetails?.previousOffice3 ?? '',
    };
  }, [currentUser?.currentClient?.account.businessMetadata]);

  const handleSubmit = useCallback(
    async (data: IAddress) => {
      try {
        setIsLoading(true);
        await updateBusinessAddress({
          uuid: currentUser?.uuid ?? '',
          session: 'address',
          clientId: currentUser?.currentClient?.uuid ?? '',
          businessMetadata: {
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            postcode: data.postcode,
            city: data.city,
            state: data.state,
            country: data.country,
            registeredOffice1: data.registeredOffice1,
            registeredOffice2: data.registeredOffice2,
            principalPlaceOfBusiness: data.principalPlaceOfBusiness,
            mailingAddress: data.mailingAddress,
            previousOffice1: data.previousOffice1,
            previousOffice2: data.previousOffice2,
            previousOffice3: data.previousOffice3,
          },
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
          description: '',
          isVisible: true,
          status: 'fail',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, onShowMessage, router.back, updateBusinessAddress]
  );

  const formik = useFormik<IAddress>({
    initialValues: initForm,
    validationSchema: validationForm,
    validateOnChange: true,
    validateOnMount: true,
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
        <FormContainer onSubmit={(e) => e.preventDefault()}>
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

          <Row gap="sm">
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
          </Row>

          <Row gap="sm">
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
          </Row>

          <Input
            value={formik.values.registeredOffice1}
            label="Registered office 1"
            error={formik.errors.registeredOffice1}
            onChange={formik.handleChange('registeredOffice1')}
          />

          <Input
            label="Registered office 2"
            value={formik.values.registeredOffice2}
            error={formik.errors.registeredOffice2}
            onChange={formik.handleChange('registeredOffice2')}
          />

          <Input
            label="Principal place of business"
            value={formik.values.principalPlaceOfBusiness}
            error={formik.errors.principalPlaceOfBusiness}
            onChange={formik.handleChange('principalPlaceOfBusiness')}
          />

          <Input
            label="Mailing address"
            value={formik.values.mailingAddress}
            error={formik.errors.mailingAddress}
            onChange={formik.handleChange('mailingAddress')}
          />

          <Input
            label="Previous office 1"
            value={formik.values.previousOffice1}
            error={formik.errors.previousOffice1}
            onChange={formik.handleChange('previousOffice1')}
          />

          <Input
            label="Previous office 2"
            value={formik.values.previousOffice2}
            error={formik.errors.previousOffice2}
            onChange={formik.handleChange('previousOffice2')}
          />

          <Input
            label="Previous office 3"
            value={formik.values.previousOffice3}
            error={formik.errors.previousOffice3}
            onChange={formik.handleChange('previousOffice3')}
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
