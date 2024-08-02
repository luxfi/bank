import { PaymentProviderCurrencyCloud } from '@cdaxfx/ports-currency-cloud';
import { Request } from 'express';
import { GetWalletCurrenciesUseCase } from './abstract.handler';
import { CurrenciesName, CurrencyCloudCurrencies, User } from '@cdaxfx/tools-models';
import { ViewCurrenciesResponse } from './balances.response.type';
import { ECurrencyCode } from '@cdaxfx/tools-misc';

export class GetWalletCurrenciesCCUseCase extends GetWalletCurrenciesUseCase {

    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request
    ) {
        super();
    }

    async handle(user: User): Promise<ViewCurrenciesResponse[]> {
        const data = await this.paymentProvider.getBalances(user);

        const walletBalancesPromise = data?.balances.map((e) => ({
            currency: ECurrencyCode[e.currency],
            name: CurrenciesName[e.currency].name
        }));

        const walletBalances = await Promise.all(walletBalancesPromise);

        const allCurrencies = CurrencyCloudCurrencies.map((CCCurrency) => ({
            currency: CCCurrency.code,
            name: CCCurrency.name
        }));

        const currencies = allCurrencies.filter(
            (c) => !walletBalances.find((b) => b.currency === c.currency)
        );

        return currencies as ViewCurrenciesResponse[];
    }
}
