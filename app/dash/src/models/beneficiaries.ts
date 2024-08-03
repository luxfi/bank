import { EnumEntityType } from './entityType';

export interface IBeneficiaryDetailsResponse {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  companyName: string;
  entityType: EnumEntityType;
  address: string;
  city: string;
  state: string;
  country: string;
  currency: string;
  bankCountry: string;
  bankName: string;
  bankCountryCode: string;
  sortCode: string;
  postCode: string;
  iban: string;
  bicSwift: string;
  accountNumber: string;
  bankAddress: string;
  currencyCloudId: string;
  addressLine2?: string;
  status: 'approved' | 'pending';
}

export enum ERoutingCodesNames {
  SORT_CODE = 'sort code',
  BSB_CODE = 'bsb code',
  INSTITUTION_NO = 'institution no',
  BANK_CODE = 'bank code',
  BRANCH_CODE = 'branch code',
  ABA = 'aba',
  CLABE = 'clabe',
  CNAPS = 'cnaps',
  IFSC = 'ifsc',
  IBAN = 'iban',
  BIC_SWIFT = 'bic swift',
  ACCOUNT_NUMBER = 'account number',
}

export interface IBeneficiaryListResponse {
  id: string;
  name: string;
  bankCountry: string;
  currency: string;
  status: 'approved' | 'pending';
  account: string;
}

export interface IBeneficiariesResponse { // Add this interface
  beneficiaries: IBeneficiaryListResponse[];
}
