import { BeneficiariesRepository, User } from '@cdaxfx/tools-models';
import { ArchiveBeneficiaryResponse } from './types/beneficiary.response.type';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ArchiveBeneficiaryDomainUseCase {
    constructor(
        private readonly beneficiariesRepository: BeneficiariesRepository,
    ) { }

    async handle(id: string, user: User): Promise<ArchiveBeneficiaryResponse> {
        const beneficiary = await this.beneficiariesRepository.findOneByUserAndId(user, id);
        if (!beneficiary)
            throw new NotFoundException({messages: ['Beneficiary not found']});

        if (beneficiary.deletedAt)
            throw new BadRequestException({messages: ['Beneficiary already archived']});

        // if (!!beneficiary.gatewayId && !!beneficiary.account.gateway) {
        //   const gatewaymap = {
        //     ifx: PaymentProviderIFX,
        //     currencycloud: PaymentProviderCurrencyCloud,
        //   };
        //   const gateway =
        //     gatewaymap[beneficiary.account?.gateway].getInstance(user);

        //   await gateway.deleteBeneficiary(
        //     beneficiary.gatewayId,
        //     user.getCurrentClient()?.account?.gatewayId || null,
        //     user,
        //   );
        // }

        await this.beneficiariesRepository.deleteBeneficiary(beneficiary);
        return { id: beneficiary.uuid };
    }
}
