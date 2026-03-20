'use client'

import Link from 'next/link'
import { useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Stack, Spinner } from 'tamagui'

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
  bankInputStyle,
  bankInputInvalidStyle,
} from '@/components/bank'

import { LuxLogo } from '@luxfi/logo/react'

import { forgotPassword } from '@/api/auth'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
})

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (data) => {
      setLoading(true)
      setError('')
      try {
        await forgotPassword({ email: data.email })
        setSuccess(true)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <BankPage>
      <BankCard size="sm" alignItems="center" gap={24}>
        <LuxLogo size={80} variant="white" style={{ marginBottom: 0 }} />

        {/* Header */}
        <Stack gap={8} alignItems="center" width="100%">
          <BankHeading size="lg" textAlign="center">
            Forgot Password
          </BankHeading>
          <BankText textAlign="center">
            Enter your email and we&apos;ll send you a reset link
          </BankText>
        </Stack>

        {success ? (
          <Stack gap={16} width="100%">
            {/* Success message */}
            <BankAlert status="success">
              <BankAlertText status="success">
                A password reset link has been sent to your email address. Please
                check your inbox.
              </BankAlertText>
            </BankAlert>

            <Link
              href="/"
              style={{
                marginTop: 16,
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Back to Sign In
            </Link>
          </Stack>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            style={{ width: '100%' }}
          >
            <Stack gap={16} width="100%">
              {/* Email field */}
              <BankField
                label="Email"
                error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              >
                <input
                  style={
                    formik.touched.email && formik.errors.email
                      ? bankInputInvalidStyle
                      : bankInputStyle
                  }
                  placeholder="email@example.com"
                  disabled={loading}
                  value={formik.values.email}
                  onChange={(e) => formik.setFieldValue('email', e.target.value)}
                  onBlur={() => formik.setFieldTouched('email', true)}
                />
              </BankField>

              {/* Error */}
              {error && (
                <BankAlert status="error">
                  <BankAlertText status="error">{error}</BankAlertText>
                </BankAlert>
              )}

              {/* Submit */}
              <BankButton
                disabled={loading}
                marginTop={16}
                onPress={() => formik.handleSubmit()}
              >
                <BankButtonText>
                  {loading ? <Spinner color="black" /> : 'Send Reset Link'}
                </BankButtonText>
              </BankButton>

              <Link
                href="/"
                style={{
                  marginTop: 8,
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                Back to Sign In
              </Link>
            </Stack>
          </form>
        )}
      </BankCard>
    </BankPage>
  )
}
