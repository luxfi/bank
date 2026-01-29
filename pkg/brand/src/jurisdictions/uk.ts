import type { JurisdictionConfig } from '../types';

export const UK_FCA: JurisdictionConfig = {
  code: 'UK_FCA',
  name: 'United Kingdom (FCA)',
  country: 'United Kingdom',
  countryCode: 'GB',
  currency: 'GBP',
  currencySymbol: '£',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial Limited',
    tradingName: 'Lux Financial',
    registrationNumber: '', // Companies House number
    vatNumber: '',
    registeredAddress: {
      line1: '1 Financial Centre',
      city: 'London',
      postalCode: 'EC2V 8AF',
      country: 'United Kingdom',
      countryCode: 'GB',
    },
  },

  regulators: [
    {
      name: 'Financial Conduct Authority',
      shortName: 'FCA',
      url: 'https://www.fca.org.uk',
      licenseNumber: '', // FRN
      licenseType: 'Authorized Electronic Money Institution',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Limited is authorised by the Financial Conduct Authority (FCA) under the Electronic Money Regulations 2011 (FRN: XXXXXX) for the issuance of electronic money.',
    safeguarding: 'In accordance with the Electronic Money Regulations, customer funds are safeguarded in segregated accounts held with authorised credit institutions.',
    risk: 'Electronic money is not covered by the Financial Services Compensation Scheme (FSCS). However, your funds are protected under the Electronic Money Regulations.',
    complaints: 'If you are unhappy with our service, please contact us. If you remain dissatisfied, you may be able to refer your complaint to the Financial Ombudsman Service at financial-ombudsman.org.uk.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+44 20 1234 5678',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const UK_IOM: JurisdictionConfig = {
  code: 'UK_IOM',
  name: 'Isle of Man',
  country: 'Isle of Man',
  countryCode: 'IM',
  currency: 'GBP',
  currencySymbol: '£',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial Limited',
    tradingName: 'Lux Financial',
    registrationNumber: '', // Isle of Man company number
    registeredAddress: {
      line1: '2nd Floor, St Mary\'s Court',
      line2: '20 Hill Street',
      city: 'Douglas',
      postalCode: 'IM1 1EU',
      country: 'Isle of Man',
      countryCode: 'IM',
    },
    businessAddress: {
      buildingNumber: '27',
      line1: 'Hope Street',
      city: 'Douglas',
      postalCode: 'IM1 1AR',
      country: 'Isle of Man',
      countryCode: 'IM',
    },
  },

  regulators: [
    {
      name: 'Isle of Man Financial Services Authority',
      shortName: 'IOMFSA',
      url: 'https://www.iomfsa.im',
      licenseType: 'Class 8 License (Money Transmission Services)',
    },
  ],

  disclaimers: {
    general: 'Lux Financial Limited is a company registered in the Isle of Man and is licensed by the Isle of Man Financial Services Authority.',
    safeguarding: 'Customer funds are held in segregated accounts at regulated financial institutions and remain 100% liquid at all times.',
    risk: 'The Isle of Man is a self-governing British Crown Dependency with its own legal system and regulatory framework.',
    complaints: 'Complaints can be made to our Compliance team. The Isle of Man Financial Services Authority does not operate a compensation scheme.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+44 1624 682070',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};

export const UK_GIB: JurisdictionConfig = {
  code: 'UK_GIB',
  name: 'Gibraltar',
  country: 'Gibraltar',
  countryCode: 'GI',
  currency: 'GBP',
  currencySymbol: '£',

  legalEntity: {
    type: 'limited_company',
    name: 'Lux Financial (Gibraltar) Limited',
    tradingName: 'Lux Financial',
    registeredAddress: {
      line1: 'Suite 1, Floor 2',
      line2: 'Ocean Village Business Centre',
      city: 'Gibraltar',
      postalCode: 'GX11 1AA',
      country: 'Gibraltar',
      countryCode: 'GI',
    },
  },

  regulators: [
    {
      name: 'Gibraltar Financial Services Commission',
      shortName: 'GFSC',
      url: 'https://www.gfsc.gi',
      licenseType: 'DLT Provider License',
    },
  ],

  disclaimers: {
    general: 'Lux Financial (Gibraltar) Limited is authorised and regulated by the Gibraltar Financial Services Commission.',
    safeguarding: 'Customer funds are safeguarded in accordance with Gibraltar regulatory requirements.',
    risk: 'Gibraltar is a British Overseas Territory with its own financial services regulatory framework.',
    complaints: 'Complaints may be directed to the Gibraltar Financial Services Commission.',
  },

  contact: {
    email: 'hello@lux.financial',
    phone: '+350 200 12345',
    supportEmail: 'support@lux.financial',
    complianceEmail: 'compliance@lux.financial',
  },
};
