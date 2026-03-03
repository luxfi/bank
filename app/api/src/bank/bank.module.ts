import { Module } from '@nestjs/common';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { ConversionsModule } from './conversions/conversions.module';
import { MiscModule } from './misc/misc.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletsModule } from './wallets/wallets.module';
import { TradingModule } from '../trading/trading.module';

@Module({
    imports: [
        BeneficiariesModule,
        PaymentsModule,
        ConversionsModule,
        WalletsModule,
        TransactionsModule,
        MiscModule,
        TradingModule,
    ]
})
export class BankModule { }
