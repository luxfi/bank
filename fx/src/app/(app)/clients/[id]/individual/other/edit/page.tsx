'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { Button, Row, Text } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { IOther } from '../types';
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

  const init = useMemo((): IOther => {
    const details = clientSelected?.individualMetadata;

    return {
      highProfilePosition: details?.highProfilePosition ?? '',
      publicPosition: details?.publicPosition ?? '',
    };
  }, [clientSelected]);

  const handleSubmit = useCallback(
    async (data: IOther) => {
      setLoading(true);
      await postIndividualMetadata({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        individualMetadata: {
          ...(clientSelected?.individualMetadata as any),
          highProfilePosition: data.highProfilePosition,
          publicPosition: data.publicPosition,
        },
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: 'Other updated successfully.',
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
            title: 'Error updating "other".',
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

  const formik = useFormik<IOther>({
    initialValues: init,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Input
          label="Public position held"
          value={formik.values.publicPosition}
          error={formik.errors.publicPosition}
          onChange={formik.handleChange('publicPosition')}
        />
        <Input
          label="High profile position held"
          value={formik.values.highProfilePosition}
          error={formik.errors.highProfilePosition}
          onChange={formik.handleChange('highProfilePosition')}
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
