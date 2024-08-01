import { Module } from '@nestjs/common';
import { MailerModule } from '../mailer/mailer.module';
import { MikroOrmRegisteredForTransaction, MikroOrmRegisteredForClients } from '@cdaxfx/tools-models';
import { WebhooksShuftiproController } from './shuftipro/webhooks.controller';
import { WebhooksCurrencyCloudController } from './currency-cloud/webhooks.controller';
import { WebhooksShuftiproService } from './shuftipro/webhooks.service';
import { WebhooksCurrencyCloudService } from './currency-cloud/webhooks.service';
import { HmacGuard } from './currency-cloud/hmac.guard';
import { WebhooksIfxService } from './ifx/webhooks.service';
import { HmacIFXGuard } from './ifx/hmac.guard';
import { WebhooksIfxController } from './ifx/webhooks.controller';

@Module({
    imports: [
        MailerModule,
        MikroOrmRegisteredForTransaction(),
        MikroOrmRegisteredForClients()
    ],
    providers: [
        WebhooksShuftiproService,
        WebhooksCurrencyCloudService,
        WebhooksIfxService,
        HmacIFXGuard,
        HmacGuard
    ],
    exports: [],
    controllers: [
        WebhooksShuftiproController,
        WebhooksCurrencyCloudController,
        WebhooksIfxController
    ]
})
export class WebhooksModule { }
