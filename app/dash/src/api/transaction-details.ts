import { ITransactionDetails } from '@/models/payment';

import { dataFetch } from './fetchers';
import { SEARCH } from './paths';

export async function getTransaction(id: string): Promise<ITransactionDetails> {
  const endpoint = SEARCH.TRANSACTION_DETAILS(id);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'GET',
  });

  if (response?.data) {
    return response.data as ITransactionDetails;
  }

  const { message } = response;
  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}
