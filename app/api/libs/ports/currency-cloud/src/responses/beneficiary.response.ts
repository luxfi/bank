export enum paymentTypes {
  'priority' = 'priority', // SWIFT
  'regular' = 'regular', // LOCAL
}
export interface CreateBeneficiaryResponse {
  id?: string;
  name: string;
  bank_account_holder_name: string;
  bank_country: string;
  currency: string;
  email?: string;
  payment_types?: paymentTypes[];
  beneficiary_address?: string[];
  beneficiary_country?: string;
  beneficiary_entity_type?: string;
  beneficiary_company_name?: string;
  beneficiary_first_name?: string;
  beneficiary_last_name?: string;
  beneficiary_city?: string;
  beneficiary_postcode?: string;
  beneficiary_state_or_province?: string;
  beneficiary_date_of_birth?: string;
  beneficiary_identification_type?: string;
  beneficiary_identification_value?: string;
  bank_name?: string;
  bank_account_type?: string;
  account_number?: string;
  routing_code_type_1?: string;
  routing_code_value_1?: string;
  routing_code_type_2?: string;
  routing_code_value_2?: string;
  bic_swift?: string;
  iban?: string;
  default_beneficiary?: string;
  creator_contact_id?: string;
  bank_address?: string[];
  created_at?: string;
  updated_at?: string;
  beneficiary_external_reference?: string;
  business_nature?: string;
  company_website?: string;
}
