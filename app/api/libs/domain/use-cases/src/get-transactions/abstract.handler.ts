import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ListTransactionsRequest } from './types/transactions.request.type';
import { GetTransactionsResponse } from './types/transactions.response.type';

export abstract class GetTransactionsUseCase extends UseCaseHandler {
  abstract handle(
    query: ListTransactionsRequest,
    user: User,
  ): Promise<GetTransactionsResponse>;
}
