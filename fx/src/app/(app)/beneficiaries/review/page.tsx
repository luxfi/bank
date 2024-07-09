'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import Flag from 'react-world-flags';

import { BackButton } from '@/components/BackButton';
import ModalResult from '@/components/ModalResult';

import { ERoutingCodesNames } from '@/models/beneficiarie';
import { currencyNameDictionary } from '@/models/countries';

import { useNotification } from '@/context/Notification';

import { Button, Row } from '@cdaxfx/ui';

import { createBeneficiary } from '@/api/beneficiaries';

import { IFormParams } from '../type';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onShowNotification } = useNotification();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const data: IFormParams = useMemo(() => {
    const entries = searchParams.entries();
    const obj = Object.fromEntries(entries);
    return obj as unknown as IFormParams;
  }, [searchParams]);

  const onSubmit = useCallback(async () => {
    createBeneficiary(
      {
        address: data?.address || '',
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        companyName: data?.companyName || '',
        bankCountry: data?.bankAccountCountry || '',
        postCode: data?.postCode || '',
        addressLine2: data?.addressLine2 || '',
        city: data?.city || '',
        state: data?.state || '',
        country: data?.country || '',
        currency: data?.currency || '',
        entityType: data?.entityType || '',
        routingCodes: [
          { name: ERoutingCodesNames.IBAN, value: data?.iban || '' },
          { name: ERoutingCodesNames.BIC_SWIFT, value: data?.bicSwift || '' },
          {
            name: ERoutingCodesNames.ACCOUNT_NUMBER,
            value: data?.accountNumber || '',
          },
          { name: ERoutingCodesNames.SORT_CODE, value: data?.sortCode || '' },
        ],
      },
      data?.id
    )
      .then(() => {
        setIsModalVisible(true);
        return;
      })
      .catch(() => {
        return onShowNotification({
          type: 'ERROR',
          message: 'Error to save beneficiary',
          description: '',
        });
      });
  }, [data, onShowNotification]);

  const navigateToBeneficiaryList = useCallback(() => {
    router.replace('/beneficiaries');
  }, [router]);

  const backToAddBeneficiaryWithParams = useCallback(() => {
    router.replace(
      `/beneficiaries/new?${Object.entries(data)
        .map(([key, value]) => (value ? `&${key}=${value}` : ''))
        .join('')}`
    );
  }, [router, data]);

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
        </div>
        <Container style={{ alignItems: 'center', gap: 16 }}>
          <BeneficiaryContainerCard>
            <BeneficiaryHeaderCard>
              <div>
                <BeneficiaryCardTitle>
                  {data.companyName ||
                    `${data?.firstName} ${data?.lastName || ''}`}
                </BeneficiaryCardTitle>
                <BeneficiaryCardSubtitle>{`Beneficiary`}</BeneficiaryCardSubtitle>
              </div>
            </BeneficiaryHeaderCard>
            <BeneficiaryContentCard>
              <div>
                <BeneficiaryCardSubtitle>{`Entity Type`}</BeneficiaryCardSubtitle>
                <BeneficiaryCardTitle>{`${data?.entityType}`}</BeneficiaryCardTitle>
              </div>
              <div>
                <BeneficiaryCardSubtitle>{`Address`}</BeneficiaryCardSubtitle>
                <BeneficiaryCardTitle>{`${data?.address}`}</BeneficiaryCardTitle>
                {data?.addressLine2 && (
                  <BeneficiaryCardTitle>{`${data?.addressLine2}`}</BeneficiaryCardTitle>
                )}
              </div>
              <div>
                <BeneficiaryCardSubtitle>{`City`}</BeneficiaryCardSubtitle>
                <BeneficiaryCardTitle>{`${data?.city}`}</BeneficiaryCardTitle>
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
                    code={data?.currency?.slice(0, 2)}
                    height={40}
                  />
                </div>
                <div>
                  <BeneficiaryCardTitle>{`${data?.currency} - ${
                    data?.currency
                      ? currencyNameDictionary[data?.currency]
                      : '--'
                  }`}</BeneficiaryCardTitle>
                  <BeneficiaryCardSubtitle>{`Beneficiary Banking Detail`}</BeneficiaryCardSubtitle>
                </div>
              </div>
            </BeneficiaryHeaderCard>
            <BeneficiaryContentCard>
              <div>
                <BeneficiaryCardSubtitle>{`Bank Country`}</BeneficiaryCardSubtitle>
                <BeneficiaryCardTitle>{`${data?.bankAccountCountry}`}</BeneficiaryCardTitle>
              </div>
              <div>
                <BeneficiaryCardSubtitle>{`Currency`}</BeneficiaryCardSubtitle>
                <BeneficiaryCardTitle>{`${data?.currency}`}</BeneficiaryCardTitle>
              </div>
              {data?.accountNumber && (
                <div>
                  <BeneficiaryCardSubtitle>{`Account Number`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${data?.accountNumber} `}</BeneficiaryCardTitle>
                </div>
              )}
              {data?.sortCode && (
                <div>
                  <BeneficiaryCardSubtitle>{`Sort Code`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${data?.sortCode}`}</BeneficiaryCardTitle>
                </div>
              )}
              {data?.iban && (
                <div>
                  <BeneficiaryCardSubtitle>{`IBAN`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${data?.iban}`}</BeneficiaryCardTitle>
                </div>
              )}
              {data?.bicSwift && (
                <div>
                  <BeneficiaryCardSubtitle>{`BIC/SWIFT`}</BeneficiaryCardSubtitle>
                  <BeneficiaryCardTitle>{`${data?.bicSwift}`}</BeneficiaryCardTitle>
                </div>
              )}
            </BeneficiaryContentCard>
          </BeneficiaryContainerCard>

          <Row style={{ gap: 16 }}>
            <Button
              onClick={backToAddBeneficiaryWithParams}
              leftIcon="pen"
              text="Edit"
              variant="secondary"
              roundness="rounded"
            />
            <Button
              onClick={onSubmit}
              text={data?.id ? 'Update beneficiary' : 'Create beneficiary'}
              roundness="rounded"
            />
          </Row>
        </Container>
      </Container>

      <ModalResult
        isVisible={isModalVisible}
        onCancel={navigateToBeneficiaryList}
        title="Successfully submitted for approval!"
        subtitle={`We have received the beneficiary details for ${data?.firstName} ${data?.lastName} and it’s under review, Once approved it can be used as a beneficiary in your transactions.`}
        type="SUCCESS"
      />
    </>
  );
}
