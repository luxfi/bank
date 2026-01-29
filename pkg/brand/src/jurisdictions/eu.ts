import type { JurisdictionConfig } from '../types';

export const EU_IRELAND: JurisdictionConfig = {
  code: 'EU_IRELAND',
  name: 'Ireland (EU)',
  country: 'Ireland',
  countryCode: 'IE',
  currency: 'EUR',
  currencySymbol: '€',

  legalEntity: {
    type: 'emi',
    name: 'Lux Financial Europe DAC',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: '1 Grand Canal Square',
      city: 'Dublin',
      state: 'Dublin 2',
      postalCode: 'D02 P820',
      country: 'Ireland',
      countryCode: 'IE',
    },
  },

  regulators: [
    {
      name: 'Central Bank of Ireland',
      shortName: 'CBI',
      url: 'https://www.centralbank.ie',
      licenseType: 'E-Money Institution',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Europe DAC is authorised by the Central Bank of Ireland as an Electronic Money Institution. Services are available throughout the European Economic Area under passporting rights.',
    safeguarding: 'Customer funds are safeguarded in accordance with the European Electronic Money Directive and held in segregated accounts with authorised credit institutions.',
    risk: 'Electronic money is not covered by the Deposit Guarantee Scheme. However, your funds are protected under the Electronic Money Regulations.',
    complaints: 'If you are dissatisfied with our service, please contact us. If your complaint is not resolved, you may escalate to the Financial Services and Pensions Ombudsman at fspo.ie.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+353 1 234 5678',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const EU_LITHUANIA: JurisdictionConfig = {
  code: 'EU_LITHUANIA',
  name: 'Lithuania (EU)',
  country: 'Lithuania',
  countryCode: 'LT',
  currency: 'EUR',
  currencySymbol: '€',

  legalEntity: {
    type: 'emi',
    name: 'Lux Financial UAB',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: 'Vilniaus g. 1',
      city: 'Vilnius',
      postalCode: 'LT-01101',
      country: 'Lithuania',
      countryCode: 'LT',
    },
  },

  regulators: [
    {
      name: 'Bank of Lithuania',
      shortName: 'LB',
      url: 'https://www.lb.lt',
      licenseType: 'Electronic Money Institution',
    },
  ],

  disclaimers: {
    general: 'Lux Financial UAB is authorised by the Bank of Lithuania as an Electronic Money Institution. Services are available throughout the European Economic Area.',
    safeguarding: 'Customer funds are safeguarded in segregated accounts in accordance with EU regulations.',
    risk: 'Electronic money is not covered by the Deposit Insurance Fund. Your funds are protected under the Electronic Money Regulations.',
    complaints: 'Complaints may be submitted to the Bank of Lithuania at lb.lt.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+370 5 123 4567',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const EU_MALTA: JurisdictionConfig = {
  code: 'EU_MALTA',
  name: 'Malta (EU)',
  country: 'Malta',
  countryCode: 'MT',
  currency: 'EUR',
  currencySymbol: '€',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial Malta Ltd',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: 'Level 3, Quantum House',
      line2: '75 Abate Rigord Street',
      city: 'Ta\' Xbiex',
      postalCode: 'XBX 1120',
      country: 'Malta',
      countryCode: 'MT',
    },
  },

  regulators: [
    {
      name: 'Malta Financial Services Authority',
      shortName: 'MFSA',
      url: 'https://www.mfsa.mt',
      licenseType: 'Class 4 VFA Service Provider',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Malta Ltd is authorised by the Malta Financial Services Authority as a Virtual Financial Assets Service Provider.',
    safeguarding: 'Customer assets are segregated and held in accordance with MFSA requirements.',
    risk: 'Virtual financial assets are highly volatile and involve substantial risk. Please ensure you understand the risks before engaging with our services.',
    complaints: 'Complaints may be directed to the Office of the Arbiter for Financial Services at financialarbiter.org.mt.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+356 2123 4567',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const EU_CYPRUS: JurisdictionConfig = {
  code: 'EU_CYPRUS',
  name: 'Cyprus (EU)',
  country: 'Cyprus',
  countryCode: 'CY',
  currency: 'EUR',
  currencySymbol: '€',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial Cyprus Ltd',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: '1 Arch. Makarios III Avenue',
      city: 'Nicosia',
      postalCode: '1065',
      country: 'Cyprus',
      countryCode: 'CY',
    },
  },

  regulators: [
    {
      name: 'Cyprus Securities and Exchange Commission',
      shortName: 'CySEC',
      url: 'https://www.cysec.gov.cy',
      licenseType: 'Cyprus Investment Firm',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Cyprus Ltd is authorised and regulated by the Cyprus Securities and Exchange Commission (CySEC).',
    safeguarding: 'Client funds are held in segregated accounts with EU credit institutions.',
    risk: 'Trading in financial instruments involves risk. Please ensure you understand the risks involved.',
    complaints: 'Complaints may be directed to the Financial Ombudsman of the Republic of Cyprus.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+357 22 123456',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const EU_GENERIC: JurisdictionConfig = EU_IRELAND; // Default EU to Ireland
