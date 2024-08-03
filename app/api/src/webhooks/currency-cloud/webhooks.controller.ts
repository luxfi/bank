import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from '@luxbank/tools-misc';
import { WebhooksCurrencyCloudService } from './webhooks.service';
import { TransactionType } from '@luxbank/tools-models';
import { Anonymous } from '../../auth/anonymous.decorator';
import { HmacGuard } from './hmac.guard';

@ApiTags('Webhooks')
@Controller('currency-cloud')
@Throttle({default: {limit: 100, ttl: 60}})
export class WebhooksCurrencyCloudController {
    constructor(private readonly webhooksService: WebhooksCurrencyCloudService) { }

    @Post('events')
    @UseGuards(HmacGuard)
    @Anonymous()
    @UsePipes(new ValidationPipe({ transform: true }))
    async currencyCloudNotification(@Body() data) {
        const webhookActions = {
            [TransactionType.Conversion]: () =>
                this.webhooksService.updateOrCreateConversionFromWebhook(data.body),
            [TransactionType.Payment]: () =>
                this.webhooksService.updateOrCreatePaymentFromWebhook(data.body),
            [TransactionType.CashManagerTransaction]: () =>
                this.webhooksService.updateOrCreateFundingFromWebhook(data.body)
        };

        await webhookActions[data.header.message_type]?.();

        return new SuccessResponse({ message: 'Webhook received' });
    }
}
