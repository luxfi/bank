import { GetLoggedUserUseCase } from '@domain/use-cases';
import {
  CreateConversionCCUseCase,
  CreateConversionIFXUseCase,
  CreateConversionUseCase,
} from '@domain/use-cases/create-conversion';
import { Module } from '@nestjs/common';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { ConversionsController } from './conversions.controller';
import {
  MikroOrmRegisteredForTransaction,
  MikroOrmRegisteredForUser,
  TransactionsRepository,
} from '@tools/models';
import {
  GetPreviewCCUseCase,
  GetPreviewIFXUseCase,
  GetPreviewUseCase,
} from '@domain/use-cases/get-conversion-preview';

@Module({
  imports: [MikroOrmRegisteredForUser(), MikroOrmRegisteredForTransaction()],
  controllers: [ConversionsController],
  providers: [
    paymentAdapter(CreateConversionUseCase, {
      factory: {
        currencyCloud: CreateConversionCCUseCase,
        ifx: CreateConversionIFXUseCase,
      },
      inject: [TransactionsRepository],
    }),
    paymentAdapter(GetPreviewUseCase, {
      factory: {
        currencyCloud: GetPreviewCCUseCase,
        ifx: GetPreviewIFXUseCase,
      },
    }),
    GetLoggedUserUseCase,
  ],
})
export class ConversionsModule {}
