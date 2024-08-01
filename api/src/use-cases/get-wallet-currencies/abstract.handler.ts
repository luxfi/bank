import { User } from '@cdaxfx/tools-models';
import { UseCaseHandler } from '../types/use-case-handler.interface';
import { ViewCurrenciesResponse } from './balances.response.type';

export abstract class GetWalletCurrenciesUseCase extends UseCaseHandler {
    abstract handle(user: User): Promise<ViewCurrenciesResponse[]>;
}
