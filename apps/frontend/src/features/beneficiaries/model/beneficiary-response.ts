import { AccountResponse } from "../../accounts/model/account-response";

export interface BeneficiaryResponse {
  uuid: string;
  firstname: string;
  lastname: string;
  entityType: string;
  currency: string;
  payment_types: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
  state: string;
  companyName: string;
  bankCountry: string;
  accountNumber: string;
  sortCode: string;
  IBAN: string;
  bicSwift: string;
  currencyCloudId?: string;
  openPaydId?: string;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
  account?: AccountResponse,
}
export interface BeneficiaryID {
  uuid: string;
}
export interface CurrencyBeneficiaryResponse{
  id: string;
  bank_account_holder_name: string;
  name: string;
  email: string;
  payment_types: string[];
  beneficiary_address: string;
  beneficiary_country: string;
  beneficiary_entity_type: string;
  beneficiary_company_name: string;
  beneficiary_first_name: string;
  beneficiary_last_name: string;
  beneficiary_city: string;
  beneficiary_postcode: string;
  beneficiary_state_or_province: string;
  beneficiary_date_of_birth: string;
  beneficiary_identification_type: string;
  beneficiary_identification_value: string;
  bank_country: string;
  bank_name: string;
  bank_account_type: string;
  currency: string;
  account_number: string;
  routing_code_type_1: string;
  routing_code_value_1: string;
  routing_code_type_2: string;
  routing_code_value_2: string;
  bic_swift: string;
  iban: string;
  default_beneficiary: string;
  creator_contact_id: string;
  bank_address: string;
  beneficiary_external_reference: string;
}
