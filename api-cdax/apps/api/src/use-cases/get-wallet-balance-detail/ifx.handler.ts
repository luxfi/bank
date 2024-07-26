import { PaymentProviderIFX } from '@cdaxfx/ports-ifx';
import { GetWalletBalanceDetailUseCase } from './abstract.handler';
import { CurrenciesNameIfx, IFXCurrencies } from '@cdaxfx/tools-models';
import { ViewBalancesResponse } from '../../use-cases';
import { NotFoundException } from '@nestjs/common';

export class GetWalletBalanceDetailIFXUseCase extends GetWalletBalanceDetailUseCase {
    constructor(protected paymentProvider: PaymentProviderIFX) {
        super();
    }

    async handle(currency: string): Promise<ViewBalancesResponse> {
        const wallets = await this.paymentProvider.getWallets();

        const walletBalancesPromise = wallets.data.map((wallet) =>
            this.paymentProvider.getWalletBalances(wallet.id)
        );

        const walletBalances = await Promise.all(walletBalancesPromise);

        const allCurrencies = IFXCurrencies.map((ifxCurrency) => ({
            currency: ifxCurrency.currency,
            name: ifxCurrency.name,
            amount: 0
        }));

        const balances = walletBalances.flatMap((wallet) =>
            wallet.balances.map((balance) => ({
                currency: balance.currency,
                name: CurrenciesNameIfx[balance.currency].name,
                amount: balance.amount
            }))
        );

        const currencies = allCurrencies.filter(
            (c) => !balances.find((b) => b.currency === c.currency)
        );

        const currencyBalance = [...balances, ...currencies].find(
            (b) => b.currency === currency
        );

        if (!currencyBalance)
            throw new NotFoundException({messages: ['Currency not found']});

        return currencyBalance as ViewBalancesResponse;
    }
}
