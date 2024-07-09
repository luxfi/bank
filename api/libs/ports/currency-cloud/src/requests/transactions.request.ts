export interface GetTransactionsRequest {
  related_entity_short_reference?: string;
  action?: string;
  related_entity_id?: string;
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
  page?: number;
  per_page?: number;
  order?: string;
  order_asc_desc?: string;
}
