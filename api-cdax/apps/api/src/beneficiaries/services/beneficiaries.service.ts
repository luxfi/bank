import { BadRequestException, Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { BankMetadata, BankMetadataDto, BeneficiariesRepository, Beneficiary, CreateBeneficiaryDto, Currencies, User } from '@cdaxfx/tools-models';
import { FilterBeneficiariesAccountDTO, FilterBeneficiariesDTO } from '@cdaxfx/tools-models';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { CurrencyCloudService } from '../../currency-cloud/currency-cloud.service';
import { MailerService } from '../../mailer/mailer.service';
import { SwiftCodeService } from '../../swift-code/swift-code.service';
import BeneficiaryEmail from '../../users/emails/beneficiary-email';
import BeneficiaryCreatedEmail from '../emails/beneficiary-email';
import { createCurrencyCloudBeneficiaryDto } from '../model/beneficiary-dto.transformer';
import { BeneficiaryManager } from '../model/beneficiary.manager';

function validateRiskLevel(riskLevel) {
    return ['low', 'unknown'].indexOf(riskLevel) !== -1;
}

@Injectable()
export class BeneficiariesService {
    logger = new Logger(BeneficiariesService.name);

    constructor(
        private readonly beneficiariesRepository: BeneficiariesRepository,
        @Inject(forwardRef(() => CurrencyCloudService)) //chris
        private readonly currencyCloudService: CurrencyCloudService,
        // private readonly openPaydService: OpenPaydService,
        @Inject(forwardRef(() => SwiftCodeService)) //chris
        private readonly swiftCodeService: SwiftCodeService,
        @Inject(forwardRef(() => MailerService)) //chris
        private readonly mailer: MailerService
    ) { }

    async updateFromBankMetadata(beneficiary: Beneficiary, owner: User) {
        this.beneficiariesRepository.persistAndFlush(beneficiary);
    }

    async deleteBeneficiary(beneficiary: Beneficiary, owner: User) {
        await this.deleteInGateway(owner, beneficiary);
        await this.beneficiariesRepository.deleteBeneficiary(beneficiary);
    }

    async approveBeneficiary(beneficiary: Beneficiary, owner: User) {
        const original = beneficiary.isApproved;
        beneficiary.isApproved = !beneficiary.isApproved;
        if (beneficiary.isApproved)
            await this.createOrUpdateInGateway(beneficiary.creator, beneficiary);
        else
            await this.deleteInGateway(beneficiary.creator, beneficiary);
        
        await this.beneficiariesRepository.persistAndFlush(beneficiary);
        if (original === beneficiary.isApproved)
            throw new BadRequestException('Could not update the beneficiary in the gateway.');

        let message = '';
        if (beneficiary.isApproved)
            message = `Congratulations to ${beneficiary.getName()} for being approved to receive payment through CDAX Forex!`;
        else
            message = `The beneficiary has been disapproved because he/she does not meet the necessary requirements for CDAX Forex to process the payment. This could include having incorrect information, not having an active account, or not having the necessary documents required.`;

        await this.mailer.send(
            new BeneficiaryEmail(beneficiary.creator.username, {
                fullName: beneficiary.getName(),
                accountNumber: beneficiary.accountNumber,
                currency: beneficiary.currency,
                message: message
            })
        );
        return beneficiary;
    }

    async getActiveBeneficiaries(user: User, query?: FilterBeneficiariesDTO) {
        return this.beneficiariesRepository.findActiveByUser(user, query);
    }

    async getActiveBeneficiariesByCurrency(user: User, currency: string) {
        return this.beneficiariesRepository.findActiveByUserAndCurrency(user, currency);
    }

    async getActiveBeneficiariesByAccount(accountUuid: string, query: FilterBeneficiariesAccountDTO) {
        return this.beneficiariesRepository.findBeneficiariesByAccount(accountUuid, query);
    }

    async getOneForUser(user: User, uuid: string) {
        return this.beneficiariesRepository.findOneByUserAndId(user, uuid);
    }

    async hasActiveBeneficiaries(user: User) {
        const activeCount = await this.beneficiariesRepository.countActiveByUser(user);
        return activeCount > 0;
    }

    async deleteInGateway(owner: User, beneficiary: Beneficiary) {
        if (beneficiary.currencyCloudId) {
            await this.currencyCloudService.deleteBeneficiary(beneficiary.currencyCloudId, owner.contact?.account?.cloudCurrencyId || null, owner);
            beneficiary.currencyCloudId = '';
            beneficiary.gatewayId = '';
        }

        beneficiary.isApproved = false;
    }

    async createOrUpdateInGateway(creator: User, beneficiary: Beneficiary) {
        const cloudCurrencyId = beneficiary.account.cloudCurrencyId;
        const currencyCloudData = createCurrencyCloudBeneficiaryDto(beneficiary);

        const clientId = creator.clients
            .getItems()
            .find((c) => c.account?.uuid === beneficiary.account.uuid)?.uuid;

        if (clientId)
            creator.setCurrentClient(clientId);

        if (cloudCurrencyId) {
            const { errors: currencyCloudErrors } =
                await this.swiftCodeService.validateOnCurrencyCloud(
                    currencyCloudData,
                    cloudCurrencyId,
                    creator
                );
            console.log('currencyCloudErrors', currencyCloudErrors);

            if (currencyCloudErrors.length == 0) {
                try {
                    let beneficiaryId: string | null = null;
                    let paymentTypes: string | null = null;
                    if (beneficiary.currencyCloudId) {
                        [beneficiaryId, paymentTypes] =
                            await this.currencyCloudService.updateBeneficiary(
                                beneficiary.currencyCloudId,
                                currencyCloudData,
                                cloudCurrencyId,
                                creator
                            );
                    } else {
                        [beneficiaryId, paymentTypes] =
                            await this.currencyCloudService.createBeneficiary(
                                currencyCloudData,
                                cloudCurrencyId,
                                creator
                            );
                    }
                    beneficiary.currencyCloudId = beneficiaryId;
                    beneficiary.paymentType = paymentTypes;
                    beneficiary.gatewayId = beneficiaryId;
                } 
                catch (error) {
                    beneficiary.isApproved = false;
                    this.logger.error(`Couldn't create currency cloud beneficiary.`);
                    this.logger.error(error);
                    // this.logger.error(error.request);
                    this.logger.error((error as any).response.data);
                }
            } else {
                beneficiary.isApproved = false;
                return { errors: { ...currencyCloudErrors } };
            }
        } else {
            beneficiary.isApproved = false;
        }
    }

    async saveBankDetails(beneficiary: Beneficiary, user: User) {
        const bankDetails = await this.swiftCodeService.getBankDetails(
            beneficiary,
            user
        );
        beneficiary.bankName = bankDetails?.bankName;
        beneficiary.branchName = bankDetails?.branchName;
        beneficiary.bankAddress = bankDetails?.bankAddress;
    }

    async create(
        createBeneficiaryDto: CreateBeneficiaryDto,
        creator: User,
        preapproved?: boolean
    ): Promise<{ beneficiary?: Beneficiary; errors?: any }> {
        try {
            const errors = {
                riskLevel: '',
                isValid: true
            };

            const beneficiary = BeneficiaryManager.createFromCreateDto(
                createBeneficiaryDto,
                creator
            );

            if (preapproved)
                beneficiary.isApproved = true;
            
            await this.saveBankDetails(beneficiary, beneficiary.creator);

            if (beneficiary.isApproved)
                await this.createOrUpdateInGateway(creator, beneficiary);
            console.log('createOrUpdateInGateway', creator);

            await this.beneficiariesRepository.persistAndFlush(beneficiary);
            console.log('persistAndFlush', beneficiary);

            await this.mailer.send(
                new BeneficiaryCreatedEmail(beneficiary.creator.username, {
                    fullName: beneficiary.getName(),
                    uuid: beneficiary.uuid,
                    url: `${process.env.FRONTEND_URL}/dashboard/beneficiaries/${beneficiary.uuid}`,
                    createdBy: {
                        fullName: `${creator?.firstname} ${creator?.lastname}`,
                        email: creator?.username ?? '',
                        phone: creator?.contact?.mobileNumber ?? ''
                    },
                    createdAt: dayjs().format('HH:mm a')
                })
            );

            return { beneficiary };
        } catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
            if (axios.isAxiosError(err))
                this.logger.error(err.response?.data);
            throw err;
        }
    }

    toBankMetadata(beneficiary: Beneficiary, bankMetadata: BankMetadata): BankMetadataDto {
        return {
            IBAN: beneficiary.IBAN,
            bicSwift: beneficiary.bicSwift,
            sortCode: beneficiary.sortCode,
            accountNumber: beneficiary.accountNumber,
            bankName: bankMetadata.branch,
            accountHolderName: beneficiary.getName(),
            branch: bankMetadata.branch,
            bankCountry: beneficiary.bankCountry,
            currency: <Currencies>beneficiary.currency
        };
    }

    async update(beneficiary: Beneficiary, dto: CreateBeneficiaryDto, updater: User): Promise<{ beneficiary?: Beneficiary; errors?: any }> {
        try {
            const originalBeneficiary = { ...beneficiary };
            BeneficiaryManager.updateByDto(dto, beneficiary);
            const errors = {
                riskLevel: '',
                isValid: true,
                notApproved: false
            };

            const beneficiariesCount = await this.beneficiariesRepository.countActiveByUser(updater);
            if (beneficiariesCount > 0) {
                const { beneficiaries: userBeneficiaries } = await this.beneficiariesRepository.findActiveByUser(updater);
                const beneficiary = userBeneficiaries.pop();
                if (beneficiary && originalBeneficiary.uuid == beneficiary.uuid)
                    await beneficiary.account.setBankMetadata(this.toBankMetadata(beneficiary, beneficiary.account.bankMetadata));
            }
            await this.saveBankDetails(beneficiary, beneficiary.creator);

            if (beneficiary.isApproved) {
                if (
                    ((dto.IBAN || originalBeneficiary.IBAN) &&
                        originalBeneficiary.IBAN != (dto.IBAN || '')) ||
                    ((dto.bicSwift || originalBeneficiary.bicSwift) &&
                        originalBeneficiary.bicSwift != (dto.bicSwift || '')) ||
                    ((dto.sortCode || originalBeneficiary.sortCode) &&
                        originalBeneficiary.sortCode != (dto.sortCode || '')) ||
                    ((dto.accountNumber || originalBeneficiary.accountNumber) &&
                        originalBeneficiary.accountNumber != (dto.accountNumber || '')) ||
                    originalBeneficiary.bankCountry != dto.bankCountry ||
                    originalBeneficiary.currency != dto.currency
                ) {
                    await this.deleteInGateway(beneficiary.creator, beneficiary);
                } else {
                    await this.createOrUpdateInGateway(beneficiary.creator, beneficiary);
                }
            }

            await this.beneficiariesRepository.persistAndFlush(beneficiary);
            return { beneficiary, errors };
        } 
        catch (err) {
            this.logger.error((err as Error).message, (err as Error).stack);
            throw err;
        }
    }

    async migrateExistingBeneficiaries(user: User, gateway: string): Promise<any> {
        const existingBeneficiaries = (await this.getActiveBeneficiaries(user)).beneficiaries;
        existingBeneficiaries.map((beneficiary) => {
            if (gateway == 'open_payd' && !beneficiary.openPaydId) {
                beneficiary.isApproved = true;
                this.createOrUpdateInGateway(user, beneficiary);
                this.beneficiariesRepository.persistAndFlush(beneficiary);
            } else if (
                gateway == 'currency_cloud' &&
                !beneficiary.currencyCloudId &&
                beneficiary.isApproved
            ) {
                this.createOrUpdateInGateway(user, beneficiary);
                this.beneficiariesRepository.persistAndFlush(beneficiary);
            }
        });
    }

    async beneficiariesPending() {
        return this.beneficiariesRepository.beneficiariesPending();
    }
}
