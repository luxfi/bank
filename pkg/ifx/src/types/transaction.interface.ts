import { ECurrencyCode } from '@luxbank/misc';

export enum EDefaultRoutingCodesNames {
  BIC_SWIFT = 'bic swift',
  ACCOUNT_NUMBER = 'account number',
  IBAN = 'iban'
}

export const ReversedERoutingCodesNames = {
  'sort code': 'SORT_CODE',
  'bsb code': 'BSB_CODE',
  'institution no': 'INSTITUTION_NO',
  'bank code': 'BANK_CODE',
  'branch code': 'BRANCH_CODE',
  aba: 'ABA',
  clabe: 'CLABE',
  cnaps: 'CNAPS',
  ifsc: 'IFSC',
  iban: 'IBAN',
  'bic swift': 'BIC_SWIFT',
  'account number': 'ACCOUNT_NUMBER'
};

export enum ERoutingCodesNames {
  SORT_CODE = 'sort code',
  BSB_CODE = 'bsb code',
  INSTITUTION_NO = 'institution no',
  BANK_CODE = 'bank code',
  BRANCH_CODE = 'branch code',
  ABA = 'aba',
  CLABE = 'clabe',
  CNAPS = 'cnaps',
  IFSC = 'ifsc',
  IBAN = 'iban',
  BIC_SWIFT = 'bic swift',
  ACCOUNT_NUMBER = 'account number'
}

export interface RoutingCodes {
  name: ERoutingCodesNames;
  value: string;
}

export enum EPaymentType {
  PRIORITY = 'priority',
  REGULAR = 'regular'
}

export enum EEntityType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business'
}

export enum IfxEntityType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'corporate'
}

export enum EDateField {
  SETTLEMENT_AT = 'settlementAt',
  CREATED_AT = 'createdAt',
  COMPLETED_AT = 'completedAt'
}

export enum ETransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum ETransactionType {
  CONVERSION = 'conversion',
  PAYMENT = 'payment',
  INBOUND_FUNDS = 'inbound_funds'
}

export class TransactionCurrencyAmount {
  currency: ECurrencyCode;
  amount: string;
}

export enum ETransactionApprovalStatus {
  IN_APPROVAL = 'in approval',
  APPROVED = 'approved',
  DENIED = 'denied',
  REJECTED = 'rejected'
}
