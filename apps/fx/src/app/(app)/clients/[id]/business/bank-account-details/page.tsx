'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { Button, Column, useTheme } from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';
import { IBankAccount } from './types';

export default function BankAccount() {
  const router = useRouter();

  const { theme } = useTheme();
  const { clientSelected } = useClients();

  const bankAccount = useMemo((): IBankAccount => {
    const bankAccountDetails = clientSelected?.bankMetadata;
    return {
      account: bankAccountDetails?.accountHolderName ?? '',
      accountCurrency: bankAccountDetails?.currency ?? '',
      accountNumber: bankAccountDetails?.accountNumber ?? '',
      bankCountry: bankAccountDetails?.bankCountry ?? '',
      bic: bankAccountDetails?.bicSwift ?? '',
      branch: bankAccountDetails?.branch ?? '',
      iban: bankAccountDetails?.IBAN ?? '',
      name: bankAccountDetails?.bankName ?? '',
      sortCode: bankAccountDetails?.sortCode ?? '',
    };
  }, [clientSelected?.bankMetadata]);

  return (
    <>
      <HeaderClientsDetails />
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
          <LabelAndValue label="Account holder" value={bankAccount.account} />
          <LabelAndValue label="Bank country" value={bankAccount.bankCountry} />
          <LabelAndValue
            label="Account currency"
            value={bankAccount.accountCurrency}
          />
          <LabelAndValue label="Sort code" value={bankAccount.sortCode} />
          <LabelAndValue
            label="Account number"
            value={bankAccount.accountNumber}
          />
          <LabelAndValue label="IBAN" value={bankAccount.iban} />
          <LabelAndValue label="BIC / SWIFT" value={bankAccount.bic} />
        </Column>

        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          leftIcon="pen-2"
          roundness="rounded"
          onClick={() => router.push('bank-account-details/edit')}
        />
      </Column>
    </>
  );
}
