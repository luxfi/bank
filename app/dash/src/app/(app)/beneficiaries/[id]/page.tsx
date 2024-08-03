'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Flag from 'react-world-flags';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalMessage from '@/components/ModalMessage';

import { UserRole } from '@/models/auth';
import { IBeneficiaryDetailsResponse } from '@/models/beneficiaries';
import { currencyNameDictionary } from '@/models/countries';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { Button, Column, Icon, Row, Text, useTheme } from '@luxbank/ui';

import { deleteBeneficiary, getBeneficiaryDetails } from '@/api/beneficiaries';

import {
  BeneficiaryCardSubtitle,
  BeneficiaryCardTitle,
  BeneficiaryContainerCard,
  BeneficiaryContentCard,
  BeneficiaryHeaderCard,
  Container,
  Title,
} from './styles';

export default function BeneficiariesDetails() {
  const { id }: { id: string } = useParams();
  const route = useRouter();
  const { currentUser } = useAuth();
  const { onShowNotification } = useNotification();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IBeneficiaryDetailsResponse>();
  const [modalDelete, setModalDelete] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const name = useMemo(() => {
    return data?.entityType === 'business'
      ? data.name
      : `${data?.firstName} ${data?.lastName}`;
  }, [data]);

  const getBeneficiary = useCallback(async () => {
    setIsLoading(true);

    await getBeneficiaryDetails(id ?? '')
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = useCallback(async () => {
    setDeleteIsLoading(true);
    await deleteBeneficiary(data?.id ?? '')
      .then(() => route.back())
      .catch(() =>
        onShowNotification({
          type: 'ERROR',
          message: 'Error deleting beneficiary',
          description: '',
        })
      );
  }, [data, onShowNotification, route]);

  useEffect(() => {
    getBeneficiary();
  }, [getBeneficiary]);

  const navigateToEdit = useCallback(() => {
    route.push(`/beneficiaries/edit?id=${data?.id}`);
  }, [data?.id, route]);

  return (
    <>
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <BackButton>
            <Title>Beneficiaries</Title>
          </BackButton>

          <Button
            text="Payment History"
            roundness="rounded"
            style={{ height: 40 }}
            onClick={() => route.push(`/transactions?beneficiary=${data?.id}`)}
          />
        </div>
        {isLoading ? (
          <Column width="100%" height="400px" align="center" justify="center">
            <Loading />
          </Column>
        ) : (
          <Column
            align="center"
            justify="center"
            width="100%"
            height="100%"
            gap="xs"
          >
            <BeneficiaryContainerCard>
              <BeneficiaryHeaderCard>
                <div>
                  <BeneficiaryCardTitle>{name}</BeneficiaryCardTitle>
                  <BeneficiaryCardSubtitle>Beneficiary</BeneficiaryCardSubtitle>
                </div>

                {currentUser?.role !== UserRole.ViewerUser && (
                  <div
                    onClick={() => setModalDelete(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Row gap="xxs" align="center">
                      <Icon
                        variant="trash-bin-minimalistic"
                        size="sm"
                        color={theme.textColor.feedback['icon-negative'].value}
                      />
                      <Text
                        variant="body_md_regular"
                        color={theme.textColor.feedback['icon-negative'].value}
                      >
                        Delete
                      </Text>
                    </Row>
                  </div>
                )}
              </BeneficiaryHeaderCard>
              <BeneficiaryContentCard>
                {/* Content for Beneficiary Details */}
              </BeneficiaryContentCard>
            </BeneficiaryContainerCard>

            {/* Additional Content as needed */}
          </Column>
        )}
      </Container>

      <ModalMessage
        isVisible={modalDelete}
        title="Delete Beneficiary?"
        description={`Are you sure you want to delete ${name}?`}
        isLoading={deleteIsLoading}
        onConfirm={handleDelete}
        onCancel={() => setModalDelete(false)}
      />
    </>
  );
}
