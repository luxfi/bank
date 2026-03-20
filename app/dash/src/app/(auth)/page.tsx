'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { Stack, XStack } from 'tamagui'

import {
  BankPage,
  BankCard,
  BankButton,
  BankButtonText,
  BankHeading,
  BankText,
  BankField,
  BankAlert,
  BankAlertText,
  bankColors,
  bankInputStyle,
  bankInputInvalidStyle,
} from '@/components/bank'
import ModalForgotPassword from '@/components/ModalForgotPassword'
import { TriangleBankLogo } from '@/components/TriangleBankLogo'
import { LuxLogo } from '@luxfi/logo/react'

import { AUTH_PATHS } from '@/app/paths'
import { useAuth } from '@/store/useAuth'
import { Formik } from 'formik'
import * as Yup from 'yup'

// Demo mode configuration
const IS_DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
  process.env.NEXT_PUBLIC_DEMO_CUSTOMER === 'triangle-bank'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail invalid')
    .required('Please enter the email address.'),
  password: Yup.string()
    .required('Please enter the password.')
    .min(6, 'Password must contain 6 characters '),
})

interface IDataSubmit {
  email: string
  password: string
}

const formActionsInit = {
  loading: false,
  error: '',
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <BankCard size="sm" maxWidth={280} gap={12} padding={24}>
      <BankHeading size="xs">{title}</BankHeading>
      <BankText>{description}</BankText>
    </BankCard>
  )
}

