'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import Input from '@/components/Input';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { Button, Row, Text } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { Container, FormContainer } from './styles';

interface IForm {
  expectedVolume: string;
  expectedValue: string;
}

export default function ShareholdersEdit() {
  const { back } = useRouter();
  const {
    masterClientSelected,
    getClientsInfo,
    clientSelected,
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
          expectedVolume: data.expectedVolume,
          expectedActivity: data.expectedValue,
        },
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: 'Expected activity updated successfully.',
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
            title: 'Error updating expected activity.',
            description: '',
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
      expectedValue: company?.expectedActivity ?? '',
      expectedVolume: company?.expectedVolume ?? '',
    },
    validateOnChange: false,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit Shareholder</Text>
      <FormContainer>
        <Input
          label="Expected Value"
          value={formik.values.expectedValue}
          onChange={formik.handleChange('expectedValue')}
        />

        <Input
          label="Expected Volume"
          value={formik.values.expectedVolume}
          onChange={formik.handleChange('expectedVolume')}
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
