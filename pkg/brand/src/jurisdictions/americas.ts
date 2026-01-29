import type { JurisdictionConfig } from '../types';

export const CA_FINTRAC: JurisdictionConfig = {
  code: 'CA_FINTRAC',
  name: 'Canada (FINTRAC)',
  country: 'Canada',
  countryCode: 'CA',
  currency: 'CAD',
  currencySymbol: 'C$',

  legalEntity: {
    type: 'corporation',
    name: 'Lux Financial Canada Inc.',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: '100 King Street West',
      line2: 'Suite 5700',
      city: 'Toronto',
      state: 'ON',
      postalCode: 'M5X 1C7',
      country: 'Canada',
      countryCode: 'CA',
    },
  },

  regulators: [
    {
      name: 'Financial Transactions and Reports Analysis Centre of Canada',
      shortName: 'FINTRAC',
      url: 'https://www.fintrac-canafe.gc.ca',
      licenseType: 'Money Services Business',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Canada Inc. is registered with FINTRAC as a Money Services Business (MSB Registration: MXXXXXX).',
    safeguarding: 'Customer funds are held in segregated accounts with Canadian Schedule I banks.',
    risk: 'Money services are subject to exchange rate fluctuations and fees. Provincial regulations may apply.',
    complaints: 'If you have a complaint, please contact our Customer Service team. Provincial regulators may also accept complaints.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+1 (416) 555-0100',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const CA_PROVINCIAL: JurisdictionConfig = {
  code: 'CA_PROVINCIAL',
  name: 'Canada (Provincial)',
  country: 'Canada',
  countryCode: 'CA',
  currency: 'CAD',
  currencySymbol: 'C$',

  legalEntity: {
    type: 'corporation',
    name: 'Lux Financial Canada Inc.',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: '100 King Street West',
      line2: 'Suite 5700',
      city: 'Toronto',
      state: 'ON',
      postalCode: 'M5X 1C7',
      country: 'Canada',
      countryCode: 'CA',
    },
  },

  regulators: [
    {
      name: 'Financial Transactions and Reports Analysis Centre of Canada',
      shortName: 'FINTRAC',
      url: 'https://www.fintrac-canafe.gc.ca',
      licenseType: 'Money Services Business',
    },
    {
      name: 'Ontario Securities Commission',
      shortName: 'OSC',
      url: 'https://www.osc.ca',
      licenseType: 'Restricted Dealer',
    },
    {
      name: 'Autorité des marchés financiers',
      shortName: 'AMF',
      url: 'https://lautorite.qc.ca',
      licenseType: 'Money Services Business',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Canada Inc. is registered with FINTRAC as a Money Services Business and holds provincial registrations across Canada.',
    safeguarding: 'Customer funds are held in segregated accounts with Canadian Schedule I banks.',
    risk: 'Services may vary by province. Please check your provincial regulations.',
    complaints: 'Complaints may be directed to your provincial securities regulator.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+1 (416) 555-0100',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};
