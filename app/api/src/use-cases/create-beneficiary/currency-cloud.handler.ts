import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentProviderCurrencyCloud, CreateBeneficiaryRequest } from '@luxbank/ports-currency-cloud';
import { MailerService } from '@luxbank/ports-email';
import { isInUk, isSwift } from '@luxbank/tools-misc';
import { AccountType, BeneficiariesRepository, Beneficiary } from '@luxbank/tools-models';
import { RoutingCodeType, getRoutingCodeByCountry } from '../../currency-cloud/model/routing-code-type.enum';
import { Request } from 'express';
import { CreateBeneficiaryUseCase } from './abstract.handler';
import { BeneficiaryResponse } from './types/beneficiary.response.type';

export class CreateBeneficiaryCCUseCase extends CreateBeneficiaryUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request,
        private readonly beneficiariesRepository: BeneficiariesRepository,
        private readonly mailer: MailerService
    ) {
        super();
    }

    async handle(id: string): Promise<BeneficiaryResponse> {
        const beneficiary = await this.beneficiariesRepository.findOneById(id);

        if (!beneficiary)
            throw new NotFoundException({messages: ['Beneficiary not found']});

        const result: CreateBeneficiaryRequest = {
            name: beneficiary.getName(),
            bank_account_holder_name: beneficiary.getName(),
            bank_country: beneficiary.bankCountry,
            currency: beneficiary.currency,
            beneficiary_city: beneficiary.city,
            beneficiary_country: beneficiary.country,
            beneficiary_entity_type: beneficiary.entityType,
            bank_name: beneficiary.bankName,
            bank_address: beneficiary.bankAddress,
            beneficiary_state_or_province: beneficiary.state,
            beneficiary_postcode: beneficiary.postcode
        };

        if (beneficiary.entityType === AccountType.Individual) {
            result.name = beneficiary.getName();
            result.beneficiary_first_name = beneficiary.firstname;
            result.beneficiary_last_name = beneficiary.lastname;
            result.beneficiary_entity_type = 'individual';
            result.beneficiary_address = [beneficiary.address];
        } else {
            result.name = beneficiary.companyName;
            result.bank_account_holder_name = beneficiary.companyName;
            result.beneficiary_company_name = beneficiary.companyName;
            result.beneficiary_entity_type = 'company';
            if (beneficiary.address)
                result.beneficiary_address = [beneficiary.address];
        }

        if (isInUk(beneficiary.bankCountry)) {
            if (beneficiary.accountNumber)
                result.account_number = beneficiary.accountNumber;

            if (beneficiary.sortCode) {
                result.routing_code_type_1 = RoutingCodeType.SortCode;
                result.routing_code_value_1 = beneficiary.sortCode;
            }

            if ((!beneficiary.accountNumber || !beneficiary.sortCode) && beneficiary.IBAN) {
                result.routing_code_type_1 = RoutingCodeType.SortCode;
                result.account_number = beneficiary.IBAN.substring(14, 22);
                result.routing_code_value_1 = beneficiary.IBAN.substring(8, 14);
            }
        } else if (beneficiary.accountNumber) {
            const routingCode = getRoutingCodeByCountry(beneficiary.bankCountry);
            result.account_number = beneficiary.accountNumber;
            if (routingCode && beneficiary.sortCode) {
                result.routing_code_type_1 = routingCode;
                result.routing_code_value_1 = beneficiary.sortCode;
            }
        }

        if (beneficiary.IBAN) {
            result.iban = beneficiary.IBAN;
            if (beneficiary.bicSwift)
                result.bic_swift = beneficiary.bicSwift;
        } else if (isSwift(beneficiary.bankCountry)) {
            result.bic_swift = beneficiary.bicSwift;
        }

        const response = await this.paymentProvider
            .createBeneficiary(result, beneficiary.creator)
            .catch(async (err) => {
                console.log('error', err);
            });

        if (!response || !response.id) {
            await this.rollback(beneficiary!);
            throw new BadRequestException({messages: ['Failed to create beneficiary']});
        }

        beneficiary.gatewayId = response.id;

        await this.beneficiariesRepository.persistAndFlush(beneficiary);

        return { id: response.id };
    }

    async rollback(beneficiary: Beneficiary) {
        return this.beneficiariesRepository.getEntityManager().removeAndFlush(beneficiary);
    }
}
