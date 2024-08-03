'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';
import SelectCurrencies from '@/components/SelectCurrencyCountry';

import { useMessages } from '@/context/Messages';

import { countriesOptions } from '@/utils/lib';

import { useClients } from '@/store/useClient';
import { Button, Row, Text } from '@luxbank/ui';
import { useFormik } from 'formik';

import { IBankAccount, validationForm } from '../types';
import { Container, FormContainer } from './styles';

export default function BankAccount() {
  const { onShowMessage } = useMessages();
  const { back } = useRouter();
  const {
    postBankAccountDetails,
    clientSelected,
    masterClientSelected,
    getClientsInfo,
  } = useClients();

  const [, setLoading] = useState(false);

  const init = useMemo((): IBankAccount => {
    const bankDetails = clientSelected?.bankMetadata;

    return {
      account: bankDetails?.accountHolderName ?? '',
      accountCurrency: bankDetails?.currency ?? '',
      accountNumber: bankDetails?.accountNumber ?? '',
      bankCountry: bankDetails?.bankCountry ?? '',
      bic: bankDetails?.bicSwift ?? '',
      branch: bankDetails?.branch ?? '',
      iban: bankDetails?.IBAN ?? '',
      name: bankDetails?.bankName ?? '',
      sortCode: bankDetails?.sortCode ?? '',
    };
  }, [clientSelected]);

  const handleSubmit = useCallback(
    async (data: IBankAccount) => {
      setLoading(true);
      await postBankAccountDetails({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        bankMetadata: {
          ...(clientSelected?.bankMetadata as any),
          accountHolderName: data.account,
          accountNumber: data.accountNumber,
          bankCountry: data.bankCountry,
          bankName: data.name,
          bicSwift: data.bic,
          branch: data.branch,
          currency: data.accountCurrency,
          IBAN: data.iban,
          sortCode: data.sortCode,
        },
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: 'Bank account details updated successfully.',
            description: '',
            isVisible: true,
            status: 'success',
            onClose: () => {
              getClientsInfo(clientSelected?.uuid ?? '');
              back();
            },
          })
        )
        .catch(() =>
          onShowMessage({
            type: 'message',
            title: 'Error saving Bank Account details.',
            description: '',
            isVisible: true,
            status: 'fail',
          })
        )
        .finally(() => setLoading(false));
    },
    [
      postBankAccountDetails,
      masterClientSelected?.uuid,
      clientSelected?.uuid,
      clientSelected?.bankMetadata,
      onShowMessage,
      getClientsInfo,
      back,
    ]
  );

  const formik = useFormik<IBankAccount>({
    initialValues: init,
    validationSchema: validationForm,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit</Text>
      <FormContainer>
        <Input
          label="Name of bank"
          value={formik.values.name}
          error={formik.errors.name}
          onChange={formik.handleChange('name')}
        />
        <Input
          label="Branch"
          value={formik.values.branch}
          error={formik.errors.branch}
          onChange={formik.handleChange('branch')}
        />

        <Input
          label="Account holder"
          value={formik.values.account}
          error={formik.errors.account}
          onChange={formik.handleChange('account')}
        />

        <Select
          showSearch
          label="Bank country"
          options={countriesOptions}
          value={formik.values.bankCountry}
          error={formik.errors.bankCountry}
          onChange={formik.handleChange('bankCountry')}
        />

        <SelectCurrencies
          label="Bank currency"
          value={formik.values.accountCurrency}
          error={formik.errors.accountCurrency}
          onChange={formik.handleChange('accountCurrency')}
        />

        <Input
          label="Sort code"
          value={formik.values.sortCode}
          error={formik.errors.sortCode}
          onChange={formik.handleChange('sortCode')}
        />

        <Input
          label="Account number"
          value={formik.values.accountNumber}
          error={formik.errors.accountNumber}
          onChange={formik.handleChange('accountNumber')}
        />

        <Input
          label="IBAN"
          value={formik.values.iban}
          error={formik.errors.iban}
          onChange={formik.handleChange('iban')}
        />
        <Input
          label="BIC / SWIFT"
          value={formik.values.bic}
          error={formik.errors.bic}
          onChange={formik.handleChange('bic')}
        />

        <Row gap="sm" style={{ alignSelf: 'center', marginTop: 24 }}>
          <Button
            roundness="rounded"
            variant="secondary"
            text="Cancel"
            onClick={() => back()}
          />
          <Button
            roundness="rounded"
            text="Save Changes"
            onClick={() => {
              onShowMessage({
                isVisible: true,
                title: 'Are you sure you wish to proceed with the change?',
                type: 'question',
                onConfirm: () => formik.handleSubmit(),
              });
            }}
          />
        </Row>
      </FormContainer>
    </Container>
  );
}
