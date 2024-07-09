import {
  ApprovePaymentCCUseCase,
  ApprovePaymentIFXUseCase,
  ApprovePaymentUseCase,
  CreatePaymentCCUseCase,
  CreatePaymentIFXUseCase,
  CreatePaymentUseCase,
  GetLoggedUserUseCase,
} from '@domain/use-cases';
import { RejectPaymentDomainUseCase } from '@domain/use-cases/reject-payment/domain.handler';
import {
  GetPurposeCodesCCUseCase,
  GetPurposeCodesIFXUseCase,
  GetPurposeCodesUseCase,
} from '@domain/use-cases/get-purpose-code';
import { Module } from '@nestjs/common';
import { MailerService } from '@ports/email';
import {
  BeneficiariesRepository,
  MikroOrmRegisteredForBeneficiaries,
  MikroOrmRegisteredForTransaction,
  MikroOrmRegisteredForUser,
  TransactionsRepository,
  UsersRepository,
} from '@tools/models';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    MikroOrmRegisteredForUser(),
    MikroOrmRegisteredForTransaction(),
    MikroOrmRegisteredForBeneficiaries(),
  ],
  controllers: [PaymentsController],
  providers: [
    MailerService,
    RejectPaymentDomainUseCase,
    paymentAdapter(ApprovePaymentUseCase, {
      factory: {
        currencyCloud: ApprovePaymentCCUseCase,
        ifx: ApprovePaymentIFXUseCase,
      },
      inject: [TransactionsRepository, MailerService],
    }),
    paymentAdapter(CreatePaymentUseCase, {
      factory: {
        currencyCloud: CreatePaymentCCUseCase,
        ifx: CreatePaymentIFXUseCase,
      },
      inject: [
        TransactionsRepository,
        BeneficiariesRepository,
        UsersRepository,
        MailerService,
      ],
    }),
    paymentAdapter(GetPurposeCodesUseCase, {
      factory: {
        currencyCloud: GetPurposeCodesCCUseCase,
        ifx: GetPurposeCodesIFXUseCase,
      },
    }),
    GetLoggedUserUseCase,
  ],
})
export class PaymentsModule {}
