import { PaymentProviderCurrencyCloud } from '@cdaxfx/ports-currency-cloud';
import { Request } from 'express';
import { GetWalletBalancesUseCase } from './abstract.handler';
import { CurrenciesName, User } from '@cdaxfx/tools-models';
import { ViewBalancesResponse } from './balances.response.type';
import { ECurrencyCode } from '@cdaxfx/tools-misc';

export class GetWalletbalancesCCUseCase extends GetWalletBalancesUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request
    ) {
        super();
    }

    async handle(user: User): Promise<ViewBalancesResponse[]> {
        const data = await this.paymentProvider.getBalances(user);

        return data?.balances.map((e) => ({
            currency: ECurrencyCode[e.currency],
            name: CurrenciesName[e.currency].name,
            amount: e.amount
        }));
    }
}
