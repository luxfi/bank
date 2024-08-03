import { Module } from '@nestjs/common';

import { ArchiveBeneficiaryDomainUseCase, CreateBeneficiaryCCUseCase, CreateBeneficiaryIFXUseCase, CreateBeneficiaryUseCase, DisapproveBeneficiaryDomainUseCase, 
        GetLoggedUserUseCase, CreateBeneficiaryDomainUseCase, GetBeneficiariesDomainUseCase, GetBeneficiaryDetailDomainUseCase, GetCurrentBeneficiaryDomainUseCase,
        UpdateBeneficiaryDomainUseCase, ApproveBeneficiaryDomainUseCase } from '../../use-cases';
import { MailerService } from '@luxbank/ports-email';
import { BeneficiariesRepository, MikroOrmRegisteredForBeneficiaries, MikroOrmRegisteredForTransaction, MikroOrmRegisteredForUser } from '@luxbank/tools-models';
import { SwiftCodeModule } from '../../swift-code/swift-code.module';
import { SwiftCodeService } from '../../swift-code/swift-code.service';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { BeneficiariesController } from './beneficiaries.controller';

@Module({
    imports: [
        MikroOrmRegisteredForUser(),
        MikroOrmRegisteredForTransaction(),
        MikroOrmRegisteredForBeneficiaries(),
        SwiftCodeModule
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
                ifx: CreateBeneficiaryIFXUseCase
            },
            inject: [BeneficiariesRepository, MailerService, SwiftCodeService]
        }),
        GetLoggedUserUseCase
    ],
})
export class BeneficiariesModule { }
