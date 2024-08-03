export interface QuotePostFromResponse {
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
}

export interface QuoteFromResponse {
  settlement_cut_off_time: string;
  currency_pair: string;
  client_buy_currency: string;
  client_sell_currency: string;
  client_buy_amount: string;
  client_sell_amount: string;
  fixed_side: string;
  client_rate: string;
  partner_rate: string;
  core_rate: string;
  deposit_required: string;
  deposit_amount: string;
  deposit_currency: string;
  mid_market_rate: string;
  quoteId?: string;
  invalid_conversion_dates?: object;
  first_conversion_date?: string;
}

export interface TopPostFromResponse {
  account_id: string;
  currency: string;
  transferred_amount: string;
}


export interface BeneficiaryFromResponse {
  id: string,
  bank_account_holder_name: string,
  name: string,
  email: string,
  payment_types: string,
  beneficiary_address: string,
  beneficiary_country: string,
  beneficiary_entity_type: string,
  beneficiary_company_name: string,
  beneficiary_first_name: string,
  beneficiary_last_name: string,
  beneficiary_city: string,
  beneficiary_postcode: string,
  beneficiary_state_or_province: string,
  beneficiary_date_of_birth: string,
  beneficiary_identification_type: string,
  beneficiary_identification_value: string,
  bank_country: string,
  bank_name: string,
  bank_account_type: string,
  currency: string,
  account_number: string,
  routing_code_type_1: string,
  routing_code_value_1: string,
  routing_code_type_2: string,
  routing_code_value_2: string,
  bic_swift: string,
  iban: string,
  default_beneficiary: string,
  creator_contact_id: string,
  bank_address: string,
  beneficiary_external_reference: string
}
export interface SplitPreviewConversionFromResponse {
  id: string,
  short_reference: string,
  sell_amount: string,
  sell_currency: string,
  buy_amount: string,
  buy_currency: string,
  settlement_date: string,
  conversion_date: string,
  status: string,
}
export interface SplitPreviewFromResponse {
  parent_conversion: SplitPreviewConversionFromResponse,
  child_conversion: SplitPreviewConversionFromResponse
}