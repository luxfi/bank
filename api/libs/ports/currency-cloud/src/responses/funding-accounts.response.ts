export interface FundingAccounts {
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

export interface FundingAccountsFindResponse {
  funding_accounts: FundingAccounts[];
  pagination: {
    total_entries: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    previous_page: number;
    next_page: number;
    order: string;
    order_asc_desc: string;
  };
}
