import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegisteredForClients } from '@luxbank/tools-models';
import { ComplianceSyncService } from './compliance-sync.service';
import { TradingService } from './trading.service';

@Module({
  imports: [
    ConfigModule,
    RegisteredForClients(),
  ],
  providers: [ComplianceSyncService, TradingService],
  exports: [ComplianceSyncService, TradingService],
})
export class TradingModule {}
