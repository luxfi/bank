/* eslint-disable @typescript-eslint/no-explicit-any */

import { IIndividualMetadataUser } from './auth';

export interface IBusinessMetadata {
  companyName: string;
  countryOfRegistration: string;
}

interface IBankMetadata {
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
  bicSwift: string;
  currency: string;
  deletedAt?: string;
}

export interface IAccountResponse {
  id: string;
  createdAt: string;
  account_name: string;
  brand: string;
  your_reference: string;
  status: string;
  street: string;
  city: string;
  state_or_province: string;
  country: string;
  postal_code: string;
  spread_table: string;
  legal_entity_type: string;
  identification_type: string;
  identification_value: string;
  short_reference: string;
  api_trading: string;
  online_trading: string;
  businessMetadata?: IBusinessMetadata;
  phone_trading: string;
  process_third_party_funds: string;
  settlement_type: string;
  agent_or_reliance: string;
  terms_and_conditions_accepted: string;
  bank_account_verified: string;
  bankMetadata?: IBankMetadata;
  individualMetadata?: IIndividualMetadataUser;
  riskAssessments: any;
  entityType: string;
  cloudCurrencyId: string;
  openPaydId: string;
  isApproved: boolean;
}

export interface IContactResponse {
  uuid: string;
  login_id: string;
  id: string;
  first_name: string;
  last_name: string;
  account_id: string;
  account_name: string;
  status: string;
  locale: string;
  timezone: string;
  email_address: string;
  country?: string;
  mobile_phone_number: string;
  phone_number: string;
  your_reference: string;
  date_of_birth: string;
  complyLaunchId?: string;
  complyLaunchResponse?: string;
  account?: IAccountResponse;
}
