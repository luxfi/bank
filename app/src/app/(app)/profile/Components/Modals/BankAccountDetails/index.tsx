'use client';

import { useCallback, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { LoadingOutlined } from '@ant-design/icons';
import { Modal as ModalAntd } from 'antd';
import { useFormik } from 'formik';

import { updateUserBankMetadata } from '@/api/user';

import { defaultTheme } from '@/styles/themes/default';

import { ContentModal, ContentButton } from './Style';

interface IDataForm {
  nameOfBank: string;
  branch: string;
  accountHolder: string;
  bankCountry: string;
  accountCurrency: string;
  sortCode: string;
  accountNumber: string;
  IBAN: string;
  bic: string;
}

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

export default function ModalBankAccountDetails({
  openModal,
  onCloseModal,
}: IModalProps) {
  const { onShowNotification } = useNotification();
  const { currentUser, setUser } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (data: IDataForm) => {
    setLoading(true);

    await updateUserBankMetadata({
      sort1: '',
      uuid: currentUser!.currentClient.account!.bankMetadata?.uuid ?? '',
      bankName: data.nameOfBank,
      branch: data.branch,
      accountHolderName: data.accountHolder,
      accountNumber: data.accountNumber,
      bankCountry: data.bankCountry,
      bicSwift: data.bic,
      IBAN: data.IBAN,
      sortCode: data.sortCode,
      currency: data.accountCurrency,
    })
      .then((user) => {
        onShowNotification({
          type: 'SUCCESS',
          message: 'Success',
          description: 'User updated successfully',
        });

        if (user) {
          setUser(user);
        }
        setLoading(false);
        onCloseModal();
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error',
          description: err.message,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const formik = useFormik<IDataForm>({
    initialValues: {
      nameOfBank:
        currentUser?.currentClient?.account?.bankMetadata?.bankName ?? '',
      branch: currentUser?.currentClient?.account?.bankMetadata?.branch ?? '',
      accountHolder:
        currentUser?.currentClient?.account?.bankMetadata?.accountHolderName ??
        '',
      bankCountry:
        currentUser?.currentClient?.account?.bankMetadata?.bankCountry ?? '',
      accountCurrency:
        currentUser?.currentClient?.account?.bankMetadata?.currency ?? '',
      sortCode:
        currentUser?.currentClient?.account?.bankMetadata?.sortCode ?? '',
      accountNumber:
        currentUser?.currentClient?.account?.bankMetadata?.accountNumber ?? '',
      IBAN: currentUser?.currentClient?.account?.bankMetadata?.IBAN ?? '',
      bic: currentUser?.currentClient?.account?.bankMetadata?.bicSwift ?? '',
    },
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <ModalAntd
      title="Bank Account Details"
      onCancel={onCloseModal}
      footer={null}
      open={openModal}
    >
      <ContentModal>
        <div style={{ gridColumn: '1 / 3' }}>
          <Input
            value={formik.values.nameOfBank}
            onChange={formik.handleChange('nameOfBank')}
            label="Name of Bank:"
          />
        </div>
        <Input
          value={formik.values.branch}
          onChange={formik.handleChange('branch')}
          label="Branch:"
        />
        <Input
          value={formik.values.accountHolder}
          onChange={formik.handleChange('accountHolder')}
          label="Account Holder:"
        />
        <Input
          value={formik.values.bankCountry}
          onChange={formik.handleChange('bankCountry')}
          label="Bank Country:"
        />
        <Input
          value={formik.values.accountCurrency}
          onChange={formik.handleChange('accountCurrency')}
          label="Account Currency:"
        />
        <Input
          value={formik.values.sortCode}
          onChange={formik.handleChange('sortCode')}
          label="Sort Code:"
        />
        <Input
          value={formik.values.accountNumber}
          onChange={formik.handleChange('accountNumber')}
          label="Account Number:"
        />
        <Input
          value={formik.values.IBAN}
          onChange={formik.handleChange('IBAN')}
          label="IBAN:"
        />
        <Input
          value={formik.values.bic}
          onChange={formik.handleChange('bic')}
          label="Bic:"
        />

        <ContentButton>
          {loading ? (
            <LoadingOutlined
              style={{
                color: defaultTheme.colors.secondary,
                fontSize: 40,
                fontWeight: 600,
                paddingInline: 20,
              }}
            />
          ) : (
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              color={defaultTheme.colors.secondary}
              style={{ width: 160 }}
            >
              Save
            </Button>
          )}
        </ContentButton>
      </ContentModal>
    </ModalAntd>
  );
}
