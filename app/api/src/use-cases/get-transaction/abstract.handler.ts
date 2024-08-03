import { User } from '@luxbank/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { GetTransactionResponse } from './types/transaction.response.type';

export abstract class GetTransactionUseCase extends UseCaseHandler {
    abstract handle(id: string, user: User): Promise<GetTransactionResponse>;
}
