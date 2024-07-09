'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import { Loading } from '@/components/Loading';

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

import { IEmployment, validationForm } from '../types';
import { Container, FormContainer } from './styles';

export default function EmployerEdit() {
  const { theme } = useTheme();
  const { onShowMessage } = useMessages();
  const { currentUser } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { updateIndividualEmploymentDetails } = useManageAccount();

  const init = useMemo((): IEmployment => {
    const employmentDetails =
      currentUser?.currentClient.account.individualMetadata;

    return {
      address1: employmentDetails?.employerAddress1 ?? '',
      address2: employmentDetails?.employerAddress2 ?? '',
      address3: employmentDetails?.employerAddress3 ?? '',
      address4: '',
      name: employmentDetails?.employerName ?? '',
      occupation: employmentDetails?.occupation ?? '',
    };
  }, [currentUser?.currentClient.account.individualMetadata]);

  const handleSubmit = useCallback(
    async (data: IEmployment) => {
      setIsLoading(true);
      try {
        await updateIndividualEmploymentDetails({
          clientId: currentUser?.currentClient?.uuid ?? '',
          individualMetadata: {
            employerAddress1: data?.address1 ?? '',
            employerAddress2: data?.address2 ?? '',
            employerAddress3: data?.address3 ?? '',
            employerName: data?.name ?? '',
            occupation: data?.occupation ?? '',
          },
          session: 'employment',
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
      updateIndividualEmploymentDetails,
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
      {isLoading ? (
        <Column>
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
            label="Name"
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
