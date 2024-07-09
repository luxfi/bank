import { PaymentProviderIFX } from '@ports/ifx';
import { GetPreviewUseCase } from './abstract.handler';
import { GetPreviewResponse } from './types/preview.response.type';
import { GetPreviewRequest } from './types/preview.request.type';

import { BadRequestException, NotAcceptableException } from '@nestjs/common';
import { EDirection } from '../types/direction.interface';

export class GetPreviewIFXUseCase extends GetPreviewUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderIFX,
    private request: Request,
    private beneficiariesService: any,
  ) {
    super();
  }

  async handle(conversion: GetPreviewRequest): Promise<GetPreviewResponse> {
    const { id } = await this.paymentProvider.createQuote({
      trades: [
        {
          amount: conversion.amount,
          direction: conversion.direction,
          buyCurrency: conversion.buyCurrency,
          sellCurrency: conversion.sellCurrency,
        },
      ],
    });

    const quote = await this.paymentProvider.previewQuote(id);

    const quotePreview = quote.quotedStandaloneTrades[0];

    if (!quotePreview) {
      throw new NotAcceptableException({
        messages: ['Quote not found'],
      });
    }

    return {
      quoteId: id,
      rate: String(quotePreview.rate),
      amount:
        EDirection.BUY === quotePreview.direction
          ? String(quotePreview.sell.amount)
          : String(quotePreview.buy.amount),
      sellCurrency: quotePreview.sell.currency,
      buyCurrency: quotePreview.buy.currency,
      direction: quotePreview.direction,
      expiresDate: quote.expiresAt,
    };
  }
}
