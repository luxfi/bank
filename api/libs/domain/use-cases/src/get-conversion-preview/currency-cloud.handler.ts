import { PaymentProviderCurrencyCloud } from '@ports/currency-cloud';
import { ECurrencyCode } from '@tools/misc';
import { User } from '@tools/models';
import { Request } from 'express';
import { EDirection } from '../types/direction.interface';
import { GetPreviewUseCase } from './abstract.handler';
import { GetPreviewRequest } from './types/preview.request.type';
import { GetPreviewResponse } from './types/preview.response.type';

export class GetPreviewCCUseCase extends GetPreviewUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderCurrencyCloud,
    private request: Request,
    private beneficiariesService: any,
  ) {
    super();
  }

  async handle(
    conversion: GetPreviewRequest,
    user: User,
  ): Promise<GetPreviewResponse> {
    const { buyCurrency, sellCurrency } = conversion;
    let conversionDates = {};

    if (!!buyCurrency && !!sellCurrency) {
      conversionDates = await this.paymentProvider.getConversionDates(
        `${sellCurrency.substring(0, 3)}${buyCurrency.substring(0, 3)}`,
        user,
      );
    }
    const quote = await this.paymentProvider.getCurrencyQuote(conversion, user);
    return {
      rate: quote.client_rate,
      amount:
        conversion.direction === 'buy'
          ? quote.client_sell_amount
          : quote.client_buy_amount,
      sellCurrency: quote.client_sell_currency as ECurrencyCode,
      buyCurrency: quote.client_buy_currency as ECurrencyCode,
      direction: quote.fixed_side as EDirection,
      expiresDate: quote.settlement_cut_off_time,
      ...conversionDates,
    };
  }
}
