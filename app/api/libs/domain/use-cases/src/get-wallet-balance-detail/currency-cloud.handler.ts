import { PaymentProviderCurrencyCloud } from '@ports/currency-cloud';
import { Request } from 'express';
import { GetWalletBalanceDetailUseCase } from './abstract.handler';
import { CurrenciesName, User } from '@tools/models';
import { ViewBalancesResponse } from './balances.response.type';
import { ECurrencyCode } from '@tools/misc';

export class GetWalletBalanceDetailCCUseCase extends GetWalletBalanceDetailUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderCurrencyCloud,
    private request: Request,
  ) {
    super();
  }

  async handle(currency: string, user: User): Promise<ViewBalancesResponse> {
    const data = await this.paymentProvider.getBalance(currency, user);

    return {
      currency: ECurrencyCode[data.currency],
      name: CurrenciesName[data.currency].name,
      amount: data.amount,
    };
  }
}
