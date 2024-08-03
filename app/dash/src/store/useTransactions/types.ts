import { ISortingPagination } from '@/components/Table';

import { IPaginationResponse } from '@/models/pagination';
import { ITransactionDetails } from '@/models/payment';
import { ITransactionV2 } from '@/models/transactions';

import { ITransactionsFilters } from '@/app/(app)/transactions/types';

import { IDefaultStates } from '../helpers/setStates';

export interface ITransactionsResponse {
  data: Array<ITransactionV2>;
  pagination: IPaginationResponse;
}
export interface ITransactionsStates
  extends IDefaultStates<ITransactionsActions> {
  inApprovalCount: number;
}

export interface ITransactionsActions {
  getTransactions: (
    payload: ITransactionsFilters & ISortingPagination
  ) => Promise<ITransactionsResponse>;

  getSelectedTransaction: (id: string) => Promise<ITransactionDetails>;
  getTransactionsCount: (payload: ITransactionsFilters) => Promise<number>;
  setApprovalCount: () => Promise<void>;

  approveTransaction: (id: string) => Promise<void>;
  rejectTransaction: ({
    id,
    reason,
  }: {
    id: string;
    reason: string;
  }) => Promise<void>;
}

export const PATHS = {
  GET_TRANSACTIONS: '/api/v2/transactions',
  TRANSACTION_DETAILS: (id: string) => `/api/v2/transactions/${id}`,
  REJECT_PAYMENT: (id: string) => `/api/v2/payments/reject_payment/${id}`,
  APPROVE_PAYMENT: (id: string) => `/api/v2/payments/approve_payment/${id}`,
};
