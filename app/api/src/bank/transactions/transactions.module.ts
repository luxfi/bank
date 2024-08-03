import { GetLoggedUserUseCase, GetTotalTransactionsDomainUseCase, GetTransactionDomainUseCase, GetTransactionsDomainUseCase } from '../../use-cases';
import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForClients, MikroOrmRegisteredForTransaction, MikroOrmRegisteredForUser } from '@luxbank/tools-models';
import { TransactionsController } from './transactions.controller';
import { TransactionsCron } from './transactions.cron';

@Module({
    imports: [
        MikroOrmRegisteredForUser(),
        MikroOrmRegisteredForTransaction(),
        MikroOrmRegisteredForClients()
    ],
    controllers: [TransactionsController],
    providers: [
        TransactionsCron,
        GetTransactionsDomainUseCase,
        GetTransactionDomainUseCase,
        GetTotalTransactionsDomainUseCase,
        GetLoggedUserUseCase
    ]
})
export class TransactionsModule { }
