import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegisteredForClients } from '@luxbank/tools-models';
import { IamModule } from '@luxbank/iam';
import { ComplianceSyncService } from './compliance-sync.service';
import { TradingService } from './trading.service';

@Module({
  imports: [
    ConfigModule,
    RegisteredForClients(),
    IamModule.forRoot(),
  ],
  providers: [ComplianceSyncService, TradingService],
  exports: [ComplianceSyncService, TradingService],
})
export class TradingModule {}
