import {
  IPendingTransactionBank,
  IPendingTransactionBeneficiary,
  IPendingTransactionPayer,
} from "../../pending/models/Transaction";
import { IndividualMetadataDto } from "../../registration/model/individualMetadataSchema";

export interface AccountResponse {
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
  phone_trading: string;
  process_third_party_funds: string;
  settlement_type: string;
  agent_or_reliance: string;
  terms_and_conditions_accepted: string;
  bank_account_verified: string;
  riskAssessments: any;
  entityType: string;
  cloudCurrencyId: string;
  openPaydId: string;
  isApproved: boolean;
  individualMetadata?: IndividualMetadataDto;
  businessMetadata?: BusinessMetadata;
  bankMetadata?: IBankMetadata;
}

export interface IBankMetadata {
  bankName: string;
  branch: string;
  accountHolderName: string;
  bankCountry: string;
  currency: string;
  sortCode: string;
  accountNumber: string;
  IBAN: string;
  bicSwift: string;
  uuid: string;
}
export interface BusinessMetadata {
  address1: string;
  address2: string;
  companyName: string;
  companyRegistrationNumber: string;
  companyType: string;
  countryOfRegistration: string;
  createdAt: string;
  dateOfIncorporation: string;
  dateOfRegistration: string;
  email: string;
  expectedActivity: string;
  expectedVolume: string;
  isPubliclyTrading: boolean;
  isRegulated: boolean;
  isVatRegistered: boolean;
  legalEntity: string;
  mailingAddress: string;
  natureOfBusiness: string;
  otherContactInfo: string;
  otherTradingNames: string;
  previousOffice1: string;
  previousOffice2: string;
  previousOffice3: string;
  principalPlace: string;
  registeredOffice1: string;
  registeredOffice2: string;
  registeredOffice3: string;
  regulatorName: string;
  statutoryProvision: string;
  stockMarket: string;
  stockMarketLocation: string;
  telephoneNumber: string;
  tradingName: string;
  updatedAt: string;
  uuid: string;
  vatNumber: string;
  websiteUrl: string;

  registeredOffice1_address2: string;
  registeredOffice1_city: string;
  registeredOffice1_postcode: string;
  registeredOffice1_state: string;

  expectedVolumeOfTransactions: string;
  expectedValueOfTurnover: string;
}
export interface RoutingCodeEntry {
  routingCodeKey: string;
  routingCodeValue: string;
}
export interface PayInDetails {
  senderBic: string;
  senderIban: string;
  senderAccountNumber: string;
  senderName: string;
  senderAddress: string;
  senderInformation: string;
  routingCodeEntries: RoutingCodeEntry[];
  transactionReference: string;
  paymentType: string;
}
export interface Transaction {
  id: string;
  balance_id: string;
  account_id: string;
  currency: string;
  amount: string;
  balance_amount: null;
  type: string;
  related_entity_type: string;
  related_entity_id: string;
  related_entity_short_reference: string;
  status: string;
  reason: string;
  settles_at: string;
  created_at: string;
  completed_at: string;
  action: string;
  account_name?: string;
  pay_in_details?: PayInDetails;
}

export interface Conversion {
  id: string;
  settlement_date: string;
  conversion_date: string;
  short_reference: string;
  creator_contact_id: string;
  account_id: string;
  currency_pair: string;
  status: string;
  buy_currency: string;
  sell_currency: string;
  client_buy_amount: string;
  client_sell_amount: string;
  fixed_side: string;
  core_rate: string;
  partner_rate: string;
  partner_buy_amount: string;
  partner_sell_amount: string;
  client_rate: string;
  deposit_required: string;
  deposit_amount: string;
  deposit_currency: string;
  deposit_status: string;
  deposit_required_at: string;
  payment_ids: string;
  unallocated_funds: string;
  unique_request_id: string;
  created_at: string;
  mid_market_rate: string;
  fee_amount?: string | null;
}
export interface PaymentResponse {
  id: string;
  amount: string;
  beneficiary_id: string;
  currency: string;
  reference: string;
  reason: string;
  status: string;
  creator_contact_id: string;
  payment_type: string;
  payment_date: string;
  estimated_arrival: string;
  transferred_at: string;
  authorisation_steps_required: string;
  last_updater_contact_id: string;
  short_reference: string;
  failure_reason: string;
  payer_id: string;
  payer_details_source: string;
  created_at: string;
  updated_at: string;
  unique_request_id: string;
  failure_returned_amount: string;
  conversion_id: string | null;
  payment_group_id: string | null;
  ultimate_beneficiary_name: string | null;
  purpose_code: string | null;
  charge_type: string | null;
  fee_amount: string | null;
  fee_currency: string | null;
  error: any | null;
  related_entity_id: string | null;
  account_name: string | null;
  status_approval: "pending" | "done" | "expired" | "rejected" | string;
  payer?: {
    firstname?: string;
    lastname?: string;
    dateOfBirth: string;
    addressLine1: string;
    city: string;
    country: string;
    companyName: string;
    countryOfRegistration: string;
  };
}
export interface ContactResponse {
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
  account?: AccountResponse;
  mobileNumber?: string;
  businessRole?: string;
}
export interface SenderResponse {
  id: string;
  amount: string;
  currency: string;
  additional_information: string;
  value_date: string;
  sender: string;
  created_at: string;
}

export interface SettleAccountResponse {
  login_id: string;
  id: string;
  first_name: string;
  last_name: string;
  account_name: string;
  status: string;
  locale: string;
  timezone: string;
  email_address: string;
  mobile_phone_number: string;
  phone_number: string;
  your_reference: string;
  date_of_birth: string;
  bank_account_holder_name: string;
  beneficiary_address: string;
  beneficiary_country: string;
  bic_swift: string;
  iban: string;
  routing_code_type_1: string;
  routing_code_value_1: string;
  routing_code_type_2: string;
  routing_code_value_2: string;
  account_id: string;
  bank_name: string;
  bank_address: string;
  bank_country: string;
  currency: string;
  account_number: string;
}

export interface ReferenceSettleAccountResponse {
  bank_account_holder_name: string;
  beneficiary_address: string;
  beneficiary_country: string;
  bic_swift: string;
  iban: string;
  account_number: string;
  currency: string;
  bank_name: string;
  bank_address: string[];
  bank_country: string;
  routing_code_type_1: string;
  routing_code_value_1: string;
  routing_code_type_2: string;
  routing_code_value_2: string;
}

export interface FundingAccountResponse {
  id: string;
  account_id: string;
  account_number: string;
  account_number_type: string;
  account_holder_name: string;
  bank_name: string;
  bank_address: string;
  bank_country: string;
  currency: string;
  payment_type: string;
  routing_code: string;
  routing_code_type: string;
}

export interface AccountDataResponse {
  settlement_accounts: ReferenceSettleAccountResponse[];
  funding_accounts: FundingAccountResponse[];
}
