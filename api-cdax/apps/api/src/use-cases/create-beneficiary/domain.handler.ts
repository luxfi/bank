import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@cdaxfx/ports-email';
import { isSwift } from '@cdaxfx/tools-misc';
import { Account, BeneficiariesRepository, Beneficiary, User } from '@cdaxfx/tools-models';
import dayjs from 'dayjs';
import { EEntityType, ReversedERoutingCodesNames, RoutingCodes } from '@cdaxfx/ports-ifx';
import { CreateBeneficiaryRequest } from './types/beneficiary.request.type';
import { BeneficiaryResponse } from './types/beneficiary.response.type';
import BeneficiaryCreatedEmail from '../../beneficiaries/emails/beneficiary-email';
import { SwiftCodeService } from '../../swift-code/swift-code.service';

@Injectable()
export class CreateBeneficiaryDomainUseCase {
    constructor(
        private readonly beneficiariesRepository: BeneficiariesRepository,
        private readonly mailer: MailerService,
        private readonly swiftCodeService: SwiftCodeService
    ) { }

    async handle(beneficiary: CreateBeneficiaryRequest, user: User): Promise<BeneficiaryResponse> {
        if (!user?.getCurrentClient()?.account)
            throw new BadRequestException({messages: ['No account associated with the current user.']});

        if (!user.getCurrentClient()?.uuid)
            throw new BadRequestException({messages: ['No client associated with the current user.']});

        const beneficaryToSave = this.createBeneficaryEntity(beneficiary, user);

        await this.beneficiariesRepository.persistAndFlush(beneficaryToSave);

        await this.mailer.send(
            new BeneficiaryCreatedEmail(beneficaryToSave.creator.username, {
                fullName: beneficaryToSave.getName(),
                uuid: beneficaryToSave.uuid,
                url: `${process.env.FRONTEND_URL}/dashboard/beneficiaries/${beneficaryToSave.uuid}`,
                createdBy: {
                    fullName: `${user?.firstname} ${user?.lastname}`,
                    email: user?.username ?? '',
                    phone: user?.contact?.mobileNumber ?? ''
                },
                createdAt: dayjs().format('HH:mm a')
            })
        );

        return { id: beneficaryToSave.uuid };
    }

    private async saveBankDetails(beneficiary: Beneficiary, user: User) {
        const bankDetails = await this.swiftCodeService.getBankDetails(beneficiary, user);
        beneficiary.bankName = bankDetails?.bankName;
        beneficiary.branchName = bankDetails?.branchName;
        beneficiary.bankAddress = bankDetails?.bankAddress;
    }

    private getCodes(routingCodes: RoutingCodes[]): any {
        return {
            ...routingCodes.reduce((acc, code, index) => {
                return {
                    ...acc,
                    [ReversedERoutingCodesNames[code.name as any]]: code.value
                };
            }, {})
        };
    }

    createBeneficaryEntity(dto: CreateBeneficiaryRequest, user: User): Beneficiary {
        const beneficiary = new Beneficiary();

        beneficiary.entityType = dto.entityType as any;
        beneficiary.currency = dto.currency;
        beneficiary.address = dto.address;
        beneficiary.addressLine2 = dto.addressLine2 ?? '';
        beneficiary.city = dto.city;
        beneficiary.state = dto.state;
        beneficiary.postcode = dto.postCode;
        beneficiary.country = dto.country;

        if (dto.entityType === EEntityType.INDIVIDUAL) {
            beneficiary.firstname = dto.firstName ?? '';
            beneficiary.lastname = dto.lastName ?? '';
        }

        if (dto.entityType === EEntityType.BUSINESS) {
            beneficiary.companyName = dto.companyName ?? '';
        }

        beneficiary.bankCountry = dto.bankCountry;
        beneficiary.impersonator_uuid = user.personatedBy;

        const codes = this.getCodes(dto.routingCodes);

        if (codes.ACCOUNT_NUMBER)
            beneficiary.accountNumber = String(codes.ACCOUNT_NUMBER);

        if (codes.SORT_CODE)
            beneficiary.sortCode = String(codes.SORT_CODE);

        if (!isSwift(codes.bankCountry)) 
            beneficiary.IBAN = codes.IBAN ?? '';

        beneficiary.bicSwift = codes.BIC_SWIFT ?? '';

        beneficiary.creator = user;
        beneficiary.account = user?.getCurrentClient()?.account as Account;

        beneficiary.isApproved = false;

        beneficiary.client_uuid = user?.getCurrentClient()?.uuid ?? '';

        this.saveBankDetails(beneficiary, user);

        return beneficiary;
    }
}
