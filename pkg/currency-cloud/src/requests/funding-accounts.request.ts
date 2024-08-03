export interface FundingAccountsRequest {
    payment_type?: string;
    currency?: string;
    account_id?: string;
    on_behalf_of?: string;
    page: number;
    per_page: number;
    order?: string;
    order_asc_desc?: string;
}
  