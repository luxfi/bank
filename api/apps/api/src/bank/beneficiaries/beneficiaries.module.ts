import { Module } from '@nestjs/common';

import {
  ArchiveBeneficiaryDomainUseCase,
  CreateBeneficiaryCCUseCase,
  CreateBeneficiaryIFXUseCase,
  CreateBeneficiaryUseCase,
  DisapproveBeneficiaryDomainUseCase,
  GetLoggedUserUseCase,
} from '@domain/use-cases';
import { CreateBeneficiaryDomainUseCase } from '@domain/use-cases/create-beneficiary/domain.handler';
import { GetBeneficiariesDomainUseCase } from '@domain/use-cases/get-beneficiaries';
import { GetBeneficiaryDetailDomainUseCase } from '@domain/use-cases/get-beneficiary-detail';
import { GetCurrentBeneficiaryDomainUseCase } from '@domain/use-cases/get-current-beneficiary';
import { MailerService } from '@ports/email';
import {
  BeneficiariesRepository,
  MikroOrmRegisteredForBeneficiaries,
  MikroOrmRegisteredForTransaction,
  MikroOrmRegisteredForUser,
} from '@tools/models';
import { SwiftCodeModule } from '../../swift-code/swift-code.module';
import { SwiftCodeService } from '../../swift-code/swift-code.service';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { BeneficiariesController } from './beneficiaries.controller';
import { UpdateBeneficiaryDomainUseCase } from '@domain/use-cases/update-beneficiary';
import { ApproveBeneficiaryDomainUseCase } from '@domain/use-cases/approve-beneficiary';

@Module({
  imports: [
    MikroOrmRegisteredForUser(),
    MikroOrmRegisteredForTransaction(),
    MikroOrmRegisteredForBeneficiaries(),
    SwiftCodeModule,
  ],
  controllers: [BeneficiariesController],
  providers: [
    DisapproveBeneficiaryDomainUseCase,
    ArchiveBeneficiaryDomainUseCase,
    ApproveBeneficiaryDomainUseCase,
    CreateBeneficiaryDomainUseCase,
    GetCurrentBeneficiaryDomainUseCase,
    GetBeneficiariesDomainUseCase,
    GetBeneficiaryDetailDomainUseCase,
    UpdateBeneficiaryDomainUseCase,
    MailerService,
    paymentAdapter(CreateBeneficiaryUseCase, {
      factory: {
        currencyCloud: CreateBeneficiaryCCUseCase,
        ifx: CreateBeneficiaryIFXUseCase,
      },
      inject: [BeneficiariesRepository, MailerService, SwiftCodeService],
    }),
    GetLoggedUserUseCase,
  ],
})
export class BeneficiariesModule {}
