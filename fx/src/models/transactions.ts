interface ICurrencyAmount {
  currency: string;
  amount: string;
}
export interface ITransactionV2 {
  id: string;
  transactionStatus: string;
  shortId: string;
  cdaxId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  gateway: string;
  settlementAt: string;
  completedAt: string;
  creatorName: string;
  beneficiaryName: string;
  clientName: string;
  transactionType: string;
  in: ICurrencyAmount;
  out: ICurrencyAmount;
  approvalStatus: string;
  approvedBy: string;
  approvalStatusChangedAt: string;
  cdaxFee?: string;
  spread?: string;

}

export type TTransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'rejected';

export enum TransactionStatus {
  'init' = 'Init',
  'completed' = 'Completed',
  'failed' = 'Failed',
  'closed' = 'Closed',
  'deleted' = 'Deleted',
  'trade_settled' = 'Trade Settled',
  'ready_to_send' = 'Ready to Send',
  'released' = 'Released',
  'suspended' = 'Suspended',
  'awaiting_authorisation' = 'Awaiting Authorization',
  'submitted' = 'Submitted',
  'authorised' = 'Authorized',
  'awaiting_funds' = 'Awaiting Funds',
  'funds_sent' = 'Funds Sent',
  'funds_arrived' = 'Funds Arrived',
}
