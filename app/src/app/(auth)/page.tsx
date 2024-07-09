'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createRef, useCallback, useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import Button from '@/components/Button';
import Input from '@/components/Input';
import ModalForgotPassword from '@/components/ModalForgotPassword';

// import { useCurrentUser } from '@/context/CurrentUser';

import { AUTH_PATHS } from '@/app/paths';
import { useAuth } from '@/store/useAuth';
import { LoadingOutlined } from '@ant-design/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import * as ApiAuth from '@/api/auth';

import { defaultTheme } from '@/styles/themes/default';

import {
  ActionContainer,
  ButtonsContainer,
  CaptchaContainer,
  Container,
  FormContainer,
  MainActionContainer,
  RequestRegistration,
  SubmitError,
  Subtitle,
  Title,
  TitleContainer,
} from './styles';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail invalid')
    .required('Please enter the email address.'),
  password: Yup.string()
    .required('Please enter the password.')
    .min(6, 'Password must contain 6 characters '),
});

interface IDataSubmit {
  email: string;
  password: string;
}

const formActionsInit = {
  loading: false,
  error: '',
};

export default function SignIn() {
  const router = useRouter();
  // const { setCurrentUserData, clearUserData } = useCurrentUser();
  const { setClearUser, setSignIn } = useAuth();

  const captchaRef = createRef<ReCAPTCHA>();

  const [formActions, setFormActions] = useState(formActionsInit);
  const [modalForgotPassword, setModalForgotPassword] =
    useState<boolean>(false);

  const [captcha, setCaptcha] = useState<string>('');
  const [captchaErrorMessage, setCaptchaErrorMessage] = useState<
    string | null
  >();

  useEffect(() => {
    // clearUserData();
    setClearUser();
  }, [setClearUser]);

  const handleSubmit = useCallback(
    async (data: IDataSubmit) => {
      try {
        setFormActions({
          error: '',
          loading: true,
        });

        if (!captcha) {
          setCaptchaErrorMessage('Please complete the reCAPTCHA to proceed.');
          return;
        }

        setCaptchaErrorMessage(null);

        await setSignIn({
          password: data.password,
          r: captcha,
          username: data.email,
        });

        router.push(AUTH_PATHS.AUTH_2FA);
      } catch (error: any) {
        setCaptcha('');
        setFormActions({
          error: error?.message?.replace('Error: ', '') ?? '',
          loading: false,
        });
      }
    },
    [captcha, router, setSignIn]
  );

  useEffect(() => {
    if (captchaErrorMessage || formActions.error) {
      captchaRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaErrorMessage, formActions.error]);

  return (
    <>
      <Container>
        <FormContainer>
          <Image
            id="img1"
            src={'/image/cdax-logo.svg'}
            alt="Mini Phone"
            width={212}
            height={200}
          />
          <TitleContainer>
            <Title>Sign In</Title>
            <Subtitle>Welcome back! Please enter your details</Subtitle>
          </TitleContainer>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={({ email, password }) => {
              handleSubmit({ email, password });
            }}
          >
            {({ handleChange, values, errors, handleSubmit }) => (
              <ActionContainer>
                <Input
                  disabled={formActions.loading}
                  containerStyle={{ marginBottom: 16 }}
                  placeholder="email@example.com"
                  label="E-mail:"
                  value={values.email}
                  onChange={handleChange('email')}
                  error={errors?.email}
                />
                <Input
                  disabled={formActions.loading}
                  onChange={handleChange('password')}
                  error={errors?.password}
                  value={values.password}
                  label="Password:"
                  placeholder="your password"
                  password
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '3rem',
                  }}
                >
                  <CaptchaContainer $hasError={!!captchaErrorMessage}>
                    <div>
                      <ReCAPTCHA
                        ref={captchaRef}
                        hl="en"
                        onChange={(e: any) => setCaptcha(e)}
                        sitekey={String(
                          process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY
                        )}
                      />
                    </div>
                    {captchaErrorMessage && !captcha && (
                      <span>{captchaErrorMessage}</span>
                    )}
                  </CaptchaContainer>
                </div>
                {formActions.loading ? (
                  <LoadingOutlined
                    style={{
                      color: defaultTheme.colors.primary,
                      fontSize: 40,
                      fontWeight: 600,
                      paddingBlock: 40,
                    }}
                  />
                ) : (
                  <ButtonsContainer>
                    {formActions.error && (
                      <SubmitError>{formActions.error}</SubmitError>
                    )}
                    <MainActionContainer>
                      <Button
                        disabled={formActions.loading || !captcha}
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        color={defaultTheme.colors.primary}
                      >
                        Login
                      </Button>
                    </MainActionContainer>
                    <Link
                      style={{
                        fontWeight: 600,
                        color: '#1E3456',
                        fontSize: 14,
                      }}
                      onClick={() => setModalForgotPassword(true)}
                      href={'#'}
                    >
                      Forgot Password
                    </Link>
                    <RequestRegistration>
                      {`Don't have an Account?  `}
                      <Link href={'/registration'}>Request registration</Link>
                    </RequestRegistration>
                  </ButtonsContainer>
                )}
              </ActionContainer>
            )}
          </Formik>
        </FormContainer>
      </Container>

      <ModalForgotPassword
        isVisible={modalForgotPassword}
        onClose={setModalForgotPassword}
      />
    </>
  );
}
