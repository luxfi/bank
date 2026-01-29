/**
 * Triangle Bank - Demo Customer Configuration
 *
 * Triangle Bank is the demo/reference customer for the Lux Financial platform.
 * Uses a right-side-up triangle logo (contrasting with Lux's inverted triangle).
 */

import type { BrandColors, BrandAssets, BrandTypography, BrandSocial } from '../types';

export const TRIANGLE_BANK_COLORS: BrandColors = {
  // Primary - Indigo/violet
  primary: '#6366F1',
  primaryForeground: '#FFFFFF',

  // Secondary - Slate dark
  secondary: '#1E293B',
  secondaryForeground: '#FFFFFF',

  // Accent - Cyan
  accent: '#22D3EE',
  accentForeground: '#0F172A',

  // Backgrounds - Deep slate
  background: '#0F172A',
  foreground: '#FFFFFF',

  // Muted
  muted: '#334155',
  mutedForeground: '#94A3B8',

  // Destructive (errors)
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  // Borders and inputs
  border: '#334155',
  input: '#1E293B',
  ring: '#22D3EE',
};

export const TRIANGLE_BANK_TYPOGRAPHY: BrandTypography = {
  fontFamily: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
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

export const TRIANGLE_BANK_ASSETS: BrandAssets = {
  logo: {
    primary: '/images/customers/triangle-bank/logo.svg',
    white: '/images/customers/triangle-bank/logo-white.svg',
    dark: '/images/customers/triangle-bank/logo-dark.svg',
    icon: '/images/customers/triangle-bank/icon.svg',
    wordmark: '/images/customers/triangle-bank/wordmark.svg',
  },
  favicon: {
    ico: '/images/customers/triangle-bank/favicon.ico',
    svg: '/images/customers/triangle-bank/favicon.svg',
    png16: '/images/customers/triangle-bank/favicon-16x16.png',
    png32: '/images/customers/triangle-bank/favicon-32x32.png',
    png192: '/images/customers/triangle-bank/android-chrome-192x192.png',
    png512: '/images/customers/triangle-bank/android-chrome-512x512.png',
    appleTouchIcon: '/images/customers/triangle-bank/apple-touch-icon.png',
  },
};

export const TRIANGLE_BANK_SOCIAL: BrandSocial = {
  twitter: 'https://twitter.com/trianglebank',
  linkedin: 'https://linkedin.com/company/triangle-bank',
};

/**
 * Triangle Bank demo customer configuration
 */
export const TRIANGLE_BANK_CONFIG = {
  // Core identity
  id: 'triangle-bank',
  name: 'Triangle Bank',
  legalName: 'Triangle Bank, Inc.',
  tagline: 'Banking made simple, secure, and smart',
  description: 'Triangle Bank is a next-generation digital bank built on Lux Financial infrastructure, offering seamless USDC/USDT payments, AI-powered operations, and post-quantum security.',

  // Visual identity
  colors: TRIANGLE_BANK_COLORS,
  typography: TRIANGLE_BANK_TYPOGRAPHY,
  assets: TRIANGLE_BANK_ASSETS,

  // Digital presence
  domains: {
    primary: 'trianglebank.demo.lux.financial',
    app: 'app.trianglebank.demo.lux.financial',
  },

  // Social
  social: TRIANGLE_BANK_SOCIAL,

  // Demo features enabled
  features: {
    // Native crypto support
    stablecoins: ['USDC', 'USDT', 'USDY', 'PYUSD'],
    cryptoAssets: true,
    multiChain: ['polygon', 'ethereum', 'arbitrum', 'optimism', 'base'],

    // Lux infrastructure
    luxKMS: true,           // Key Management System
    luxMPC: true,           // Multi-Party Computation custody
    luxIAM: true,           // Enterprise Identity & Access Management
    luxHSM: true,           // Hardware Security Module integration

    // AI-powered features
    mcpServer: true,        // Model Context Protocol server
    zapProtocol: true,      // ZAP browser-to-MCP communication
    aiChat: true,           // AI-powered customer support
    aiCompliance: true,     // AI compliance monitoring

    // Security
    postQuantumSecurity: true,
    nodeInfrastructure: true,

    // Payments
    crossBorderPayments: true,
    realtimeFX: true,
    instantSettlement: true,
  },

  // Demo users
  demoUsers: [
    {
      email: 'alex@trianglebank.com',
      name: 'Alex Johnson',
      role: 'customer',
      avatar: 'AJ',
    },
    {
      email: 'admin@trianglebank.com',
      name: 'Admin User',
      role: 'admin',
      avatar: 'AU',
    },
  ],
};

/**
 * Triangle Bank Logo SVG (right-side-up triangle)
 * Contrasts with Lux's inverted/upside-down triangle
 */
export const TRIANGLE_BANK_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="triangleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#22D3EE"/>
      <stop offset="100%" style="stop-color:#06B6D4"/>
    </linearGradient>
  </defs>
  <polygon points="50,10 90,80 10,80" fill="url(#triangleGrad)"/>
</svg>`;

export const TRIANGLE_BANK_LOGO_WHITE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="50,10 90,80 10,80" fill="#FFFFFF"/>
</svg>`;

export const TRIANGLE_BANK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <polygon points="12,2 22,20 2,20" fill="currentColor"/>
</svg>`;
