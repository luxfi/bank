'use client'

import React from 'react'
import { View, Text, styled, type GetProps } from 'tamagui'

// ── Bank Theme Tokens ─────────────────────────────────────────────
export const bankColors = {
  bg: '#000000',
  card: '#111111',
  cardBorder: '#222222',
  input: '#1A1A1A',
  inputBorder: '#333333',
  inputFocus: '#555555',
  inputPlaceholder: '#666666',
  text: '#FFFFFF',
  textMuted: '#888888',
  textLabel: '#CCCCCC',
  accent: '#FFFFFF',
  accentPress: '#E0E0E0',
  accentHover: '#F0F0F0',
  error: '#FF4444',
  errorBg: '#1C0A0A',
  errorBorder: '#441111',
  success: '#44FF44',
  successBg: '#0A1C0A',
  successBorder: '#114411',
  divider: '#222222',
  disabled: '#444444',
} as const

// ── BankPage (full-screen dark background) ────────────────────────
export const BankPage = styled(View, {
  name: 'BankPage',
  backgroundColor: bankColors.bg,
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
})

export type BankPageProps = GetProps<typeof BankPage>

// ── BankCard ──────────────────────────────────────────────────────
export const BankCard = styled(View, {
  name: 'BankCard',
  backgroundColor: bankColors.card,
  borderRadius: 24,
  borderWidth: 1,
  borderColor: bankColors.cardBorder,
  padding: 32,
  gap: 32,
  width: '100%',
  maxWidth: 512,

  variants: {
    size: {
      sm: { padding: 24, gap: 24, maxWidth: 448 },
      md: { padding: 32, gap: 32, maxWidth: 512 },
      lg: { padding: 40, gap: 40, maxWidth: 640 },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export type BankCardProps = GetProps<typeof BankCard>

// ── BankButton ────────────────────────────────────────────────────
export const BankButton = styled(View, {
  name: 'BankButton',
  tag: 'button',
  backgroundColor: bankColors.accent,
  borderRadius: 16,
  height: 56,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  width: '100%',
  userSelect: 'none',
  borderWidth: 0,

  pressStyle: {
    backgroundColor: bankColors.accentPress,
    scale: 0.98,
  },

  hoverStyle: {
    backgroundColor: bankColors.accentHover,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: bankColors.accent,
      },
      secondary: {
        backgroundColor: bankColors.cardBorder,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: bankColors.cardBorder,
      },
    },
    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
  },
})

export const BankButtonText = styled(Text, {
  name: 'BankButtonText',
  color: '#000000',
  fontSize: 16,
  fontWeight: '700',
  textAlign: 'center',

  variants: {
    variant: {
      primary: { color: '#000000' },
      secondary: { color: bankColors.text },
      ghost: { color: bankColors.text },
    },
  } as const,
})

export type BankButtonProps = GetProps<typeof BankButton>

// ── BankHeading ───────────────────────────────────────────────────
export const BankHeading = styled(Text, {
  name: 'BankHeading',
  color: bankColors.text,
  fontWeight: '700',

  variants: {
    size: {
      xs: { fontSize: 18, lineHeight: 24 },
      sm: { fontSize: 24, lineHeight: 32 },
      md: { fontSize: 30, lineHeight: 38 },
      lg: { fontSize: 36, lineHeight: 44 },
      xl: { fontSize: 48, lineHeight: 56 },
    },
  } as const,

  defaultVariants: {
    size: 'lg',
  },
})

export type BankHeadingProps = GetProps<typeof BankHeading>

// ── BankText ──────────────────────────────────────────────────────
export const BankText = styled(Text, {
  name: 'BankText',
  color: bankColors.textMuted,
  fontSize: 16,
  lineHeight: 24,

  variants: {
    variant: {
      default: { color: bankColors.textMuted },
      label: { color: bankColors.textLabel, fontSize: 14, fontWeight: '500' },
      error: { color: bankColors.error, fontSize: 13 },
      success: { color: bankColors.success, fontSize: 13 },
      link: { color: bankColors.text, fontWeight: '600', cursor: 'pointer' },
      muted: { color: bankColors.disabled },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
  },
})

export type BankTextProps = GetProps<typeof BankText>

// ── BankField ─────────────────────────────────────────────────────
// Compound component: label + input + error
export function BankField({
  label,
  error,
  children,
}: {
  label?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <View gap={8} width="100%">
      {label && <BankText variant="label">{label}</BankText>}
      {children}
      {error && <BankText variant="error">{error}</BankText>}
    </View>
  )
}

// ── BankAlert ─────────────────────────────────────────────────────
export const BankAlert = styled(View, {
  name: 'BankAlert',
  borderRadius: 12,
  padding: 16,
  borderWidth: 1,
  gap: 4,

  variants: {
    status: {
      error: {
        backgroundColor: bankColors.errorBg,
        borderColor: bankColors.errorBorder,
      },
      success: {
        backgroundColor: bankColors.successBg,
        borderColor: bankColors.successBorder,
      },
    },
  } as const,
})

export const BankAlertText = styled(Text, {
  name: 'BankAlertText',
  fontSize: 14,

  variants: {
    status: {
      error: { color: bankColors.error },
      success: { color: bankColors.success },
    },
  } as const,
})

export type BankAlertProps = GetProps<typeof BankAlert>

// ── BankPinBox ───────────────────────────────────────────────────
export const BankPinBox = styled(Text, {
  name: 'BankPinBox',
  tag: 'input',
  backgroundColor: bankColors.input,
  color: bankColors.text,
  borderWidth: 1,
  borderColor: bankColors.inputBorder,
  borderRadius: 12,
  width: 48,
  height: 48,
  textAlign: 'center',
  fontSize: 20,
  fontWeight: '600',
  outlineStyle: 'none',

  focusStyle: {
    borderColor: bankColors.inputFocus,
  },

  variants: {
    invalid: {
      true: { borderColor: bankColors.error },
    },
  } as const,
})

export type BankPinBoxProps = GetProps<typeof BankPinBox>

// ── BankDivider ──────────────────────────────────────────────────
export const BankDivider = styled(View, {
  name: 'BankDivider',
  height: 1,
  width: '100%',
  backgroundColor: bankColors.divider,
})

// ── bankInputStyle ───────────────────────────────────────────────
// Shared inline style object for real HTML <input> elements.
// Use this with <input style={bankInputStyle} /> to get bank-themed form inputs.
export const bankInputStyle: React.CSSProperties = {
  backgroundColor: bankColors.input,
  color: bankColors.text,
  border: `1px solid ${bankColors.inputBorder}`,
  borderRadius: 12,
  padding: '14px 16px',
  fontSize: 16,
  lineHeight: '24px',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

export const bankInputInvalidStyle: React.CSSProperties = {
  ...bankInputStyle,
  borderColor: bankColors.error,
}
