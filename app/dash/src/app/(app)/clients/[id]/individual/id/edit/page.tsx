'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { Button, Row, Text } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { IId, optionIdentificationType } from '../types';
import { Container, FormContainer } from './styles';

export default function AddressEdit() {
  const { onShowMessage } = useMessages();
  const { back } = useRouter();
  const {
    postIndividualMetadata,
    clientSelected,
    masterClientSelected,
    getClientsInfo,
  } = useClients();

  const [, setLoading] = useState(false);

  const init = useMemo((): IId => {
    const details = clientSelected?.individualMetadata;

    return {
      identificationType: details?.identificationType ?? '',
      identificationNumber: details?.identificationNumber ?? '',
    };
  }, [clientSelected]);

  const handleSubmit = useCallback(
    async (data: IId) => {
      setLoading(true);
      await postIndividualMetadata({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        individualMetadata: {
          ...(clientSelected?.individualMetadata as any),
          identificationType: data.identificationType,
          identificationNumber: data.identificationNumber,
        },
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: 'Id updated successfully.',
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
            title: 'Error updating Id.',
            description: '',
            isVisible: true,
            status: 'fail',
          })
        )
        .finally(() => setLoading(false));
    },
    [
      back,
      clientSelected?.individualMetadata,
      clientSelected?.uuid,
      getClientsInfo,
      masterClientSelected?.uuid,
      onShowMessage,
      postIndividualMetadata,
    ]
  );

  const formik = useFormik<IId>({
    initialValues: init,
    onSubmit: (data) => handleSubmit(data),
  });

  // Passport, National ID, Drivers's License

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Select
          label="Identification Type"
          value={formik.values.identificationType}
          error={formik.errors.identificationType}
          options={optionIdentificationType}
          onChange={formik.handleChange('identificationType')}
        />
        <Input
          label="Identification number"
          value={formik.values.identificationNumber}
          error={formik.errors.identificationNumber}
          onChange={formik.handleChange('identificationNumber')}
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
