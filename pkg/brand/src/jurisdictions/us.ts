import type { JurisdictionConfig, Address } from '../types';

const defaultUSAddress: Address = {
  line1: '1234 Financial District',
  city: 'New York',
  state: 'NY',
  postalCode: '10004',
  country: 'United States',
  countryCode: 'US',
};

export const US_FEDERAL: JurisdictionConfig = {
  code: 'US_FEDERAL',
  name: 'United States (Federal)',
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  currencySymbol: '$',

  legalEntity: {
    type: 'chartered_bank',
    name: 'Lux Financial, N.A.',
    tradingName: 'Lux Financial',
    registrationNumber: '', // OCC Charter Number
    registeredAddress: defaultUSAddress,
  },

  regulators: [
    {
      name: 'Office of the Comptroller of the Currency',
      shortName: 'OCC',
      url: 'https://www.occ.gov',
    },
    {
      name: 'Federal Deposit Insurance Corporation',
      shortName: 'FDIC',
      url: 'https://www.fdic.gov',
    },
    {
      name: 'Financial Crimes Enforcement Network',
      shortName: 'FinCEN',
      url: 'https://www.fincen.gov',
    },
  ],

  disclaimers: {
    general: 'Lux Financial, N.A. is a nationally chartered bank supervised by the Office of the Comptroller of the Currency. Member FDIC. Equal Housing Lender.',
    safeguarding: 'Deposits are insured by the FDIC up to $250,000 per depositor, per insured bank, for each account ownership category.',
    risk: 'Banking products and services are subject to bank and credit approval. Not all products and services are available in all geographic areas.',
    complaints: 'If you have a complaint, please contact our Customer Service team or submit a complaint to the Consumer Financial Protection Bureau (CFPB) at consumerfinance.gov/complaint.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+1 (800) 555-0100',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const US_STATE: JurisdictionConfig = {
  code: 'US_STATE',
  name: 'United States (State Licensed)',
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  currencySymbol: '$',

  legalEntity: {
    type: 'llc',
    name: 'Lux Financial LLC',
    tradingName: 'Lux Financial',
    registeredAddress: defaultUSAddress,
  },

  regulators: [
    {
      name: 'State Department of Financial Services',
      shortName: 'DFS',
    },
    {
      name: 'Financial Crimes Enforcement Network',
      shortName: 'FinCEN',
      url: 'https://www.fincen.gov',
    },
  ],

  disclaimers: {
    general: 'Lux Financial LLC is a licensed money transmitter. Licenses held in all 50 states, DC, and Puerto Rico. NMLS ID: XXXXXX.',
    safeguarding: 'Customer funds are held in FDIC-insured bank accounts or invested in approved securities as required by state regulations.',
    risk: 'Services may not be available in all jurisdictions. Please check your local regulations.',
    complaints: 'To file a complaint, contact our Customer Service team or your state\'s Department of Financial Services.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+1 (800) 555-0100',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const US_TRUST: JurisdictionConfig = {
  code: 'US_TRUST',
  name: 'United States (Trust Company)',
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  currencySymbol: '$',

  legalEntity: {
    type: 'trust',
    name: 'Lux Trust Company',
    tradingName: 'Lux Financial',
    registeredAddress: {
      ...defaultUSAddress,
      state: 'SD', // South Dakota is popular for trust companies
      city: 'Sioux Falls',
      postalCode: '57104',
    },
  },

  regulators: [
    {
      name: 'South Dakota Division of Banking',
      shortName: 'SD Banking',
      url: 'https://dlr.sd.gov/banking/',
    },
  ],

  disclaimers: {
    general: 'Lux Trust Company is a South Dakota chartered trust company regulated by the South Dakota Division of Banking.',
    safeguarding: 'Assets held in custody are segregated from company assets and held for the benefit of customers.',
    risk: 'Trust services involve risks. Past performance is not indicative of future results.',
    complaints: 'Complaints may be directed to the South Dakota Division of Banking.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+1 (800) 555-0100',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const US_SPONSORED: JurisdictionConfig = {
  code: 'US_SPONSORED',
  name: 'United States (Sponsor Bank)',
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  currencySymbol: '$',

  legalEntity: {
    type: 'llc',
    name: 'Lux Financial LLC',
    tradingName: 'Lux Financial',
    registeredAddress: defaultUSAddress,
  },

  sponsorBank: {
    name: 'Metropolitan Commercial Bank',
    shortName: 'MCB',
    charterType: 'NY State Chartered',
    fdic: true,
    url: 'https://www.mcbankny.com',
    address: {
      line1: '99 Park Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10016',
      country: 'United States',
      countryCode: 'US',
    },
  },

  regulators: [
    {
      name: 'New York State Department of Financial Services',
      shortName: 'NYDFS',
      url: 'https://www.dfs.ny.gov',
    },
    {
      name: 'Federal Deposit Insurance Corporation',
      shortName: 'FDIC',
      url: 'https://www.fdic.gov',
    },
    {
      name: 'Financial Crimes Enforcement Network',
      shortName: 'FinCEN',
      url: 'https://www.fincen.gov',
    },
  ],

  disclaimers: {
    general: 'Lux Financial LLC provides technology services. Banking services provided by Metropolitan Commercial Bank, Member FDIC.',
    safeguarding: 'Funds held at Metropolitan Commercial Bank are FDIC-insured up to $250,000 per depositor.',
    risk: 'Stablecoin and digital asset services involve risks including price volatility and regulatory uncertainty. Not FDIC insured. May lose value.',
    complaints: 'For complaints regarding banking services, contact Metropolitan Commercial Bank. For technology services, contact Lux Financial support.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+1 (800) 555-0100',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const US_FUND: JurisdictionConfig = {
  code: 'US_FUND',
  name: 'United States (Investment Fund)',
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  currencySymbol: '$',

  legalEntity: {
    type: 'fund',
    name: 'Lux Financial Fund LP',
    tradingName: 'Lux Financial',
    registeredAddress: {
      ...defaultUSAddress,
      state: 'DE',
      city: 'Wilmington',
      postalCode: '19801',
    },
  },

  regulators: [
    {
      name: 'Securities and Exchange Commission',
      shortName: 'SEC',
      url: 'https://www.sec.gov',
    },
    {
      name: 'Financial Industry Regulatory Authority',
      shortName: 'FINRA',
      url: 'https://www.finra.org',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Fund LP is a Delaware limited partnership. Securities offered through Lux Securities LLC, Member FINRA/SIPC.',
    risk: 'Investment involves risk including the possible loss of principal. Past performance does not guarantee future results. This is not an offer to sell or solicitation to buy securities.',
    complaints: 'Complaints may be directed to FINRA at finra.org/investors/have-problem.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+1 (800) 555-0100',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};
