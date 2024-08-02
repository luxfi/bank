import { forwardRef, Module } from '@nestjs/common';
import { BeneficiariesModule } from '../beneficiaries/beneficiaries.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { CurrencyCloudController } from './currency-cloud.controller';
import { CurrencyCloudService } from './currency-cloud.service';
import { MailerModule } from '../mailer/mailer.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => BeneficiariesModule),
        forwardRef(() => TransactionsModule),
        forwardRef(() => ClientsModule),
        MailerModule,
    ],
    providers: [CurrencyCloudService],
    exports: [CurrencyCloudService],
    controllers: [CurrencyCloudController]
})
export class CurrencyCloudModule { }
