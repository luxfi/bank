import { User } from '@tools/models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ViewBalancesResponse } from './balances.response.type';

export abstract class GetWalletBalanceDetailUseCase extends UseCaseHandler {
  abstract handle(currency: string, user: User): Promise<ViewBalancesResponse>;
}
