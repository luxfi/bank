import { User } from '@luxbank/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ViewBalancesResponse } from '../../use-cases';

export abstract class GetWalletBalanceDetailUseCase extends UseCaseHandler {
    abstract handle(currency: string, user: User): Promise<ViewBalancesResponse>;
}
