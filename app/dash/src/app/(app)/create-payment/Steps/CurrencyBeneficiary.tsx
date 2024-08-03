import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import RecentBeneficiary from '@/components/RecentBeneficiary';
import Select from '@/components/Select';
import SelectBalances from '@/components/SelectBalancesCountry';

import { IBeneficiaryListResponse } from '@/models/beneficiaries';

import { EStep, useCreatePayment } from '@/context/CreatePayment';
import { useMessages } from '@/context/Messages';
import { useNotification } from '@/context/Notification';

import { formatCurrency } from '@/utils/lib';

import useUrlSearchParams from '@/hooks/useUrlParams';
import { Button, Column, Row, Text, useTheme } from '@cdaxfx/ui';

import { getBeneficiariesRecentPaid } from '@/api/beneficiaries';

import {
  ActionContainer,
  ContentContainer,
  SectionContainer,
  WrapperButton,
} from '../styles';
import CardAmount from './Components/CardAdmountStep';
import SectionTitle from './Components/SectionTitle';

export default function CurrencyBeneficiary() {
  const router = useRouter();
  const { onShowMessage } = useMessages();
  const { onShowNotification } = useNotification();
  const { urlParams } = useUrlSearchParams<{
    currency: string;
    beneficiary: string;
  }>();
  const { theme } = useTheme();

  const { onChangeData, onChangeSelected, data, selected, isLoading } =
    useCreatePayment();

  const [checkError, setCheckError] = useState<boolean>(false);
  const [recentBeneficiary, setRecentBeneficiary] = useState<
    Array<IBeneficiaryListResponse>
  >([]);

  const getRecentBeneficiaries = useCallback(async () => {
    try {
      const recentBeneficiaries = await getBeneficiariesRecentPaid();
      setRecentBeneficiary(recentBeneficiaries.data ?? []);
    } catch {
      console.error('Error to get recent beneficiaries');
    }
  }, []);

  const handleContinue = useCallback(() => {
    if (!selected?.currency || !selected?.beneficiary) {
      setCheckError(true);
      return onShowNotification({
        type: 'ERROR',
        message: 'Fill in all fields',
        description: '',
      });
    }

    onChangeData('currentStep', EStep.REASON);
  }, [
    selected?.currency,
    selected?.beneficiary,
    onChangeData,
    onShowNotification,
  ]);

  useEffect(() => {
    if (urlParams?.currency && urlParams?.beneficiary) {
      onChangeSelected('currency', urlParams.currency);
      onChangeSelected('beneficiaryId', urlParams.beneficiary);
    }
  }, [onChangeSelected, urlParams]);

  const TextSelectedCurrency: React.FC = useCallback(() => {
    const { balances } = data;
    const base =
      Array.isArray(balances) &&
      balances?.find((c) => c.currency === selected.currency);

    if (!base) return null;
    return (
      <Column width="100%" align="center" justify="center">
        <Row gap="xxs">
          <Text variant="heading_title_3">{formatCurrency(base?.amount)}</Text>
          <Text
            variant="heading_title_3"
            color={theme.textColor.layout.secondary.value}
          >
            {base?.currency}
          </Text>
        </Row>
        <Text
          variant="caption_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          available funds
        </Text>
      </Column>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.balances, selected.currency]);

  useEffect(() => {
    getRecentBeneficiaries();
  }, [getRecentBeneficiaries]);

  return (
    <>
      <ContentContainer>
        <SectionContainer>
          <SectionTitle title="Currency" />

          <div
            style={{
              width: 400,
              marginTop: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            <SelectBalances
              label=""
              placeholder="Select Currency"
              value={selected.currency}
              onChange={(value) => onChangeSelected('currency', value)}
              error={
                checkError && !selected?.currency ? 'Selected currency' : ''
              }
            />

            <TextSelectedCurrency />
          </div>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle title="Beneficiary" />
          <div
            style={{
              width: 400,
              marginTop: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            <Select
              label=""
              placeholder="Select Beneficiary"
              isLoading={isLoading}
              onChange={(value) => onChangeSelected('beneficiaryId', value)}
              value={selected.beneficiary?.id}
              options={
                data?.beneficiaries?.map((item) => ({
                  label: item.name,
                  value: item.id,
                  ...item,
                })) ?? []
              }
              helper={`Beneficiaries of all ${
                selected?.currency ? `the ${selected.currency}` : ''
              } currency`}
              error={
                checkError && !selected?.beneficiary
                  ? 'Selected Beneficiary'
                  : ''
              }
            />

            {selected?.beneficiary && (
              <CardAmount
                address={selected?.beneficiary?.address}
                bankCountry={selected?.beneficiary.bankCountry}
                beneficiary={selected?.beneficiary.name}
                entityType={selected?.beneficiary.entityType}
                iban={selected?.beneficiary.iban}
                swiftCode={selected?.beneficiary.bicSwift}
              />
            )}

            <WrapperButton style={{ width: '100%' }}>
              <Button
                onClick={() => {
                  onShowMessage({
                    isVisible: true,
                    title: 'Attention!',
                    type: 'question',
                    onConfirm: () => router.push('/beneficiaries/new'),
                    description:
                      'Do you really want to go to another screen, your data will be lost?',
                    textButtonCancel: 'No',
                    textButtonConfirm: 'Yes',
                  });
                }}
                rightIcon="case-minimalistic"
                text="Add new Beneficiary"
                roundness="rounded"
                variant="secondary"
              />
            </WrapperButton>
          </div>
          <SectionTitle underTitle="Recent" />
          {recentBeneficiary?.length > 0 && (
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              {recentBeneficiary?.slice(0, 5).map((beneficiary, index) => (
                <RecentBeneficiary
                  onClick={(b) => {
                    onChangeSelected('currency', b.currency);
                    onChangeSelected('beneficiaryId', b.id);
                  }}
                  key={index}
                  beneficiary={beneficiary}
                />
              ))}
            </div>
          )}
        </SectionContainer>
      </ContentContainer>

      <ActionContainer>
        <WrapperButton>
          <Button
            onClick={handleContinue}
            text="Continue"
            roundness="rounded"
            disabled={!selected?.currency || !selected?.beneficiary}
          />
        </WrapperButton>
      </ActionContainer>
    </>
  );
}
