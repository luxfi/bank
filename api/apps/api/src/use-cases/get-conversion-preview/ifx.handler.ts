import { PaymentProviderIFX } from '@cdaxfx/ports-ifx';
import { GetPreviewUseCase } from './abstract.handler';
import { GetPreviewResponse, GetPreviewRequest, EDirection } from '@cdaxfx/ports-currency-cloud';
import { NotAcceptableException } from '@nestjs/common';

export class GetPreviewIFXUseCase extends GetPreviewUseCase {
    constructor(
        protected paymentProvider: PaymentProviderIFX,
        private request: Request,
        private beneficiariesService: any
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
                    sellCurrency: conversion.sellCurrency
                }
            ]
        });

        const quote = await this.paymentProvider.previewQuote(id);

        const quotePreview = quote.quotedStandaloneTrades[0];

        if (!quotePreview) {
            throw new NotAcceptableException({messages: ['Quote not found']});
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
            expiresDate: quote.expiresAt
        };
    }
}
