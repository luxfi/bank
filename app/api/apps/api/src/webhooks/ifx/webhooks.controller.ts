import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from '@tools/misc';
import { Anonymous } from '../../auth/anonymous.decorator';
import { HmacIFXGuard } from './hmac.guard';
import { TransactionType, WebhooksIfxService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('ifx')
@Throttle(100, 60)
export class WebhooksIfxController {
  constructor(private readonly webhooksService: WebhooksIfxService) {}

  @Post('events')
  @UseGuards(HmacIFXGuard)
  @Anonymous()
  @UsePipes(new ValidationPipe({ transform: true }))
  async ifxNotification(@Body() data) {
    console.log('webhook data', data);

    const webhookActions = {
      [TransactionType.Test]: () => {
        console.log('test webhook', data);
      },
      [TransactionType.Credit]: () =>
        this.webhooksService.updateTransaction(data),
    };

    await webhookActions[data.type]?.();

    return new SuccessResponse({ message: 'Webhook received' });
  }
}
