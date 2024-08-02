import { PaymentProviderCurrencyCloud, EDirection, GetPreviewRequest, GetPreviewResponse } from '@cdaxfx/ports-currency-cloud';
import { ECurrencyCode } from '@cdaxfx/tools-misc';
import { User } from '@cdaxfx/tools-models';
import { Request } from 'express';
import { GetPreviewUseCase } from './abstract.handler';

export class GetPreviewCCUseCase extends GetPreviewUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request,
        private beneficiariesService: any
    ) {
        super();
    }

    async handle(conversion: GetPreviewRequest, user: User): Promise<GetPreviewResponse> {
        const { buyCurrency, sellCurrency } = conversion;
        let conversionDates = {};

        if (!!buyCurrency && !!sellCurrency) {
            conversionDates = await this.paymentProvider.getConversionDates(
                `${sellCurrency.substring(0, 3)}${buyCurrency.substring(0, 3)}`,
                user
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
            ...conversionDates
        };
    }
}
