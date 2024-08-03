'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Tooltip } from '@/components/Tooltip';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { Icon, Text } from '@cdaxfx/ui';

import ModalResult from '../ModalResult';
import Select from '../Select';
import { Container } from './styles';

export default function ClientSelector() {
  const { currentUser, setChangeClient } = useAuth();
  const { onShowNotification } = useNotification();
  const [modalResultOpen, setModalResultOpen] = useState(false);

  const listOption = useMemo(() => {
    return currentUser?.clients
      ? currentUser.clients.map((data) => ({
          label: data.name,
          value: data.uuid,
        }))
      : [];
  }, [currentUser]);

  const handleChangeUser = useCallback(
    async (uuid: string) => {
      try {
        setChangeClient(uuid).then(() => {
          window.location.reload();
          if (!currentUser?.currentClient?.name) return;
          localStorage.setItem('_changeClient_notify', 'notify');
        });
      } catch (error: any) {
        onShowNotification({
          type: 'ERROR',
          message: error?.message ?? 'Error changing user',
          description: '',
        });
      }
    },
    [currentUser?.currentClient?.name, onShowNotification, setChangeClient]
  );

  useEffect(() => {
    const notification = localStorage.getItem('_changeClient_notify');
    if (!notification) return;
    setModalResultOpen(true);
    localStorage.removeItem('_changeClient_notify');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container>
        <Text variant="body_sm_semibold">Active account</Text>

        <Tooltip title="Select the account you would like to access. You can navigate between your accounts using the selection item on the side, every action you perform will refer to the account that is currently selected.">
          <p>
            <Icon variant="exclamation-circle" />
          </p>
        </Tooltip>

        <Select
          label=""
          onChange={handleChangeUser}
          options={listOption}
          value={currentUser?.currentClient?.uuid}
          showSearch
        />
      </Container>
      <ModalResult
        isVisible={modalResultOpen}
        onCancel={() => setModalResultOpen(false)}
        type="SUCCESS"
        title={`Now you are currently logged into the account: ${currentUser?.currentClient?.name}.`}
        subtitle={`Welcome back, ${currentUser?.firstname} ${currentUser?.lastname}!`}
      />
    </>
  );
}
