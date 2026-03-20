'use client'

import React from 'react'
import { View, Text, styled, type GetProps } from 'tamagui'

// ── Bank Theme Tokens ─────────────────────────────────────────────
export const bankColors = {
  bg: '#000000',
  card: '#0A0A0A',
  cardBorder: '#1A1A1A',
  input: '#000000',
  inputBorder: '#444444',
  inputFocus: '#FFFFFF',
  inputPlaceholder: '#555555',
  text: '#FFFFFF',
  textMuted: '#777777',
  textLabel: '#AAAAAA',
  accent: '#FFFFFF',
  accentPress: '#CCCCCC',
  accentHover: '#E8E8E8',
  error: '#FF3B30',
  errorBg: '#1A0000',
  errorBorder: '#441111',
  success: '#30D158',
  successBg: '#001A0A',
  successBorder: '#114411',
  divider: '#1A1A1A',
  disabled: '#333333',
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
  borderRadius: 32,
  borderWidth: 0,
  padding: 40,
  gap: 36,
  width: '100%',
  maxWidth: 480,

  variants: {
    size: {
      sm: { padding: 28, gap: 28, maxWidth: 420 },
      md: { padding: 40, gap: 36, maxWidth: 480 },
      lg: { padding: 48, gap: 44, maxWidth: 560 },
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
  borderRadius: 999,
  height: 60,
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
      xs: { fontSize: 20, lineHeight: 28 },
      sm: { fontSize: 28, lineHeight: 36 },
      md: { fontSize: 36, lineHeight: 44 },
      lg: { fontSize: 44, lineHeight: 52 },
      xl: { fontSize: 56, lineHeight: 64 },
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
  fontSize: 18,
  lineHeight: 28,

  variants: {
    variant: {
      default: { color: bankColors.textMuted },
      label: { color: bankColors.textLabel, fontSize: 16, fontWeight: '500' },
      error: { color: bankColors.error, fontSize: 14 },
      success: { color: bankColors.success, fontSize: 14 },
      link: { color: bankColors.text, fontWeight: '600', cursor: 'pointer', fontSize: 16 },
      muted: { color: bankColors.disabled, fontSize: 14 },
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
  backgroundColor: '#000000',
  color: '#FFFFFF',
  border: '1px solid #444444',
  borderRadius: 16,
  padding: '18px 20px',
  fontSize: 18,
  lineHeight: '26px',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
  WebkitAppearance: 'none' as const,
}

export const bankInputInvalidStyle: React.CSSProperties = {
  ...bankInputStyle,
  borderColor: '#FF3B30',
}
