import { GetLoggedUserUseCase, CreateConversionCCUseCase, CreateConversionIFXUseCase, CreateConversionUseCase,
        GetPreviewCCUseCase, GetPreviewIFXUseCase, GetPreviewUseCase } from '../../use-cases';
import { Module } from '@nestjs/common';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { ConversionsController } from './conversions.controller';
import { MikroOrmRegisteredForTransaction, MikroOrmRegisteredForUser, TransactionsRepository } from '@cdaxfx/tools-models';

@Module({
    imports: [MikroOrmRegisteredForUser(), MikroOrmRegisteredForTransaction()],
    controllers: [ConversionsController],
    providers: [
        paymentAdapter(CreateConversionUseCase, {
            factory: {
                currencyCloud: CreateConversionCCUseCase,
                ifx: CreateConversionIFXUseCase
            },
            inject: [TransactionsRepository]
        }),
        paymentAdapter(GetPreviewUseCase, {
            factory: {
                currencyCloud: GetPreviewCCUseCase,
                ifx: GetPreviewIFXUseCase
            }
        }),
        GetLoggedUserUseCase
    ]
})
export class ConversionsModule { }
