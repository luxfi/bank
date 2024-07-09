import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';

import { ISubAccount } from '@/models/clients';

import { useMessages } from '@/context/Messages';
import { useNotification } from '@/context/Notification';

import { useClients } from '@/store/useClient';
import { Button, Column, Text, useTheme } from '@cdaxfx/ui';
import { Modal, Spin } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import {
  EGateway,
  IFormCurrencyCloud,
  IFormIFX,
  TForm,
  initCurrencyCloud,
  initIFX,
  optionsPaymentGateway,
} from './types';

interface IProps {
  isVisible: boolean;
  onClose(): void;
}

export const ModalDocumentsLinkAccount = ({ isVisible, onClose }: IProps) => {
  const { theme } = useTheme();

  const {
    clientSelected,
    masterClientSelected,
    getSubAccount,
    postLinkAccountCurrencyCloud,
    postLinkAccountIFX,
    loading,
    getClientsInfo,
  } = useClients();
  const { onShowMessage } = useMessages();
  const { onShowNotification } = useNotification();

  const [form, setForm] = useState<TForm>(initIFX);
  const [subAccount, setSubAccount] = useState<Array<ISubAccount>>([]);

  useEffect(() => {
    getSubAccount().then(setSubAccount);
  }, []);

  useEffect(() => {
    if (
      ['Low', 'Standard'].includes(
        clientSelected?.riskAssessment?.riskRating ?? ''
      )
    ) {
      handleSetForm('gateway', 'CURRENCY_CLOUD');
    }
  }, [clientSelected]);

  const optionCurrencyId = useMemo((): Array<DefaultOptionType> => {
    return subAccount?.map((data) => ({
      label: `${data.friendlyName} ${data.clientType}`,
      value: data.accountHolderId,
    }));
  }, [subAccount]);

  const handleSetForm = useCallback(
    <T extends TForm>(field: keyof T, value: string) => {
      setForm((pS) => {
        if (field === 'gateway' && value != form.gateway) {
          return {
            ...(value === 'CURRENCY_CLOUD' ? initCurrencyCloud : initIFX),
            [field]: value,
          };
        }

        return {
          ...pS,
          [field]: value,
        };
      });
    },
    [form]
  );

  const currencyCloud = () => (
    <Column style={{ width: '100%', gap: 16 }}>
      <Select
        containerStyle={{ marginBottom: 16 }}
        label={'Contact ID'}
        showSearch
        options={optionCurrencyId}
        value={(form as IFormCurrencyCloud).contactId}
        onChange={(v: EGateway) =>
          handleSetForm<IFormCurrencyCloud>('contactId', v)
        }
      />
    </Column>
  );

  const ifx = () => (
    <Column style={{ width: '100%', gap: 16 }}>
      <Input
        label="Client ID"
        onChange={(v) => handleSetForm<IFormIFX>('clientId', v)}
      />
      <Input
        label="Client secret"
        onChange={(v) => handleSetForm<IFormIFX>('clientSecret', v)}
      />
      <Input
        label="User name"
        onChange={(v) => handleSetForm<IFormIFX>('userName', v)}
      />
      <Input
        label="Password"
        onChange={(v) => handleSetForm<IFormIFX>('password', v)}
      />
    </Column>
  );

  const fieldForm: Record<EGateway, ReactNode> = {
    CURRENCY_CLOUD: currencyCloud(),
    IFX: ifx(),
  };

  const disabledButton = useMemo((): boolean => {
    return Object.values(form).filter((value) => value === '').length > 0;
  }, [form]);

  const handleSubmitForm = useCallback(async () => {
    if (form.gateway === 'CURRENCY_CLOUD') {
      return await postLinkAccountCurrencyCloud({
        clientId: clientSelected?.uuid ?? '',
        contactId: form.contactId ?? '',
        masterClientId: masterClientSelected?.uuid ?? '',
      })
        .then(() =>
          onShowMessage({
            isVisible: true,
            title: 'Linked to Currency Cloud successfully.',
            type: 'message',
            description: '',
            onClose: () => {
              getClientsInfo(clientSelected?.uuid ?? '');
              onClose();
            },
          })
        )
        .catch((error) =>
          onShowNotification({
            type: 'ERROR',
            description: '',
            message: (error as any)?.message ?? 'Erro on save Currency Cloud',
          })
        );
    }

    return await postLinkAccountIFX({
      masterClientId: masterClientSelected?.uuid ?? '',
      clientId: clientSelected?.uuid ?? '',
      credentials: {
        clientId: form.clientId,
        clientSecret: form.clientSecret,
        password: form.password,
        username: form.userName,
      },
    })
      .then(() =>
        onShowMessage({
          isVisible: true,
          title: 'Linked to IFX successfully.',
          type: 'message',
          description: '',
          onClose: () => {
            getClientsInfo(clientSelected?.uuid ?? '');
            onClose();
          },
        })
      )
      .catch((error) =>
        onShowNotification({
          type: 'ERROR',
          description: '',
          message: (error as any)?.message ?? 'Erro on save Currency Cloud',
        })
      );
  }, [
    form,
    postLinkAccountIFX,
    masterClientSelected?.uuid,
    clientSelected?.uuid,
    postLinkAccountCurrencyCloud,
    onShowMessage,
    onShowNotification,
  ]);

  return (
    <Modal
      centered
      open={isVisible}
      footer={() => null}
      width={'516px'}
      closable={true}
      maskClosable={false}
      onCancel={() => onClose()}
    >
      <Column width="100%">
        <Text
          style={{ fontSize: 16, alignSelf: 'flex-start', marginBottom: 24 }}
          variant="body_sm_bold"
        >
          Link to gateway
        </Text>
        <Text
          style={{ fontSize: 14, alignSelf: 'flex-start', marginBottom: 24 }}
          variant="body_sm_regular"
          color={theme.textColor.layout.secondary.value}
        >
          Please select a payment gateway
        </Text>

        <Select
          containerStyle={{ marginBottom: 16 }}
          label={'Payment gateway'}
          options={optionsPaymentGateway}
          value={form.gateway}
          onChange={(v: EGateway) => handleSetForm('gateway', v)}
        />

        {fieldForm[form.gateway]}

        {loading.postLinkAccountCurrencyCloud ||
        loading.postLinkAccountCurrencyCloud ? (
          <Spin size="large" style={{ alignSelf: 'center', marginTop: 32 }} />
        ) : (
          <Button
            disabled={disabledButton}
            text="Link Account"
            style={{ alignSelf: 'flex-end', marginTop: 32 }}
            roundness="rounded"
            onClick={() => handleSubmitForm()}
          />
        )}
      </Column>
    </Modal>
  );
};
