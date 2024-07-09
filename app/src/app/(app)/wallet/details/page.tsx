'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { CircleIconButton } from '@/components/CircleIconButton';
import { Flag } from '@/components/Flag';
import { Loading } from '@/components/Loading';
import Tabs from '@/components/Tabs';

import { UserRole } from '@/models/auth';
import { currenciesArray } from '@/models/countries';

import { useNotification } from '@/context/Notification';

import { formatCurrency } from '@/utils/lib';

import { useAuth } from '@/store/useAuth';
import { useWallet } from '@/store/useWallet';
import {
  Button,
  Card,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import Transactions from '../../transactions/page';
import { LabelBackButton } from '../add/styles';
import { ModalLabelValue } from '../components/ModalLabels';
import {
  ButtonsContainer,
  Container,
  Content,
  CurrencyContainer,
  Header,
  LabelValue,
  Title,
} from './styles';

export default function AddWalletDetails() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  const currency = searchParams.get('currency') ?? '';
  const [isLoading, setIsLoading] = useState(true);

  const { walletSelected, setWalletSelected, getCurrencyWallet } = useWallet();
  const { onShowNotification } = useNotification();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState(1);

  const getCurrency = useCallback(async () => {
    setIsLoading(true);
    if (!currency) return;
    const currencyWallet = await getCurrencyWallet(
      currency as keyof typeof currenciesArray
    );
    setWalletSelected({
      amount: currencyWallet.amount || 0,
      name: currencyWallet.name || '--',
      currency: currency || '--',
    });
    setIsLoading(false);
  }, [currency, getCurrencyWallet, setWalletSelected]);

  useEffect(() => {
    getCurrency();
  }, []);

  const handleClipBoard = useCallback(async () => {
    if (!walletSelected?.details?.[0]) return;

    const data = walletSelected?.details?.[0];

    try {
      const info = `
      Account Holder Name: ${data.accountHolderName}
      IBAN: ${data.routingCodes?.find((rC) => rC.name === 'iban')?.value ?? ''}
      BIC: ${
        data.routingCodes?.find((rC) => rC.name === 'bic swift')?.value ?? ''
      }
      Bank Name: ${data.bankName}
      Bank Address: ${data.bankAddress}
      Bank Country: ${data.bankCountryName}
      `;
      await navigator.clipboard.writeText(info);
      onShowNotification({
        type: 'SUCCESS',
        message: 'Copied to clipboard',
        description: '',
      });
    } catch (error) {
      onShowNotification({
        type: 'ERROR',
        message: 'Erro to clipboard',
        description: '',
      });
    }
  }, [onShowNotification, walletSelected?.details]);

  const tabs = [
    {
      key: '1',
      label: `${walletSelected?.currency} Transactions`,
      children: <></>,
    },
    {
      key: '2',
      label: `Acount Details`,
      children: <></>,
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Container>
        <BackButton>
          <LabelBackButton>Wallet</LabelBackButton>
        </BackButton>
        <Content>
          <Header>
            <CurrencyContainer>
              <Flag
                size={40}
                flagCode={walletSelected?.currency?.slice(0, 2) ?? '--'}
              />
              <Title>{walletSelected?.name}</Title>
            </CurrencyContainer>
            {currentUser?.role !== UserRole.ViewerUser && (
              <ButtonsContainer>
                <CircleIconButton
                  icon="plus1"
                  label={`Add ${walletSelected?.currency ?? '--'}`}
                  onClick={() => setActiveTab(2)}
                />

                <CircleIconButton
                  icon="hand-money"
                  label={`Pay ${walletSelected?.currency ?? '--'}`}
                  onClick={() =>
                    router.push(
                      `/create-payment?currency=${walletSelected?.currency}`
                    )
                  }
                />

                <CircleIconButton
                  icon="sort-vertical"
                  label={`Convert ${walletSelected?.currency ?? '--'}`}
                  onClick={() =>
                    router.push(
                      `/conversion?currency=${walletSelected?.currency}`
                    )
                  }
                />
              </ButtonsContainer>
            )}
          </Header>
          <LabelValue style={{ marginTop: 8 }}>
            {`${
              walletSelected?.amount
                ? formatCurrency(walletSelected.amount)
                : ''
            } ${walletSelected?.currency ?? ''}`}
          </LabelValue>
        </Content>

        <Tabs
          items={tabs}
          defaultActiveKeyTab={1}
          onChange={setActiveTab}
          activeTabKey={String(activeTab)}
        />
        {activeTab === 1 ? (
          <Transactions />
        ) : (
          <Column width="100%" justify="center" align="center" gap="lg">
            <Text
              variant="body_sm_regular"
              color={theme.textColor.layout.primary.value}
            >
              Use the following details to add funds to your account via
              transfer.
            </Text>
            <Card
              width="700px"
              borderColor={theme.borderColor.layout['border-subtle'].value}
              backgroundColor={
                theme.backgroundColor.layout['container-L0'].value
              }
            >
              <Column width="100%" gap="sm" justify="center" align="center">
                <Row>
                  <Column gap="sm" width="100%">
                    <ModalLabelValue
                      label="Account holder name"
                      value={
                        walletSelected?.details?.[0]?.accountHolderName ?? '--'
                      }
                    />
                    <ModalLabelValue
                      label="Bank Name"
                      value={walletSelected?.details?.[0]?.bankName ?? '--'}
                    />
                    <ModalLabelValue
                      label="Bank Country"
                      value={
                        walletSelected?.details?.[0]?.bankCountryName ?? '--'
                      }
                    />
                  </Column>
                  <Column gap="sm" width="100%">
                    <ModalLabelValue
                      label="Bank Address"
                      value={walletSelected?.details?.[0]?.bankAddress ?? '--'}
                    />
                  </Column>
                </Row>
                <Row width="100%" style={{ paddingBlock: 16 }}>
                  <Column width="100%">
                    <ModalLabelValue
                      label="IBAN"
                      value={
                        walletSelected?.details?.[0]?.routingCodes?.find(
                          (rC) => rC.name === 'iban'
                        )?.value ?? '--'
                      }
                    />
                  </Column>
                  <Column width="100%">
                    <ModalLabelValue
                      label="BIC"
                      value={
                        walletSelected?.details?.[0]?.routingCodes?.find(
                          (rC) => rC.name === 'bic_swift'
                        )?.value ?? '--'
                      }
                    />
                  </Column>
                </Row>
                <Button
                  variant="primary"
                  roundness="rounded"
                  onClick={handleClipBoard}
                  leftIcon="copy"
                  text="Copy account details"
                />
              </Column>
            </Card>
          </Column>
        )}
      </Container>
    </>
  );
}
