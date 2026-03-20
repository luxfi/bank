'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useFormik } from 'formik'
import * as yup from 'yup'

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

import { sendRegistrationRequest } from '@/api/registration'

export interface IRequestRegistrationForm {
  firstname: string
  lastname: string
  email: string
  mobileNumber: string
}

const formActionsInit = {
  loading: false,
  error: '',
}

const validationSchema = yup.object({
  firstname: yup.string().required('Please enter your first name'),
  lastname: yup.string().required('Please enter your last name'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  mobileNumber: yup
    .string()
    .required('Please enter your Phone Number')
    .matches(/^(\+|\d)[0-9]{7,15}$/, 'Please enter a valid phone number'),
})

export default function Registration() {
  const router = useRouter()
  const [formActions, setFormActions] = useState(formActionsInit)

  const handleSubmit = async (data: IRequestRegistrationForm) => {
    setFormActions({
      error: '',
      loading: true,
    })
    await sendRegistrationRequest(data)
      .then(() => {
        router.push('/registration/success')
        formik.resetForm()
      })
      .catch(() => {
        setFormActions((pS) => ({
          ...pS,
          error: 'Error sending information, please try again later',
        }))
      })
      .finally(() => {
        setFormActions((pS) => ({
          ...pS,
          loading: false,
        }))
      })
  }

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      mobileNumber: '',
    },
    validationSchema,
    onSubmit: (data) => {
      handleSubmit(data)
    },
  })

  const fieldError = (field: keyof typeof formik.values) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : undefined

  return (
    <BankPage>
      <BankCard>
        <form onSubmit={formik.handleSubmit}>
          <Stack gap={32}>
            {/* Header */}
            <Stack gap={8} alignItems="center">
              <BankHeading size="lg" textAlign="center">
                Request Registration
              </BankHeading>
              <BankText textAlign="center">
                Fill out the form to request access
              </BankText>
            </Stack>

            {/* Fields */}
            <Stack gap={20}>
              {/* First Name */}
              <BankField label="First Name" error={fieldError('firstname')}>
                <input
                  style={fieldError('firstname') ? bankInputInvalidStyle : bankInputStyle}
                  placeholder="First Name"
                  disabled={formActions.loading}
                  value={formik.values.firstname}
                  onChange={(e) => formik.setFieldValue('firstname', e.target.value)}
                  onBlur={() => formik.setFieldTouched('firstname', true)}
                />
              </BankField>

              {/* Last Name */}
              <BankField label="Last Name" error={fieldError('lastname')}>
                <input
                  style={fieldError('lastname') ? bankInputInvalidStyle : bankInputStyle}
                  placeholder="Last Name"
                  disabled={formActions.loading}
                  value={formik.values.lastname}
                  onChange={(e) => formik.setFieldValue('lastname', e.target.value)}
                  onBlur={() => formik.setFieldTouched('lastname', true)}
                />
              </BankField>

              {/* Email */}
              <BankField label="Email" error={fieldError('email')}>
                <input
                  style={fieldError('email') ? bankInputInvalidStyle : bankInputStyle}
                  type="email"
                  inputMode="email"
                  placeholder="email@example.com"
                  disabled={formActions.loading}
                  value={formik.values.email}
                  onChange={(e) => formik.setFieldValue('email', e.target.value)}
                  onBlur={() => formik.setFieldTouched('email', true)}
                />
              </BankField>

              {/* Mobile Number */}
              <BankField label="Mobile Number" error={fieldError('mobileNumber')}>
                <input
                  style={fieldError('mobileNumber') ? bankInputInvalidStyle : bankInputStyle}
                  type="tel"
                  inputMode="tel"
                  placeholder="+44..."
                  disabled={formActions.loading}
                  value={formik.values.mobileNumber}
                  onChange={(e) => formik.setFieldValue('mobileNumber', e.target.value)}
                  onBlur={() => formik.setFieldTouched('mobileNumber', true)}
                />
              </BankField>
            </Stack>

            {/* Error */}
            {formActions.error && (
              <BankAlert status="error">
                <BankAlertText status="error">{formActions.error}</BankAlertText>
              </BankAlert>
            )}

            {/* Submit */}
            <BankButton
              disabled={formActions.loading}
              onPress={() => formik.handleSubmit()}
            >
              <BankButtonText>
                {formActions.loading ? <Spinner color="black" /> : 'Send'}
              </BankButtonText>
            </BankButton>

            {/* Sign in link */}
            <BankText textAlign="center">
              Already using Lux?{' '}
              <Link href="/" style={{ textDecoration: 'none' }}>
                <BankText
                  tag="span"
                  variant="link"
                  hoverStyle={{ textDecorationLine: 'underline' }}
                >
                  Sign in
                </BankText>
              </Link>
            </BankText>
          </Stack>
        </form>
      </BankCard>
    </BankPage>
  )
}
