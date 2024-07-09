'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';
import ModalMessage from '@/components/ModalMessage';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import {
  Button,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import dayjs from 'dayjs';

import { HeaderClientsDetails } from '../../components/Header';

export default function Directors() {
  const { theme } = useTheme();
  const router = useRouter();
  const { onShowMessage } = useMessages();

  const {
    clientSelected,
    masterClientSelected,
    getClientsInfo,
    deleteShareholder,
  } = useClients();

  const [modalShareholder, setModalShareholder] = useState<{
    isVisible: boolean;
    name: string;
    uuid: string;
  }>({ isVisible: false, name: '', uuid: '' });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const navigateToAddShareholder = useCallback(
    (uuid?: string) => {
      return () =>
        router.push(`shareholders/edit${uuid ? `?uuid=${uuid}` : ''}`);
    },
    [router]
  );

  const handleDelete = useCallback(async () => {
    try {
      if (!clientSelected) return;
      if (!masterClientSelected) return;

      setIsDeleteLoading(true);

      const shareholders =
        clientSelected.shareholders.filter(
          (item) => item.uuid !== modalShareholder.uuid
        ) || [];

      await deleteShareholder({
        clientId: clientSelected.uuid,
        masterClientId: masterClientSelected.uuid,
        shareholders,
      });

      getClientsInfo(clientSelected.uuid);

      onShowMessage({
        isVisible: true,
        title: `The shareholder ${modalShareholder.name} has been deleted.`,
        type: 'message',
        status: 'success',
        description: '',
        onClose: () => {},
      });
    } catch (error: any) {
      onShowMessage({
        isVisible: true,
        title: 'Error deleting shareholder',
        type: 'message',
        status: 'fail',
        description: error?.message || '',
        onClose: () => {},
      });
    } finally {
      setModalShareholder({ isVisible: false, name: '', uuid: '' });
      setIsDeleteLoading(false);
    }
  }, [
    clientSelected,
    deleteShareholder,
    getClientsInfo,
    masterClientSelected,
    modalShareholder.name,
    modalShareholder.uuid,
    onShowMessage,
  ]);

  return (
    <>
      <HeaderClientsDetails />

      <Row
        style={{ marginTop: 32, paddingInline: 24 }}
        width="100%"
        align="center"
        justify="space-between"
      >
        <Text variant="body_md_semibold">
          Number of Shareholders {clientSelected?.shareholders?.length || 0}
        </Text>

        <Button
          leftIcon="plus-circle"
          text="Add shareholders"
          roundness="rounded"
          variant="secondary"
          onClick={navigateToAddShareholder()}
        />
      </Row>

      <Column padding="sm" style={{ width: '100%' }}>
        {clientSelected?.shareholders.map((item, index) => (
          <Column
            key={item.uuid}
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
              <Text variant="body_md_bold">{`Shareholder ${index + 1}`}</Text>
              <Row gap="lg">
                <Button
                  roundness="rounded"
                  size="small"
                  leftIcon="pen-2"
                  text="Edit"
                  onClick={navigateToAddShareholder(item.uuid)}
                />
                <Button
                  size="small"
                  roundness="rounded"
                  leftIcon="trash-bin-minimalistic"
                  text="Delete"
                  onClick={() =>
                    setModalShareholder({
                      isVisible: true,
                      name: item.fullName,
                      uuid: item.uuid,
                    })
                  }
                />
              </Row>
            </Row>

            <LabelAndValue label="Type" value={item.entityType} />
            <LabelAndValue label="Full name" value={item.fullName} />

            {item.entityType === 'individual' && (
              <>
                <LabelAndValue
                  label="Date of birth"
                  value={item.dob && dayjs(item.dob).format('YYYY-MM-DD')}
                />
                <LabelAndValue label="Occupation" value={item.occupation} />
              </>
            )}

            <LabelAndValue label="Phone number" value={item.telephoneNumber} />
            <LabelAndValue label="Email" value={item.email} />

            {item.entityType === 'individual' && (
              <LabelAndValue label="Nationality" value={item.nationality} />
            )}

            {item.entityType === 'business' && (
              <LabelAndValue label="Company Type" value={item.companyType} />
            )}
            <LabelAndValue label="Shares Held" value={item.shares} />
            <LabelAndValue label="Address 1" value={item.address1} />
            <LabelAndValue label="Address 2" value={item.address2} />

            <LabelAndValue
              label="Previous Address 1"
              value={item.previousAddress1}
            />
            <LabelAndValue
              label="Previous Address 2"
              value={item.previousAddress2}
            />

            <LabelAndValue label="State" value={item.state} />

            <LabelAndValue label="Country" value={item.country} />
          </Column>
        ))}
      </Column>

      <ModalMessage
        isVisible={modalShareholder.isVisible}
        title={`Are you sure want to delete Shareholder ${modalShareholder.name}?`}
        description=""
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        onCancel={() =>
          setModalShareholder({ isVisible: false, name: '', uuid: '' })
        }
      />
    </>
  );
}
