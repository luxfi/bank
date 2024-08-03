import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { Button, Column, Row, Text, useTheme } from '@luxbank/ui';
import { Modal, Spin } from 'antd';
import Cookies from 'js-cookie';

import TwoFactorCodeInput from '../Input2fa';
import { InputsContainer } from './styles';

interface IProps {
  isVisible: boolean;
  accountName: string;
  onClose(value: false): void;
}

export const ModalCheckCodeImpersonate = ({
  onClose,
  accountName,
  isVisible,
}: IProps) => {
  const router = useRouter();

  const { theme } = useTheme();
  const { loading, set2fa, setChangeUserImpersonateAndCurrentUser } = useAuth();
  const { onShowNotification } = useNotification();

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!code || code.length < 6) {
      setErrorMessage('Please provide a valid 6 digit code');
      return;
    }

    await set2fa({
      code: code,
      provider: 'email',
    })
      .then((response) => {
        setChangeUserImpersonateAndCurrentUser(response.user);
        router.push('/dashboard');
        onClose(false);
      })
      .catch((err) => {
        onShowNotification({
          description: '',
          message: err?.message ?? 'Error on check your code',
          type: 'ERROR',
        });
      });
  };

  const handleCloseModal = () => {
    if (loading.setImpersonate) return;

    const token =
      Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_IMPERSONATE ?? '') ?? '';

    Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '', token);

    onClose(false);
  };

  return (
    <Modal
      onCancel={() => handleCloseModal()}
      title=""
      centered
      open={isVisible}
      footer={() => null}
    >
      <Column align="center">
        <Text variant="body_md_bold">{`Switching to ${accountName}`}</Text>
        <Text
          color={theme.textColor.layout.secondary.value}
          variant="body_sm_regular"
        >{`Enter your 6 digit code`}</Text>

        {loading.setImpersonate && (
          <Row align="center" justify="center" style={{ marginBlock: 24 }}>
            <Spin />
          </Row>
        )}

        <form
          style={{
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {!loading.setImpersonate && (
            <InputsContainer>
              <TwoFactorCodeInput
                onChange={setCode}
                allowedCharacters="numeric"
                autoFocus
                errorMsg={errorMessage}
              />
            </InputsContainer>
          )}

          {loading.set2fa && (
            <Row align="center" justify="center" style={{ marginBlock: 24 }}>
              <Spin />
            </Row>
          )}

          {!loading.set2fa && (
            <Button
              disabled={code.length < 6}
              roundness="rounded"
              text="Access account"
              onClick={() => handleSubmit()}
            />
          )}
        </form>
      </Column>
    </Modal>
  );
};
