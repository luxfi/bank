import { ISortingPagination } from '@/components/Table';

import { IPaginationResponse } from '@/models/pagination';
import { ITransactionV2 } from '@/models/transactions';

import { ITransactionsFilters } from '@/app/(app)/transactions/types';

import { dataFetch } from './fetchers';
import { SEARCH } from './paths';

export async function getTransactions(
  params?: (ITransactionsFilters & ISortingPagination) | string
): Promise<{
  data: Array<ITransactionV2>;
  pagination: IPaginationResponse;
}> {
  const endpoint = SEARCH.TRANSACTIONS;

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'GET',
    urlParams: params as any,
  });

  if (response?.data) {
    return {
      data: response.data as Array<ITransactionV2>,
      pagination: response.pagination as IPaginationResponse,
    };
  }

  const { message } = response;
  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}
