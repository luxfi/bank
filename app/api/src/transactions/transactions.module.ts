import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForBeneficiaries, MikroOrmRegisteredForTransaction } from '@cdaxfx/tools-models';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
    imports: [
        MikroOrmRegisteredForTransaction(),
        MikroOrmRegisteredForBeneficiaries()
    ],
    providers: [TransactionsService],
    controllers: [TransactionsController],
    exports: [TransactionsService]
})
export class TransactionsModule { }
