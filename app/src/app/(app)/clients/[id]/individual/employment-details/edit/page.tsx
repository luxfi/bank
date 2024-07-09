'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { Button, Icon, Row, Text, useTheme } from '@cdaxfx/ui';
import { useFormik } from 'formik';

import { IEmployment, validationForm } from '../types';
import { Container, FormContainer } from './styles';

export default function EmployerEdit() {
  const { theme } = useTheme();
  const { onShowMessage } = useMessages();
  const { back } = useRouter();

  const {
    clientSelected,
    masterClientSelected,
    postIndividualMetadata,
    getClientsInfo,
  } = useClients();

  const [, setLoading] = useState(false);

  const init = useMemo((): IEmployment => {
    const employmentDetails = clientSelected?.individualMetadata;

    return {
      address1: employmentDetails?.employerAddress1 ?? '',
      address2: employmentDetails?.employerAddress2 ?? '',
      address3: employmentDetails?.employerAddress3 ?? '',
      name: employmentDetails?.employerName ?? '',
      // postcode: employmentDetails?.empl ?? '',
      occupation: employmentDetails?.occupation ?? '',
    };
  }, [clientSelected]);

  const handleSubmit = useCallback(
    async (data: IEmployment) => {
      setLoading(true);
      await postIndividualMetadata({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        individualMetadata: {
          ...(clientSelected?.individualMetadata as any),
          employerAddress1: data?.address1 ?? '',
          employerAddress2: data?.address2 ?? '',
          employerAddress3: data?.address3 ?? '',
          employerName: data?.name ?? '',
          occupation: data?.occupation ?? '',
        },
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: 'Employment details updated successfully.',
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
            title: 'Error updating employment details.',
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
      clientSelected?.individualMetadata,
      onShowMessage,
      getClientsInfo,
      back,
    ]
  );

  const formik = useFormik<IEmployment>({
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
          label="Employer name"
          value={formik.values.name}
          error={formik.errors.name}
          onChange={formik.handleChange('name')}
        />
        <Input
          label="Occupation"
          value={formik.values.occupation}
          error={formik.errors.occupation}
          onChange={formik.handleChange('occupation')}
        />
        {/* <Input
          label="Postcode"
          value={formik.values.postcode}
          error={formik.errors.postcode}
          onChange={formik.handleChange('postcode')}
        /> */}
        <Input
          label="Employer address 1"
          value={formik.values.address1}
          error={formik.errors.address1}
          onChange={formik.handleChange('address1')}
        />
        <Input
          label="Employer address 2"
          value={formik.values.address2}
          error={formik.errors.address2}
          onChange={formik.handleChange('address2')}
        />
        <Input
          label="Employer address 3"
          value={formik.values.address3}
          error={formik.errors.address3}
          onChange={formik.handleChange('address3')}
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
