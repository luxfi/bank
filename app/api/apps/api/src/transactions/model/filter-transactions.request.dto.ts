export interface FilterTransactions {
  shortReference?: string;
  action?: string;
  settles_at_from?: string;
  settles_at_to?: string;
  created_at_from?: string;
  created_at_to?: string;
  completed_at_from?: string;
  completed_at_to?: string;
  status?: string;
  type?: string;
  amount_from?: string;
  amount_to?: string;
  currency?: string;
  scope?: string;
  page: number;
  account_id?: string;
  gateway?: string;
  client?: string;
  status_approval?: string;
  reference?: string;
  beneficiary_id?: string;
}

export class FilterTransactionsDTO {
  shortReference?: string;
  action?: string;
  settles_at_from?: string;
  settles_at_to?: string;
  created_at_from?: string;
  created_at_to?: string;
  completed_at_from?: string;
  completed_at_to?: string;
  status?: string;
  type?: string;
  amount_from?: string;
  amount_to?: string;
  currency?: string;
  scope?: string;
  page: number;
  account_id?: string;
  gateway?: string;
  client?: string;
  status_approval?: string;
  reference?: string;
  beneficiary_id?: string;
}
