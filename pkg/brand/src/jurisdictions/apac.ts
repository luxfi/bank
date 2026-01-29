import type { JurisdictionConfig } from '../types';

export const SG_MAS: JurisdictionConfig = {
  code: 'SG_MAS',
  name: 'Singapore',
  country: 'Singapore',
  countryCode: 'SG',
  currency: 'SGD',
  currencySymbol: 'S$',

  legalEntity: {
    type: 'corporation',
    name: 'Lux Financial Pte. Ltd.',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: '1 Raffles Place',
      line2: '#20-01 One Raffles Place',
      city: 'Singapore',
      postalCode: '048616',
      country: 'Singapore',
      countryCode: 'SG',
    },
  },

  regulators: [
    {
      name: 'Monetary Authority of Singapore',
      shortName: 'MAS',
      url: 'https://www.mas.gov.sg',
      licenseType: 'Major Payment Institution',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Pte. Ltd. holds a Major Payment Institution license issued by the Monetary Authority of Singapore under the Payment Services Act 2019.',
    safeguarding: 'Customer funds are safeguarded in accordance with MAS requirements and held in trust accounts with qualifying financial institutions.',
    risk: 'Payment services are not covered by the Singapore Deposit Insurance Corporation scheme.',
    complaints: 'If you have a complaint, please contact our Customer Service. You may also lodge a complaint with the Financial Industry Disputes Resolution Centre (FIDReC) at fidrec.com.sg.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+65 6123 4567',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const HK_SFC: JurisdictionConfig = {
  code: 'HK_SFC',
  name: 'Hong Kong (SFC)',
  country: 'Hong Kong',
  countryCode: 'HK',
  currency: 'HKD',
  currencySymbol: 'HK$',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial (Hong Kong) Limited',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: 'Level 20, Two International Finance Centre',
      line2: '8 Finance Street, Central',
      city: 'Hong Kong',
      postalCode: '',
      country: 'Hong Kong',
      countryCode: 'HK',
    },
  },

  regulators: [
    {
      name: 'Securities and Futures Commission',
      shortName: 'SFC',
      url: 'https://www.sfc.hk',
      licenseType: 'Type 1 (Dealing in Securities)',
    },
  ],

  disclaimers: {
    general: 'Lux Financial (Hong Kong) Limited is licensed by the Securities and Futures Commission of Hong Kong.',
    safeguarding: 'Client assets are held in segregated accounts with authorized financial institutions.',
    risk: 'Securities trading involves risk. Please ensure you understand the risks before investing.',
    complaints: 'Complaints may be directed to the SFC or the Financial Dispute Resolution Centre at fdrc.org.hk.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+852 2123 4567',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const HK_HKMA: JurisdictionConfig = {
  code: 'HK_HKMA',
  name: 'Hong Kong (HKMA)',
  country: 'Hong Kong',
  countryCode: 'HK',
  currency: 'HKD',
  currencySymbol: 'HK$',

  legalEntity: {
    type: 'mso',
    name: 'Lux Money Services (Hong Kong) Limited',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: 'Level 20, Two International Finance Centre',
      line2: '8 Finance Street, Central',
      city: 'Hong Kong',
      postalCode: '',
      country: 'Hong Kong',
      countryCode: 'HK',
    },
  },

  regulators: [
    {
      name: 'Hong Kong Customs and Excise Department',
      shortName: 'C&ED',
      url: 'https://www.customs.gov.hk',
      licenseType: 'Money Service Operator',
    },
  ],

  disclaimers: {
    general: 'Lux Money Services (Hong Kong) Limited is a licensed Money Service Operator under the Anti-Money Laundering and Counter-Terrorist Financing Ordinance.',
    safeguarding: 'Customer funds are held securely in accordance with regulatory requirements.',
    risk: 'Money remittance services are subject to exchange rate fluctuations and fees.',
    complaints: 'Complaints may be directed to the Hong Kong Customs and Excise Department.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+852 2123 4567',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const AU_ASIC: JurisdictionConfig = {
  code: 'AU_ASIC',
  name: 'Australia',
  country: 'Australia',
  countryCode: 'AU',
  currency: 'AUD',
  currencySymbol: 'A$',

  legalEntity: {
    type: 'corporation',
    name: 'Lux Financial Pty Ltd',
    tradingName: 'Lux Financial',
    registrationNumber: '', // ACN/ABN
    registeredAddress: {
      line1: 'Level 10, 123 Pitt Street',
      city: 'Sydney',
      state: 'NSW',
      postalCode: '2000',
      country: 'Australia',
      countryCode: 'AU',
    },
  },

  regulators: [
    {
      name: 'Australian Securities and Investments Commission',
      shortName: 'ASIC',
      url: 'https://asic.gov.au',
      licenseType: 'Australian Financial Services Licence',
    },
    {
      name: 'Australian Transaction Reports and Analysis Centre',
      shortName: 'AUSTRAC',
      url: 'https://www.austrac.gov.au',
      licenseType: 'Digital Currency Exchange',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Pty Ltd holds an Australian Financial Services Licence (AFSL: XXXXXX) issued by ASIC and is registered with AUSTRAC as a digital currency exchange provider.',
    safeguarding: 'Customer funds are held in trust accounts with authorised deposit-taking institutions.',
    risk: 'Financial services are subject to risks. Please read our Product Disclosure Statement and Financial Services Guide before making any decisions.',
    complaints: 'If you have a complaint, contact us first. If unresolved, you may escalate to the Australian Financial Complaints Authority (AFCA) at afca.org.au.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+61 2 1234 5678',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const AU_AUSTRAC = AU_ASIC; // Same entity, different regulatory focus
