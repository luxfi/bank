import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmRegisteredForBeneficiaries } from '@tools/models';
import { CurrencyCloudModule } from '../currency-cloud/currency-cloud.module';
import { MailerModule } from '../mailer/mailer.module';
import { SwiftCodeModule } from '../swift-code/swift-code.module';
import { BeneficiariesController } from './beneficiaries.controller';
import { BeneficiariesService } from './services/beneficiaries.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    MikroOrmRegisteredForBeneficiaries(),
    forwardRef(() => CurrencyCloudModule),
    SwiftCodeModule,
    MailerModule,
    ClientsModule,
  ],
  providers: [BeneficiariesService],
  controllers: [BeneficiariesController],
  exports: [BeneficiariesService],
})
export class BeneficiariesModule {}
