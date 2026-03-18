import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmRegisteredForClients, MikroOrmRegisteredForUserClients } from '@luxbank/tools-models';
import { IamModule } from '@luxbank/iam';
import { ClientsModule } from '../clients/clients.module';
import { ComplianceSyncService } from './compliance-sync.service';
import { TradingService } from './trading.service';

@Module({
  imports: [
    ConfigModule,
    MikroOrmRegisteredForClients(),
    MikroOrmRegisteredForUserClients(),
    forwardRef(() => ClientsModule),
    IamModule.forRoot(),
  ],
  providers: [ComplianceSyncService, TradingService],
  exports: [ComplianceSyncService, TradingService],
})
export class TradingModule {}
