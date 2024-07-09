'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';

import { useMessages } from '@/context/Messages';

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

import { IPersonDetailsEdit, validationForm } from '../types';
import { Container, FormContainer } from './styles';
import { Loading } from '@/components/Loading';

export default function PersonalDetailsEdit() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { onShowMessage } = useMessages();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { updateIndividualPersonalDetails } = useManageAccount();

  const initValues = useMemo((): IPersonDetailsEdit => {
    const currentClient = currentUser?.currentClient.account.individualMetadata;
    return {
      title: currentClient?.title ?? '',
      firstName: currentClient?.firstname ?? '',
      lastName: currentClient?.lastname ?? '',
      email: currentUser?.username ?? '',
      phoneNumber: currentUser?.contact?.mobileNumber ?? '',
    };
  }, [currentUser]);

  const handleSubmit = useCallback(
    async (data: IPersonDetailsEdit) => {
      setLoading(true);
      try {
        await updateIndividualPersonalDetails({
          individualMetadata: {
            title: data.title,
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            mobileNumber: data.phoneNumber,
          },
          clientId: currentUser?.currentClient?.uuid ?? '',
          session: 'personal',
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
        setLoading(false);
      }
    },
    [
      currentUser?.currentClient?.uuid,
      currentUser?.uuid,
      onShowMessage,
      router.back,
      updateIndividualPersonalDetails,
    ]
  );

  const formik = useFormik<IPersonDetailsEdit>({
    initialValues: initValues,
    validationSchema: validationForm,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <>
      <Container>
        <Text variant="headline_regular">Edit</Text>
        {loading ? (
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
            <Row gap="sm">
              <div style={{ width: 188 }}>
                <Input
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange('title')}
                />
              </div>
              <Input
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange('firstName')}
              />
            </Row>
            <Input
              label="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange('lastName')}
            />
            <Input
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange('email')}
            />
            <Input
              variant="phoneNumber"
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={(v) => formik.setFieldValue('phoneNumber', v)}
            />

            <Row gap="sm" style={{ alignSelf: 'center', marginTop: 24 }}>
              <Button
                onClick={() =>
                  onShowMessage({
                    isVisible: true,
                    title: 'Are you sure you wish to proceed with the change?',
                    type: 'question',
                    onConfirm: router.back,
                  })
                }
                roundness="rounded"
                variant="secondary"
                text="Cancel"
              />
              <Button
                roundness="rounded"
                text="Save Changes"
                onClick={formik.handleSubmit}
              />
            </Row>
          </FormContainer>
        )}
      </Container>
    </>
  );
}
