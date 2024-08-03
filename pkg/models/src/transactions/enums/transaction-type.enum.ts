export enum TransactionType {
  Conversion = 'conversion',
  Transfer = 'transfer',
  CashManagerTransaction = 'cash_manager_transaction',
  Payment = 'payment'
}

export enum TransactionAction {
  Payment = 'payment',
  Conversion = 'conversion',
  Transfer = 'TRANSFER',
  Funding = 'inbound_funds',
  Fee = 'FEE'
}

export enum TransactionStatus {
  Init = 'init',
  Completed = 'completed',
  Failed = 'failed',
  Closed = 'closed',
  Deleted = 'deleted',
  TradeSettled = 'trade_settled',
  ReadyToSend = 'ready_to_send',
  Released = 'released',
  Suspended = 'suspended',
  AwaitingAuthorisation = 'awaiting_authorisation',
  Submitted = 'submitted',
  Authorised = 'authorised',
  AwaitingFunds = 'awaiting_funds',
  FundsSent = 'funds_sent',
  FundsArrived = 'funds_arrived',
  Scheduled = 'scheduled',
  Expired = 'expired'
}

export enum TransactionStatusResumed {
  SCHEDULED = 'scheduled',
  PENDING = 'pending',
  COMPLETED = 'completed',
  DELETED = 'deleted',
  FAILED = 'failed'
}

export const TransactionStatusMap = {
  scheduled: [
    TransactionStatus.ReadyToSend,
    TransactionStatus.Released,
    TransactionStatus.Suspended,
    TransactionStatus.AwaitingAuthorisation,
    TransactionStatus.Submitted,
    TransactionStatus.Authorised,
    TransactionStatus.AwaitingFunds,
    TransactionStatus.FundsSent,
    TransactionStatus.FundsArrived
  ],
  pending: [
    TransactionStatus.ReadyToSend,
    TransactionStatus.Released,
    TransactionStatus.Suspended,
    TransactionStatus.AwaitingAuthorisation,
    TransactionStatus.Submitted,
    TransactionStatus.Authorised,
    TransactionStatus.AwaitingFunds,
    TransactionStatus.FundsSent,
    TransactionStatus.FundsArrived
  ],
  completed: [
    TransactionStatus.Closed,
    TransactionStatus.Completed,
    TransactionStatus.TradeSettled
  ],
  deleted: [TransactionStatus.Deleted],
  failed: [TransactionStatus.Failed]
};

export const TransactionStatusLabel = {
  [TransactionStatus.Init]: 'pending',
  [TransactionStatus.ReadyToSend]: 'pending',
  [TransactionStatus.Released]: 'pending',
  [TransactionStatus.Suspended]: 'pending',
  [TransactionStatus.AwaitingAuthorisation]: 'pending',
  [TransactionStatus.Submitted]: 'pending',
  [TransactionStatus.Authorised]: 'pending',
  [TransactionStatus.AwaitingFunds]: 'pending',
  [TransactionStatus.FundsSent]: 'pending',
  [TransactionStatus.FundsArrived]: 'pending',
  [TransactionStatus.Closed]: 'completed',
  [TransactionStatus.Completed]: 'completed',
  [TransactionStatus.TradeSettled]: 'completed',
  [TransactionStatus.Deleted]: 'deleted',
  [TransactionStatus.Failed]: 'failed'
};
