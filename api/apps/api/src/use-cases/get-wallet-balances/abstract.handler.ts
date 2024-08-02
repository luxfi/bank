import { User } from '@cdaxfx/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ViewBalancesResponse } from './balances.response.type';

export abstract class GetWalletBalancesUseCase extends UseCaseHandler {
    abstract handle(user: User): Promise<ViewBalancesResponse[]>;
}