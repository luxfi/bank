import { ApprovePaymentCCUseCase, ApprovePaymentIFXUseCase, ApprovePaymentUseCase, CreatePaymentCCUseCase, CreatePaymentIFXUseCase, CreatePaymentUseCase,
        GetLoggedUserUseCase, RejectPaymentDomainUseCase, GetPurposeCodesCCUseCase, GetPurposeCodesIFXUseCase, GetPurposeCodesUseCase } from '../../use-cases';
import { Module } from '@nestjs/common';
import { MailerService } from '@luxbank/ports-email';
import { BeneficiariesRepository, MikroOrmRegisteredForBeneficiaries, MikroOrmRegisteredForTransaction, MikroOrmRegisteredForUser,
        TransactionsRepository, UsersRepository } from '@luxbank/tools-models';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { PaymentsController } from './payments.controller';

@Module({
    imports: [
        MikroOrmRegisteredForUser(),
        MikroOrmRegisteredForTransaction(),
        MikroOrmRegisteredForBeneficiaries()
    ],
    controllers: [PaymentsController],
    providers: [
        MailerService,
        RejectPaymentDomainUseCase,
        paymentAdapter(ApprovePaymentUseCase, {
            factory: {
                currencyCloud: ApprovePaymentCCUseCase,
                ifx: ApprovePaymentIFXUseCase
            },
            inject: [TransactionsRepository, MailerService]
        }),
        paymentAdapter(CreatePaymentUseCase, {
            factory: {
                currencyCloud: CreatePaymentCCUseCase,
                ifx: CreatePaymentIFXUseCase
            },
            inject: [
                TransactionsRepository,
                BeneficiariesRepository,
                UsersRepository,
                MailerService
            ]
        }),
        paymentAdapter(GetPurposeCodesUseCase, {
            factory: {
                currencyCloud: GetPurposeCodesCCUseCase,
                ifx: GetPurposeCodesIFXUseCase
            }
        }),
        GetLoggedUserUseCase
    ]
})
export class PaymentsModule { }
