import { IPaginationResponse } from '@/models/pagination';
import { ITransactionDetails } from '@/models/payment';

import { create } from 'zustand';

import { setErrorState, setLoadingState } from '../helpers/setStates';
import * as api from './fetchers';
import {
  ITransactionsActions,
  ITransactionsResponse,
  ITransactionsStates,
} from './types';

export const useTransactions = create<
  ITransactionsStates & ITransactionsActions
>((set) => ({
  selectedTransaction: {} as ITransactionDetails,
  inApprovalCount: 0,

  loading: {} as ITransactionsStates['loading'],
  errors: {} as ITransactionsStates['errors'],

  async getTransactions(payload) {
    setLoadingState(useTransactions, 'getTransactions', true);
    return await api
      .getTransactions(payload)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        setErrorState(useTransactions, 'getTransactions', err);
        return {} as ITransactionsResponse;
      })
      .finally(() => {
        setLoadingState(useTransactions, 'getTransactions', false);
      });
  },

  async setApprovalCount() {
    setLoadingState(useTransactions, 'setApprovalCount', true);
    await api
      .getTransactions({
        statusApproval: 'pending',
        type: 'payment',
        limit: 0,
        page: 1,
      })
      .then(({ pagination }: { pagination: IPaginationResponse }) => {
        set({ inApprovalCount: pagination.totalEntries });
      })
      .catch((err) => {
        setErrorState(useTransactions, 'setApprovalCount', err);
      })
      .finally(() => {
        setLoadingState(useTransactions, 'setApprovalCount', false);
      });
  },

  async getSelectedTransaction(payload) {
    setLoadingState(useTransactions, 'getSelectedTransaction', true);
    return await api
      .getTransactionDetails(payload)
      .then((data: ITransactionDetails) => {
        return data;
      })
      .catch((err) => {
        setErrorState(useTransactions, 'getSelectedTransaction', err);
        return {} as ITransactionDetails;
      })
      .finally(() => {
        setLoadingState(useTransactions, 'getSelectedTransaction', false);
      });
  },

  async getTransactionsCount(payload) {
    setLoadingState(useTransactions, 'getTransactionsCount', true);

    return await api
      .getTransactions({ ...payload, limit: 0, page: 1 })
      .then(({ pagination }: { pagination: IPaginationResponse }) => {
        return pagination.totalEntries;
      })
      .catch((err) => {
        setErrorState(useTransactions, 'getTransactionsCount', err);
        return 0;
      })
      .finally(() => {
        setLoadingState(useTransactions, 'getTransactionsCount', false);
      });
  },

  async approveTransaction(id) {
    setLoadingState(useTransactions, 'approveTransaction', true);
    api
      .approveTransaction(id)
      .catch((err) => {
        setErrorState(useTransactions, 'approveTransaction', err);
      })
      .finally(() => {
        setLoadingState(useTransactions, 'approveTransaction', false);
      });
  },

  async rejectTransaction({ id, reason }) {
    setLoadingState(useTransactions, 'rejectTransaction', true);
    api
      .rejectTransaction(id, reason)
      .catch((err) => {
        setErrorState(useTransactions, 'rejectTransaction', err);
      })
      .finally(() => {
        setLoadingState(useTransactions, 'rejectTransaction', false);
      });
  },
}));
