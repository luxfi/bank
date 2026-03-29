/**
 * Lux Financial Brand Configuration
 *
 * Central brand identity configuration used throughout the platform.
 */

import type { BrandConfig, BrandColors, BrandTypography, BrandAssets, BrandSocial } from './types';
import { getJurisdiction, DEFAULT_JURISDICTION } from './jurisdictions';

/**
 * Lux Financial brand colors
 * Based on the Lux brand guidelines
 */
export const LUX_COLORS: BrandColors = {
  // Primary - Lux purple/violet
  primary: '#8B5CF6',
  primaryForeground: '#FFFFFF',

  // Secondary
  secondary: '#1E1E2E',
  secondaryForeground: '#FFFFFF',

  // Accent - White for clean monochrome
  accent: '#FFFFFF',
  accentForeground: '#000000',

  // Backgrounds
  background: '#000000',
  foreground: '#FFFFFF',

  // Muted
  muted: '#27272A',
  mutedForeground: '#A1A1AA',

  // Destructive (errors)
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  // Borders and inputs
  border: '#27272A',
  input: '#27272A',
  ring: '#8B5CF6',
};

/**
 * Alternative color schemes
 */
export const LUX_COLORS_LIGHT: BrandColors = {
  ...LUX_COLORS,
  background: '#FFFFFF',
  foreground: '#0D0D0D',
  secondary: '#F4F4F5',
  secondaryForeground: '#0D0D0D',
  muted: '#F4F4F5',
  mutedForeground: '#71717A',
  border: '#E4E4E7',
  input: '#E4E4E7',
};

/**
 * Lux Financial typography
 */
export const LUX_TYPOGRAPHY: BrandTypography = {
  fontFamily: {
    heading: '"Inter", "SF Pro Display", system-ui, sans-serif',
    body: '"Inter", "SF Pro Text", system-ui, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", monospace',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * Lux Financial assets paths
 */
export const LUX_ASSETS: BrandAssets = {
  logo: {
    primary: '/images/lux-logo.svg',
    white: '/images/lux-logo-white.svg',
    dark: '/images/lux-logo-dark.svg',
    icon: '/images/lux-icon.svg',
    wordmark: '/images/lux-wordmark.svg',
  },
  favicon: {
    ico: '/favicon.ico',
    svg: '/favicon.svg',
    png16: '/favicon-16x16.png',
    png32: '/favicon-32x32.png',
    png192: '/android-chrome-192x192.png',
    png512: '/android-chrome-512x512.png',
    appleTouchIcon: '/apple-touch-icon.png',
  },
};

/**
 * Lux Financial social links
 */
export const LUX_SOCIAL: BrandSocial = {
  twitter: 'https://twitter.com/luxfinance',
  linkedin: 'https://linkedin.com/company/luxfinance',
  github: 'https://github.com/luxfi',
  discord: 'https://discord.gg/luxfinance',
  telegram: 'https://t.me/luxfinance',
};

/**
 * Create a complete brand configuration
 */
export function createBrandConfig(
  jurisdictionCode = DEFAULT_JURISDICTION,
  overrides?: Partial<BrandConfig>
): BrandConfig {
  const jurisdiction = getJurisdiction(jurisdictionCode);

  const config: BrandConfig = {
    // Core identity
    name: 'Lux Financial',
    legalName: jurisdiction.legalEntity.name,
    tagline: 'White-Label Banking Infrastructure',
    description: 'Lux Financial provides enterprise-grade white-label banking infrastructure for fintechs, neobanks, and financial institutions. Modern APIs, multi-currency support, and seamless integrations.',

    // Visual identity
    colors: LUX_COLORS,
    typography: LUX_TYPOGRAPHY,
    assets: LUX_ASSETS,

    // Digital presence
    domains: {
      primary: 'lux.financial',
      app: 'app.lux.financial',
      admin: 'admin.lux.financial',
      api: 'api.lux.financial',
      docs: 'docs.lux.financial',
      support: 'support.lux.financial',
    },

    // Social
    social: LUX_SOCIAL,

    // Active jurisdiction
    jurisdiction,

    // Available jurisdictions
    availableJurisdictions: [
      'US_FEDERAL', 'US_STATE', 'US_TRUST', 'US_SPONSORED',
      'UK_FCA', 'UK_IOM',
      'EU_IRELAND', 'EU_LITHUANIA',
      'SG_MAS',
      'HK_SFC',
      'AU_ASIC',
      'CA_FINTRAC',
      'UAE_DFSA', 'UAE_ADGM',
    ],
  };

  return { ...config, ...overrides };
}

/**
 * Default brand configuration (uses environment or UK_IOM)
 */
export const LUX_BRAND = createBrandConfig();

/**
 * Export commonly used configurations
 */
export const BRAND_NAME = LUX_BRAND.name;
export const BRAND_TAGLINE = LUX_BRAND.tagline;
export const BRAND_DESCRIPTION = LUX_BRAND.description;
