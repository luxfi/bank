'use client'

import { useCallback, useEffect, useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Stack, Spinner } from 'tamagui'

import {
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
} from '@/components/bank'

import { IRequestError } from '@/models/request'
import * as ApiAuth from '@/api/auth'

interface IProps {
  isVisible: boolean
  onClose(value: false): void
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail invalid')
    .required('Please enter the email address.'),
})

const formActionsInit = {
  loading: false,
  error: '',
}

export default function ModalForgotPassword({ isVisible, onClose }: IProps) {
  const [formActions, setFormActions] = useState(formActionsInit)

  const handleSendEmail = useCallback(async (email: string) => {
    try {
      setFormActions({
        error: '',
        loading: true,
      })

      await ApiAuth.forgotPassword({ email })

      onClose(false)
    } catch (err) {
      const error = err as unknown as IRequestError

      setFormActions({
        error: error?.message,
        loading: false,
      })
    }
  }, [onClose])

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSendEmail(values.email)
    },
  })

  useEffect(() => {
    if (isVisible) {
      formik.resetForm()
      setFormActions(formActionsInit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  if (!isVisible) return null

  return (
    <Stack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0,0,0,0.8)"
      justifyContent="center"
      alignItems="center"
      zIndex={100}
      animation="fast"
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
      onPress={() => {
        if (!formActions.loading) onClose(false)
      }}
    >
      <BankCard
        size="sm"
        width="90%"
        gap={16}
        animation="fast"
        enterStyle={{ y: -20, opacity: 0, scale: 0.9 }}
        exitStyle={{ y: 10, opacity: 0, scale: 0.95 }}
        onPress={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <BankHeading size="sm">Forgot Password</BankHeading>
        <BankText>
          Enter your email to receive a password reset link
        </BankText>

        {/* Email field */}
        <BankField
          label="Email"
          error={formik.errors.email && formik.touched.email ? formik.errors.email : undefined}
        >
          <input
            className="bank-input" style={bankInputStyle}
            disabled={formActions.loading}
            value={formik.values.email}
            onChange={(e) => formik.setFieldValue('email', e.target.value)}
          />
        </BankField>

        {/* Error */}
        {formActions.error && (
          <BankAlert status="error">
            <BankAlertText status="error">{formActions.error}</BankAlertText>
          </BankAlert>
        )}

        {/* Actions */}
        <BankButton
          disabled={formActions.loading}
          onPress={() => formik.handleSubmit()}
        >
          <BankButtonText>
            {formActions.loading ? <Spinner color="black" /> : 'Send Reset Link'}
          </BankButtonText>
        </BankButton>

        <BankButton
          variant="secondary"
          disabled={formActions.loading}
          onPress={() => onClose(false)}
        >
          <BankButtonText variant="secondary">Cancel</BankButtonText>
        </BankButton>
      </BankCard>
    </Stack>
  )
}
