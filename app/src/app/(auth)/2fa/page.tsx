'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import TwoFactorCodeInput from '@/components/Input2fa';

// import { useCurrentUser } from '@/context/CurrentUser';

import { censorPhoneNumber, formatPhoneNumber } from '@/utils/lib';

import { useAuth } from '@/store/useAuth';
import { Spin } from 'antd';

// import { check2faCode, send2faCode } from '@/api/auth';

import { defaultTheme } from '@/styles/themes/default';

import {
  Card,
  Container,
  InputsContainer,
  LinkBtn,
  StyledForm,
} from './styles';

export default function TwoFactorAuth() {
  // const { currentUser, setCurrentUserData } = useCurrentUser();
  const { currentUser, set2fa, setSend2Fa } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [sendSuccessMessage, setSendSuccessMessage] = useState(
    'We send a code to your email'
  );

  const [provider, setProvider] = useState<'sms' | 'email'>('email');
  const [timer, setTimer] = useState<number>(60);

  const router = useRouter();

  useEffect(() => {
    const storagedTime = localStorage.getItem('2fa_timer');
    if (storagedTime) setTimer(Number(storagedTime));
  }, []);

  useEffect(() => {
    let intervalId: any;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    localStorage.setItem('2fa_timer', String(timer));
    return () => {
      localStorage.removeItem('2fa_timer');
      clearInterval(intervalId);
    };
  }, [timer]);

  const handleResendCode = async (provider: 'sms' | 'email'): Promise<void> => {
    setProvider(provider);

    if (provider === 'sms') {
      const mobileNumber = formatPhoneNumber(
        (currentUser as any).contact?.mobileNumber
      );
      const censoredPhoneNumber = mobileNumber
        ? censorPhoneNumber(mobileNumber)
        : null;
      setSendSuccessMessage(`We send a code to ${censoredPhoneNumber}`);
    } else if (provider === 'email') {
      setSendSuccessMessage;
    }
    setIsLoading(true);

    await setSend2Fa(provider)
      .then(() => setTimer(60))
      .catch((err) => {
        setIsLoading(false);
        setErrorMessage(err);
      })
      .finally(() => setIsLoading(false));

    // await send2faCode(provider)
    //   .then((res) => {
    //     res;
    //     setTimer(60);
    //   })
    //   .catch((err) => {
    //     setErrorMessage(err);
    //   });
  };

  const handleSubmit = async () => {
    if (!code || code.length < 6) {
      setErrorMessage('Please provide a valid 6 digit code');
      return;
    }

    setIsLoading(true);

    await set2fa({
      code: code,
      provider: provider,
    })
      .then(() => {
        router.push('/dashboard');
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessage(
          'The security code you entered is incorrect. Please try again.'
        );
      });
    // setLoading(true);

    // await check2faCode(code, provider)
    //   .then((res) => {
    //     setCurrentUserData(res, true);

    //     router.push('/dashboard');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //     setErrorMessage(err);
    //   });
  };

  useEffect(() => {
    if (code.length >= 6) {
      setErrorMessage('');
    }
  }, [code]);

  return (
    <Container>
      <Card>
        <h1>Enter the 6 digit code</h1>
        <h2>{sendSuccessMessage}</h2>
        <StyledForm>
          <InputsContainer>
            <TwoFactorCodeInput
              onChange={setCode}
              allowedCharacters="numeric"
              autoFocus
              errorMsg={errorMessage}
            />
          </InputsContainer>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '52px',
              }}
            >
              <Spin />
            </div>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={false}
              color={defaultTheme.colors.primary}
            >
              Verify
            </Button>
          )}
        </StyledForm>
        {timer ? (
          <h3 className="timer">{`Send again ${timer}`}</h3>
        ) : (
          <LinkBtn onClick={() => handleResendCode(provider)}>
            Send again
          </LinkBtn>
        )}
        {(currentUser as any)?.contact?.mobileNumber && (
          <LinkBtn
            disabled={!!timer}
            onClick={() => {
              handleResendCode(provider === 'email' ? 'sms' : 'email');
            }}
          >
            {`Receive by ${provider === 'email' ? 'SMS' : 'Mail'}`}
          </LinkBtn>
        )}
      </Card>
    </Container>
  );
}
