export interface Transaction {
    id: string;
    balance_id: string;
    account_id: string;
    currency: string;
    amount: string;
    balance_amount: string;
    type: string;
    related_entity_type: string;
    related_entity_id: string;
    related_entity_short_reference: string;
    status: string;
    reason: string;
    settles_at: string;
    created_at: string;
    updated_at: string;
    completed_at: string;
    action: string;
}
  
export interface GetTransactionsResponse {
    transactions: Transaction[];
}
  