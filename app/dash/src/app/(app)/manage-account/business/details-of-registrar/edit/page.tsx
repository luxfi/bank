'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import Select from '@/components/Select';

import { useMessages } from '@/context/Messages';

import { convertMapInOptionList } from '@/utils/lib';

import { whoTheyAreOptions } from '@/app/(app)/clients/types';
import { useAuth } from '@/store/useAuth';
import { useManageAccount } from '@/store/useManageAccount';
import { Button, Column, Icon, Row, Text, useTheme } from '@luxbank/ui';
import { useFormik } from 'formik';

import { IDetailsOfRegistrar, validationForm } from '../types';
import { Container, FormContainer } from './styles';

export default function PersonalDetailsEdit() {
  const { theme } = useTheme();
  const { currentClientInfo, currentUser } = useAuth();
  const { onShowMessage } = useMessages();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { updateBusinessDetailsOfRegistrar } = useManageAccount();

  const initValues = useMemo((): IDetailsOfRegistrar => {
    return {
      firstName: currentClientInfo?.ownerMetadata?.firstName ?? '',
      lastName: currentClientInfo?.ownerMetadata?.lastName ?? '',
      email: currentClientInfo?.ownerMetadata?.email ?? '',
      phoneNumber:
        currentClientInfo?.ownerMetadata?.metadata?.phoneNumber ?? '',
      whoTheyAre: currentClientInfo?.ownerMetadata?.metadata?.whoTheyAre ?? '',
    };
  }, [
    currentClientInfo?.ownerMetadata?.email,
    currentClientInfo?.ownerMetadata?.firstName,
    currentClientInfo?.ownerMetadata?.lastName,
    currentClientInfo?.ownerMetadata?.metadata?.phoneNumber,
    currentClientInfo?.ownerMetadata?.metadata?.whoTheyAre,
  ]);

  const handleSubmit = useCallback(
    async (data: IDetailsOfRegistrar) => {
      try {
        if (!currentUser) return;

        setIsLoading(true);

        await updateBusinessDetailsOfRegistrar({
          userClientsMetadataDto: {
            phoneNumber: data.phoneNumber,
            whoTheyAre: data.whoTheyAre,
          },
          clientId: currentUser.currentClient.uuid,
          uuid: currentUser.uuid,
          session: 'personal',
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
    [currentUser, updateBusinessDetailsOfRegistrar, onShowMessage, router.back]
  );

  const formik = useFormik<IDetailsOfRegistrar>({
    initialValues: initValues,
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
            label="First name"
            disabled={!!currentClientInfo?.ownerMetadata?.firstName}
            value={formik.values.firstName}
            onChange={formik.handleChange('firstName')}
            error={formik.errors.firstName}
          />
          <Input
            label="Last name"
            disabled={!!currentClientInfo?.ownerMetadata?.lastName}
            value={formik.values.lastName}
            onChange={formik.handleChange('lastName')}
            error={formik.errors.lastName}
          />
          <Input
            label="Email"
            value={formik.values.email}
            disabled
            onChange={() => null}
          />
          <Input
            variant="phoneNumber"
            label="Phone number"
            value={formik.values.phoneNumber}
            onChange={(v) => formik.setFieldValue('phoneNumber', v)}
            error={formik.errors.phoneNumber}
          />
          <Select
            label="Who they are"
            value={formik.values.whoTheyAre}
            onChange={formik.handleChange('whoTheyAre')}
            options={convertMapInOptionList(whoTheyAreOptions)}
            error={formik.errors.whoTheyAre}
          />

          <Row gap="sm" style={{ alignSelf: 'center', marginTop: 24 }}>
            <Button
              roundness="rounded"
              variant="secondary"
              text="Cancel"
              onClick={router.back}
            />
            <Button
              roundness="rounded"
              text="Save Changes"
              disabled={formik.isSubmitting || !formik.isValid}
              onClick={() => {
                onShowMessage({
                  isVisible: true,
                  title: 'Are you sure you wish to proceed with the change?',
                  type: 'question',
                  onConfirm: formik.handleSubmit,
                });
              }}
            />
          </Row>
        </FormContainer>
      )}
    </Container>
  );
}
