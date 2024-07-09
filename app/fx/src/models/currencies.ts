export interface ICurrencies {
  name: string;
  currency?: string;
  amount?: string;

  code: string;
  can_buy?: boolean;
  can_sell?: boolean;
  decimal_places?: number;
  online_trading?: boolean;
}

export interface IBalances {
  id: string;
  account_id: string;
  currency: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface ICurrencyBalancesTransactionsAccount extends ICurrencies {
  account?: {
    founding?: Array<IFoundAccount>;
    settlement?: Array<ISettleAccount>;
  };
  details?: IBalances;
  transactions?: Array<ICurrencyTransaction>;
}

export interface ICurrencyBalance {
  balanceId: string;
  balanceAmount: number;
  balanceAccount_id: string;
  currencyCode: string;
  countryName: string;
}

export interface IConvertTodayDTO {
  sellId: string;
  buyId: string;
  amountTo: string;
  value: string;
  day: string;
}

export interface IConvertCurrencyAmount {
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
  first_conversion_cutoff_datetime: string;
  first_conversion_date: string;
  next_day_conversion_date: string;
  default_conversion_date: string;
  optimize_liquidity_conversion_date: string;
  invalid_conversion_dates: Record<string, string>;
}

export interface IPayloadCreateQuote {
  sell_account_id: string;
  buy_account_id: string;
  sell_currency: string;
  buy_currency: string;
  amount: string;
  fixed_side: string;
  conversion_date: string;
  quoteId: string;
  term_agreement: boolean;
}

export interface IConvertQuote {
  id: string;
  awaiting_funds: string;
  settlement_date: string;
  conversion_date: string;
  short_reference: string;
  creator_contact_id: string;
  account_id: string;
  currency_pair: string;
  status: string;
  buy_currency: string;
  sell_currency: string;
  client_buy_amount: number;
  client_sell_amount: number;
  fixed_side: string;
  core_rate: string;
  partner_rate: number;
  partner_buy_amount: number;
  partner_sell_amount: number;
  client_rate: number;
  deposit_required: boolean;
  deposit_amount: number;
  deposit_currency: string;
  deposit_status: string;
  deposit_required_at: string;
  payment_ids: [];
  unallocated_funds: number;
  unique_request_id?: string;
  created_at: string;
  updated_at: string;
  mid_market_rate: number;
}

export interface ISettleAccount {
  bank_account_holder_name: string;
  beneficiary_address: string;
  beneficiary_country: string;
  bank_name: string;
  bank_address: Array<string>;
  bank_country: string;
  currency: string;
  bic_swift: string;
  iban: string;
  account_number: string;
  routing_code_type_1: string;
  routing_code_value_1: string;
  routing_code_type_2: string;
  routing_code_value_2: string;
}

export interface IFoundAccount {
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
  created_at: string;
  updated_at: string;
}

export interface ISettleAccountsResponse {
  settlement_accounts: Array<ISettleAccount>;
  funding_accounts: Array<IFoundAccount>;
}

export interface ICurrencyAccount {
  id: string;
  account_name: string;
  brand: string;
  your_reference?: string;
  status: string;
  street: string;
  city: string;
  state_or_province: string;
  country: string;
  postal_code: string;
  spread_table: string;
  legal_entity_type: string;
  created_at: string;
  updated_at: string;
  identification_type: string;
  identification_value?: string;
  short_reference: string;
  api_trading: boolean;
  online_trading: boolean;
  phone_trading: boolean;
  process_third_party_funds: boolean;
  settlement_type: string;
  agent_or_reliance: boolean;
  terms_and_conditions_accepted?: string;
  bank_account_verified: string;
}

export interface ICurrencyTransaction {
  account_name: string;
  creator: string;
  account_id: string;
  action: string;
  amount: string;
  buy_amount: string;
  buy_currency: string;
  sell_amount: string;
  sell_currency: string;
  balance_amount: string | null;
  balance_id: string;
  completed_at: string | null;
  created_at: Date;
  currency: string;
  id: string;
  reason: string | null;
  related_entity_id: string;
  related_entity_short_reference: string;
  related_entity_type: string;
  settles_at: string | null;
  status: string;
  type: string;
  updated_at: Date;
  client_rate: string;
  core_rate: string;
  fee_amount: string | null;
  fee_currency: string | null;
  gateway_fee_amount: string | null;
  gateway_fee_currency: string | null;
  gateway: string;
  gateway_created_at: string | null;
  gateway_spread_table: string | null;
  beneficiary_id: string | null;
}

export interface IPayment {
  id: string;
  amount: number;
  beneficiary_id: string;
  currency: string;
  reference: string;
  reason: string;
  status: string;
  creator_contact_id: string;
  payment_type: string;
  payment_date: string;
  estimated_arrival?: string;
  transferred_at: string;
  authorisation_steps_required: string;
  last_updater_contact_id: string;
  short_reference: string;
  conversion_id?: string;
  failure_reason?: string;
  payer_id: string;
  payer_details_source: string;
  created_at: string;
  updated_at: string;
  payment_group_id?: string;
  unique_request_id: string;
  failure_returned_amount: number;
  ultimate_beneficiary_name?: string;
  purpose_code?: string;
  charge_type: string;
  fee_amount?: string;
  fee_currency?: string;
  review_status: string;
  invoice_date?: string;
  invoice_number?: string;
}

export interface IBankBeneficiary {
  id: string;
  bank_account_holder_name: string;
  name: string;
  email?: string;
  payment_types: Array<string>;
  beneficiary_address: Array<string>;
  beneficiary_country: string;
  beneficiary_entity_type: string;
  beneficiary_company_name?: string;
  beneficiary_first_name: string;
  beneficiary_last_name: string;
  beneficiary_city: string;
  beneficiary_postcode: string;
  beneficiary_state_or_province: string;
  beneficiary_date_of_birth?: string;
  beneficiary_identification_type?: string;
  beneficiary_identification_value?: string;
  bank_country: string;
  bank_name: string;
  bank_account_type?: string;
  currency: string;
  account_number?: string;
  routing_code_type_1?: string;
  routing_code_value_1?: string;
  routing_code_type_2?: string;
  routing_code_value_2?: string;
  bic_swift: string;
  iban: string;
  default_beneficiary: string;
  creator_contact_id: string;
  bank_address: Array<string>;
  business_nature?: string;
  company_website?: string;
  created_at?: string;
  updated_at?: string;
  beneficiary_external_reference?: string;
}

export interface IPayer {
  id: string;
  legal_entity_type: string;
  company_name?: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state_or_province: string;
  country: string;
  postcode: string;
  date_of_birth: string;
  identification_type: string;
  identification_value?: string;
  created_at: string;
  updated_at: string;
}
