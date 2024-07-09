export interface IForm {
  companyName: string;
  companyType: string;
  tradingName: string;
  otherTradingName: string;
  legalEntity: string;
  email: string;
  phoneNumber: string;
  countryOfRegistration: string;
  companyRegNumber: string;
  vatNumber: string;
  dateOfRegistration: string;
  dateOfIncorporation: string;
  website: string;
  otherContactInfo: string;
  statutory: string;
  publicityTrading: string;
  whereListed: string;
  whichMarket: string;
  nameOfRegulator: string;
}

export const companyType = [
  { label: 'Limited Liability', value: 'LIMITED_LIABILITY' },
  { label: 'Sole Trader', value: 'SOLE_TRADER' },
  { label: 'Partnership', value: 'PARTNERSHIP' },
  { label: 'Charity', value: 'CHARITY' },
  { label: 'Joint Stock Company', value: 'JOINT_STOCK_COMPANY' },
  { label: 'Public Limited Company', value: 'PUBLIC_LIMITED_COMPANY' },
];
