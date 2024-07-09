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
  mobile_phone_number: null;
  phone_number: string;
  your_reference: null;
  date_of_birth: null;
  created_at: Date;
  updated_at: Date;
}

export interface AccountResponse {
  id: string;
  account_name: string;
  brand: string;
  your_reference: null;
  status: string;
  street: string;
  city: string;
  state_or_province: null;
  country: string;
  postal_code: string;
  spread_table: string;
  legal_entity_type: string;
  created_at: Date;
  updated_at: Date;
  identification_type: null;
  identification_value: null;
  short_reference: string;
  api_trading: boolean;
  online_trading: boolean;
  phone_trading: boolean;
  process_third_party_funds: boolean;
  settlement_type: string;
  agent_or_reliance: boolean;
  terms_and_conditions_accepted: null;
  bank_account_verified: string;
}
