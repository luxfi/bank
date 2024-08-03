'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import Input from '@/components/Input';

import { useMessages } from '@/context/Messages';

import { onlyNumber } from '@/utils/lib';

import { useClients } from '@/store/useClient';
import { IBroker } from '@/store/useClient/types';
import { Button, Row, Text } from '@luxbank/ui';
import { useFormik } from 'formik';

import { Container, FormContainer } from './styles';

interface IForm {
  name: string;
  address: string;
  kyc: string;
  client: string;
  percentageSplit: string;
  payment: string;
  bankAccount: string;
  contract: string;
  comments: string;
}

export default function ShareholdersEdit() {
  const params = useSearchParams();

  const { back } = useRouter();
  const { masterClientSelected, postBrokers, clientSelected, getClientsInfo } =
    useClients();
  const { onShowMessage } = useMessages();

  const brokerId = params.get('brokerId');

  const broker = useMemo(() => {
    if (!brokerId) return null;

    return clientSelected?.brokers?.find((item) => item.uuid === brokerId);
  }, [brokerId, clientSelected?.brokers]);

  const handleSubmit = useCallback(
    async (data: IForm) => {
      const pBrokers = clientSelected?.brokers ?? [];
      const newBroker: IBroker = {
        address: data.address,
        bankAccount: data.bankAccount,
        client: data.client,
        comment: data.comments,
        contract: data.contract,
        country: '',
        kyc: data.kyc,
        name: data.name,
        payment: data.payment,
        percentageSplit: data.percentageSplit,
        uuid: brokerId ?? '',
      };

      await postBrokers({
        masterClientId: masterClientSelected?.uuid ?? '',
        clientUuid: clientSelected?.uuid ?? '',
        brokers: !brokerId
          ? [...pBrokers, newBroker]
          : clientSelected?.brokers?.map((item) => {
              if (item.uuid === brokerId) {
                return newBroker;
              }
              return item;
            }) ?? [],
      })
        .then(() =>
          onShowMessage({
            type: 'message',
            title: brokerId
              ? `Broker details updated successfully.`
              : `The broker ${newBroker.name} has been added.`,
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
            title: `Error saving broker ${newBroker.name} details.`,
            description: '',
            isVisible: true,
            status: 'fail',
          })
        );
    },
    [
      back,
      brokerId,
      clientSelected?.brokers,
      clientSelected?.uuid,
      getClientsInfo,
      masterClientSelected?.uuid,
      onShowMessage,
      postBrokers,
    ]
  );

  const formik = useFormik<IForm>({
    initialValues: {
      name: broker?.name ?? '',
      address: broker?.address ?? '',
      kyc: broker?.kyc ?? '',
      client: broker?.client ?? '',
      percentageSplit: broker?.percentageSplit.toString() ?? '',
      payment: broker?.payment ?? '',
      bankAccount: broker?.bankAccount ?? '',
      contract: broker?.contract ?? '',
      comments: broker?.comment ?? '',
    },
    validateOnChange: false,
    onSubmit: (data) => handleSubmit(data),
  });

  return (
    <Container>
      <Text variant="headline_regular">Edit Shareholder</Text>
      <FormContainer>
        <Input
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange('name')}
        />

        <Input
          label="Address"
          value={formik.values.address}
          onChange={formik.handleChange('address')}
        />

        <Input
          label="KYC"
          value={formik.values.kyc}
          onChange={formik.handleChange('kyc')}
        />

        <Input
          label="Client"
          value={formik.values.client}
          onChange={formik.handleChange('client')}
        />

        <Input
          label={'Percentage split'}
          value={formik.values.percentageSplit.toString()}
          onChange={(v) =>
            formik.setFieldValue('percentageSplit', onlyNumber(v)) as any
          }
        />

        <Input
          label="Payment"
          value={formik.values.payment}
          onChange={formik.handleChange('payment')}
        />

        <Input
          label="Bank account"
          value={formik.values.bankAccount}
          onChange={formik.handleChange('bankAccount')}
        />

        <Input
          label="Contract"
          value={formik.values.contract}
          onChange={formik.handleChange('contract')}
        />

        <Input
          label="Comments"
          value={formik.values.comments}
          onChange={formik.handleChange('comments')}
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
            onClick={() =>
              onShowMessage({
                isVisible: true,
                title: 'Are you sure wish to proceed with the change?',
                type: 'question',
                onConfirm: () => {
                  formik.handleSubmit();
                },
              })
            }
          />
        </Row>
      </FormContainer>
    </Container>
  );
}
