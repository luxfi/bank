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
  const router = useRouter();
  const { onShowMessage } = useMessages();
  const { theme } = useTheme();
  const {
    clientSelected,
    masterClientSelected,
    postDirectors,
    getClientsInfo,
  } = useClients();

  const [modalDirector, setModalDirector] = useState<{
    isVisible: boolean;
    name: string;
    uuid: string;
  }>({ isVisible: false, name: '', uuid: '' });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const redirectClients = useCallback(() => {
    return router.push('/clients');
  }, [router]);

  const handleDelete = useCallback(async () => {
    try {
      if (!clientSelected) return redirectClients();
      if (!masterClientSelected) return redirectClients();

      setIsDeleteLoading(true);

      const directors = clientSelected?.directors?.filter(
        (director) => director.uuid !== modalDirector.uuid
      );

      await postDirectors({
        clientUuid: clientSelected.uuid,
        masterClientId: masterClientSelected.uuid,
        directors,
      });

      await getClientsInfo(clientSelected?.uuid ?? '');

      onShowMessage({
        isVisible: true,
        title: `The Director ${modalDirector.name} has been deleted.`,
        type: 'message',
        status: 'success',
        description: '',
        onClose: () => {},
      });
    } catch (error: any) {
      onShowMessage({
        isVisible: true,
        title: 'Error deleting Director',
        type: 'message',
        status: 'fail',
        description: error?.message || '',
        onClose: () => {},
      });
    } finally {
      setModalDirector({ isVisible: false, name: '', uuid: '' });
      setIsDeleteLoading(false);
    }
  }, [
    clientSelected,
    getClientsInfo,
    masterClientSelected,
    modalDirector.name,
    modalDirector.uuid,
    onShowMessage,
    postDirectors,
    redirectClients,
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
        <Text variant="body_md_semibold">{`Number of Directors ${clientSelected?.directors?.length}`}</Text>

        <Button
          leftIcon="plus-circle"
          text="Add director"
          roundness="rounded"
          variant="secondary"
          onClick={() => router.push(`director/edit`)}
        />
      </Row>

      {clientSelected?.directors?.map((director, index) => (
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
              <Text variant="body_md_semibold">{`Director ${index + 1}`}</Text>
              <Row gap="lg">
                <Button
                  roundness="rounded"
                  leftIcon="pen-2"
                  text="Edit"
                  size="small"
                  onClick={() =>
                    router.push(`director/edit?directorId=${director.uuid}`)
                  }
                />
                <Button
                  roundness="rounded"
                  leftIcon="trash-bin-minimalistic"
                  text="Delete"
                  size="small"
                  onClick={() => {
                    setModalDirector({
                      isVisible: true,
                      name: director.fullName,
                      uuid: director.uuid,
                    });
                  }}
                />
              </Row>
            </Row>

            <LabelAndValue label="Full Name" value={director.fullName} />
            <LabelAndValue
              label="Date of birth"
              value={dayjs(director.dob, 'YYYY-MM-DD').format('YYYY-MM-DD')}
            />
            <LabelAndValue label="Occupation" value={director.occupation} />
            <LabelAndValue
              label="Phone number"
              value={director.telephoneNumber}
            />
            <LabelAndValue label="Email" value={director.email} />
            <LabelAndValue label="Nationality" value={director.nationality} />
            <LabelAndValue label="Address 1" value={director.address1} />
            <LabelAndValue label="Address 2" value={director.address2} />
            <LabelAndValue
              label="Previous address 1"
              value={director.previousAddress1}
            />
            <LabelAndValue
              label="Previous address 2"
              value={director.previousAddress2}
            />
            <LabelAndValue label="Country" value={director.country} />
          </Column>
        </Column>
      ))}

      <ModalMessage
        isVisible={modalDirector.isVisible}
        title={`Are you sure want to delete Director ${modalDirector.name}?`}
        description=""
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        onCancel={() =>
          setModalDirector({ isVisible: false, name: '', uuid: '' })
        }
      />
    </>
  );
}
