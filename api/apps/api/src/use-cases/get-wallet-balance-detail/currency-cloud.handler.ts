import { PaymentProviderCurrencyCloud } from '@cdaxfx/ports-currency-cloud';
import { Request } from 'express';
import { GetWalletBalanceDetailUseCase } from './abstract.handler';
import { CurrenciesName, User } from '@cdaxfx/tools-models';
import { ViewBalancesResponse } from '../../use-cases';
import { ECurrencyCode } from '@cdaxfx/tools-misc';

export class GetWalletBalanceDetailCCUseCase extends GetWalletBalanceDetailUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request
    ) {
        super();
    }

    async handle(currency: string, user: User): Promise<ViewBalancesResponse> {
        const data = await this.paymentProvider.getBalance(currency, user);

        return {
            currency: ECurrencyCode[data.currency],
            name: CurrenciesName[data.currency].name,
            amount: data.amount
        };
    }
}
