import type { JurisdictionConfig } from '../types';

export const UAE_DFSA: JurisdictionConfig = {
  code: 'UAE_DFSA',
  name: 'UAE (DIFC/DFSA)',
  country: 'United Arab Emirates',
  countryCode: 'AE',
  currency: 'AED',
  currencySymbol: 'AED',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial DIFC Ltd',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: 'Level 14, The Gate Building',
      line2: 'Dubai International Financial Centre',
      city: 'Dubai',
      postalCode: '507211',
      country: 'United Arab Emirates',
      countryCode: 'AE',
    },
  },

  regulators: [
    {
      name: 'Dubai Financial Services Authority',
      shortName: 'DFSA',
      url: 'https://www.dfsa.ae',
      licenseType: 'Category 3C License',
    },
  ],

  disclaimers: {
    general: 'Lux Financial DIFC Ltd is regulated by the Dubai Financial Services Authority (DFSA) in the Dubai International Financial Centre.',
    safeguarding: 'Client assets are held in segregated accounts in accordance with DFSA Client Asset Rules.',
    risk: 'Financial services involve risk. The DFSA does not provide investor compensation schemes.',
    complaints: 'Complaints may be directed to the DFSA or the DIFC Courts.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+971 4 123 4567',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const UAE_ADGM: JurisdictionConfig = {
  code: 'UAE_ADGM',
  name: 'UAE (ADGM/FSRA)',
  country: 'United Arab Emirates',
  countryCode: 'AE',
  currency: 'AED',
  currencySymbol: 'AED',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial ADGM Ltd',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: 'Al Maryah Island',
      line2: 'Abu Dhabi Global Market Square',
      city: 'Abu Dhabi',
      postalCode: '',
      country: 'United Arab Emirates',
      countryCode: 'AE',
    },
  },

  regulators: [
    {
      name: 'Financial Services Regulatory Authority',
      shortName: 'FSRA',
      url: 'https://www.adgm.com/fsra',
      licenseType: 'Financial Services Permission',
    },
  ],

  disclaimers: {
    general: 'Lux Financial ADGM Ltd is authorised and regulated by the Financial Services Regulatory Authority (FSRA) of Abu Dhabi Global Market.',
    safeguarding: 'Client money is held in segregated accounts in accordance with FSRA rules.',
    risk: 'Financial services carry inherent risks. ADGM operates under English common law principles.',
    complaints: 'Complaints may be directed to the FSRA or ADGM Courts.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+971 2 123 4567',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const UAE_DIFC = UAE_DFSA; // Alias
