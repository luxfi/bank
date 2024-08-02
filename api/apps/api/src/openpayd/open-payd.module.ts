import { forwardRef, Module } from '@nestjs/common';
import { OpenPaydService } from './open-payd.service';
import { UsersModule } from '../users/users.module';
import { FeesModule } from '../fees/fees.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { BeneficiariesModule } from '../beneficiaries/beneficiaries.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => FeesModule),
        TransactionsModule,
        forwardRef(() => BeneficiariesModule),
        MailerModule,
    ],
    providers: [OpenPaydService],
    exports: [OpenPaydService],
    controllers: []
})
export class OpenPaydModule { }
