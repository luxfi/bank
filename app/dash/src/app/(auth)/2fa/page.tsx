'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { Stack, XStack, Spinner } from 'tamagui'

import {
  BankPage,
  BankCard,
  BankButton,
  BankButtonText,
  BankHeading,
  BankText,
  BankAlert,
  BankAlertText,
  bankColors,
} from '@/components/bank'

import { useAuth } from '@/store/useAuth'
import { censorPhoneNumber, formatPhoneNumber } from '@/utils/lib'

export default function TwoFactorAuth() {
  const { currentUser, set2fa, setSend2Fa } = useAuth()

  const [errorMessage, setErrorMessage] = useState('')
  const [code, setCode] = useState('')
  const [pinDigits, setPinDigits] = useState<string[]>(Array(6).fill(''))
  const [isLoading, setIsLoading] = useState(false)

  const [sendSuccessMessage, setSendSuccessMessage] = useState(
    'We sent a code to your email'
  )

  const [provider, setProvider] = useState<'sms' | 'email'>('email')
  const [timer, setTimer] = useState<number>(60)

  const router = useRouter()

  useEffect(() => {
    const storagedTime = localStorage.getItem('2fa_timer')
    if (storagedTime) setTimer(Number(storagedTime))
  }, [])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }

    localStorage.setItem('2fa_timer', String(timer))
    return () => {
      localStorage.removeItem('2fa_timer')
      clearInterval(intervalId)
    }
  }, [timer])

  const handlePinChange = (index: number, text: string) => {
    if (text.length > 1) text = text.slice(-1)
    if (text && !/^\d$/.test(text)) return

    const newDigits = [...pinDigits]
    newDigits[index] = text
    setPinDigits(newDigits)
    setCode(newDigits.join(''))

    // Auto-focus next input
    if (text && index < 5) {
      const next = document.getElementById(`pin-${index + 1}`) as HTMLInputElement
      next?.focus()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      const prev = document.getElementById(`pin-${index - 1}`) as HTMLInputElement
      prev?.focus()
    }
  }

  const handleResendCode = useCallback(
    async (nextProvider: 'sms' | 'email'): Promise<void> => {
      setProvider(nextProvider)

      if (nextProvider === 'sms') {
        const mobileNumber = formatPhoneNumber(
          (currentUser as any).contact?.mobileNumber
        )
        const censoredPhoneNumber = mobileNumber
          ? censorPhoneNumber(mobileNumber)
          : null
        setSendSuccessMessage(`We sent a code to ${censoredPhoneNumber}`)
      } else if (nextProvider === 'email') {
        setSendSuccessMessage('We sent a code to your email')
      }

      setIsLoading(true)

      await setSend2Fa(nextProvider)
        .then(() => setTimer(60))
        .catch((err) => {
          setIsLoading(false)
          setErrorMessage(err)
        })
        .finally(() => setIsLoading(false))
    },
    [currentUser, setSend2Fa]
  )

  const handleSubmit = useCallback(async () => {
    if (!code || code.length < 6) {
      setErrorMessage('Please provide a valid 6 digit code')
      return
    }

    setIsLoading(true)

    await set2fa({
      code: code,
      provider: provider,
    })
      .then(() => {
        router.push('/dashboard')
      })
      .catch(() => {
        setIsLoading(false)
        setErrorMessage(
          'The security code you entered is incorrect. Please try again.'
        )
      })
  }, [code, provider, set2fa, router])

  useEffect(() => {
    if (code.length >= 6) {
      setErrorMessage('')
    }
  }, [code])

  const pinInputStyle: React.CSSProperties = {
    backgroundColor: bankColors.input,
    color: bankColors.text,
    border: `1px solid ${bankColors.inputBorder}`,
    borderRadius: 12,
    width: 48,
    height: 48,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600,
    outline: 'none',
    fontFamily: 'inherit',
  }

  return (
    <BankPage>
      <BankCard>
        {/* Header */}
        <Stack gap={8} alignItems="center">
          <BankHeading size="md" textAlign="center">
            Enter the 6 digit code
          </BankHeading>
          <BankText textAlign="center">
            {sendSuccessMessage}
          </BankText>
        </Stack>

        {/* Error */}
        {errorMessage && (
          <BankAlert status="error">
            <BankAlertText status="error">{errorMessage}</BankAlertText>
          </BankAlert>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Stack gap={32}>
            <XStack gap={12} justifyContent="center">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  id={`pin-${i}`}
                  style={pinInputStyle}
                  maxLength={1}
                  inputMode="numeric"
                  value={pinDigits[i] || ''}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  disabled={isLoading}
                />
              ))}
            </XStack>

            <BankButton disabled={isLoading} onPress={() => handleSubmit()}>
              <BankButtonText>
                {isLoading ? <Spinner color="black" /> : 'Verify'}
              </BankButtonText>
            </BankButton>
          </Stack>
        </form>

        {/* Resend / Timer */}
        <Stack gap={12} alignItems="center">
          {timer ? (
            <BankText variant="muted" userSelect="none">
              Send again in {timer}s
            </BankText>
          ) : (
            <BankText
              variant="link"
              hoverStyle={{ textDecorationLine: 'underline' }}
              onPress={() => handleResendCode(provider)}
            >
              Send again
            </BankText>
          )}

          {(currentUser as any)?.contact?.mobileNumber && (
            <BankText
              variant="link"
              color={timer ? bankColors.disabled : bankColors.textMuted}
              cursor={timer ? 'not-allowed' : 'pointer'}
              opacity={timer ? 0.5 : 1}
              hoverStyle={timer ? {} : { textDecorationLine: 'underline' }}
              onPress={() => {
                if (!timer) {
                  handleResendCode(provider === 'email' ? 'sms' : 'email')
                }
              }}
            >
              {`Receive by ${provider === 'email' ? 'SMS' : 'Mail'}`}
            </BankText>
          )}
        </Stack>
      </BankCard>
    </BankPage>
  )
}
