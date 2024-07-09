import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from '@tools/misc';
import { WebhooksShuftiproService } from './webhooks.service';
import { ShuftiproDto, ShuftiproEvent } from '@tools/models';
import { Anonymous } from '../../auth/anonymous.decorator';

@ApiTags('Webhooks')
@Controller('shuftipro')
@Throttle(100, 60)
export class WebhooksShuftiproController {
  constructor(private readonly webhooksService: WebhooksShuftiproService) {}

  @Post('events')
  @Anonymous()
  @UsePipes(new ValidationPipe({ transform: true }))
  async shuftiproNotification(@Body() data: ShuftiproDto) {
    if (data.event === ShuftiproEvent.CHANGED) {
      await this.webhooksService.shuftiproNotification(data);
    }
    return new SuccessResponse({ message: 'Webhook received' });
  }
}
