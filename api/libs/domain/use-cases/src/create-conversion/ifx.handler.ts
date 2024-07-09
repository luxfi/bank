import { PaymentProviderIFX } from '@ports/ifx';
import {
  TransactionAction,
  TransactionsRepository,
  TransactionStatus,
  TransactionStatusApproval,
  User,
} from '@tools/models';
import { CreateConversionRequest } from './types/conversion.request.type';
import { CreateConversionResponse } from './types/conversion.response.type';
import { CreateConversionUseCase } from './abstract.handler';
import { BadRequestException } from '@nestjs/common';
import { EPaymentProvider } from '@tools/misc';

export class CreateConversionIFXUseCase extends CreateConversionUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderIFX,
    private request: Request,
    private readonly transactionsRepository: TransactionsRepository,
  ) {
    super();
  }

  async handle(
    quote: CreateConversionRequest,
    user: User,
  ): Promise<CreateConversionResponse> {
    if (!quote.quoteId) {
      throw new BadRequestException({
        messages: ['Missing quote id'],
      });
    }
    await this.paymentProvider.acceptQuote(quote.quoteId);

    const data = await this.paymentProvider.previewQuote(quote.quoteId);

    if (!data.bookedStandaloneTrades.length) {
      throw new BadRequestException({
        messages: ['Trade failed'],
      });
    }

    const transactionId = data.bookedStandaloneTrades[0].id;
    const quotePreview = data.quotedStandaloneTrades[0];

    const transaction = await this.transactionsRepository.createTransaction(
      {
        status: TransactionStatus.ReadyToSend,
        action: TransactionAction.Conversion,
        gateway: EPaymentProvider.IFX,
        gateway_id: user.getCurrentClient()?.account?.gatewayId,
        account_id: user.getCurrentClient()?.account?.gatewayId,
        client_uuid: user.getCurrentClient()?.uuid,
        currency: quotePreview.sell.currency,
        amount: String(quotePreview[quotePreview.direction].amount),
        transaction_id: transactionId,
        buy_amount: quotePreview.buy.amount,
        buy_currency: quotePreview.buy.currency,
        fixed_side: quotePreview.direction,
        conversion_date: quotePreview.valueDate,
        status_approval: TransactionStatusApproval.Done,
        short_id: `IFX-${transactionId}`,
        core_rate: quotePreview.rate,
        gateway_completed_at: data.acceptedOn,
        settlement_date: quotePreview.valueDate,
      },
      user,
    );

    await this.transactionsRepository.persistAndFlush(transaction);

    return { id: transaction.uuid };
  }
}
