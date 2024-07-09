'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import { IBroker } from '@/store/useClient/types';
import {
  Button,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';

export default function Directors() {
  const router = useRouter();
  const { onShowMessage } = useMessages();

  const { theme } = useTheme();
  const { clientSelected, masterClientSelected, deleteBroker, getClientsInfo } =
    useClients();

  const handleDeleteBroker = useCallback(
    async (broker: IBroker) => {
      await deleteBroker({
        masterClientId: masterClientSelected?.uuid ?? '',
        brokers: clientSelected?.brokers?.filter((b) => b !== broker) ?? [],
        clientUuid: clientSelected?.uuid ?? '',
      }).then(() => {
        onShowMessage({
          type: 'message',
          title: `The broker ${broker.name} has been deleted.`,
          description: '',
          isVisible: true,
          status: 'success',
          onClose: () => {
            getClientsInfo(clientSelected?.uuid ?? '');
          },
        });
      });
    },
    [
      clientSelected?.brokers,
      clientSelected?.uuid,
      deleteBroker,
      getClientsInfo,
      masterClientSelected?.uuid,
      onShowMessage,
    ]
  );

  return (
    <>
      <HeaderClientsDetails />

      <Row
        style={{ marginTop: 32, paddingInline: 24 }}
        width="100%"
        align="center"
        justify="space-between"
      >
        <Text variant="body_md_semibold">{`Number of Broker ${clientSelected?.brokers.length}`}</Text>

        <Button
          leftIcon="plus-circle"
          text="Add broker"
          roundness="rounded"
          variant="secondary"
          onClick={() => router.push(`broker/edit`)}
        />
      </Row>

      {clientSelected?.brokers?.map((broker, index) => (
        <Column key={index} padding="sm" style={{ width: '100%' }}>
          <Column
            padding="sm"
            gap="sm"
            style={{
              borderRadius: 8,
              backgroundColor:
                theme.backgroundColor.layout['container-L2'].value,
              width: '100%',
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            <Row width="100%" align="center" justify="space-between">
              <Text variant="body_md_semibold">{`Broker ${index + 1}`}</Text>
              <Row gap="lg">
                <Button
                  roundness="rounded"
                  leftIcon="pen-2"
                  text="Edit"
                  onClick={() =>
                    router.push(`broker/edit?brokerId=${broker.uuid}`)
                  }
                />
                <Button
                  roundness="rounded"
                  leftIcon="trash-bin-minimalistic"
                  text="Delete"
                  onClick={() => handleDeleteBroker(broker)}
                />
              </Row>
            </Row>

            <LabelAndValue label="Name" value={broker.name} />
            <LabelAndValue label="Address" value={broker.address} />
            <LabelAndValue label="KYC" value={broker.kyc} />
            <LabelAndValue label="Client" value={broker.client} />
            <LabelAndValue
              label="Percentage split"
              value={broker.percentageSplit}
            />
            <LabelAndValue label="Payment" value={broker.payment} />
            <LabelAndValue label="Bank account" value={broker.bankAccount} />
            <LabelAndValue label="Contact" value={broker.contract} />
            <LabelAndValue label="Comments" value={broker.comment} />
          </Column>
        </Column>
      ))}
    </>
  );
}
