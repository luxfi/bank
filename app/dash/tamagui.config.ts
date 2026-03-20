import { createFont, createTamagui, createTokens } from '@tamagui/core'
import { createAnimations } from '@tamagui/animations-css'

const animations = createAnimations({
  fast: 'ease-in 150ms',
  medium: 'ease-in 250ms',
  slow: 'ease-in 350ms',
})

const interFont = createFont({
  family: 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    true: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 30,
    10: 36,
    11: 40,
    12: 48,
    13: 56,
    14: 64,
    15: 72,
    16: 96,
  },
  lineHeight: {
    1: 17,
    2: 20,
    3: 21,
    4: 22,
    true: 22,
    5: 24,
    6: 28,
    7: 30,
    8: 34,
    9: 40,
    10: 44,
    11: 48,
    12: 56,
    13: 64,
    14: 72,
    15: 80,
    16: 104,
  },
  weight: {
    1: '400',
    5: '500',
    7: '600',
    9: '700',
  },
  letterSpacing: {
    4: 0,
    5: 0,
    6: -0.2,
    7: -0.3,
    8: -0.4,
    9: -0.5,
    10: -0.6,
  },
  face: {
    400: { normal: 'Inter' },
    500: { normal: 'InterMedium' },
    600: { normal: 'InterSemiBold' },
    700: { normal: 'InterBold' },
  },
})

const tokens = createTokens({
  color: {
    // Neutral
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Gray scale (matching exchange neutral tokens)
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#E5E5E5',
    gray300: '#D4D4D4',
    gray400: '#A3A3A3',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',
    gray900: '#171717',

    // Brand
    blue50: '#EFF6FF',
    blue100: '#DBEAFE',
    blue500: '#3B82F6',
    blue600: '#2563EB',
    blue700: '#1D4ED8',

    // Status
    green500: '#22C55E',
    red500: '#EF4444',
    yellow500: '#F59E0B',

    // Semantic
    accent: '#171717',
    accentSoft: '#F5F5F5',
    surface1: '#FFFFFF',
    surface2: '#FAFAFA',
    surface3: '#F5F5F5',
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    true: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    16: 64,
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    true: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
  },
  radius: {
    0: 0,
    1: 4,
    2: 6,
    3: 8,
    4: 12,
    true: 12,
    5: 16,
    6: 20,
    7: 24,
    8: 32,
    full: 999999,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
})

const lightTheme = {
  background: tokens.color.white,
  backgroundHover: tokens.color.gray50,
  backgroundPress: tokens.color.gray100,
  backgroundFocus: tokens.color.gray50,
  color: tokens.color.gray900,
  colorHover: tokens.color.black,
  colorPress: tokens.color.gray800,
  borderColor: tokens.color.gray200,
  borderColorHover: tokens.color.gray400,
  borderColorFocus: tokens.color.gray600,
  placeholderColor: tokens.color.gray400,
  accentColor: tokens.color.accent,
  accentBackground: tokens.color.accentSoft,
  shadowColor: 'rgba(0,0,0,0.08)',
  shadowColorHover: 'rgba(0,0,0,0.12)',
}

const darkTheme = {
  background: tokens.color.gray900,
  backgroundHover: tokens.color.gray800,
  backgroundPress: tokens.color.gray700,
  backgroundFocus: tokens.color.gray800,
  color: tokens.color.white,
  colorHover: tokens.color.gray100,
  colorPress: tokens.color.gray200,
  borderColor: tokens.color.gray700,
  borderColorHover: tokens.color.gray500,
  borderColorFocus: tokens.color.gray400,
  placeholderColor: tokens.color.gray500,
  accentColor: tokens.color.white,
  accentBackground: tokens.color.gray800,
  shadowColor: 'rgba(0,0,0,0.3)',
  shadowColorHover: 'rgba(0,0,0,0.4)',
}

export const config = createTamagui({
  animations,
  fonts: {
    heading: interFont,
    body: interFont,
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  tokens,
  media: {
    xs: { maxWidth: 480 },
    sm: { maxWidth: 640 },
    md: { maxWidth: 768 },
    lg: { maxWidth: 1024 },
    xl: { maxWidth: 1280 },
  },
  shorthands: {
    m: 'margin',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    mt: 'marginTop',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    p: 'padding',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    pt: 'paddingTop',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
  },
  settings: {
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    allowedStyleValues: false,
  },
})

export type AppConfig = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
