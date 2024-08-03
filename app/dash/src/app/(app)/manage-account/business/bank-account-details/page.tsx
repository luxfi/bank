'use client';

import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useAuth } from '@/store/useAuth';
import { Column, useTheme } from '@luxbank/ui';

import { HeaderDetails } from '../../components/Header';
import { IBankAccount } from './types';

export default function BankAccount() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const bankAccount = useMemo((): IBankAccount => {
    const bankAccountDetails = currentUser?.currentClient.account.bankMetadata;
    return {
      accountHolder: bankAccountDetails?.accountHolderName ?? '',
      accountNumber: bankAccountDetails?.accountNumber ?? '',
      bic: bankAccountDetails?.bicSwift ?? '',
      branch: bankAccountDetails?.branch ?? '',
      country: bankAccountDetails?.bankCountry ?? '',
      iban: bankAccountDetails?.IBAN ?? '',
      currency: bankAccountDetails?.currency ?? '',
      name: bankAccountDetails?.bankName ?? '',
      sortCode: bankAccountDetails?.sortCode ?? '',
    };
  }, [currentUser?.currentClient.account.bankMetadata]);

  return (
    <>
      <HeaderDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <Column
          padding="sm"
          gap="sm"
          style={{
            borderRadius: 8,
            backgroundColor: theme.backgroundColor.layout['container-L2'].value,
            width: '100%',
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <LabelAndValue label="Name of bank" value={bankAccount.name} />
          <LabelAndValue label="Branch" value={bankAccount.branch} />
          <LabelAndValue
            label="Account holder"
            value={bankAccount.accountHolder}
          />
          <LabelAndValue label="Bank country" value={bankAccount.country} />
          <LabelAndValue
            label="Account currency"
            value={bankAccount.currency}
          />
          <LabelAndValue label="Sort code" value={bankAccount.sortCode} />
          <LabelAndValue
            label="Account number"
            value={bankAccount.accountNumber}
          />
          <LabelAndValue label="IBAN" value={bankAccount.iban} />
          <LabelAndValue label="BIC" value={bankAccount.bic} />
        </Column>
      </Column>
    </>
  );
}
