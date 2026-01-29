import type { JurisdictionConfig } from '../types';

/**
 * Global White-Label Platform Configuration
 *
 * Lux Financial is a product of Lux Industries Inc., a USA-based fintech
 * services provider. We provide white-label banking infrastructure and
 * technology services. We are NOT a licensed bank - we provide software
 * and services to licensed financial institution partners.
 */
export const GLOBAL: JurisdictionConfig = {
  code: 'GLOBAL',
  name: 'Global',
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  currencySymbol: '$',

  legalEntity: {
    type: 'corporation',
    name: 'Lux Industries Inc.',
    shortName: 'Lux Industries',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: '995 Market St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      country: 'United States',
      countryCode: 'US',
    },
  },

  // No regulators - we are a technology provider, not a licensed institution
  regulators: [],

  disclaimers: {
    general: 'Lux Financial is a product of Lux Industries Inc., a USA-based fintech services provider. We are not a bank or licensed financial institution. Banking services are provided by licensed partner institutions.',
    safeguarding: 'Lux Financial provides technology infrastructure only. Client funds are managed by licensed banking partners.',
    risk: 'Lux Financial software is provided as-is. Financial services accessed through our platform are subject to the terms and regulations of the licensed partner institutions.',
    complaints: 'For technical support, contact support@lux.financial. For business inquiries, contact hello@lux.financial.',
  },

  contact: {
    email: 'hello@lux.financial',
    supportEmail: 'support@lux.financial',
  },
};
