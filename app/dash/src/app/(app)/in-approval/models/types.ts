import { statusMap } from '../helpers';

export interface ITransaction {
  id: string;
  action: string; //Create enum
  account_name: string;
  account_id: string;
  contact_email: string;
  amount: string;
  created_at: string; //date
  currency: string;
  reason: string;
  reference: string;
  settles_at: string; //date
  status: string; //Create enum
  status_approval: keyof typeof statusMap;
  updated_at: string; //date
  gateway: 'currencycloud' | 'openpayd';
  completed_at: string; //date
  amount_in: string;
  amount_out: string;
  contact_name: string;
  description: string; //if status is rejected
  completed_date: string;
  beneficiary: IPendingTransactionBeneficiary;
  payer: IPendingTransactionPayer;
  bank: IPendingTransactionBank;
}

export interface IPendingTransactionBeneficiary {
  id: string;
  bank_account_holder_name: string;
  name: string;
  email: string | null;
  payment_types: string[];
  beneficiary_address: string[];
  beneficiary_country: string;
  beneficiary_entity_type: string;
  beneficiary_company_name: string | null;
  beneficiary_first_name: string;
  beneficiary_last_name: string;
  beneficiary_city: string;
  beneficiary_postcode: string;
  beneficiary_state_or_province: string;
  beneficiary_date_of_birth: string | null;
  beneficiary_identification_type: string | null;
  beneficiary_identification_value: string | null;
  bank_country: string;
  bank_name: string;
  bank_account_type: string | null;
  currency: string;
  account_number: string | null;
  routing_code_type_1: string | null;
  routing_code_value_1: string | null;
  routing_code_type_2: string | null;
  routing_code_value_2: string | null;
  bic_swift: string;
  iban: string;
  default_beneficiary: string;
  creator_contact_id: string;
  bank_address: string[];
  business_nature: string | null;
  company_website: string | null;
  created_at: string;
  updated_at: string;
  beneficiary_external_reference: string | null;
}

export interface IPendingTransactionPayer {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  firstname: string;
  lastname: string;
  formerName: string;
  otherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousPostcode: string;
  previousCountry: string;
  previousState: string;
  nationality: string;
  gender: string;
  identificationNumber: string;
  identificationType: string;
  occupation: string;
  employerName: string;
  employerAddress1: string;
  employerAddress2: string;
  employerAddress3: string;
  publicPosition: string;
  highProfilePosition: string;
  deletedAt: string;

  companyName?: string;
  countryOfRegistration?: string;
}

export interface IPendingTransactionBank {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  bankName: string;
  branch: string;
  bankCountry: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  IBAN: string;
  currency: string;
  deletedAt: string;
  bicSwift: string;
}
