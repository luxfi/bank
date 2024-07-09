import { ISortingPagination } from '@/components/Table';

import { IPaginationResponse } from '@/models/pagination';
import { ITransactionDetails } from '@/models/payment';
import { ITransactionV2 } from '@/models/transactions';

import { ITransactionsFilters } from '@/app/(app)/transactions/types';

import { dataFetch } from '@/api/fetchers';

import { PATHS } from './types';

export async function getTransactions(
  params?: (ITransactionsFilters & ISortingPagination) | string
): Promise<{
  data: Array<ITransactionV2>;
  pagination: IPaginationResponse;
}> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.GET_TRANSACTIONS,
      method: 'GET',
      urlParams: params as unknown as Record<string, string>,
    });

    if (response.message) {
      throw new Error('Unable to get Transactions');
    }

    return {
      data: response.data as Array<ITransactionV2>,
      pagination: response.pagination as IPaginationResponse,
    };
  } catch (error) {
    throw new Error('Unable to get Transactions');
  }
}

export async function getTransactionDetails(
  id: string
): Promise<ITransactionDetails> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.TRANSACTION_DETAILS(id),
      method: 'GET',
    });

    if (response.message) {
      throw new Error('Unable to get Transaction Details');
    }

    return response.data as ITransactionDetails;
  } catch (error) {
    throw new Error('Unable to get Transaction Details');
  }
}

export const approveTransaction = async (id: string) => {
  try {
    const res = await dataFetch({
      endpoint: PATHS.APPROVE_PAYMENT(id),
      method: 'POST',
    });
    const { data, message } = res;

    if (message) {
      throw new Error(
        message ?? "Couldn't approve the transaction, please try again."
      );
    }
    return data;
  } catch (error) {
    throw new Error("Couldn't approve the transaction, please try again.");
  }
};

export const rejectTransaction = async (id: string, reason: string) => {
  try {
    const res = await dataFetch({
      endpoint: PATHS.REJECT_PAYMENT(id),
      method: 'POST',
      bodyParams: { description: reason },
    });

    const { data, message } = res;
    if (message) {
      throw new Error(
        message ?? "Couldn't reject the transaction, please try again."
      );
    }

    return data;
  } catch (error) {
    throw new Error("Couldn't reject the transaction, please try again.");
  }
};
