import {
  GetLoggedUserUseCase,
  GetTotalTransactionsDomainUseCase,
} from '@domain/use-cases';
import { GetTransactionDomainUseCase } from '@domain/use-cases/get-transaction';
import { GetTransactionsDomainUseCase } from '@domain/use-cases/get-transactions';
import { Module } from '@nestjs/common';
import {
  MikroOrmRegisteredForClients,
  MikroOrmRegisteredForTransaction,
  MikroOrmRegisteredForUser,
} from '@tools/models';
import { TransactionsController } from './transactions.controller';
import { TransactionsCron } from './transactions.cron';

@Module({
  imports: [
    MikroOrmRegisteredForUser(),
    MikroOrmRegisteredForTransaction(),
    MikroOrmRegisteredForClients(),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsCron,
    GetTransactionsDomainUseCase,
    GetTransactionDomainUseCase,
    GetTotalTransactionsDomainUseCase,
    GetLoggedUserUseCase,
  ],
})
export class TransactionsModule {}
