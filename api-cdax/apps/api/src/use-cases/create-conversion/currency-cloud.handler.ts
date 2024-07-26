import { PaymentProviderCurrencyCloud, ConversionTypeResponse, CreateConversionRequest, CreateConversionResponse } from '@cdaxfx/ports-currency-cloud';
import { TransactionAction, TransactionStatusApproval, TransactionsRepository, User } from '@cdaxfx/tools-models';
import { Request } from 'express';
import { CreateConversionUseCase } from './abstract.handler';

export class CreateConversionCCUseCase extends CreateConversionUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request,
        private readonly transactionsRepository: TransactionsRepository
    ) {
        super();
    }

    gateway = 'currencycloud';

    async handle(conversion: CreateConversionRequest, user: User): Promise<CreateConversionResponse> {
        const data = await this.paymentProvider.postCurrencyQuote(conversion, user);

        await this.createConversion(data, user);

        return { id: data.id };
    }

    async createConversion(quote: ConversionTypeResponse, user: User) {
        const transaction = await this.transactionsRepository.createTransaction(
            {
                status: quote.status,
                action: TransactionAction.Conversion,
                gateway: this.gateway,
                account_id: user.getCurrentClient()?.account?.gatewayId,
                gateway_id: user.getCurrentClient()?.account?.gatewayId,
                client_uuid: user.getCurrentClient()?.uuid,
                currency: quote.sell_currency,
                amount: quote.client_sell_amount,
                transaction_id: quote.id,
                short_id: quote.short_reference,
                client_rate: quote.client_rate,
                core_rate: quote.core_rate,
                buy_amount: quote.client_buy_amount,
                buy_currency: quote.buy_currency,
                fixed_side: quote.fixed_side,
                mid_market_rate: quote.mid_market_rate,
                conversion_date: quote.conversion_date,
                settlement_date: quote.settlement_date,
                gateway_created_at: quote.created_at,
                gateway_updated_at: quote.updated_at,
                partner_rate: quote.partner_rate,
                deposit_required: quote.deposit_required,
                deposit_amount: quote.deposit_amount,
                deposit_currency: quote.deposit_currency,
                deposit_status: quote.deposit_status,
                deposit_required_at: quote.deposit_required_at,
                status_approval: TransactionStatusApproval.Done,
                gateway_completed_at: quote.conversion_date
            },
            user,
        );
        await this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }
}
