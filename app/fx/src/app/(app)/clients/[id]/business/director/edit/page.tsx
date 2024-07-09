'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';
import SelectDate from '@/components/SelectDate';

import { useMessages } from '@/context/Messages';

import { countriesOptions } from '@/utils/lib';

import { useClients } from '@/store/useClient';
import { IDirector } from '@/store/useClient/types';
import { Button, Row, Text } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { Container, FormContainer } from './styles';

interface IForm {
  fullName: string;
  dateOfBirth: string;
  occupation: string;
  phoneNumber: string;
  email: string;
  nationality: string;
  address1: string;
  address2: string;
  previousAddress1: string;
  previousAddress2: string;
  country: string;
}

export default function DirectorsEdit() {
  const { back } = useRouter();

  const params = useSearchParams();
  const {
    masterClientSelected,
    clientSelected,
    postDirectors,
    getClientsInfo,
  } = useClients();

  const { onShowMessage } = useMessages();

  const directorId = params.get('directorId');

  const director = useMemo(() => {
    if (!directorId) return null;

    return clientSelected?.directors?.find((item) => item.uuid === directorId);
  }, [directorId, clientSelected]);

  const handleSubmit = useCallback(
    async (data: IForm) => {
      const pDirector = clientSelected?.directors ?? [];
      const newDirector: IDirector = {
        telephoneNumber: data.phoneNumber,
        address1: data.address1,
        address2: data.address2,
        country: data.country,
        dob: data.dateOfBirth,
        email: data.email,
        fullName: data.fullName,
        nationality: data.nationality,
        occupation: data.occupation,
        previousAddress1: data.previousAddress1,
        previousAddress2: data.previousAddress2,
        uuid: directorId ?? '',
      };

      await postDirectors({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        directors: !directorId
          ? [...pDirector, newDirector]
          : clientSelected?.directors?.map((item) => {
              if (item.uuid === directorId) {
                return newDirector;
              }
              return item;
            }) ?? [],
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: directorId
              ? `The director details has been updated`
              : `The director ${data.fullName} has been added`,
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
            title: 'Error saving director details',
            description: '',
            isVisible: true,
            status: 'fail',
          })
        );
    },
    [
      clientSelected?.directors,
      clientSelected?.uuid,
      directorId,
      postDirectors,
      masterClientSelected?.uuid,
      onShowMessage,
      getClientsInfo,
      back,
    ]
  );

  const formik = useFormik<IForm>({
    initialValues: {
      fullName: director?.fullName ?? '',
      dateOfBirth: director?.dob ?? '',
      occupation: director?.occupation ?? '',
      phoneNumber: director?.telephoneNumber ?? '',
      email: director?.email ?? '',
      nationality: director?.nationality ?? '',
      address1: director?.address1 ?? '',
      address2: director?.address2 ?? '',
      previousAddress1: director?.previousAddress1 ?? '',
      previousAddress2: director?.previousAddress2 ?? '',
      country: director?.country ?? '',
    },
    validateOnChange: false,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Input
          label="Full name"
          value={formik.values.fullName}
          onChange={formik.handleChange('fullName')}
          warning={!formik.values.fullName ? 'Please enter the full name' : ''}
        />

        <SelectDate
          label="Date of birth"
          value={formik.values.dateOfBirth}
          onChange={formik.handleChange('dateOfBirth')}
          warning={
            !formik.values.dateOfBirth ? 'Please enter the date of birth' : ''
          }
        />

        <Input
          label="Occupation"
          value={formik.values.occupation}
          onChange={formik.handleChange('occupation')}
        />

        <Input
          label="Phone number"
          value={formik.values.phoneNumber}
          onChange={(v) => formik.setFieldValue('phoneNumber', v)}
          variant="phoneNumber"
        />

        <Input
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange('email')}
        />

        <Select
          showSearch
          label={'Nationality'}
          value={formik.values.nationality}
          onChange={formik.handleChange('nationality')}
          options={countriesOptions}
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