function SignInContent() {
  const router = useRouter()
  const { setClearUser, setSignIn } = useAuth()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [formActions, setFormActions] = useState(formActionsInit)
  const [modalForgotPassword, setModalForgotPassword] =
    useState<boolean>(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)

  useEffect(() => {
    setClearUser()
  }, [setClearUser])

  const handleSubmit = useCallback(
    async (data: IDataSubmit) => {
      try {
        setFormActions({
          error: '',
          loading: true,
        })

        if (!executeRecaptcha) {
          setFormActions({
            error: 'reCAPTCHA not ready. Please try again.',
            loading: false,
          })
          return
        }

        const token = await executeRecaptcha('login')

        await setSignIn({
          password: data.password,
          r: token,
          username: data.email,
        })

        router.push(AUTH_PATHS.AUTH_2FA)
      } catch (error: any) {
        setFormActions({
          error: error?.message?.replace('Error: ', '') ?? '',
          loading: false,
        })
      }
    },
    [executeRecaptcha, router, setSignIn]
  )

  return (
    <>
      <Stack backgroundColor={bankColors.bg}>
        {/* ===== HERO: Login Form ===== */}
        <BankPage>
          <BankCard>
            {/* Logo */}
            <XStack justifyContent="center">
              {IS_DEMO_MODE ? (
                <TriangleBankLogo size={80} />
              ) : (
                <LuxLogo size={80} variant="white" />
              )}
            </XStack>

            {/* Title */}
            <Stack gap={8}>
              <BankHeading size="lg">Sign In</BankHeading>
              <BankText>
                {IS_DEMO_MODE
                  ? 'Welcome to Triangle Bank Demo'
                  : 'Welcome back! Please enter your details'}
              </BankText>
            </Stack>

            {/* Form */}
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={validationSchema}
              onSubmit={({ email, password }) => {
                handleSubmit({ email, password })
              }}
            >
              {({ handleChange, values, errors, handleSubmit }) => (
                <Stack gap={24}>
                  <Stack gap={20}>
                    {/* Email field */}
                    <BankField label="Email" error={errors.email}>
                      <input
                        className={`bank-input ${errors.email ? "bank-input-invalid" : ""}`}
                        placeholder="email@example.com"
                        value={values.email}
                        onChange={(e) => handleChange('email')(e.target.value)}
                        disabled={formActions.loading}
                        autoComplete="email"
                      />
                    </BankField>

                    {/* Password field */}
                    <BankField label="Password" error={errors.password}>
                      <input
                        className={`bank-input ${errors.password ? "bank-input-invalid" : ""}`}
                        type="password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={(e) => handleChange('password')(e.target.value)}
                        disabled={formActions.loading}
                        autoComplete="current-password"
                      />
                    </BankField>
                  </Stack>

                  {/* Error */}
                  {formActions.error && (
                    <BankAlert status="error">
                      <BankAlertText status="error">{formActions.error}</BankAlertText>
                    </BankAlert>
                  )}

                  {/* Button */}
                  <BankButton
                    disabled={formActions.loading}
                    onPress={(e) => {
                      e.preventDefault?.()
                      handleSubmit()
                    }}
                  >
                    <BankButtonText>
                      {formActions.loading ? 'Signing in...' : 'Log In'}
                    </BankButtonText>
                  </BankButton>

                  {/* Links */}
                  <Stack alignItems="center" gap={12} paddingTop={8}>
                    <BankText
                      variant="link"
                      hoverStyle={{ opacity: 0.7 }}
                      onPress={() => setModalForgotPassword(true)}
                    >
                      Forgot Password
                    </BankText>
                    <BankText>
                      {"Don't have an Account? "}
                      <Link
                        href="/registration"
                        style={{
                          fontWeight: 600,
                          color: 'white',
                          textDecorationLine: 'underline',
                        }}
                      >
                        Request registration
                      </Link>
                    </BankText>
                  </Stack>
                </Stack>
              )}
            </Formik>
          </BankCard>

          {/* Scroll indicator */}
          <BankText
            variant="muted"
            textAlign="center"
            paddingTop={24}
          >
            ↓ Scroll to learn more
          </BankText>
        </BankPage>

        {/* ===== Section 1: Institutional-Grade Trading ===== */}
        <Stack
          padding={48}
          paddingHorizontal={32}
          alignItems="center"
          backgroundColor={bankColors.bg}
        >
          <Stack gap={24} maxWidth={960} width="100%" alignItems="center">
            <BankHeading size="md" textAlign="center">
              Institutional-Grade Trading
            </BankHeading>
            <BankText textAlign="center" maxWidth={640}>
              High-frequency trading engine with sub-millisecond execution.
              Multi-chain liquidity aggregation across Lux Network.
            </BankText>
            <XStack gap={32} flexWrap="wrap" justifyContent="center" paddingTop={24}>
              <FeatureCard
                title="HFT Engine"
                description="Sub-ms execution with MEV protection and priority ordering"
              />
              <FeatureCard
                title="Deep Liquidity"
                description="Aggregated across AMM V2, V3, V4 pools and order books"
              />
              <FeatureCard
                title="Cross-Chain"
                description="Unified liquidity across Lux, Zoo, Hanzo, SPC, and Pars chains"
              />
            </XStack>
          </Stack>
        </Stack>

        {/* ===== Section 2: AMM Protocol Suite ===== */}
        <Stack
          padding={48}
          paddingHorizontal={32}
          alignItems="center"
          backgroundColor="#0A0A0A"
        >
          <Stack gap={24} maxWidth={960} width="100%" alignItems="center">
            <BankHeading size="md" textAlign="center">
              AMM Protocol Suite
            </BankHeading>
            <BankText textAlign="center" maxWidth={640}>
              Battle-tested automated market makers powering billions in volume
            </BankText>
            <XStack gap={32} flexWrap="wrap" justifyContent="center" paddingTop={24}>
              <FeatureCard
                title="Uniswap V2"
                description="Constant product AMM for long-tail assets"
              />
              <FeatureCard
                title="Concentrated Liquidity V3"
                description="Capital-efficient ranges with tick-based pricing"
              />
              <FeatureCard
                title="V4 Hooks"
                description="Programmable pools with custom logic, dynamic fees, TWAMM"
              />
              <FeatureCard
                title="NFT Pools"
                description="ERC-721 and ERC-1155 native trading with floor price discovery"
              />
            </XStack>
          </Stack>
        </Stack>

        {/* ===== Section 3: Multi-Asset Coverage ===== */}
        <Stack
          padding={48}
          paddingHorizontal={32}
          alignItems="center"
          backgroundColor={bankColors.bg}
        >
          <Stack gap={24} maxWidth={960} width="100%" alignItems="center">
            <BankHeading size="md" textAlign="center">
              Every Asset Class
            </BankHeading>
            <BankText textAlign="center" maxWidth={640}>
              Trade crypto, tokenized securities, FX, and real-world assets
            </BankText>
            <XStack gap={32} flexWrap="wrap" justifyContent="center" paddingTop={24}>
              <FeatureCard
                title="Spot Trading"
                description="500+ token pairs across all Lux chains"
              />
              <FeatureCard
                title="FX & Stablecoins"
                description="Institutional FX rates with instant settlement"
              />
              <FeatureCard
                title="Tokenized Securities"
                description="Private equity, bonds, real estate on-chain"
              />
              <FeatureCard
                title="NFTs & Collectibles"
                description="Native marketplace with royalty enforcement"
              />
            </XStack>
          </Stack>
        </Stack>

        {/* ===== Section 4: Private Markets + FHE ===== */}
        <Stack
          padding={48}
          paddingHorizontal={32}
          alignItems="center"
          backgroundColor="#0A0A0A"
        >
          <Stack gap={24} maxWidth={960} width="100%" alignItems="center">
            <BankHeading size="md" textAlign="center">
              Private Markets
            </BankHeading>
            <BankText textAlign="center" maxWidth={640}>
              Fully homomorphic encryption for confidential trading
            </BankText>
            <XStack gap={32} flexWrap="wrap" justifyContent="center" paddingTop={24}>
              <FeatureCard
                title="FHE Trading"
                description="Encrypted order matching — price discovery without information leakage"
              />
              <FeatureCard
                title="Dark Pools"
                description="Institutional block trades with zero market impact"
              />
              <FeatureCard
                title="Compliance"
                description="On-chain KYC/AML with privacy-preserving proofs"
              />
              <FeatureCard
                title="Post-Quantum"
                description="Lattice-based cryptography securing all transactions"
              />
            </XStack>
          </Stack>
        </Stack>

        {/* ===== Email Capture Section ===== */}
        <Stack
          padding={48}
          paddingHorizontal={32}
          alignItems="center"
          backgroundColor={bankColors.card}
          gap={24}
        >
          <BankHeading size="md" textAlign="center">
            Request Early Access
          </BankHeading>
          <BankText textAlign="center" maxWidth={480}>
            Join the waitlist for institutional trading on Lux Network
          </BankText>
          {waitlistSubmitted ? (
            <BankText textAlign="center">
              Thanks! We&apos;ll be in touch.
            </BankText>
          ) : (
            <XStack gap={12} maxWidth={480} width="100%">
              <input
                className="bank-input" style={{ flex: 1 }}
                placeholder="your@email.com"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
              />
              <BankButton
                width="auto"
                paddingHorizontal={24}
                onPress={() => {
                  if (waitlistEmail.includes('@')) {
                    setWaitlistSubmitted(true)
                  }
                }}
              >
                <BankButtonText>Join</BankButtonText>
              </BankButton>
            </XStack>
          )}
        </Stack>

        {/* ===== Footer ===== */}
        <Stack
          padding={32}
          alignItems="center"
          backgroundColor={bankColors.bg}
          borderTopWidth={1}
          borderTopColor={bankColors.divider}
        >
          <BankText variant="muted">
            &copy; 2026 Lux Financial. All rights reserved.
          </BankText>
        </Stack>
      </Stack>

      <ModalForgotPassword
        isVisible={modalForgotPassword}
        onClose={setModalForgotPassword}
      />
    </>
  )
}

export default function SignIn() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
    >
      <SignInContent />
    </GoogleReCaptchaProvider>
  )
}
