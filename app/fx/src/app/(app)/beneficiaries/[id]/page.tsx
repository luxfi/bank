'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Flag from 'react-world-flags';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import ModalMessage from '@/components/ModalMessage';

import { UserRole } from '@/models/auth';
import { IBeneficiaryDetailsResponse } from '@/models/beneficiarie';
import { currencyNameDictionary } from '@/models/countries';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import {
  Button,
  Column,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

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
          message: 'Error delete beneficiary',
          description: '',
        })
      );
  }, [data, onShowNotification, route]);

  useEffect(() => {
    getBeneficiary();
  }, [getBeneficiary]);

  const navigateToEdit = useCallback(() => {
    route.push(`/beneficiaries/new?id=${data?.id}`);
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
                  <BeneficiaryCardTitle>{`${name}`}</BeneficiaryCardTitle>
                  <BeneficiaryCardSubtitle>{`Beneficiary`}</BeneficiaryCardSubtitle>
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
                <div>
                  <BeneficiaryCardSubtitle>{`Entity Type`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${
                    data?.entityType ?? ''
                  }`}</BeneficiaryCardTitle>
                </div>
                <div>
                  <BeneficiaryCardSubtitle>{`Address`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${
                    data?.address ?? ''
                  }`}</BeneficiaryCardTitle>
                </div>
                <div>
                  <BeneficiaryCardSubtitle>{`City`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${
                    data?.city ?? ''
                  }`}</BeneficiaryCardTitle>
                </div>
              </BeneficiaryContentCard>
            </BeneficiaryContainerCard>

            <BeneficiaryContainerCard style={{ marginBottom: 24 }}>
              <BeneficiaryHeaderCard>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      overflow: 'hidden',
                      borderRadius: 64,
                    }}
                  >
                    <Flag
                      style={{ marginRight: 8, marginTop: 8, marginBottom: -4 }}
                      code={data?.currency.slice(0, 2)}
                      height={40}
                    />
                  </div>
                  <div>
                    <BeneficiaryCardTitle>{`${data?.currency} - ${
                      data?.currency
                        ? currencyNameDictionary[data.currency]
                        : '--'
                    }`}</BeneficiaryCardTitle>
                    <BeneficiaryCardSubtitle>{`Beneficiary Banking Detail`}</BeneficiaryCardSubtitle>
                  </div>
                </div>
                {currentUser?.role !== UserRole.SuperAdmin &&
                  currentUser?.role !== UserRole.ViewerUser && (
                    <Button
                      onClick={() => route.push('/create-payment')}
                      leftIcon="wallet-money"
                      text="Pay"
                      variant="tertiary"
                    />
                  )}
              </BeneficiaryHeaderCard>
              <BeneficiaryContentCard>
                <div>
                  <BeneficiaryCardSubtitle>{`Bank Country`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${
                    data?.bankCountry ?? ''
                  }`}</BeneficiaryCardTitle>
                </div>
                <div>
                  <BeneficiaryCardSubtitle>{`Currency`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${
                    data?.currency ?? ''
                  }`}</BeneficiaryCardTitle>
                </div>
                {data?.iban && (
                  <div>
                    <BeneficiaryCardSubtitle>{`IBAN`}</BeneficiaryCardSubtitle>
                    <BeneficiaryCardTitle>{`${
                      data?.iban ?? ''
                    } `}</BeneficiaryCardTitle>
                  </div>
                )}
                {data?.bicSwift && (
                  <div>
                    <BeneficiaryCardSubtitle>{`BIC/SWIFT`}</BeneficiaryCardSubtitle>
                    <BeneficiaryCardTitle>{`${
                      data?.bicSwift ?? ''
                    }`}</BeneficiaryCardTitle>
                  </div>
                )}
                {data?.accountNumber && (
                  <div>
                    <BeneficiaryCardSubtitle>{`Account Number`}</BeneficiaryCardSubtitle>
                    <BeneficiaryCardTitle>{`${
                      data?.accountNumber ?? ''
                    } `}</BeneficiaryCardTitle>
                  </div>
                )}
                {data?.sortCode && (
                  <div>
                    <BeneficiaryCardSubtitle>{`Sort Code`}</BeneficiaryCardSubtitle>
                    <BeneficiaryCardTitle>{`${
                      data?.sortCode ?? ''
                    }`}</BeneficiaryCardTitle>
                  </div>
                )}
              </BeneficiaryContentCard>
            </BeneficiaryContainerCard>

            {currentUser?.role !== UserRole.ViewerUser && (
              <Button
                onClick={navigateToEdit}
                leftIcon="pen"
                text="Edit"
                roundness="rounded"
                style={{ marginBottom: 64 }}
              />
            )}
          </Column>
        )}
      </Container>

      <ModalMessage
        isVisible={modalDelete}
        title="Delete Beneficiary?"
        description={`Are you sure want to delete ${name}?`}
        isLoading={deleteIsLoading}
        onConfirm={handleDelete}
        onCancel={() => setModalDelete(false)}
      />
    </>
  );
}
