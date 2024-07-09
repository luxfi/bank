import { useMemo, useState } from 'react';

import Button from '@/components/Button';

import { useAuth } from '@/store/useAuth';

import { defaultTheme } from '@/styles/themes/default';

import DataGrid from '../DataGrid';
import ModalBankAccountDetails from '../Modals/BankAccountDetails';

export default function BankAccountDetail() {
  const { currentUser } = useAuth();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  const list = useMemo(
    () => [
      {
        title: 'Name Of bank',
        content:
          currentUser?.currentClient?.account?.bankMetadata?.bankName ?? '',
      },
      {
        title: 'Branch',
        content:
          currentUser?.currentClient?.account?.bankMetadata?.branch ?? '',
      },
      {
        title: 'Account Holder',
        content:
          currentUser?.currentClient?.account?.bankMetadata
            ?.accountHolderName ?? '',
      },
      {
        title: 'Bank Country',
        content:
          currentUser?.currentClient?.account?.bankMetadata?.bankCountry ?? '',
      },
      {
        title: 'Account Currency',
        content:
          currentUser?.currentClient?.account?.bankMetadata?.currency ?? '',
      },
      {
        title: 'Sort Code',
        content:
          currentUser?.currentClient?.account?.bankMetadata?.sortCode ?? '',
      },
      {
        title: 'Account Number',
        content:
          currentUser?.currentClient?.account?.bankMetadata?.accountNumber ??
          '',
      },
      {
        title: 'IBAN',
        content: currentUser?.currentClient?.account?.bankMetadata?.IBAN ?? '',
      },
      {
        title: 'BIC',
        content:
          currentUser?.currentClient?.account?.bankMetadata?.bicSwift ?? '',
      },
    ],
    []
  );

  return (
    <>
      <DataGrid
        title="Bank Account Details"
        headerAction={
          <Button
            onClick={() => setModalIsVisible(true)}
            size="small"
            color={defaultTheme.colors.secondary}
            style={{ width: 100 }}
          >
            Edit
          </Button>
        }
        dataSource={list}
      />
      <ModalBankAccountDetails
        openModal={modalIsVisible}
        onCloseModal={() => setModalIsVisible(false)}
      />
    </>
  );
}
